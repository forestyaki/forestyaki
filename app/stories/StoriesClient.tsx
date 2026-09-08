"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { NotionStory } from "@/lib/notion";
import SectionHeader from "@/components/SectionHeader";

interface StoriesClientProps {
  initialStories: NotionStory[];
  fetchError?: string | null;
}

// Category badge color scheme adhering to the Japanese journal & earth-tone design system
function getCategoryBadgeClass(category: string): string {
  switch (category) {
    case "長程縱走":
    case "長程徒步":
    case "PCT":
    case "TA":
      return "bg-[#EBF1EC] text-[#233F31] border-[#CCE0D2]";
    case "單日步道":
    case "健行札記":
    case "步道踏查":
      return "bg-[#F7EFE8] text-[#BA6341] border-[#EAD5C5]";
    case "海外遠征":
    case "極光":
    case "雪地生活":
      return "bg-[#E6F0F2] text-[#2D5A60] border-[#C8DFE3]";
    case "生活散文":
    case "話與畫":
    case "隨筆":
      return "bg-[#F4F0E8] text-[#6E5D42] border-[#E2D8C6]";
    case "毛孩野行":
    case "犬伴路線":
    case "毛孩同行":
      return "bg-[#FDF0E9] text-[#A25032] border-[#F2D2C2]";
    default:
      return "bg-[#EFE9DE] text-[#4F5B52] border-[#DDD5C7]";
  }
}

// Fallback cover photos
function getFallbackImage(category: string): string {
  if (category === "長程縱走" || category === "長程徒步") {
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85";
  }
  if (category === "單日步道" || category === "毛孩野行") {
    return "/images/ronnie-trail.jpg";
  }
  if (category === "海外遠征") {
    return "/images/gallery-1.jpg";
  }
  return "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85";
}

/**
 * 報導者風格 - 頂部主打推薦（Featured Hero）
 */
function FeaturedHeroBanner({ story }: { story: NotionStory }) {
  const [imgError, setImgError] = useState(false);
  const fallback = useFallbackImage(story.category);
  const displayImage = !imgError && story.coverImage ? story.coverImage : fallback;

  return (
    <article className="group relative bg-[#FDFBF7] rounded-3xl border border-[#E4DDD0] shadow-sm hover:shadow-xl hover:border-[#BA6341]/40 transition-all duration-500 overflow-hidden mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* 左側 / 大尺寸封面圖 (佔 7 欄) */}
        <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[280px] sm:min-h-[380px] lg:min-h-[460px] overflow-hidden bg-[#243E30]">
          <Link
            href={`/stories/${encodeURIComponent(story.slug)}`}
            className="block w-full h-full relative cursor-pointer"
            aria-label={`閱讀主打專題：${story.title}`}
          >
            <Image
              src={displayImage}
              alt={story.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
              priority
            />
            {/* 漸層遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10 pointer-events-none" />

            {/* 頂部焦點標籤 */}
            <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#BA6341] text-white text-xs font-semibold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>焦點專題 · FEATURED</span>
              </span>
            </div>

            {/* 照片左下角日期標記 */}
            {story.date && (
              <div className="absolute bottom-4 left-5 z-10">
                <span className="text-xs text-stone-100 font-mono tracking-wider drop-shadow-sm">
                  {story.date}
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* 右側 / 專題報導引言與資訊卡片 (佔 5 欄) */}
        <div className="lg:col-span-5 p-7 sm:p-10 lg:p-12 flex flex-col justify-between bg-[#FDFBF7]">
          <div>
            {/* 分類與欄目標籤 */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(
                  story.category
                )}`}
              >
                {story.category}
              </span>
              <span className="text-xs text-[#737373] font-mono uppercase tracking-wider">
                深入報導 · IN-DEPTH
              </span>
            </div>

            {/* 醒目標題 */}
            <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] leading-snug group-hover:text-[#BA6341] transition-colors mb-4">
              <Link href={`/stories/${encodeURIComponent(story.slug)}`}>
                {story.title}
              </Link>
            </h2>

            {/* 引言摘要（報導者新聞雜誌風格） */}
            <p className="text-base sm:text-lg text-[#4A4A4A] leading-relaxed line-clamp-4 font-normal mb-6">
              {story.summary}
            </p>
          </div>

          {/* 底部作者資訊與閱讀按鈕 */}
          <div className="pt-6 border-t border-[#EFE8DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-[#737373] font-mono flex items-center gap-2">
              <span className="font-semibold text-[#262626]">森女孩 YAKI</span>
              <span>·</span>
              <span>約 6 分鐘閱讀</span>
            </div>

            <Link
              href={`/stories/${encodeURIComponent(story.slug)}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#233F31] text-[#FAF7F2] text-sm font-semibold hover:bg-[#BA6341] transition-all duration-300 shadow-xs hover:shadow-md group/btn"
            >
              <span>閱讀完整專題</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function useFallbackImage(category: string) {
  return useMemo(() => getFallbackImage(category), [category]);
}

/**
 * 報導者風格 - 文章卡片網格項（Article Grid Card）
 * 規範：
 * - 精緻圓角封面圖（Hover 時有平滑放大效果）
 * - 分類標籤（Tag）
 * - 簡短標題
 * - 2 行文字摘要（Line Clamp 2）
 * - 發布日期
 */
function MagazineArticleCard({
  story,
  isLiked,
  onToggleLike,
}: {
  story: NotionStory;
  isLiked: boolean;
  onToggleLike: () => void;
}) {
  const [imgError, setImgError] = useState(false);
  const fallback = useFallbackImage(story.category);
  const displayImage = !imgError && story.coverImage ? story.coverImage : fallback;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="group relative flex flex-col bg-[#FDFBF7] rounded-2xl border border-[#E4DDD0] shadow-xs hover:shadow-xl hover:border-[#BA6341]/40 transition-all duration-400 overflow-hidden"
    >
      {/* 16:10 精緻圓角封面圖容器（Hover 平滑放大） */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#243E30] select-none">
        <Link
          href={`/stories/${encodeURIComponent(story.slug)}`}
          className="block relative w-full h-full cursor-pointer"
          aria-label={`閱讀 ${story.title}`}
        >
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={displayImage}
              alt={story.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          </div>
        </Link>

        {/* 輕微底層漸層確保文字對比 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

        {/* 頂部標籤列：分類標籤 + 收藏按鈕 */}
        <div className="absolute top-3.5 inset-x-3.5 z-10 flex items-center justify-between pointer-events-none">
          <span
            className={`pointer-events-auto px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border shadow-xs backdrop-blur-xs ${getCategoryBadgeClass(
              story.category
            )}`}
          >
            {story.category}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleLike();
            }}
            aria-label="收藏文章"
            className={`pointer-events-auto w-7 h-7 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm transition-transform active:scale-90 ${
              isLiked
                ? "bg-[#BA6341] text-white shadow-xs"
                : "bg-black/30 text-white/85 hover:bg-black/50 hover:text-white"
            }`}
          >
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* 左下角發布日期 */}
        {story.date && (
          <div className="absolute bottom-2.5 left-3.5 z-10">
            <span className="text-[11px] text-stone-200 font-mono tracking-wider drop-shadow-sm">
              {story.date}
            </span>
          </div>
        )}
      </div>

      {/* 卡片內容區 */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* 分類與專題標註 */}
          <div className="flex items-center gap-2 text-xs text-[#737373] mb-2.5 font-mono">
            <span className="font-semibold text-[#BA6341]">{story.category}</span>
            <span>·</span>
            <span>專題札記</span>
          </div>

          {/* 簡短標題 */}
          <h3 className="text-lg sm:text-xl font-bold text-[#262626] leading-snug group-hover:text-[#BA6341] transition-colors mb-3 line-clamp-2">
            <Link href={`/stories/${encodeURIComponent(story.slug)}`}>
              {story.title}
            </Link>
          </h3>

          {/* 嚴格 2 行文字摘要（Line Clamp 2） */}
          <p className="text-sm font-normal text-[#4A4A4A] leading-relaxed line-clamp-2 mb-5">
            {story.summary}
          </p>
        </div>

        {/* 卡片底部操作列 */}
        <div className="pt-4 border-t border-[#EFE8DC] flex items-center justify-between text-xs text-[#737373]">
          <span className="font-mono">{story.date || "近期撰寫"}</span>
          <Link
            href={`/stories/${encodeURIComponent(story.slug)}`}
            className="inline-flex items-center gap-1.5 font-semibold text-[#233F31] group-hover:text-[#BA6341] group-hover:translate-x-1 transition-all"
          >
            <span>閱讀全文</span>
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function StoriesClient({
  initialStories,
  fetchError,
}: StoriesClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedStories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 1. 抓取最新或標註 Featured 的文章作為 Featured Hero
  const featuredStory = useMemo(() => {
    if (initialStories.length === 0) return null;
    return initialStories.find((s) => s.featured) || initialStories[0];
  }, [initialStories]);

  // 2. 子分類標籤過濾清單（包含「全部、長程縱走、單日步道、海外遠征、生活散文」與動態標籤）
  const categories = useMemo(() => {
    const defaultList = ["全部", "長程縱走", "單日步道", "海外遠征", "生活散文"];
    const foundCategories = new Set<string>();

    initialStories.forEach((s) => {
      const cat = s.category?.trim();
      if (cat) foundCategories.add(cat);
    });

    const result = ["全部"];
    // 依序加入預設類別（若在資料中或作為主要濾鏡）
    defaultList.slice(1).forEach((cat) => {
      result.push(cat);
    });
    // 加入其他未包含的類別
    foundCategories.forEach((cat) => {
      if (!result.includes(cat)) {
        result.push(cat);
      }
    });

    return result;
  }, [initialStories]);

  // 智慧類別比對邏輯
  const matchesCategory = (story: NotionStory, category: string) => {
    if (category === "全部") return true;
    if (story.category === category) return true;

    if (category === "長程縱走") {
      return (
        story.category === "長程徒步" ||
        story.category === "PCT" ||
        story.category === "TA" ||
        story.title.includes("縱走") ||
        story.title.includes("PCT") ||
        story.title.includes("Te Araroa")
      );
    }
    if (category === "單日步道") {
      return (
        story.category === "健行札記" ||
        story.category === "步道踏查" ||
        story.category === "毛孩野行" ||
        story.category === "犬伴路線" ||
        story.title.includes("古道")
      );
    }
    if (category === "海外遠征") {
      return (
        story.category === "極光" ||
        story.category === "雪地生活" ||
        story.title.includes("紐西蘭") ||
        story.title.includes("北極") ||
        story.title.includes("Yellowknife")
      );
    }
    if (category === "生活散文") {
      return (
        story.category === "話與畫" ||
        story.category === "隨筆" ||
        story.title.includes("話與畫") ||
        story.title.includes("散文")
      );
    }

    return false;
  };

  // 3. 根據選取標籤過濾文章列表
  const filteredStories = useMemo(() => {
    return initialStories.filter((s) => matchesCategory(s, activeCategory));
  }, [initialStories, activeCategory]);

  // 計算每個分類底下的文章數量
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      if (cat === "全部") {
        counts[cat] = initialStories.length;
      } else {
        counts[cat] = initialStories.filter((s) => matchesCategory(s, cat)).length;
      }
    });
    return counts;
  }, [categories, initialStories]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A4A4A] font-sans selection:bg-[#E8DDD1] selection:text-[#1E3729]">
      {/* ─── 頂部導覽列 (Sticky Navigation Bar) ─── */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E1D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* 返回首頁按鈕 */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#233F31] hover:text-[#BA6341] transition-colors shrink-0"
          >
            <span aria-hidden="true">←</span>
            <span>回到首頁</span>
          </Link>

          {/* 中央 Logo 與品牌名稱 */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-8 w-8 overflow-hidden rounded-full border border-[#D5E2D8] bg-[#EBF1EC] shadow-2xs shrink-0">
              <Image
                src="/logo.png"
                alt="森女孩的話與畫 Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-sm font-bold text-[#262626] group-hover:text-[#BA6341] transition-colors whitespace-nowrap">
              森女孩的話與畫
            </span>
          </Link>

          {/* 右側頁面快捷捷徑 */}
          <nav className="flex items-center gap-4 text-xs font-medium text-[#737373]">
            <Link href="/about" className="hover:text-[#BA6341] transition-colors">
              關於我
            </Link>
            <Link href="/#podcast" className="hover:text-[#BA6341] transition-colors hidden sm:inline">
              Podcast
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── 頁面主體內容 ─── */}
      <main className="py-12 sm:py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 區塊大標題 (Section Header) */}
        <div className="mb-12">
          <SectionHeader
            eyebrow="山林日誌 · JOURNAL ARCHIVE"
            title="山林日誌：自然筆觸與專題報導"
            description="仿照新聞雜誌專題排版，記錄荒野長程縱走、單日古道慢行與海外遠征的每一步呼吸。"
          />
        </div>

        {/* ─── 1. 頂部主打推薦（Featured Hero） ─── */}
        {featuredStory && <FeaturedHeroBanner story={featuredStory} />}

        {/* ─── 2. 子分類標籤過濾（Category Filter） ─── */}
        <div className="mb-10 pb-6 border-b border-[#E8E1D5]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#BA6341]" aria-hidden="true" />
              <span className="text-xs font-semibold tracking-wider text-[#BA6341] uppercase font-mono">
                專題分類過濾 · CATEGORIES
              </span>
              <span className="text-xs text-[#737373] font-mono ml-2">
                (共 {filteredStories.length} 篇報導)
              </span>
            </div>

            {/* 標籤按鈕列 */}
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                const count = categoryCounts[category] || 0;

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? "bg-[#233F31] text-[#FAF7F2] shadow-xs ring-1 ring-[#233F31]"
                        : "bg-[#F3EDE3] text-[#4F5B52] hover:bg-[#EAE0D2] hover:text-[#262626] border border-[#E8E1D5]"
                    }`}
                  >
                    <span>{category}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-black/5 text-[#737373]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── 3. 文章卡片網格（Article Grid） ─── */}
        <AnimatePresence mode="wait">
          {filteredStories.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="py-16 px-6 text-center bg-[#FDFBF7] rounded-3xl border border-dashed border-[#DDD4C5] max-w-lg mx-auto shadow-2xs"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EBF1EC] text-[#233F31] flex items-center justify-center text-3xl shadow-inner">
                🌲
              </div>
              <h3 className="text-xl font-bold text-[#262626] mb-2">
                此分類暫無更多專題
              </h3>
              <p className="text-sm text-[#4A4A4A] leading-relaxed max-w-sm mx-auto mb-6">
                森女孩正在山徑深處採集靈感，歡迎點擊下方按鈕瀏覽所有山林日誌。
              </p>
              <button
                onClick={() => setActiveCategory("全部")}
                className="px-6 py-2.5 rounded-full bg-[#233F31] text-[#FAF7F2] text-xs font-semibold hover:bg-[#BA6341] transition-colors cursor-pointer shadow-xs"
              >
                查看全部文章
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory}
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredStories.map((story) => (
                  <MagazineArticleCard
                    key={story.id}
                    story={story}
                    isLiked={!!likedStories[story.id]}
                    onToggleLike={() => toggleLike(story.id)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 頁尾精簡標註 */}
      <footer className="mt-24 py-12 border-t border-[#E8E1D5] bg-[#FDFBF7] text-center text-xs text-[#737373]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono">
            © {new Date().getFullYear()} 森女孩的話與畫 · MOUNTAIN STORIES ARCHIVE
          </p>
          <div className="flex items-center gap-4 font-mono">
            <Link href="/" className="hover:text-[#BA6341] transition-colors">
              首頁
            </Link>
            <span>·</span>
            <Link href="/about" className="hover:text-[#BA6341] transition-colors">
              關於 YAKI
            </Link>
            <span>·</span>
            <a
              href="https://open.spotify.com/show/1pusMjoawvb6plDusPEePP"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#BA6341] transition-colors"
            >
              Podcast
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
