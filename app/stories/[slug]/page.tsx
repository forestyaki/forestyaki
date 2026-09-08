import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoryBySlug, getPublishedStories, getPageBlocks, NotionStory } from "@/lib/notion";
import NotionRenderer from "@/src/components/NotionRenderer";

interface StoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {};
  }

  const coverImageUrl =
    story.coverImage && !story.coverImage.includes("google.com/search")
      ? story.coverImage
      : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&h=630&q=85";

  return {
    title: story.title,
    description: story.summary,
    openGraph: {
      title: story.title,
      description: story.summary,
      type: "article",
      images: [
        {
          url: coverImageUrl,
          width: 1200,
          height: 630,
          alt: story.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.summary,
      images: [coverImageUrl],
    },
  };
}

function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case "健行札記":
    case "長程徒步":
    case "步道踏查":
      return "bg-[#233F31] text-[#FAF7F2]";
    case "毛孩野行":
    case "犬伴路線":
    case "毛孩同行":
      return "bg-[#BA6341] text-[#FFFDF9]";
    case "生活散文":
    case "話與畫":
      return "bg-[#715A46] text-[#FAF7F2]";
    default:
      return "bg-[#233F31] text-[#FAF7F2]";
  }
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  // Fetch Notion Blocks for the story page
  const blocks = await getPageBlocks(story.id);

  // Fetch all published stories to compute previous & next navigation
  let allStories: NotionStory[] = [];
  try {
    allStories = await getPublishedStories();
  } catch (err) {
    console.error("Error loading story siblings for navigation:", err);
  }

  const currentIndex = allStories.findIndex(
    (s) => s.slug === story.slug || s.id === story.id
  );
  const prevStory = currentIndex > 0 ? allStories[currentIndex - 1] : null;
  const nextStory =
    currentIndex >= 0 && currentIndex < allStories.length - 1
      ? allStories[currentIndex + 1]
      : null;

  const displayCover =
    story.coverImage && !story.coverImage.includes("google.com/search")
      ? story.coverImage
      : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85";

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A4A4A] font-sans selection:bg-[#E8DDD1] selection:text-[#1E3729]">
      {/* ─── 頂部導覽列 (Sticky Navigation Bar) ─── */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E1D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* 返回日誌列表按鈕 */}
          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#233F31] hover:text-[#BA6341] transition-colors shrink-0"
          >
            <span aria-hidden="true">←</span>
            <span>返回日誌列表</span>
          </Link>

          {/* Logo 與站名 */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-[#D5E2D8] bg-[#EBF1EC] shadow-2xs shrink-0">
              <Image
                src="/logo.png"
                alt="森女孩的話與畫 Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#262626] group-hover:text-[#BA6341] transition-colors whitespace-nowrap">
              森女孩的話與畫
            </span>
          </Link>

          {/* 右側快捷捷徑 */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-[#737373]">
            <Link href="/about" className="hover:text-[#BA6341] transition-colors">
              關於我
            </Link>
            <Link href="/#film-gallery" className="hover:text-[#BA6341] transition-colors">
              山野光影
            </Link>
            <Link href="/#podcast" className="hover:text-[#BA6341] transition-colors">
              Podcast
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 沉浸式閱讀單欄容器 (Max-w-3xl Editorial Layout) ─── */}
      <main className="max-w-3xl mx-auto px-5 sm:px-6 pt-8 sm:pt-14 pb-24">
        <article className="space-y-8 sm:space-y-10">
          {/* ─── 1. 文章標頭 (Article Header) ─── */}
          <header className="space-y-4">
            {/* 分類膠囊標籤與發布日期 */}
            <div className="flex items-center gap-3 text-xs">
              <span
                className={`px-3 py-1 rounded-full font-semibold shadow-2xs ${getCategoryBadgeClass(
                  story.category
                )}`}
              >
                {story.category}
              </span>
              {story.date && (
                <span className="font-mono text-[#737373] tracking-wide">
                  {story.date}
                </span>
              )}
            </div>

            {/* 主標題 */}
            <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold text-[#262626] mb-5 sm:mb-6 leading-tight tracking-normal">
              {story.title}
            </h1>

            {/* 導讀前言 (Summary) */}
            {story.summary && (
              <div className="border-l-2 border-[#BA6341] pl-4 py-2 my-5 sm:my-6 bg-[#F4EFE6]/60 rounded-r-xl">
                <p className="text-base sm:text-lg font-normal text-[#4A4A4A] italic leading-relaxed">
                  {story.summary}
                </p>
              </div>
            )}
          </header>

          {/* ─── 2. 封面照片 (自適應原始比例，絕不硬性裁切) ─── */}
          {displayCover && (
            <figure className="w-full flex flex-col items-center justify-center my-8">
              <div className="w-full flex justify-center">
                <img
                  src={displayCover}
                  alt={story.title}
                  loading="eager"
                  className="max-w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-sm border border-[#E0D8CB] bg-[#EBE4D8]"
                />
              </div>
              <figcaption className="text-center text-xs text-[#737373] mt-2.5 font-mono">
                📍 {story.category} · 山林實地記事
              </figcaption>
            </figure>
          )}

          {/* ─── 3. Notion 內文區塊渲染 (Blocks Content) ─── */}
          {blocks && blocks.length > 0 ? (
            <div className="pt-2">
              <NotionRenderer blocks={blocks} />
            </div>
          ) : (
            <div className="my-8 p-8 sm:p-10 rounded-3xl bg-[#FFFEFA] border border-dashed border-[#DDD4C5] text-center shadow-2xs">
              <div className="text-3xl mb-3">🍃</div>
              <h3 className="text-lg font-semibold text-[#262626] mb-1">
                步道筆記整理中，敬請期待...
              </h3>
              <p className="text-xs text-[#737373] leading-relaxed max-w-sm mx-auto mb-4">
                作者正在山徑路上採集靈感與整理文字手帳，完整日誌內容將陸續同步發布。
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E0D8CB] text-[11px] font-mono text-[#737373]">
                NOTION PAGE ID: {story.id}
              </span>
            </div>
          )}

          {/* ─── 4. 文末手帳簽名 (Journal Sign-off Card) ─── */}
          <div className="mt-14 pt-10 border-t border-[#E8E1D5]">
            <div className="bg-[#FFFEFA] border border-[#E0D7C7] rounded-3xl p-7 sm:p-9 shadow-sm relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
              {/* 紙膠帶裝飾 */}
              <div className="absolute -top-3 left-10 w-24 h-6 bg-[#E5DCB8]/75 transform -rotate-2 border-dashed border-[#D2C59D] border-x pointer-events-none" />

              <div className="w-16 h-16 rounded-full bg-[#F5ECE3] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                🌲
              </div>
              <div className="flex-1">
                <div className="text-base font-semibold text-[#262626] mb-1">
                  森女孩 Yaki &amp; 犬伴小栗 🐾
                </div>
                <p className="text-xs text-[#737373] leading-relaxed mb-3">
                  用雙腳踩出平靜，用畫筆留下微風。感謝你讀到這裡，願每座山都溫柔以待。
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-[#BA6341] font-mono">
                  <span>#山林日誌</span>
                  <span>#長程徒步</span>
                  <span>#犬伴同行</span>
                  <span>#話與畫</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── 5. 上一篇 / 下一篇導航 (Prev / Next Navigation) ─── */}
          <div className="pt-10 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* 上一篇 */}
            {prevStory ? (
              <Link
                href={`/stories/${encodeURIComponent(prevStory.slug)}`}
                className="group flex-1 flex flex-col items-start p-4 rounded-2xl bg-[#FFFEFA] hover:bg-[#FDF9F3] border border-[#E0D8CB] hover:border-[#BA6341]/60 transition-all shadow-2xs"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#BA6341] transition-colors mb-1">
                  ← 上一篇日誌
                </span>
                <span className="text-sm font-semibold text-[#262626] group-hover:text-[#BA6341] transition-colors line-clamp-1">
                  {prevStory.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1 p-4 rounded-2xl border border-dashed border-[#E0D8CB] text-xs text-[#A8A29E] flex items-center justify-center">
                已是最新一篇日誌
              </div>
            )}

            {/* 中間所有日誌快捷鍵 */}
            <Link
              href="/#stories"
              className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-[#233F31] text-[#FAF7F2] text-xs font-semibold hover:bg-[#182C22] transition-all shadow-xs shrink-0 self-center"
            >
              <span>📚 全部日誌</span>
            </Link>

            {/* 下一篇 */}
            {nextStory ? (
              <Link
                href={`/stories/${encodeURIComponent(nextStory.slug)}`}
                className="group flex-1 flex flex-col items-end text-right p-4 rounded-2xl bg-[#FFFEFA] hover:bg-[#FDF9F3] border border-[#E0D8CB] hover:border-[#BA6341]/60 transition-all shadow-2xs"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#BA6341] transition-colors mb-1">
                  下一篇日誌 →
                </span>
                <span className="text-sm font-semibold text-[#262626] group-hover:text-[#BA6341] transition-colors line-clamp-1">
                  {nextStory.title}
                </span>
              </Link>
            ) : (
              <div className="flex-1 p-4 rounded-2xl border border-dashed border-[#E0D8CB] text-xs text-[#A8A29E] flex items-center justify-center">
                已是第一篇日誌
              </div>
            )}
          </div>
        </article>
      </main>

      {/* ─── 簡約頁尾 (Footer) ─── */}
      <footer className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-12">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>© 2024–2026 森女孩的話與畫 · FOREST GIRL&apos;S WORDS &amp; ART</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#BA6341] transition-colors">
              首頁
            </Link>
            <Link href="/about" className="hover:text-[#BA6341] transition-colors">
              關於森女孩
            </Link>
            <Link
              href="/#stories"
              className="hover:text-[#BA6341] transition-colors font-semibold text-[#262626]"
            >
              山林日誌
            </Link>
            <Link href="/#podcast" className="hover:text-[#BA6341] transition-colors">
              Podcast
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
