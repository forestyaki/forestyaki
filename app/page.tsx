import { getPublishedStories, NotionStory } from "@/lib/notion";
import HomeClient from "./HomeClient";
import { photos } from "./TrailFilmGallery";

// Revalidate published stories every 60 seconds (ISR)
export const revalidate = 60;
export { photos };

export default async function Home() {
  let stories: NotionStory[] = [];
  let fetchError: string | null = null;

  try {
    stories = await getPublishedStories();
  } catch (error) {
    console.error("Error fetching Notion stories in page.tsx:", error);
    fetchError = error instanceof Error ? error.message : "無法連線至 Notion 資料庫";
  }

  return <HomeClient initialStories={stories} fetchError={fetchError} />;
}
