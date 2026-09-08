import type { Metadata } from "next";
import { getPublishedStories, NotionStory } from "@/lib/notion";
import MagazineHomeClient from "./magazine/MagazineHomeClient";
import { photos } from "./TrailFilmGallery";

export const metadata: Metadata = {
  title: "森女孩的話與畫 · Forest Yaki｜日系戶外生活誌",
  description: "在這裡安放走過的路，還有那些閃閃發光的平靜日常。記錄太平洋屋脊步道（PCT）4,000公里、黃刀鎮極光與雪地生活、山狗狗 Ronnie 與手作生活雜誌。",
};

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

  return <MagazineHomeClient initialStories={stories} fetchError={fetchError} isOfficialHome={true} />;
}

