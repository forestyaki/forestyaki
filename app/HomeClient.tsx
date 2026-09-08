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
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.88 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleLike();
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm transition-colors ${
              isLiked
                ? "bg-[#C16744] text-white shadow-sm"
                : "bg-black/25 text-white/85 hover:bg-black/45"
            }`}
            aria-label="收藏文章"
          >
            <svg
              className="w-4 h-4 fill-current transition-transform duration-200"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.button>
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
          <div className="flex items-center gap-2 text-xs text-[#737373] mb-3">
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
        <div className="pt-4 border-t border-[#EFE8DC] flex items-center justify-between text-xs text-[#737373]">
          <span className="font-mono text-[#737373]">{story.date}</span>
          <Link
            href={`/stories/${encodeURIComponent(story.slug)}`}
            className="inline-flex items-center gap-1.5 font-medium text-[#737373] group-hover:text-[#C16744] group-hover:translate-x-1 transition-all"
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

  // Day 10: GSAP Hero Entrance Timeline
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
        // 步驟 5：右側拍立得相框與底部數據統計卡片優雅定位 (opacity: 0 -> 1，y: 15 -> 0，0.5s)
        .fromTo(
          [".gsap-hero-polaroid", ".gsap-hero-stats"],
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
          "-=0.25"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-[#FAF7F2] text-[#4A4A4A] font-sans selection:bg-[#E8DDD1] selection:text-[#1E3729]">
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
              <span className="text-[10px] tracking-widest text-[#737373] uppercase font-mono">
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
          {/* Hero Pill Badge - Centered & Soft Oatmeal Gray */}
          <div className="flex justify-center w-full mb-6">
            <div className="gsap-hero-badge inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-2xl sm:rounded-full bg-stone-100/90 border border-stone-200/70 text-[#4A4A4A] text-[11px] sm:text-xs font-medium shadow-2xs text-center leading-tight max-w-full backdrop-blur-xs">
              <span className="whitespace-nowrap">🥾 長程徒步者 · 聲音紀錄 · 畫筆漫遊</span>
              <span className="hidden sm:inline text-stone-300">｜</span>
              <span className="whitespace-nowrap text-[#262626] font-semibold sm:font-medium">PCT &amp; Te Araroa</span>
            </div>
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
                <div className="gsap-hero-desc text-sm sm:text-base text-[#4A4A4A] font-normal leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto text-left">
                  <p className="mb-3 leading-relaxed text-left">
                    嗨，我是 Yaki。著迷於日出前天空被染成粉橘的魔幻時刻，也戀雙腳踩在泥土落葉上的每一步沙沙聲。
                  </p>
                  <p className="leading-relaxed text-left">
                    從太平洋屋脊步道（PCT）走到紐西蘭 Te Araroa。這裡是我的山林樹洞——記錄走過的路、收錄風聲對話，也把閃閃發光的日常悄悄畫進紙筆裡。
                  </p>
                </div>

                {/* Action Buttons - Centered */}
                <div className="gsap-hero-cta flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto mx-auto">
                  <a
                    href="#stories"
                    className="group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-full bg-[#D96B43] text-white font-semibold text-base shadow-sm hover:bg-[#C25A34] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <span>探索山林日誌</span>
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

              {/* Stats Card */}
              <div className="gsap-hero-stats mt-6 sm:mt-8 w-full max-w-md mx-auto lg:mx-0 rounded-2xl bg-[#FDFBF7]/90 backdrop-blur-md border border-stone-200/60 shadow-xs p-3.5 sm:py-4 sm:px-5">
                <div className="grid grid-cols-3 divide-x divide-stone-200/80 text-center">
                  <div className="px-2">
                    <div className="text-xl sm:text-2xl font-bold text-[#1E3F20] font-serif">48+</div>
                    <div className="text-[11px] sm:text-xs text-[#737373] font-medium mt-0.5 whitespace-nowrap">百岳與古道</div>
                  </div>
                  <div className="px-2">
                    <div className="text-xl sm:text-2xl font-bold text-[#C16744] font-serif">32 條</div>
                    <div className="text-[11px] sm:text-xs text-[#737373] font-medium mt-0.5 whitespace-nowrap">犬伴友善路線</div>
                  </div>
                  <div className="px-2">
                    <div className="text-xl sm:text-2xl font-bold text-[#1E3F20] font-serif">100%</div>
                    <div className="text-[11px] sm:text-xs text-[#737373] font-medium mt-0.5 whitespace-nowrap">山林手作感</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Polaroid Card */}
            <div className="gsap-hero-polaroid lg:col-span-5 flex justify-center lg:justify-end ml-auto">
              <div className="relative w-full max-w-[280px] sm:max-w-[295px] lg:scale-90 lg:translate-x-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-[#E5DCB8]/75 backdrop-blur-2xs transform -rotate-2 z-20 shadow-2xs border-dashed border-[#D2C59D] border-x"></div>

                <div className="bg-[#FFFEFA] p-5 pb-7 rounded-sm border border-[#E0D8CB] shadow-xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="relative aspect-[3/4] rounded-xs overflow-hidden bg-[#EAE4D7] shadow-inner">
                    <Image
                      src="/images/ronnie-trail.jpg"
                      alt="Ronnie 在淡蘭古道中路"
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 280px, 300px"
                      className="object-cover object-center"
                    />

                    {/* Subtle Gradient Overlay for Tag Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                    {/* Location Badge on Photo */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-[11px] font-medium tracking-wider text-[#FAF7F2] font-sans shadow-xs">
                        <span className="text-[#E8C28A] text-[10px]">📍</span>
                        <span>淡蘭古道中路</span>
                      </span>
                    </div>
                  </div>

                  {/* Polaroid Journal Quote & Trail Notes */}
                  <div className="mt-3.5 px-0.5">
                    <p className="text-xs text-[#4A4A4A] italic font-sans leading-relaxed">
                      「我最喜歡看你迎頭走來，耳朵往後甩，笑盈盈的看著我。」
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-xs text-[#7B867E]">
                      <span className="font-serif italic text-xs text-[#233F31]">
                        Ronnie on Trail, 2024
                      </span>
                      <span className="flex items-center gap-1 text-[#C16744] text-[11px]">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        Favorite trail
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Left Companion Dog Badge */}
                <div className="absolute -bottom-5 -left-5 bg-[#FFFEFA] border border-[#E2DACB] rounded-2xl p-2.5 sm:p-3 shadow-lg flex items-center gap-3">
                  <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-stone-200/80 shadow-xs">
                    <Image
                      src="/images/ronnie-avatar.jpg"
                      alt="夥伴犬 Ronnie"
                      fill
                      unoptimized
                      className="object-cover object-[62%_50%]"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#262626] font-sans">
                      夥伴犬：Ronnie
                    </div>
                    <div className="text-[11px] text-[#737373] font-sans mt-0.5">
                      黑狗 · 2 歲 · 步道漫遊中
                    </div>
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
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-[#FFFEFA] border border-[#E0D8CB] p-4 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="w-32 h-32 rounded-full bg-[#EBF1EC] border-2 border-[#D2DEC8] flex items-center justify-center mb-4 text-4xl shadow-inner">
                    🌲
                  </div>
                  <h3 className="text-xl font-semibold text-[#262626]">YAKI</h3>
                  <p className="text-xs text-[#737373] mt-1 font-mono tracking-wider">
                    WORDS × ART × HIKER
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#EAE3D5] text-[#554E43]">
                      台北 / 山林常駐
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-[#FBEBE5] text-[#C16744]">
                      毛孩系旅人
                    </span>
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-[#233F31] text-[#FAF7F2] text-[11px] px-3 py-1 rounded-full font-medium shadow-md rotate-6">
                  手繪與山林 🍃
                </div>
              </div>
            </div>

            {/* Introduction Text */}
            <div className="md:col-span-7 flex flex-col items-start">
              <SectionHeader
                eyebrow="關於森女孩 · ABOUT YAKI"
                title={
                  <>
                    在城市與山嶺交界的邊緣，
                    <br />
                    記錄文字與畫筆帶來的平靜。
                  </>
                }
                className="mb-5"
              />

              <p className="text-base font-normal text-[#4A4A4A] leading-relaxed mb-4">
                嗨，我是森女孩。平日是文字與插畫創作者，一到週末就成了往山裡奔跑的健行者。身旁總是跟著四歲的大狗「小栗」，牠的腳步輕快，提醒著我抬頭看看樹冠灑落的斑駁陽光。
              </p>
              <p className="text-base font-normal text-[#4A4A4A] leading-relaxed mb-6">
                對我而言，登山從不是為了「征服」哪座山頭，而是一場把自己還給自然的溫柔儀式。我用畫筆捕捉微光、用紙筆記下每條步道的泥土觸感與氣息，並把適合犬伴同行的健行指南與創作日常，整理在這裡與你分享。
              </p>

              {/* Three Pillar Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <div className="bg-[#FFFEFA] p-3.5 rounded-xl border border-[#E2DACB] shadow-2xs">
                  <div className="text-[#262626] font-semibold text-sm flex items-center gap-2 mb-1">
                    <span>⛰️</span>
                    <span>穿梭山林</span>
                  </div>
                  <p className="text-xs font-normal text-[#4A4A4A] leading-relaxed">
                    偏愛中級山巨木、靜謐古道與高山雲海。
                  </p>
                </div>

                <div className="bg-[#FFFEFA] p-3.5 rounded-xl border border-[#E2DACB] shadow-2xs">
                  <div className="text-[#262626] font-semibold text-sm flex items-center gap-2 mb-1">
                    <span>🐾</span>
                    <span>犬伴健行</span>
                  </div>
                  <p className="text-xs font-normal text-[#4A4A4A] leading-relaxed">
                    實地踏查友善路線，注重毛孩關節與安全。
                  </p>
                </div>

                <div className="bg-[#FFFEFA] p-3.5 rounded-xl border border-[#E2DACB] shadow-2xs">
                  <div className="text-[#262626] font-semibold text-sm flex items-center gap-2 mb-1">
                    <span>🎨</span>
                    <span>話與畫創作</span>
                  </div>
                  <p className="text-xs font-normal text-[#4A4A4A] leading-relaxed">
                    手繪山林插圖、書寫自然與生活溫潤散文。
                  </p>
                </div>
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
            title="山林日誌：拾起自然與創作的微光"
            description="從一日散步路線到中級山林秘境，用文字與筆觸記錄每一步的呼吸。"
          />

          <Link
            href="/stories"
            className="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-[#BA6341] hover:text-[#233F31] transition-colors group"
          >
            <span>瀏覽所有日誌專題</span>
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
              山徑微光收集中，敬請期待
            </h3>
            <p className="text-sm font-normal text-[#4A4A4A] leading-relaxed max-w-md mx-auto">
              {fetchError
                ? "山徑信號稍弱，正在重新連線山林筆記中。歡迎稍後回來散步。"
                : "森女孩正在山林深處整理筆記與照片。新故事即將在微風中送達，歡迎稍後回來散步。"}
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
                <span>瀏覽全部山林日誌</span>
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
            eyebrow="TRAIL VOICES & CONNECT · 山野迴響與社群"
            title="在山嶺與日常之間，收錄微光與話語"
            description="聆聽步道上的聲音碎片，或透過文字與社群與我並肩同行。"
            titleClassName="text-2xl md:text-3xl font-bold text-[#262626]"
            className="mb-12"
          />

          {/* 內部網格佈局 (Editorial 2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* 【左半部：Podcast 聲音漫遊（佔 7 欄 lg:col-span-7）】 */}
            <div className="lg:col-span-7">
              <div className="h-full bg-white rounded-3xl p-6 md:p-8 border border-stone-200/80 shadow-sm flex flex-col justify-between transition-all duration-300">
                <div>
                  {/* 頂部標註：小標「山林聲音札記」+ 狀態標籤「最新單集 · 即刻收聽」 */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#BA6341]" aria-hidden="true" />
                      <span className="text-xs font-semibold tracking-wider text-[#BA6341] uppercase font-mono">
                        山林聲音札記
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1EC] text-[#233F31] text-xs font-semibold shadow-2xs">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB954] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DB954]" />
                      </span>
                      <span>最新單集 · 即刻收聽</span>
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
                      最新單集隨筆：北極圈零下 20 度的雪地生活與極光守候，以及紐西蘭 3,000 公里徒步時南阿爾卑斯山的溪流與清冽山風收音。
                    </p>
                  </div>
                </div>

                {/* 底部操作列 */}
                <div className="pt-4 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#737373] font-mono">
                    <span>🎧 隔週更新 · 自然收音與創作隨筆</span>
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
                    追蹤日常動態，欣賞手繪插畫、毛孩步道寫真與即時山況分享。
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
                          <div className="text-[11px] text-[#737373]">日常碎碎念、插畫與山林照片</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#737373] group-hover:text-[#C16744] group-hover:translate-x-0.5 transition-all">
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
                          <div className="text-[11px] text-[#737373]">裝備碎碎念與即時山況交流</div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#737373] group-hover:text-[#C16744] group-hover:translate-x-0.5 transition-all">
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
                    收到下一封山野信件
                  </h4>
                  <p className="text-xs text-[#CCD9CF] mb-4 leading-relaxed">
                    每月一封精選電子報，包含私人私房路線 GPX 軌跡檔、毛孩友善評比與手繪插圖。
                  </p>

                  {subscribed ? (
                    <div className="bg-white/10 border border-white/20 rounded-xl p-3 text-xs text-[#E1EFE4] flex items-center gap-2">
                      <span>🌿</span>
                      <span>感謝訂閱！第一封山野信件已準備寄出。</span>
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
                        暖心訂閱
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
              <p className="text-xs text-[#737373] max-w-sm leading-relaxed">
                願每座山都溫柔以待，願每次前行都有微光相伴。用雙腳踩出平靜，用畫筆留下微風。
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-6 text-xs font-normal text-[#737373]">
              <a href="#" className="hover:text-[#C16744] transition-colors">
                首頁頂部
              </a>
              <Link href="/about" className="hover:text-[#C16744] transition-colors">
                關於森女孩
              </Link>
              <Link href="/stories" className="hover:text-[#C16744] transition-colors">
                山林日誌
              </Link>
              <a href="#film-gallery" className="hover:text-[#C16744] transition-colors">
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
                className="hover:text-[#C16744] transition-colors"
              >
                Podcast
              </a>
              <a
                href="https://www.instagram.com/forestyaki/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#C16744] transition-colors"
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

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
            <div>© 2024–2026 森女孩的話與畫 · FOREST GIRL&apos;S WORDS &amp; ART</div>
            <div className="flex items-center gap-4 text-[11px] text-[#737373]">
              <span>犬伴同行友善倡議</span>
              <span>·</span>
              <span>無痕山林 (LNT) 實踐者</span>
              <span>·</span>
              <span>Made with warm earth vibes</span>
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
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-[#EFE8DC] text-[#616E64] hover:bg-[#C16744] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
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
                    山林樹洞信箱
                  </h3>
                  <p className="text-xs sm:text-sm font-normal text-[#4A4A4A] leading-relaxed mt-2">
                    走累了或有想說的話，寫封信給樹洞吧，我會在 Podcast 裡溫柔回覆你。
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleTreeHoleSubmit} className="flex flex-col gap-4">
                  {/* Field 1: Name / Alias */}
                  <div>
                    <label className="block text-xs font-semibold text-[#262626] mb-1.5">
                      你的稱呼／代稱 <span className="text-[#737373] font-normal">（選填）</span>
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
                      placeholder="寫下你今天的心情、登山故事或生活煩惱..."
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
                        <span>信件飄往森林中...</span>
                      </>
                    ) : (
                      <>
                        <span>🕊️</span>
                        <span>將信件投遞進樹洞</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Success / Thank You Card */
              <div className="py-6 text-center flex flex-col items-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#EBF1EC] text-[#233F31] border-2 border-[#D5E2D8] flex items-center justify-center text-3xl mb-4 shadow-inner">
                  🌿
                </div>
                <h3 className="text-2xl font-semibold text-[#262626] mb-2">
                  信件已悄悄落入樹洞，謝謝你的分享。
                </h3>
                <p className="text-xs sm:text-sm font-normal text-[#4A4A4A] leading-relaxed max-w-sm mb-6">
                  {submittedSenderName ? `親愛的 ${submittedSenderName}，` : ""}
                  謝謝你願意跟我分享你的心情與故事。這封信已經靜靜躺在樹洞裡，我會在錄製《森女孩的話與畫》Podcast 時細細閱讀，願今天的微風也能帶給你溫柔的陪伴。
                </p>
                <button
                  onClick={closeTreeHoleModal}
                  className="px-6 py-2.5 rounded-full bg-[#233F31] hover:bg-[#C16744] active:scale-95 text-[#FAF7F2] text-xs font-semibold transition-all shadow-xs cursor-pointer"
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
