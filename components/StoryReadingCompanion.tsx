"use client";

import React, { useState, useEffect } from "react";

interface StoryReadingCompanionProps {
  storyTitle: string;
  storySummary?: string;
}

export default function StoryReadingCompanion({
  storyTitle,
  storySummary,
}: StoryReadingCompanionProps) {
  const [progress, setProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        setProgress(currentProgress);
      }
      setShowBackToTop(scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: storyTitle,
          text: storySummary || `森女孩的話與畫：《${storyTitle}》`,
          url,
        });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast("已複製文章連結，隨時可貼上分享 🌿");
    } catch {
      showToast("請直接複製網址列分享 🍃");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ─── 1. 頂部黏性滾動閱讀進度條 (Sticky Reading Progress Line) ─── */}
      <div
        className="fixed top-16 left-0 w-full h-[2.5px] bg-[#E8E1D5]/60 z-50 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#BA6341] transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ─── 2. 文末互動分享列 (Social Share & Copy Bar) ─── */}
      <div className="mt-8 pt-6 border-t border-[#E8E1D5] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#595550]">
          <span>🌿 喜歡這篇札記嗎？分享給身邊喜愛山林的朋友</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F2] border border-[#D5C9B8] text-xs font-semibold text-[#233F31] hover:bg-[#233F31] hover:text-[#FAF7F2] hover:border-[#233F31] transition-all shadow-2xs cursor-pointer active:scale-95"
            aria-label="分享或複製本篇文章連結"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>分享好文</span>
          </button>
        </div>
      </div>

      {/* ─── 3. 懸浮回到頂部按鈕 (Floating Back to Top) ─── */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          showBackToTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={scrollToTop}
          className="w-11 h-11 rounded-full bg-[#233F31] text-[#FAF7F2] hover:bg-[#BA6341] shadow-md hover:shadow-lg flex items-center justify-center transition-all cursor-pointer group active:scale-90 border border-white/20"
          aria-label="平滑返回頁首"
        >
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {/* ─── 4. 手帳微提示浮層 (Toast Feedback) ─── */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-[#233F31] text-[#FAF7F2] text-xs sm:text-sm font-medium shadow-xl border border-[#BA6341]/40 flex items-center gap-2"
        >
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
