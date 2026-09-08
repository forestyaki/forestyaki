import type { Metadata } from "next";
import { getPublishedStories, NotionStory } from "@/lib/notion";
import MagazineHomeClient from "./MagazineHomeClient";

export const metadata: Metadata = {
  title: "日系戶外雜誌版預覽 · ISSUE 04｜森女孩的話與畫",
  description: "【雙軌預覽】日系戶外獨立雜誌風首頁：跨版封面刊頭、非對稱底片網格與沉浸式山行紀事。",
};

export const revalidate = 60;

export default async function MagazinePage() {
  let stories: NotionStory[] = [];
  let fetchError: string | null = null;

  try {
    stories = await getPublishedStories();
  } catch (error) {
    console.error("Error fetching Notion stories in magazine/page.tsx:", error);
    fetchError = error instanceof Error ? error.message : "無法連線至 Notion 資料庫";
  }

  return <MagazineHomeClient initialStories={stories} fetchError={fetchError} />;
}
