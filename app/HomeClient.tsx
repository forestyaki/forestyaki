"use client";

import { useState, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { gsap } from "gsap";
import { NotionStory } from "@/lib/notion";
import TrailFilmGallery from "./TrailFilmGallery";
import SectionHeader from "@/src/components/SectionHeader";

interface HomeClientProps {
  initialStories: NotionStory[];
  fetchError: string | null;
}

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

// Gentle, organic motion variants for cards and images
const cardVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
  hover: {
    y: -4,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

const imageVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

function StoryCard({
  story,
  isLiked,
  onToggleLike,
}: {
  story: NotionStory;
  isLiked: boolean;
  onToggleLike: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  // Robust check for cover image: story.coverImage || (story as any).cover || fallbackImage
  const rawCover = story.coverImage || (story as any).cover || (story as any).CoverImage || null;

  // If rawCover is a Notion internal URL, safely route through our /api/notion-image proxy
  const safeCover = useMemo(() => {
    if (!rawCover) return null;
    if (rawCover.includes("file.notion.com") || rawCover.includes("file.notion.so")) {
      return `/api/notion-image?url=${encodeURIComponent(rawCover)}`;
    }
    return rawCover;
  }, [rawCover]);

  // Check if coverImage is a direct image URL (not a search page)
  const isDirectImage = Boolean(
    safeCover &&
      !safeCover.includes("google.com/search") &&
      !safeCover.includes("google.com/url") &&
      (safeCover.startsWith("http://") ||
        safeCover.startsWith("https://") ||
        safeCover.startsWith("/"))
  );

  // High-quality warm atmospheric mountain & hiking photo fallbacks
  const fallbackImage = useMemo(() => {
    if (
      story.category === "犬伴路線" ||
      story.category === "毛孩同行" ||
      story.category === "毛孩野行"
    ) {
      return "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=85";
    }
    if (story.category === "生活散文" || story.category === "話與畫") {
      return "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=85";
    }
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85";
  }, [story.category]);

  const displayImage = isDirectImage && !imgError && safeCover ? safeCover : fallbackImage;

  return (
    <motion.article
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      variants={cardVariants}
      className="group relative flex flex-col bg-[#FDFBF7] rounded-2xl border border-[#E4DDD0] shadow-xs hover:shadow-xl hover:border-[#C16744]/45 transition-[box-shadow,border-color] duration-400 overflow-hidden"
    >
      {/* 16:10 精緻圓角封面圖容器（Hover 平滑放大效果） */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#243E30] select-none">
        <Link
          href={`/stories/${encodeURIComponent(story.slug)}`}
          className="block relative w-full h-full cursor-pointer"
          aria-label={`閱讀 ${story.title}`}
        >
          <motion.div
            variants={imageVariants}
            className="relative w-full h-full"
          >
            <Image
              src={displayImage}
              alt={story.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          </motion.div>
        </Link>

        {/* Soft bottom gradient to ensure overlay contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/10 pointer-events-none" />

        {/* Top bar: Category Badge + Like Button */}
        <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-xs border border-white/20 backdrop-blur-xs ${getCategoryBadgeClass(
              story.category
            )}`}
          >
            {story.category}
          </span>

          {/* Like button with micro-feedback */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleLike();
            }}
            aria-label={isLiked ? "已收藏文章，點擊取消" : "收藏這篇日誌"}
            aria-pressed={isLiked}
            className="pointer-events-auto -mr-2 -mt-2 min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer group/like"
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-transform group-active/like:scale-90 ${
                isLiked
                  ? "bg-[#BA6341] text-white shadow-sm"
                  : "bg-black/30 text-white/90 hover:bg-black/50"
              }`}
            >
              <svg
                className="w-4 h-4 fill-current transition-transform duration-200"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          </button>
        </div>

        {/* Bottom Tag on 16:9 visual */}
        {story.date && (
          <div className="absolute bottom-3 left-4 z-10">
            <span className="text-[11px] text-stone-100 font-mono tracking-wider drop-shadow-sm">
              {story.date}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Read indicator */}
          <div className="flex items-center gap-2 text-xs text-[#595550] mb-3">
            <span
              className={`px-2 py-0.5 rounded-sm font-medium text-[11px] ${getCategoryBadgeClass(
                story.category
              )}`}
            >
              {story.category}
            </span>
            <span>·</span>
            <span>山林札記</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-[#262626] leading-snug group-hover:text-[#C16744] transition-colors mb-3 line-clamp-2">
            <Link href={`/stories/${encodeURIComponent(story.slug)}`} className="focus:outline-none">
              {story.title}
            </Link>
          </h3>

          {/* Summary / Excerpt (Strictly 2 lines) */}
          <p className="text-sm font-normal text-[#4A4A4A] leading-relaxed line-clamp-2 mb-6">
            {story.summary}
          </p>
        </div>

        {/* Card Footer: Date & Link */}
        <div className="pt-4 border-t border-[#EFE8DC] flex items-center justify-between text-xs text-[#595550]">
          <span className="font-mono text-[#595550]">{story.date}</span>
          <Link
            href={`/stories/${encodeURIComponent(story.slug)}`}
            className="inline-flex items-center gap-1.5 font-medium text-[#595550] group-hover:text-[#BA6341] group-hover:translate-x-1 transition-all"
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

export default function HomeClient({ initialStories, fetchError }: HomeClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [likedStories, setLikedStories] = useState<Record<string, boolean>>({});
  const [newsletterEmail, setNewsletterEmail] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(false);

  // Tree Hole Modal State
  const [isTreeHoleOpen, setIsTreeHoleOpen] = useState<boolean>(false);
  const [treeHoleName, setTreeHoleName] = useState<string>("");
  const [treeHoleMessage, setTreeHoleMessage] = useState<string>("");
  const [treeHoleConsent, setTreeHoleConsent] = useState<boolean>(true);
  const [treeHoleSubmitted, setTreeHoleSubmitted] = useState<boolean>(false);
  const [submittedSenderName, setSubmittedSenderName] = useState<string>("");
  const [isSubmittingTreeHole, setIsSubmittingTreeHole] = useState<boolean>(false);
  const [treeHoleError, setTreeHoleError] = useState<string>("");

  const toggleLike = (id: string) => {
    setLikedStories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  const handleTreeHoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!treeHoleMessage.trim() || isSubmittingTreeHole) return;

    setIsSubmittingTreeHole(true);
    setTreeHoleError("");

    const senderName = treeHoleName.trim();

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycby746Kdo9P1sB0dCb-SY4kIdWu_O9G_psPDAqt7bom80gXPhJnE5TBUE4ykUPRxC98DEA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            name: senderName || "山林旅人",
            message: treeHoleMessage.trim(),
            consent: String(treeHoleConsent),
          }),
        }
      );

      setSubmittedSenderName(senderName);
      setTreeHoleSubmitted(true);
      setTreeHoleName("");
      setTreeHoleMessage("");
      setTreeHoleConsent(true);
    } catch (err) {
      console.error("Failed to submit tree hole letter:", err);
      setTreeHoleError("信件在微風中似乎迷路了，請稍候再試試看。");
    } finally {
      setIsSubmittingTreeHole(false);
    }
  };

  const closeTreeHoleModal = () => {
    setIsTreeHoleOpen(false);
    setTimeout(() => {
      setTreeHoleSubmitted(false);
      setSubmittedSenderName("");
      setTreeHoleName("");
      setTreeHoleMessage("");
      setTreeHoleConsent(true);
      setTreeHoleError("");
    }, 300);
  };

  // 只固定顯示最新 3 篇文章卡片
  const latestStories = useMemo(() => {
    return initialStories.slice(0, 3);
  }, [initialStories]);

  const rootRef = useRef<HTMLDivElement>(null);

  const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // GSAP Hero Entrance Timeline with prefers-reduced-motion support
  useIsomorphicLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const animatedElements = [
        ".gsap-header",
        ".gsap-hero-badge",
        ".gsap-hero-title",
        ".gsap-hero-desc",
        ".gsap-hero-cta",
        ".gsap-hero-polaroid",
      ];

      if (prefersReducedMotion) {
        gsap.set(animatedElements, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 步驟 1：頂部導覽列淡入 (opacity: 0 -> 1，y: -10 -> 0，0.5s)
      tl.fromTo(
        ".gsap-header",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 }
      )
        // 步驟 2：大標題「森女孩的」與「話與畫」（含陰影與底線）自下方微微升起並淡入 (y: 20 -> 0，opacity: 0 -> 1，0.6s)
        .fromTo(
          [".gsap-hero-badge", ".gsap-hero-title"],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.3"
        )
        // 步驟 3：副標題文字段落（「嗨，我是 Yaki...」）淡入 (y: 15 -> 0，0.5s)
        .fromTo(
          ".gsap-hero-desc",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.35"
        )
        // 步驟 4：兩顆 CTA 按鈕（「探索山林日誌」、「收聽 Podcast」）浮現 (y: 10 -> 0，0.4s)
        .fromTo(
          ".gsap-hero-cta",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.25"
        )
        // 步驟 5：右側照片卡片優雅定位 (opacity: 0 -> 1，y: 15 -> 0，0.5s)
        .fromTo(
          ".gsap-hero-polaroid",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.25"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // 鎖定背景頁面捲動與監聽 ESC 鍵關閉選單/樹洞信箱
  useEffect(() => {
    if (mobileMenuOpen || isTreeHoleOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (mobileMenuOpen) setMobileMenuOpen(false);
          if (isTreeHoleOpen) setIsTreeHoleOpen(false);
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mobileMenuOpen, isTreeHoleOpen]);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#FAF7F2] text-[#4A4A4A] font-sans selection:bg-[#E8DDD1] selection:text-[#1E3729]">
      {/* ─── Classic Edition Notice Banner ─── */}
      <div className="bg-[#233F31] text-[#FAF7F2] text-xs py-2 px-4 flex items-center justify-between border-b border-[#1b3227]">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#BA6341]" />
            <span className="font-medium">經典手帳典藏版</span>
            <span className="hidden sm:inline text-[#FAF7F2]/70">｜ 完整保留原始溫潤手帳排版與功能</span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BA6341] hover:bg-[#a35232] text-white font-medium text-[11px] transition-colors shadow-xs shrink-0"
          >
            前往全新「日系戶外雜誌首頁」
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* ─── Top Navigation ─── */}
      <header className="gsap-header sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group transition-transform hover:scale-[1.01]"
            aria-label="森女孩的話與畫 - 回到頂部"
          >
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-[#D5E2D8] bg-[#EBF1EC] shadow-2xs group-hover:border-[#C16744]/50 transition-all">
              <Image
                src="/logo.png"
                alt="森女孩的話與畫 Logo"
                width={48}
                height={48}
                className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-[#262626] group-hover:text-[#C16744] transition-colors font-sans">
                森女孩的話與畫
              </span>
              <span className="text-[10px] tracking-widest text-[#595550] uppercase font-mono">
                FOREST GIRL&apos;S WORDS &amp; ART
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A4A4A]">
            <Link
              href="/about"
              className="hover:text-[#C16744] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C16744] hover:after:w-full after:transition-all"
            >
              關於森女孩
            </Link>
            <Link
              href="/stories"
              className="hover:text-[#C16744] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C16744] hover:after:w-full after:transition-all"
            >
              山林日誌
            </Link>
            <a
              href="#film-gallery"
              className="hover:text-[#C16744] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C16744] hover:after:w-full after:transition-all"
            >
              山野光影
            </a>
            <a
              href="/#podcast"
              onClick={(e) => {
                const el = document.getElementById("podcast");
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", "#podcast");
                }
              }}
              className="hover:text-[#C16744] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C16744] hover:after:w-full after:transition-all"
            >
              Podcast
            </a>
            <a
              href="https://www.instagram.com/forestyaki/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C16744] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C16744] hover:after:w-full after:transition-all"
            >
              Instagram
            </a>
          </nav>

          {/* CTA Header Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsTreeHoleOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#233F31] text-[#FAF7F2] hover:bg-[#C16744] active:scale-95 transition-all shadow-xs cursor-pointer"
              aria-label="寄信給山林樹洞"
            >
              <span>📮</span>
              <span>寄信給山林樹洞</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#233F31] hover:text-[#C16744] focus:outline-none"
            aria-label="選單開關"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 pt-3 pb-6 bg-[#FAF7F2] border-b border-[#E8E1D5] flex flex-col gap-4 text-sm font-medium text-[#4A4A4A]">
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#EFE8DC] hover:text-[#C16744] transition-colors"
            >
              關於森女孩
            </Link>
            <Link
              href="/stories"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#EFE8DC] hover:text-[#C16744] transition-colors"
            >
              山林日誌
            </Link>
            <a
              href="#film-gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#EFE8DC]"
            >
              山野光影
            </a>
            <a
              href="/#podcast"
              onClick={(e) => {
                setMobileMenuOpen(false);
                const el = document.getElementById("podcast");
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", "#podcast");
                }
              }}
              className="py-2 border-b border-[#EFE8DC] hover:text-[#C16744] transition-colors"
            >
              Podcast
            </a>
            <a
              href="https://www.instagram.com/forestyaki/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-[#EFE8DC] hover:text-[#C16744] transition-colors"
            >
              Instagram
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsTreeHoleOpen(true);
              }}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-[#233F31] text-[#FAF7F2] text-xs font-semibold hover:bg-[#C16744] active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>📮</span>
              <span>寄信給山林樹洞</span>
            </button>
          </div>
        )}
      </header>

      {/* ─── 1. Hero 區塊 ─── */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Full-bleed Hero Background Image with Bright Tracing Paper Veil */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none w-full h-full">
          <Image
            src="/hero-bg.jpg"
            alt="森女孩與健行夥伴在山林步道終點"
            fill
            priority
            unoptimized
            quality={95}
            sizes="100vw"
            className="object-cover object-[center_20%] md:object-[60%_30%] lg:object-[65%_28%] opacity-65 md:opacity-88 saturate-[0.92] contrast-[0.98]"
          />

          {/* Gentle Translucent Tracing Paper Tint Layer (手機保持 65%，桌面調低至 40%) */}
          <div className="absolute inset-0 bg-[#FDFBF7]/65 md:bg-[#FDFBF7]/40 backdrop-blur-[1.5px] md:backdrop-blur-none transition-colors duration-300"></div>

          {/* Soft Paper Grain Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/40 md:from-[#FAF7F2]/20 via-transparent to-[#FAF7F2]"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          {/* Hero Pill Badges - Centered */}
          <div className="flex justify-center items-center gap-2 sm:gap-2.5 flex-wrap w-full mb-6">
            <span className="gsap-hero-badge px-3.5 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/80 text-[#262626] text-xs font-medium shadow-2xs backdrop-blur-xs">
              徒步情書
            </span>
            <span className="gsap-hero-badge px-3.5 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/80 text-[#262626] text-xs font-medium shadow-2xs backdrop-blur-xs">
              所思所想
            </span>
            <span className="gsap-hero-badge px-3.5 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/80 text-[#262626] text-xs font-medium shadow-2xs backdrop-blur-xs">
              一些隨手的畫
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content - Centered on Mobile, Left-Docked on Desktop */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center max-w-md sm:max-w-lg lg:max-w-[460px] mx-auto lg:mx-0 lg:mr-auto relative z-10">
              {/* Airy Paper Card (日系輕盈紙質手帳卡片) */}
              <div className="w-full bg-[#FDFBF7]/90 backdrop-blur-md border border-stone-200/70 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
                {/* Semantic H1 for SEO & Screen Readers */}
                <h1 className="sr-only">森女孩的話與畫</h1>

                {/* Hand-drawn 3-Tree Logo */}
                <Image
                  src="/images/logo-tree.png"
                  alt="森女孩的話與畫 Logo"
                  width={120}
                  height={120}
                  className="gsap-hero-title w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto mb-4 select-none"
                  priority
                />

                {/* Introduction Story Paragraphs (Reporter Charcoal #4A4A4A, text-left) */}
                <div className="gsap-hero-desc text-sm sm:text-base text-[#4A4A4A] font-normal leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto text-left space-y-1.5">
                  <p className="leading-relaxed text-left">
                    我喜歡走路，看書，和愛人與小狗待在一起
                  </p>
                  <p className="leading-relaxed text-left">
                    這裡是我的思想樹洞
                  </p>
                  <p className="leading-relaxed text-left">
                    記錄走過的路、不想忘記的對話
                  </p>
                  <p className="leading-relaxed text-left">
                    還有閃閃發光的日常
                  </p>
                </div>

                {/* Action Buttons - Centered */}
                <div className="gsap-hero-cta flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto mx-auto">
                  <a
                    href="#stories"
                    className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#D96B43] text-white font-semibold text-base shadow-sm hover:bg-[#C25A34] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <span>看山林日誌</span>
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-all duration-300">
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
                    </span>
                  </a>

                  <a
                    href="#podcast"
                    onClick={(e) => {
                      const el = document.getElementById("podcast");
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: "smooth" });
                        window.history.pushState(null, "", "#podcast");
                      }
                    }}
                    className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#262626] font-medium text-base border border-stone-200 hover:border-stone-400 hover:bg-stone-50 hover:-translate-y-0.5 transition-all duration-200 shadow-2xs cursor-pointer"
                  >
                    <svg
                      className="w-4 h-4 text-[#D96B43] group-hover:scale-110 transition-transform"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                    <span>收聽 Podcast</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Clean Photo Card without decorations */}
            <div className="gsap-hero-polaroid lg:col-span-5 flex justify-center lg:justify-end ml-auto">
              <div className="w-full max-w-[280px] sm:max-w-[305px] lg:scale-95 lg:translate-x-4">
                <div className="bg-[#FFFEFA] p-4 pb-5 rounded-2xl border border-[#E0D8CB] shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#EAE4D7]">
                    <Image
                      src="/images/ronnie-trail.jpg"
                      alt="Ronnie 在山林步道"
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 280px, 305px"
                      className="object-cover object-center"
                      priority
                    />
                  </div>

                  {/* Photo Caption / Quote */}
                  <div className="mt-4 px-1">
                    <p className="text-xs sm:text-[13px] text-[#4A4A4A] font-sans leading-relaxed">
                      「他是我的山狗狗Ronnie，我最喜歡看著她迎頭走來，耳朵往後甩，笑盈盈的看著我。」
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. 關於我 (About) ─── */}
      <section id="about" className="py-20 bg-[#F4EFE6] border-y border-[#E8E0D2] relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Avatar & Visual Box */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative">
                <div className="w-64 sm:w-72 p-6 rounded-3xl bg-[#FFFEFA] border border-[#E0D8CB] shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-[#D2DEC8] shadow-sm mb-3.5 bg-[#EBF1EC]">
                    <Image
                      src="/avatar.jpg"
                      alt="Yaki 個人頭像"
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 128px, 144px"
                      className="object-cover object-top"
                      priority
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-[#262626]">YAKI</h3>
                  <p className="text-xs text-[#595550] mt-1 font-mono tracking-wider">
                    WORDS × ART × HIKER
                  </p>
                  <div className="flex items-center justify-center mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#EAE3D5]/80 text-[#4A4A4A] border border-[#DDD5C7]/60">
                      徒步者 / 寫字的人
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Introduction Text */}
            <div className="md:col-span-7 flex flex-col items-start">
              <SectionHeader
                eyebrow="關於森女孩 · ABOUT YAKI"
                title={
                  <>
                    在這裡安放走過的路，
                    <br />
                    還有那些閃閃發光的平靜日常。
                  </>
                }
                className="mb-5"
              />

              <div className="space-y-4 text-base font-normal text-[#4A4A4A] leading-relaxed">
                <p>
                  嗨，我是 Yaki。記錄生活的書寫與手作者，也是一名長途徒步與戶外漫遊者。
                </p>
                <p>
                  曾與伴侶在太平洋屋脊步道（PCT）走過四千多公里的荒野，在洛磯山脈的雪季與北緯65度的極光間生活。如今的路上，身邊還有踏著輕快步伐的小黑狗 Ronnie，我們著迷於在山林裡安靜地走著，讓風和泥土慢慢洗去生活裡的雜音。
                </p>
                <p>
                  在這裡，我用紙筆、色彩與鏡頭，整理步道上的風霜與微光、夥伴與毛孩同行的日常，以及雙手創作帶來的平靜。願這些文字與畫面，能為你帶來一片寧靜的山林綠意。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. 精選內容 (Latest 3 Stories from Notion / Curated) ─── */}
      <section id="stories" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            eyebrow="山林日誌 · JOURNAL ARCHIVE"
            title="山林日誌"
            description="記下長途徒步走過的路、單日散步與生活裡的隨筆。"
          />

          <Link
            href="/stories"
            className="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-[#BA6341] hover:text-[#233F31] transition-colors group"
          >
            <span>看全部文章</span>
            <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 固定只顯示最新 3 篇文章卡片，或空狀態 */}
        {latestStories.length === 0 ? (
          <div className="py-16 px-6 text-center bg-[#FDFBF7] rounded-3xl border border-dashed border-[#DDD4C5] max-w-xl mx-auto shadow-2xs">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EBF1EC] text-[#233F31] flex items-center justify-center text-3xl shadow-inner">
              🌲
            </div>
            <h3 className="text-xl font-semibold text-[#262626] mb-2">
              文章整理中
            </h3>
            <p className="text-sm font-normal text-[#4A4A4A] leading-relaxed max-w-md mx-auto">
              {fetchError
                ? "目前連線不太順暢，正在重新載入文章中。"
                : "文章還在陸續整理中，寫好就會更新在這裡。"}
            </p>
          </div>
        ) : (
          <div>
            {/* 3 欄式卡片網格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  isLiked={!!likedStories[story.id]}
                  onToggleLike={() => toggleLike(story.id)}
                />
              ))}
            </div>

            {/* 區塊底部醒目的膠囊按鈕 */}
            <div className="mt-14 text-center">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#233F31] text-[#FAF7F2] text-sm font-semibold hover:bg-[#BA6341] transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 cursor-pointer group"
              >
                <span>看全部文章</span>
                <span className="group-hover:translate-x-1.5 transition-transform" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ─── 3.5 純粹山野攝影牆 (Minimal Photo Gallery) ─── */}
      <TrailFilmGallery />

      {/* ─── 4. 山野迴響與社群 (Unified Podcast & Connect Editorial Grid) ─── */}
      <section
        id="podcast"
        className="py-20 bg-[#FDFBF7] border-t border-[#E8E1D5] relative scroll-mt-24"
      >
        <div id="connect" className="absolute -top-24 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6">
          {/* 區塊統一大標頭 */}
          <SectionHeader
            eyebrow="PODCAST & CONNECT · 聲音與社群"
            title="步道上的聲音與日常碎念"
            description="把路上收錄的自然風聲、旅途故事和生活雜記放在這裡。"
            titleClassName="text-2xl md:text-3xl font-bold text-[#262626]"
            className="mb-12"
          />

          {/* 內部網格佈局 (Editorial 2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* 【左半部：Podcast 聲音漫遊（佔 7 欄 lg:col-span-7）】 */}
            <div className="lg:col-span-7">
              <div className="h-full bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between transition-all duration-300">
                <div>
                  {/* 頂部標註：小標「自然收音與閒聊」+ 狀態標籤「最新單集」 */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#BA6341]" aria-hidden="true" />
                      <span className="text-xs font-semibold tracking-wider text-[#BA6341] uppercase font-mono">
                        自然收音與閒聊
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1EC] text-[#233F31] text-xs font-semibold shadow-2xs">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]" />
                      </span>
                      <span>最新單集</span>
                    </span>
                  </div>

                  {/* 節目名稱 */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#262626] font-sans mb-4">
                    《森女孩的話與畫》
                  </h3>

                  {/* Spotify Compact 橫幅播放器 (152px) */}
                  <div className="w-full overflow-hidden rounded-2xl border border-[#E5DEC7] bg-[#FAF7F2] p-1 shadow-2xs mb-5">
                    <iframe
                      data-testid="embed-iframe"
                      style={{ borderRadius: "12px" }}
                      src="https://open.spotify.com/embed/show/1pusMjoawvb6plDusPEePP?utm_source=generator&theme=0"
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="w-full rounded-xl"
                      title="森女孩的話與畫 Spotify 節目官方播放器"
                    />
                  </div>

                  {/* 下方隨筆說明 */}
                  <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#EBE4D5] mb-6">
                    <p className="text-xs sm:text-sm font-normal text-[#4A4A4A] leading-relaxed">
                      北極圈零下 20 度的雪地生活與極光，還有在紐西蘭走路時收錄的溪流與風聲。
                    </p>
                  </div>
                </div>

                {/* 底部操作列 */}
                <div className="pt-4 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#595550] font-mono">
                    <span>🎧 隔週更新 · 自然收音與生活隨筆</span>
                  </div>
                  <a
                    href="https://open.spotify.com/show/1pusMjoawvb6plDusPEePP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#262626] hover:text-[#1DB954] transition-colors group"
                  >
                    <span>在 Spotify 上追蹤頻道</span>
                    <span className="text-[#1DB954] group-hover:translate-x-1 transition-transform" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* 【右半部：社群與山野信件（佔 5 欄 lg:col-span-5，垂直並列）】 */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              {/* 1. Instagram & Threads 卡片 */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BA6341]" aria-hidden="true" />
                    <span className="text-xs font-semibold tracking-wider text-[#BA6341] uppercase font-mono">
                      CONNECT · 社群連結
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#262626] font-sans mb-1">
                    Instagram 與社群交流
                  </h4>
                  <p className="text-xs text-[#4A4A4A] mb-4 leading-relaxed">
                    平常畫的圖、小狗 Ronnie 的日常，還有一些在路上的隨手紀錄。
                  </p>

                  <div className="flex flex-col gap-2.5">
                    <a
                      href="https://www.instagram.com/forestyaki/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#E5DEC7] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FCEEE8] text-[#C16744] flex items-center justify-center font-bold text-sm shrink-0">
                          📸
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#262626] group-hover:text-[#C16744] transition-colors">
                            Instagram @forestyaki
                          </div>
                          <div className="text-[11px] text-[#595550]">日常碎碎念、插畫與山林照片</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#595550] group-hover:text-[#C16744] group-hover:translate-x-0.5 transition-all">
                        追蹤 →
                      </span>
                    </a>

                    <a
                      href="https://threads.net"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#E5DEC7] transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#EBF1EC] text-[#233F31] flex items-center justify-center font-bold text-sm shrink-0">
                          💬
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#262626] group-hover:text-[#C16744] transition-colors">
                            Threads
                          </div>
                          <div className="text-[11px] text-[#595550]">隨手碎碎念與裝備心得</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#595550] group-hover:text-[#C16744] group-hover:translate-x-0.5 transition-all">
                        加入 →
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* 2. 深墨綠色「山野信件」訂閱卡片 */}
              <div className="bg-[#1C2C24] rounded-3xl p-6 shadow-sm text-white flex flex-col justify-between relative overflow-hidden flex-1">
                {/* 輕微環境光裝飾 */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8C28A]" aria-hidden="true" />
                    <span className="text-xs font-semibold tracking-wider text-[#E8C28A] uppercase font-mono">
                      NEWSLETTER · 山野信件
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-white font-sans mb-1">
                    山野信件
                  </h4>
                  <p className="text-xs text-[#CCD9CF] mb-4 leading-relaxed">
                    偶爾寫信分享走過的路線、帶狗狗爬山的心得和手繪圖，直接寄到你的信箱。
                  </p>

                  {subscribed ? (
                    <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-[#E1EFE4] flex items-center gap-2">
                      <span>🌿</span>
                      <span>感謝訂閱，信件寄出時會通知你。</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="請輸入你的 Email..."
                        className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-2 focus:ring-[#C16744] focus:bg-white/15 transition-all"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-[#BA6341] hover:bg-[#A35232] active:scale-95 text-white font-semibold text-xs transition-all shadow-xs whitespace-nowrap cursor-pointer shrink-0"
                      >
                        訂閱信件
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. 簡約溫暖的 Footer ─── */}
      <footer className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-[#ECE5D8]">
            {/* Brand in Footer */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-3 mb-2 group cursor-pointer"
                aria-label="回到頂部"
              >
                <div className="h-9 w-9 overflow-hidden rounded-full border border-[#D5E2D8] bg-[#EBF1EC] shadow-2xs group-hover:border-[#C16744]/50 transition-all">
                  <Image
                    src="/logo.png"
                    alt="森女孩的話與畫 Logo"
                    width={36}
                    height={36}
                    className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-lg font-semibold text-[#262626] group-hover:text-[#C16744] transition-colors">
                  森女孩的話與畫
                </span>
              </a>
              <p className="text-xs text-[#595550] max-w-sm leading-relaxed">
                走過的路、不想忘記的對話，還有閃閃發光的日常。
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6 text-xs font-normal text-[#595550]">
              <a href="#" className="hover:text-[#BA6341] transition-colors">
                首頁頂部
              </a>
              <Link href="/about" className="hover:text-[#BA6341] transition-colors">
                關於森女孩
              </Link>
              <Link href="/stories" className="hover:text-[#BA6341] transition-colors">
                山林日誌
              </Link>
              <a href="#film-gallery" className="hover:text-[#BA6341] transition-colors">
                山野光影
              </a>
              <a
                href="/#podcast"
                onClick={(e) => {
                  const el = document.getElementById("podcast");
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "#podcast");
                  }
                }}
                className="hover:text-[#BA6341] transition-colors"
              >
                Podcast
              </a>
              <a
                href="https://www.instagram.com/forestyaki/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#BA6341] transition-colors"
              >
                Instagram
              </a>
            </div>

            {/* Back to top button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-10 h-10 rounded-full border border-[#DDD4C5] bg-[#FFFEFA] text-[#556358] flex items-center justify-center hover:bg-[#233F31] hover:text-[#FAF7F2] hover:border-[#233F31] transition-all shadow-2xs cursor-pointer"
              aria-label="回到頁頂"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#595550] gap-4">
            <div>© 2024–2026 森女孩的話與畫 · FOREST GIRL&apos;S WORDS &amp; ART</div>
            <div className="flex items-center gap-4 text-[11px] text-[#595550]">
              <span>與狗同行</span>
              <span>·</span>
              <span>無痕山林</span>
              <span>·</span>
              <span>步道生活</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── 樹洞投信互動視窗 (Tree Hole Modal) ─── */}
      {isTreeHoleOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#182C22]/65 backdrop-blur-xs transition-opacity duration-300"
          onClick={closeTreeHoleModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border border-[#E0D7C7] p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto"
          >
            {/* Washi Tape Accent */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#E5DCB8]/80 transform -rotate-1 border-dashed border-[#D2C59D] border-x pointer-events-none"></div>

            {/* Close Button (✕) */}
            <button
              onClick={closeTreeHoleModal}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-[#EFE8DC] text-[#616E64] hover:bg-[#BA6341] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="關閉樹洞信箱"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!treeHoleSubmitted ? (
              <div>
                {/* Header */}
                <div className="text-center sm:text-left mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1EC] text-[#233F31] text-xs font-medium mb-3">
                    <span>📮</span>
                    <span>FOREST TREE HOLE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold text-[#262626] tracking-tight">
                    思想樹洞
                  </h3>
                  <p className="text-xs sm:text-sm font-normal text-[#4A4A4A] leading-relaxed mt-2">
                    有想說的話、走在路上的心情，都可以投進樹洞。我會在 Podcast 裡挑一些來聊聊。
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleTreeHoleSubmit} className="flex flex-col gap-4">
                  {/* Field 1: Name / Alias */}
                  <div>
                    <label className="block text-xs font-semibold text-[#262626] mb-1.5">
                      你的稱呼／代稱 <span className="text-[#595550] font-normal">（選填）</span>
                    </label>
                    <input
                      type="text"
                      value={treeHoleName}
                      onChange={(e) => setTreeHoleName(e.target.value)}
                      placeholder="例如：山裡的迷途小鹿、週五下班的小白..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FFFEFA] border border-[#E0D8CB] text-xs sm:text-sm text-[#262626] placeholder-[#9BA59D] focus:outline-none focus:ring-2 focus:ring-[#C16744] transition-all"
                    />
                  </div>

                  {/* Field 2: Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#262626] mb-1.5">
                      想對樹洞說的話 <span className="text-[#C16744]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={treeHoleMessage}
                      onChange={(e) => setTreeHoleMessage(e.target.value)}
                      placeholder="寫下你的故事、走在路上的心情，或是生活裡的碎念..."
                      className="w-full px-4 py-3 rounded-2xl bg-[#FFFEFA] border border-[#E0D8CB] text-xs sm:text-sm text-[#262626] placeholder-[#9BA59D] focus:outline-none focus:ring-2 focus:ring-[#C16744] transition-all resize-none leading-relaxed"
                    />
                  </div>

                  {/* Field 3: Checkbox Consent */}
                  <label className="flex items-start gap-2.5 cursor-pointer select-none text-xs text-[#4A4A4A] pt-1">
                    <input
                      type="checkbox"
                      checked={treeHoleConsent}
                      onChange={(e) => setTreeHoleConsent(e.target.checked)}
                      className="mt-0.5 rounded text-[#C16744] focus:ring-[#C16744] accent-[#C16744]"
                    />
                    <span className="leading-snug">
                      同意在《森女孩的話與畫》Podcast 中匿名朗讀與回覆
                    </span>
                  </label>

                  {/* Error Notification if any */}
                  {treeHoleError && (
                    <div className="p-3 rounded-xl bg-[#FDF1E8] border border-[#F1D0BD] text-xs text-[#9E4A28] flex items-center gap-2 animate-fadeIn">
                      <span className="text-sm">🍃</span>
                      <span>{treeHoleError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingTreeHole}
                    className="mt-2 w-full py-3 rounded-full bg-[#C16744] hover:bg-[#B85936] disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-[#FAF7F2] font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmittingTreeHole ? (
                      <>
                        <span className="animate-spin text-base">🍃</span>
                        <span>正在寄出...</span>
                      </>
                    ) : (
                      <>
                        <span>🕊️</span>
                        <span>投遞到樹洞</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Success / Thank You Card with Hand-stamped ceremony */
              <div className="py-6 text-center flex flex-col items-center animate-fadeIn">
                <div className="relative w-20 h-20 rounded-full bg-[#EBF1EC] text-[#233F31] border-2 border-[#BA6341]/60 flex items-center justify-center text-4xl mb-4 shadow-sm transform -rotate-3 transition-transform hover:rotate-0">
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#BA6341]/40 pointer-events-none" />
                  <span>🌲</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E5DEC7] text-[11px] font-mono text-[#BA6341] uppercase tracking-wider mb-3">
                  STAMPED · 信件已投遞
                </div>
                <h3 className="text-2xl font-semibold text-[#262626] mb-2 font-sans">
                  信件已經投進樹洞了。
                </h3>
                <p className="text-xs sm:text-sm font-normal text-[#595550] leading-relaxed max-w-sm mb-6">
                  {submittedSenderName ? `親愛的 ${submittedSenderName}，` : ""}
                  謝謝你的分享。這封信我已經收到了，錄製 Podcast 時會找時間在節目裡聊聊。祝你有平靜愉快的一天。
                </p>
                <button
                  onClick={closeTreeHoleModal}
                  className="px-6 py-2.5 rounded-full bg-[#233F31] hover:bg-[#BA6341] active:scale-95 text-[#FAF7F2] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  關閉樹洞信箱
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
