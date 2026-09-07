import React from "react";

export default function StoryLoading() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A4A] font-sans selection:bg-[#E8DDD1]">
      {/* ─── 頂部導覽列骨架 ─── */}
      <header className="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E8E1D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="h-5 w-28 bg-stone-200/70 rounded-full animate-pulse" />
          <div className="h-7 w-32 bg-stone-200/70 rounded-full animate-pulse" />
          <div className="hidden sm:flex items-center gap-4">
            <div className="h-4 w-12 bg-stone-200/60 rounded-md animate-pulse" />
            <div className="h-4 w-14 bg-stone-200/60 rounded-md animate-pulse" />
          </div>
        </div>
      </header>

      {/* ─── 沉浸式閱讀單欄容器骨架 (Max-w-3xl Editorial Layout) ─── */}
      <main className="max-w-3xl mx-auto px-5 sm:px-6 pt-10 sm:pt-14 pb-24">
        <div className="space-y-10 animate-pulse">
          {/* ─── 1. 文章標頭骨架 ─── */}
          <div className="space-y-4">
            {/* 分類膠囊標籤與發布日期 */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 bg-stone-200/70 rounded-full" />
              <div className="h-4 w-24 bg-stone-200/60 rounded-md" />
            </div>

            {/* 大標題兩行佔位條 (rounded-md) */}
            <div className="space-y-3 pt-2">
              <div className="h-8 sm:h-10 w-4/5 bg-stone-200/80 rounded-md" />
              <div className="h-8 sm:h-10 w-2/3 bg-stone-200/70 rounded-md" />
            </div>

            {/* 導讀前言摘要佔位塊 */}
            <div className="border-l-2 border-stone-300 pl-4 py-3 my-6 bg-stone-100/60 rounded-r-xl space-y-2">
              <div className="h-4 w-11/12 bg-stone-200/70 rounded-md" />
              <div className="h-4 w-4/5 bg-stone-200/60 rounded-md" />
            </div>
          </div>

          {/* ─── 2. 封面主圖大區塊 (h-80 w-full rounded-2xl) ─── */}
          <div className="w-full flex flex-col items-center justify-center my-8">
            <div className="w-full h-72 sm:h-80 md:h-96 rounded-2xl bg-stone-200/70 border border-[#E0D8CB]/60 flex items-center justify-center shadow-xs">
              <svg
                className="w-12 h-12 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <div className="h-3.5 w-36 bg-stone-200/50 rounded-full mt-3" />
          </div>

          {/* ─── 3. 內文段落仿排版線條 (數行長短交錯的圓角條塊) ─── */}
          <div className="space-y-8 pt-2">
            {/* 段落一 */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-200/70 rounded-md" />
              <div className="h-4 w-11/12 bg-stone-200/70 rounded-md" />
              <div className="h-4 w-4/5 bg-stone-200/60 rounded-md" />
              <div className="h-4 w-3/4 bg-stone-200/50 rounded-md" />
            </div>

            {/* 章節標題佔位條 */}
            <div className="h-6 w-52 bg-stone-200/80 rounded-md pt-1" />

            {/* 段落二 */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-200/70 rounded-md" />
              <div className="h-4 w-5/6 bg-stone-200/70 rounded-md" />
              <div className="h-4 w-2/3 bg-stone-200/60 rounded-md" />
            </div>

            {/* 段落三 */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-200/70 rounded-md" />
              <div className="h-4 w-11/12 bg-stone-200/70 rounded-md" />
              <div className="h-4 w-4/5 bg-stone-200/60 rounded-md" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
