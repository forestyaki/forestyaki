import type { Metadata } from "next";
import { getPublishedStories, NotionStory } from "@/lib/notion";
import StoriesClient from "./StoriesClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "山林日誌 · JOURNAL ARCHIVE | 森女孩的話與畫",
  description:
    "仿照新聞雜誌專題排版，收錄荒野長程縱走、單日古道踏查與海外遠征深度專題。",
  openGraph: {
    title: "山林日誌 · JOURNAL ARCHIVE | 森女孩的話與畫",
    description:
      "仿照新聞雜誌專題排版，收錄荒野長程縱走、單日古道踏查與海外遠征深度專題。",
  },
};

export default async function StoriesPage() {
  let stories: NotionStory[] = [];
  let fetchError: string | null = null;

  try {
    stories = await getPublishedStories();
  } catch (error) {
    console.error("Error fetching stories in StoriesPage:", error);
    fetchError = error instanceof Error ? error.message : "無法載入山林日誌資料";
  }

  return <StoriesClient initialStories={stories} fetchError={fetchError} />;
}
