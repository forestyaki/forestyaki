import type { Metadata } from "next";
import { getPublishedStories, NotionStory } from "@/lib/notion";
import HomeClient from "../HomeClient";
import { photos } from "../TrailFilmGallery";

export const metadata: Metadata = {
  title: "經典手帳典藏版｜森女孩的話與畫",
  description: "森女孩的話與畫原始手帳版本：記錄長程縱走、黃刀鎮雪季、山狗狗 Ronnie 與平靜日常。",
};

// Revalidate published stories every 60 seconds (ISR)
export const revalidate = 60;
export { photos };

export default async function ClassicPage() {
  let stories: NotionStory[] = [];
  let fetchError: string | null = null;

  try {
    stories = await getPublishedStories();
  } catch (error) {
    console.error("Error fetching Notion stories in classic/page.tsx:", error);
    fetchError = error instanceof Error ? error.message : "無法連線至 Notion 資料庫";
  }

  return <HomeClient initialStories={stories} fetchError={fetchError} />;
}
