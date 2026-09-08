import { Client, LogLevel } from "@notionhq/client";
import { getCuratedStories } from "./stories";

export interface NotionStory {
  id: string;
  pageId?: string;
  title: string;
  category: string;
  slug: string;
  summary: string;
  date: string;
  coverImage: string | null;
  featured?: boolean;
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  logLevel: LogLevel.ERROR,
});

let cachedDataSourceId: string | null = null;

/**
 * Case-insensitive property reader for Notion page properties
 */
function getProp(properties: Record<string, any>, name: string): any {
  if (properties[name]) return properties[name];
  const lower = name.toLowerCase();
  const key = Object.keys(properties).find((k) => k.toLowerCase() === lower);
  return key ? properties[key] : undefined;
}

/**
 * Resolves the queryable data_source_id or database_id across Notion's SDK versions.
 * Gracefully handles:
 * 1. A page ID containing an inline child_database (when user copies the page URL/ID)
 * 2. A database ID directly
 * 3. A data_source ID directly
 * 4. Automatic workspace search fallback
 */
async function resolveDataSourceId(rawId: string): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;
  const cleanId = rawId.replace(/-/g, "");

  // 1. Check if rawId is a page containing an inline child_database
  try {
    const blocks = await notion.blocks.children.list({ block_id: cleanId });
    const childDb = blocks.results.find((b: any) => b.type === "child_database");
    if (childDb) {
      try {
        const db = await notion.databases.retrieve({ database_id: childDb.id });
        if ((db as any).data_sources && (db as any).data_sources.length > 0) {
          const dsId = (db as any).data_sources[0].id as string;
          cachedDataSourceId = dsId;
          return dsId;
        }
      } catch {}
      cachedDataSourceId = childDb.id;
      return childDb.id;
    }
  } catch {}

  // 2. Check if rawId is directly a database
  try {
    const db = await notion.databases.retrieve({ database_id: cleanId });
    if ((db as any).data_sources && (db as any).data_sources.length > 0) {
      const dsId = (db as any).data_sources[0].id as string;
      cachedDataSourceId = dsId;
      return dsId;
    }
    cachedDataSourceId = cleanId;
    return cleanId;
  } catch {}

  // 3. Check if rawId is directly a data_source
  try {
    if ((notion as any).dataSources?.retrieve) {
      const ds = await (notion as any).dataSources.retrieve({ data_source_id: cleanId });
      if (ds && ds.id) {
        cachedDataSourceId = ds.id;
        return ds.id;
      }
    }
  } catch {}

  // 4. Fallback search for accessible data_source or database in workspace
  try {
    if (typeof (notion as any).search === "function") {
      try {
        const res = await (notion as any).search({ filter: { value: "data_source", property: "object" } });
        if (res.results && res.results.length > 0) {
          cachedDataSourceId = res.results[0].id;
          return res.results[0].id;
        }
      } catch {}

      try {
        const res = await (notion as any).search({ filter: { value: "database", property: "object" } });
        if (res.results && res.results.length > 0) {
          cachedDataSourceId = res.results[0].id;
          return res.results[0].id;
        }
      } catch {}
    }
  } catch {}

  cachedDataSourceId = cleanId;
  return cleanId;
}

/**
 * Fetches published stories from Notion database, ordered by Date descending.
 * Gracefully falls back to curated stories when Notion is empty or unreachable.
 */
export async function getPublishedStories(): Promise<NotionStory[]> {
  const apiKey = process.env.NOTION_API_KEY;
  const rawId = process.env.NOTION_DATA_SOURCE_ID || process.env.NOTION_DATABASE_ID;

  if (!apiKey || !rawId) {
    console.warn("Notion API Key or Database ID is missing from environment variables. Using curated stories.");
    return getCuratedStories();
  }

  try {
    const targetId = await resolveDataSourceId(rawId);

    const sorts = [
      { property: "Date", direction: "descending" as const },
    ];

    let results: any[] = [];

    // Supports Notion SDK v5 (dataSources.query) and v2 (databases.query)
    if (typeof (notion as any).dataSources?.query === "function") {
      try {
        const response = await (notion as any).dataSources.query({
          data_source_id: targetId,
          filter: { property: "Published", checkbox: { equals: true } },
          sorts,
        });
        results = response.results || [];
      } catch {
        const response = await (notion as any).dataSources.query({
          data_source_id: targetId,
          sorts,
        });
        results = response.results || [];
      }
    } else if (typeof (notion as any).databases?.query === "function") {
      try {
        const response = await (notion as any).databases.query({
          database_id: targetId,
          filter: { property: "Published", checkbox: { equals: true } },
          sorts,
        });
        results = response.results || [];
      } catch {
        const response = await (notion as any).databases.query({
          database_id: targetId,
          sorts,
        });
        results = response.results || [];
      }
    }

    if (results.length > 0) {
      const stories = results.map(parseNotionPage);
      return await Promise.all(
        stories.map(async (story) => {
          if (
            story.coverImage &&
            (story.coverImage.includes("file.notion.com") ||
              story.coverImage.includes("file.notion.so"))
          ) {
            const resolved = await resolveCoverImageUrl(story.coverImage);
            return { ...story, coverImage: resolved };
          }
          return story;
        })
      );
    }

    return getCuratedStories();
  } catch (error) {
    console.error("Error in getPublishedStories(), falling back to curated stories:", error);
    return getCuratedStories();
  }
}

/**
 * Resolves a cover image URL:
 * - If it's a Notion internal file URL (file.notion.com / file.notion.so) containing a block ID,
 *   resolves it via notion.blocks.retrieve to obtain the public authenticated S3 signed URL.
 * - Otherwise returns the URL as is.
 */
export async function resolveCoverImageUrl(rawUrl: string | null): Promise<string | null> {
  if (!rawUrl) return null;

  if (rawUrl.includes("file.notion.com") || rawUrl.includes("file.notion.so")) {
    try {
      const parsed = new URL(rawUrl);
      const blockId = parsed.searchParams.get("id");
      if (blockId) {
        const cleanId = blockId.replace(/-/g, "");
        const block: any = await notion.blocks.retrieve({ block_id: cleanId });
        if (block && block.type === "image" && block.image?.file?.url) {
          return block.image.file.url;
        }
      }
    } catch (err: any) {
      console.warn("Failed to resolve Notion internal file URL to signed S3 URL:", err?.message);
    }
  }

  return rawUrl;
}

/**
 * Parses a Notion Page object into our clean NotionStory structure
 */
export function parseNotionPage(page: any): NotionStory {
  const props = page.properties || {};

  // Title (title type)
  const titleProp = getProp(props, "Title");
  const title =
    titleProp?.title?.map((t: any) => t.plain_text).join("") ||
    "無標題山林記事";

  // Category (select type)
  const catProp = getProp(props, "Category");
  const category = catProp?.select?.name || "山林日誌";

  // slug (rich_text type)
  const slugProp = getProp(props, "slug");
  const slug =
    slugProp?.rich_text?.map((t: any) => t.plain_text).join("") ||
    page.id;

  // Summary (rich_text type)
  const sumProp = getProp(props, "Summary");
  const summary =
    sumProp?.rich_text?.map((t: any) => t.plain_text).join("") ||
    "記錄長途徒步、山林日常與手繪創作的隨筆。";

  // Date (date type)
  const dateProp = getProp(props, "Date");
  const rawDate = dateProp?.date?.start || "";
  const date = rawDate ? rawDate.replace(/-/g, ".") : "";

  // CoverImage: Check "CoverImage", "cover", "Cover", "Cover_Image", "image"
  const coverProp =
    getProp(props, "CoverImage") ||
    getProp(props, "Cover_Image") ||
    getProp(props, "Cover") ||
    getProp(props, "cover") ||
    getProp(props, "Image") ||
    getProp(props, "image");

  let coverImage: string | null = null;
  if (coverProp) {
    if (coverProp.type === "url" && coverProp.url) {
      coverImage = coverProp.url;
    } else if (
      coverProp.type === "files" &&
      Array.isArray(coverProp.files) &&
      coverProp.files.length > 0
    ) {
      const firstFile = coverProp.files[0];
      coverImage = firstFile?.file?.url || firstFile?.external?.url || null;
    } else if (
      coverProp.type === "rich_text" &&
      Array.isArray(coverProp.rich_text) &&
      coverProp.rich_text.length > 0
    ) {
      coverImage = coverProp.rich_text.map((t: any) => t.plain_text).join("").trim() || null;
    } else if (typeof coverProp.url === "string") {
      coverImage = coverProp.url;
    }
  }

  // Fallback to page cover if CoverImage property is not set
  if (!coverImage && page.cover) {
    coverImage = page.cover?.external?.url || page.cover?.file?.url || null;
  }

  // Featured (checkbox type)
  const featProp = getProp(props, "Featured");
  const featured = Boolean(featProp?.checkbox);

  return {
    id: page.id,
    pageId: page.id,
    title,
    category,
    slug,
    summary,
    date,
    coverImage,
    featured,
  };
}

/**
 * Fetches a single story by slug from Notion database
 * If query by slug is not found or fails, falls back gracefully to searching published stories
 */
export async function getStoryBySlug(slug: string): Promise<NotionStory | null> {
  const apiKey = process.env.NOTION_API_KEY;
  const rawId = process.env.NOTION_DATA_SOURCE_ID || process.env.NOTION_DATABASE_ID;

  if (!apiKey || !rawId || !slug) {
    return null;
  }

  const decodedSlug = decodeURIComponent(slug);

  try {
    const targetId = await resolveDataSourceId(rawId);
    let results: any[] = [];

    // Direct filter on slug or Slug property safely
    const queryBySlugProp = async (propName: string) => {
      const filter = { property: propName, rich_text: { equals: decodedSlug } };
      if (typeof (notion as any).dataSources?.query === "function") {
        const res = await (notion as any).dataSources.query({ data_source_id: targetId, filter });
        return res.results || [];
      } else if (typeof (notion as any).databases?.query === "function") {
        const res = await (notion as any).databases.query({ database_id: targetId, filter });
        return res.results || [];
      }
      return [];
    };

    try {
      results = await queryBySlugProp("slug");
    } catch {
      try {
        results = await queryBySlugProp("Slug");
      } catch {}
    }

    if (results.length > 0) {
      const story = parseNotionPage(results[0]);
      if (
        story.coverImage &&
        (story.coverImage.includes("file.notion.com") ||
          story.coverImage.includes("file.notion.so"))
      ) {
        story.coverImage = await resolveCoverImageUrl(story.coverImage);
      }
      return story;
    }

    // Fallback: search all published stories by slug or ID
    const allStories = await getPublishedStories();
    const matched = allStories.find(
      (s) =>
        s.slug === decodedSlug ||
        s.slug === slug ||
        s.id === decodedSlug ||
        s.id.replace(/-/g, "") === decodedSlug.replace(/-/g, "")
    );

    return matched || null;
  } catch (error) {
    console.error(`Error in getStoryBySlug("${slug}"):`, error);
    try {
      const allStories = await getPublishedStories();
      return (
        allStories.find(
          (s) =>
            s.slug === decodedSlug ||
            s.slug === slug ||
            s.id === decodedSlug ||
            s.id.replace(/-/g, "") === decodedSlug.replace(/-/g, "")
        ) || null
      );
    } catch {
      return null;
    }
  }
}

/**
 * Fetches the children blocks of a Notion page
 * Supports automatic pagination up to full page content with robust error handling
 */
export async function getPageBlocks(blockId: string): Promise<any[]> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey || !blockId) {
    return [];
  }

  const cleanId = blockId.replace(/-/g, "");

  try {
    let allBlocks: any[] = [];
    let cursor: string | undefined = undefined;

    while (true) {
      const response = await notion.blocks.children.list({
        block_id: cleanId,
        page_size: 100,
        start_cursor: cursor,
      });

      allBlocks = allBlocks.concat(response.results || []);

      if (!response.has_more || !response.next_cursor) {
        break;
      }
      cursor = response.next_cursor;
    }

    return allBlocks;
  } catch (error) {
    console.error(`Error fetching page blocks for ID "${blockId}":`, error);
    return [];
  }
}

