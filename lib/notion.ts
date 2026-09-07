import { Client } from "@notionhq/client";

export interface NotionStory {
  id: string;
  pageId?: string;
  title: string;
  category: string;
  slug: string;
  summary: string;
  date: string;
  coverImage: string | null;
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
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
 * Resolves the queryable data_source_id or database_id across Notion's latest SDK versions
 */
async function resolveDataSourceId(rawId: string): Promise<string> {
  if (cachedDataSourceId) return cachedDataSourceId;
  const cleanId = rawId.replace(/-/g, "");

  // 1. Try retrieving directly as data_source
  try {
    const ds = await (notion as any).dataSources?.retrieve({ data_source_id: cleanId });
    if (ds && ds.id) {
      cachedDataSourceId = ds.id;
      return ds.id;
    }
  } catch {}

  // 2. Try retrieving as database and inspect its data_sources
  try {
    const db = await notion.databases.retrieve({ database_id: cleanId });
    if ((db as any).data_sources && (db as any).data_sources.length > 0) {
      const dsId = (db as any).data_sources[0].id as string;
      cachedDataSourceId = dsId;
      return dsId;
    }
  } catch {}

  // 3. Try retrieving as page containing an inline child_database
  try {
    const blocks = await notion.blocks.children.list({ block_id: cleanId });
    const childDb = blocks.results.find((b: any) => b.type === "child_database");
    if (childDb) {
      const db = await notion.databases.retrieve({ database_id: childDb.id });
      if ((db as any).data_sources && (db as any).data_sources.length > 0) {
        const dsId = (db as any).data_sources[0].id as string;
        cachedDataSourceId = dsId;
        return dsId;
      }
    }
  } catch {}

  cachedDataSourceId = cleanId;
  return cleanId;
}

/**
 * Fetches published & featured stories from Notion database, ordered by Date descending
 */
export async function getPublishedStories(): Promise<NotionStory[]> {
  const apiKey = process.env.NOTION_API_KEY;
  const rawId = process.env.NOTION_DATA_SOURCE_ID || process.env.NOTION_DATABASE_ID;

  if (!apiKey || !rawId) {
    console.warn("Notion API Key or Database ID is missing from environment variables.");
    return [];
  }

  try {
    const targetId = await resolveDataSourceId(rawId);

    const filter = {
      and: [
        { property: "Published", checkbox: { equals: true } },
        { property: "Featured", checkbox: { equals: true } },
      ],
    };

    const sorts = [
      { property: "Date", direction: "descending" as const },
    ];

    let results: any[] = [];

    // Supports Notion SDK v5 (dataSources.query) and v2 (databases.query)
    if (typeof (notion as any).dataSources?.query === "function") {
      const response = await (notion as any).dataSources.query({
        data_source_id: targetId,
        filter,
        sorts,
      });
      results = response.results || [];
    } else if (typeof (notion as any).databases?.query === "function") {
      const response = await (notion as any).databases.query({
        database_id: targetId,
        filter,
        sorts,
      });
      results = response.results || [];
    }

    return results.map(parseNotionPage);
  } catch (error) {
    console.error("Error in getPublishedStories():", error);
    throw error;
  }
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
    "在千米之上的雲霧與落葉泥土間，記錄生活與山徑的微光。";

  // Date (date type)
  const dateProp = getProp(props, "Date");
  const rawDate = dateProp?.date?.start || "";
  const date = rawDate ? rawDate.replace(/-/g, ".") : "";

  // CoverImage (url type or page cover fallback)
  const coverProp = getProp(props, "CoverImage");
  const coverImage =
    coverProp?.url ||
    page.cover?.external?.url ||
    page.cover?.file?.url ||
    null;

  return {
    id: page.id,
    pageId: page.id,
    title,
    category,
    slug,
    summary,
    date,
    coverImage,
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

    // Direct filter on slug or Slug property
    const filter = {
      or: [
        { property: "slug", rich_text: { equals: decodedSlug } },
        { property: "Slug", rich_text: { equals: decodedSlug } },
      ],
    };

    let results: any[] = [];

    if (typeof (notion as any).dataSources?.query === "function") {
      try {
        const response = await (notion as any).dataSources.query({
          data_source_id: targetId,
          filter,
        });
        results = response.results || [];
      } catch (err) {
        // Fallback to fetch all published stories if filtered query fails
      }
    } else if (typeof (notion as any).databases?.query === "function") {
      try {
        const response = await (notion as any).databases.query({
          database_id: targetId,
          filter,
        });
        results = response.results || [];
      } catch (err) {
        // Fallback
      }
    }

    if (results.length > 0) {
      return parseNotionPage(results[0]);
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

