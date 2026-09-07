import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 步道迷蹤",
  description: "這條小徑似乎通往了未知的深林。可能文章已被移至其他篇章，或連結稍有偏差。",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-sans flex flex-col justify-between selection:bg-[#E8DDD1] selection:text-[#1E3729]">
      {/* ─── 頂部極簡導覽列 ─── */}
      <header className="w-full border-b border-[#E8E1D5] bg-[#FDFBF7]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 overflow-hidden rounded-full border border-[#D5E2D8] bg-[#EBF1EC] shadow-2xs">
              <Image
                src="/logo.png"
                alt="森女孩的話與畫 Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-sm font-semibold text-[#262626] group-hover:text-[#BA6341] transition-colors">
              森女孩的話與畫
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-[#233F31] hover:text-[#BA6341] transition-colors flex items-center gap-1.5"
          >
            <span aria-hidden="true">←</span>
            <span>回首頁</span>
          </Link>
        </div>
      </header>

      {/* ─── 置中手帳風 404 主體卡片 ─── */}
      <main className="flex-1 flex items-center justify-center px-6 py-16 sm:py-24">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm text-center relative overflow-hidden">
          {/* 紙膠帶裝飾 */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#E5DCB8]/75 transform -rotate-1 border-dashed border-[#D2C59D] border-x pointer-events-none" />

          {/* 指南針圖標 */}
          <div className="w-16 h-16 rounded-full bg-[#FBF0EB] text-[#BA6341] flex items-center justify-center text-3xl mx-auto mb-6 shadow-2xs">
            🧭
          </div>

          {/* 陶土橘小標 */}
          <div className="inline-flex items-center justify-center gap-2 text-xs font-mono font-medium tracking-widest text-[#BA6341] uppercase mb-3">
            <span className="w-4 h-px bg-[#BA6341]" aria-hidden="true" />
            <span>404 · 步道迷蹤</span>
            <span className="w-4 h-px bg-[#BA6341]" aria-hidden="true" />
          </div>

          {/* 大標題 */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#262626] font-sans mb-3 leading-snug">
            這條小徑似乎通往了未知的深林
          </h1>

          {/* 說明文字 */}
          <p className="text-sm text-[#4A4A4A] font-normal leading-relaxed mb-8 max-w-sm mx-auto">
            可能文章已被移至其他篇章，或連結稍有偏差。深呼吸，讓我們循著林道足跡回到熟悉的營地。
          </p>

          {/* 陶土橘主要按鈕 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#BA6341] hover:bg-[#A35232] text-white text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group w-full sm:w-auto"
            >
              <span>返回山林首頁</span>
              <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">
                →
              </span>
            </Link>
          </div>

          {/* 底部熱門單元捷徑 */}
          <div className="mt-8 pt-6 border-t border-[#EFE8DC] flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-[#737373]">
            <Link href="/#stories" className="hover:text-[#BA6341] transition-colors">
              山林日誌
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-[#BA6341] transition-colors">
              關於森女孩
            </Link>
            <span>•</span>
            <Link href="/#podcast" className="hover:text-[#BA6341] transition-colors">
              聲音漫遊
            </Link>
          </div>
        </div>
      </main>

      {/* ─── 底部溫暖簽名 ─── */}
      <footer className="w-full py-6 text-center text-xs text-[#737373] border-t border-[#E8E1D5]">
        <p>願每座山都溫柔以待，願每次迷途都是遇見美景的開始。</p>
      </footer>
    </div>
  );
}
