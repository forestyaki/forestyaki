"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { NotionStory } from "@/lib/notion";
import PhotoLightbox from "@/components/PhotoLightbox";

interface MagazineHomeClientProps {
  initialStories: NotionStory[];
  fetchError: string | null;
  isOfficialHome?: boolean;
}

const MAGAZINE_PHOTOS = [
  {
    id: "mag-1",
    src: "/images/gallery-3.jpg",
    imageUrl: "/images/gallery-3.jpg",
    location: "Pacific Crest Trail · High Sierra",
    altitude: "3,700m",
    title: "四千公里的並肩同行",
    description: "走在太平洋屋脊步道的高山隘口，每一步都有彼此的照應。",
    film: "Kodak Portra 400",
    frame: "01A",
  },
  {
    id: "mag-2",
    src: "/images/gallery-1.jpg",
    imageUrl: "/images/gallery-1.jpg",
    location: "Yellowknife, Canada · 62°N",
    altitude: "206m",
    title: "雪原月光與極光之夜",
    description: "零下二十度的北極圈雪夜，極光與月光在大地上投下青綠微光。",
    film: "Cinestill 800T",
    frame: "02A",
  },
  {
    id: "mag-3",
    src: "/images/gallery-2.jpg",
    imageUrl: "/images/gallery-2.jpg",
    location: "Ancient Forest Trail",
    altitude: "1,450m",
    title: "老樹身旁的停歇",
    description: "走累了，背靠著老樹深呼吸，聽風吹過樹冠的沙沙聲。",
    film: "Fujicolor Pro 400H",
    frame: "03A",
  },
  {
    id: "mag-4",
    src: "/images/gallery-6.jpg",
    imageUrl: "/images/gallery-6.jpg",
    location: "雪山圈谷 · 主峰步道",
    altitude: "3,886m",
    title: "五月圈谷杜鵑盛開",
    description: "冰河遺跡的圈谷裡，遇見整片盛開的高山杜鵑。",
    film: "Kodak Ektar 100",
    frame: "04A",
  },
];

export default function MagazineHomeClient({
  initialStories,
  fetchError,
  isOfficialHome = true,
}: MagazineHomeClientProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Hero feature story (always first story or fallback)
  const featuredStory = useMemo(() => {
    if (initialStories && initialStories.length > 0) return initialStories[0];
    return null;
  }, [initialStories]);
  const heroStory = featuredStory;

  // Remaining stories
  const remainingStories = useMemo(() => {
    if (!initialStories || initialStories.length <= 1) return [];
    return initialStories.slice(1, 5);
  }, [initialStories]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D312E] font-sans selection:bg-[#E8DDD1] selection:text-[#1E3729]">
      {/* ─── 0. 雙軌預覽快速切換頂欄 (若非正式首頁時顯示) ─── */}
      {!isOfficialHome && (
        <aside aria-label="版本切換導覽" className="sticky top-0 z-50 bg-[#233F31] text-[#FAF7F2] text-xs py-2 px-4 shadow-md border-b border-[#1E3729]">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#BA6341] animate-pulse" />
              <span className="font-semibold tracking-wide">
                您正在預覽：【日系戶外獨立雜誌版】（Earthy Editorial Magazine）
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/classic"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-medium transition-colors border border-white/20"
              >
                <span>← 前往【經典手帳版首頁】</span>
              </Link>
            </div>
          </div>
        </aside>
      )}

      {/* ─── 1. 雜誌頂部導覽 (Magazine Header Bar) ─── */}
      <header className="border-b border-[#E8E1D5] bg-[#FAF7F2]/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs font-mono text-[#595550]">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link href="/" className="font-semibold text-[#262626] hover:text-[#BA6341] transition-colors flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#233F31]"></span>
              <span>FOREST YAKI</span>
            </Link>
            <span className="text-[#C5BDB0]">/</span>
            <span className="hidden sm:inline">ISSUE NO. 04</span>
            <span className="text-[#C5BDB0] hidden sm:inline">/</span>
            <span>AUTUMN &amp; WINTER 2026</span>
          </div>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/stories" className="hover:text-[#BA6341] transition-colors">
              專題庫
            </Link>
            <Link href="/about" className="hover:text-[#BA6341] transition-colors">
              關於 Yaki
            </Link>
            <a href="#film-reel" className="hover:text-[#BA6341] transition-colors hidden md:inline">
              底片印樣
            </a>
            <a href="#field-audio" className="hover:text-[#BA6341] transition-colors hidden md:inline">
              自然收音
            </a>
            <Link
              href="/classic"
              className="text-[#78716C] hover:text-[#BA6341] transition-colors inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAE4D9]/60 hover:bg-[#EAE4D9]"
              title="查看原始手帳版本"
            >
              <span>經典手帳</span>
              <span className="text-[9px] bg-[#233F31] text-white px-1 py-0.2 rounded font-mono">v1</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ─── 2. 跨版雜誌大刊頭 (Editorial Masthead & Issue Stamp) ─── */}
      <section className="pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b-2 border-[#233F31] pb-6">
          {/* 刊名大標 */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#EBF1EC] text-[#233F31] font-mono text-[11px] font-semibold border border-[#CCE0D2]">
                WILDERNESS &amp; WORDS
              </span>
              <span className="font-mono text-[11px] text-[#595550]">
                TAIWAN × PACIFIC CREST TRAIL
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#233F31] tracking-tight leading-none">
              森女孩的話與畫
            </h1>
            <p className="mt-3 font-mono text-xs sm:text-sm tracking-widest text-[#595550] uppercase">
              FOREST YAKI JOURNAL · OUTDOOR LIFE &amp; OBSERVATION
            </p>
          </div>

          {/* 右側：期別印章徽章 + 金句引言 */}
          <div className="flex items-center gap-6 self-start lg:self-end">
            <div className="hidden sm:block max-w-xs text-right text-xs text-[#595550] font-serif italic border-r border-[#E0D8CB] pr-5 leading-relaxed">
              &ldquo;In every walk with nature, one receives far more than he seeks.&rdquo;
              <span className="block mt-1 font-mono text-[10px] text-[#78716C]">
                — John Muir
              </span>
            </div>

            {/* 經典雜誌期別波浪戳印 */}
            <div className="relative w-20 h-20 rounded-full bg-[#BA6341] text-white flex flex-col items-center justify-center p-2 text-center shadow-md transform rotate-2">
              <div className="absolute inset-1 rounded-full border border-dashed border-white/60 pointer-events-none" />
              <span className="text-[9px] font-mono tracking-widest uppercase">ISSUE</span>
              <span className="text-xl font-bold font-serif leading-none">04</span>
              <span className="text-[9px] font-mono tracking-wider mt-0.5">SPRING</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. 非對稱雜誌封面級 Hero (Asymmetric 7:5 Editorial Grid) ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* 【左側 7 欄】：寬幅 35mm 底片大主圖 + 橙色日期印字 + 齒孔邊界 */}
          <div className="lg:col-span-7 relative bg-[#1E3729] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group border border-[#E0D8CB]">
            {/* 底片邊界標記 (Film Rebate Notch Marks) */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-black/40 z-20 flex items-center justify-between px-4 text-[10px] font-mono text-stone-300 pointer-events-none tracking-widest">
              <span>▲ -31</span>
              <span>KODAK PORTRA 400</span>
              <span>-203 ▲</span>
            </div>

            {/* 大底片主圖 */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-[500px]">
              <Image
                src="/hero-bg.jpg"
                alt="太平洋屋脊步道健行紀實"
                fill
                priority
                className="object-cover object-[50%_35%] saturate-[0.92] contrast-[0.98] transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              {/* 左上角步道標籤 */}
              <div className="absolute top-10 left-5 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#BA6341] text-white font-mono text-xs font-semibold shadow-sm">
                  <span>PCT · 4,270 KM 縱走記事</span>
                </span>
              </div>

              {/* 右下角：經典 35mm 底片橙色日期印字 */}
              <div className="absolute bottom-5 right-5 z-20 font-mono text-lg sm:text-xl font-bold text-[#FF8A00] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] select-none">
                &apos;23 08 14
              </div>

              {/* 左下角圖說 */}
              <div className="absolute bottom-5 left-5 z-20 text-white/95 max-w-sm">
                <p className="text-xs font-mono text-stone-300 mb-1">
                  📍 High Sierra · Forester Pass 隘口前夕
                </p>
                <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                  背著四千公里的帳篷與行囊，在寂靜積雪的山徑上找回自己的呼吸。
                </h3>
              </div>
            </div>

            {/* 底片下緣標記 */}
            <div className="h-6 bg-black/40 z-20 flex items-center justify-between px-4 text-[10px] font-mono text-stone-300 pointer-events-none tracking-widest">
              <span>31A</span>
              <span>42-36 · EXPOSURE</span>
              <span>SAFETY FILM</span>
            </div>
          </div>

          {/* 【右側 5 欄】：雜誌專欄導讀欄 (Editorial Column with Drop Cap) */}
          <div className="lg:col-span-5 bg-[#FFFEFA] rounded-2xl border border-[#E0D8CB] p-7 sm:p-9 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* 中間日式直排美學點綴 (Vertical Japanese Accent Line) */}
            <div className="absolute top-6 right-6 hidden sm:block pointer-events-none select-none opacity-30 font-serif text-xs text-[#233F31] [writing-mode:vertical-rl] tracking-widest">
              自然と共にある暮らし――
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#BA6341]" />
                <span className="font-mono text-xs font-semibold text-[#BA6341] tracking-wider uppercase">
                  LEAD EDITORIAL · 卷首專欄
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#233F31] leading-tight mb-5">
                在千米之上的稜線，
                <br />
                把生活裡的雜音留在身後。
              </h2>

              {/* 首字下沉 (Drop Cap 'F') */}
              <div className="text-sm sm:text-base text-[#4A4A4A] leading-[1.85] space-y-4">
                <p className="first-letter:float-left first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-[#233F31] first-letter:mr-3 first-letter:leading-none">
                  走進山徑裡，事情就變得很單純——只要專注在眼前的這一步、下一處水源，還有天黑前的營地。每天除了走路就是吃飯睡覺，心裡卻少見地安靜下來。
                </p>
                <p className="text-xs sm:text-sm text-[#595550]">
                  身邊踏著輕快小碎步的小黑狗 Ronnie，耳朵往後甩、笑盈盈的模樣，提醒著我：生活裡真正重要的事物，往往輕盈得不需要語言。
                </p>
              </div>

              {/* 專欄短引言 */}
              <div className="my-6 border-l-2 border-[#BA6341] bg-[#F4EFE6] p-4 rounded-r-xl">
                <p className="font-serif italic text-xs sm:text-sm text-[#262626]">
                  &ldquo;登山從來不是為了征服什麼，而是在山林面前，坦然承認自己的渺小。&rdquo;
                </p>
                <span className="block mt-1 font-mono text-[11px] text-[#595550]">
                  — Yaki &amp; Ronnie
                </span>
              </div>
            </div>

            {/* 導向 CTA */}
            <div className="pt-4 border-t border-[#EFE8DC] flex items-center justify-between gap-4">
              <span className="font-mono text-xs text-[#595550]">
                ⏱️ 閱讀完整專訪約 6 分鐘
              </span>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#233F31] text-[#FAF7F2] hover:bg-[#BA6341] transition-colors text-xs font-semibold shadow-xs"
              >
                <span>閱讀專訪全文</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. 金句引言穿插 (Editorial Pull Quote Strip) ─── */}
      <section className="my-14 bg-[#F5EFE6] border-y border-[#E5DEC7] py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-start gap-4">
            <span className="font-serif text-5xl font-bold text-[#BA6341] leading-none select-none">
              “
            </span>
            <p className="font-serif text-lg sm:text-xl text-[#262626] font-medium leading-relaxed">
              在這裡安放走過的路，還有那些閃閃發光的平靜日常。
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs text-[#BA6341] border border-[#BA6341]/40 px-3.5 py-1.5 rounded-full bg-white/60">
            PACIFIC CREST TRAIL · 4,270 KM
          </div>
        </div>
      </section>

      {/* ─── 5. 雜誌專題庫 (Featured Stories Section) ─── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E8E1D5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#BA6341]" />
              <span className="font-mono text-xs font-semibold text-[#BA6341] tracking-wider uppercase">
                FEATURE ARTICLES · 專題手帳
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#233F31]">
              山野行走記事
            </h2>
          </div>
          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#233F31] hover:text-[#BA6341] transition-colors"
          >
            <span>瀏覽全部日誌資料庫 ({initialStories.length})</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* 雜誌版非對稱文章網格 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* 主打大卡 (佔 7 欄) */}
          {featuredStory && (
            <article className="md:col-span-7 bg-[#FFFEFA] rounded-2xl border border-[#E0D8CB] overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#243E30]">
                  <Image
                    src={
                      featuredStory.coverImage ||
                      "/images/gallery-3.jpg"
                    }
                    alt={featuredStory.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-[#233F31] text-[#FAF7F2] font-mono text-[11px] font-semibold">
                      FEATURED · {featuredStory.category}
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#595550] mb-3">
                    <span>{featuredStory.date}</span>
                    <span>·</span>
                    <span>📷 Kodak Portra 400</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#262626] group-hover:text-[#BA6341] transition-colors mb-3 leading-snug">
                    <Link href={`/stories/${featuredStory.slug}`}>
                      {featuredStory.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-[#4A4A4A] leading-relaxed line-clamp-3 mb-6">
                    {featuredStory.summary}
                  </p>
                </div>
              </div>

              <div className="px-7 pb-6 pt-4 border-t border-[#EFE8DC] flex items-center justify-between text-xs font-mono">
                <span className="text-[#595550]">READ TIME: 5 MINS</span>
                <Link
                  href={`/stories/${featuredStory.slug}`}
                  className="font-semibold text-[#233F31] group-hover:text-[#BA6341] inline-flex items-center gap-1"
                >
                  <span>閱讀完整報導</span>
                  <span>→</span>
                </Link>
              </div>
            </article>
          )}

          {/* 次要側欄卡片 (佔 5 欄，垂直排列) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {remainingStories.map((story, index) => (
              <article
                key={story.id}
                className="bg-[#FFFEFA] rounded-2xl border border-[#E0D8CB] p-6 shadow-2xs hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 font-mono text-xs text-[#595550] mb-2">
                    <span className="text-[#BA6341] font-semibold">
                      #{String(index + 2).padStart(2, "0")} · {story.category}
                    </span>
                    <span>{story.date}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-[#262626] group-hover:text-[#BA6341] transition-colors mb-2 leading-snug">
                    <Link href={`/stories/${story.slug}`}>{story.title}</Link>
                  </h4>
                  <p className="text-xs text-[#595550] leading-relaxed line-clamp-2 mb-4">
                    {story.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFE8DC] flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#595550]">山林實地札記</span>
                  <Link
                    href={`/stories/${story.slug}`}
                    className="font-semibold text-[#233F31] group-hover:text-[#BA6341]"
                  >
                    閱讀內文 →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. 35mm 底片印樣相簿牆 (Trail Film Contact Sheet) ─── */}
      <section
        id="film-reel"
        className="my-20 py-16 bg-[#F3EDE3] border-y border-[#E2D8C6]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#BA6341]" />
                <span className="font-mono text-xs font-semibold text-[#BA6341] tracking-wider uppercase">
                  CONTACT SHEET · 35mm 底片印樣
                </span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#233F31]">
                山野光影印樣
              </h2>
            </div>
            <p className="text-xs font-mono text-[#595550]">
              點擊相片可放大檢視詳細底片資訊
            </p>
          </div>

          {/* 底片排卡 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MAGAZINE_PHOTOS.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActivePhotoIndex(index)}
                className="bg-[#FFFEFA] rounded-xl p-3 border border-[#D5C9B8] shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                {/* 照片容器帶黑框底片質感 */}
                <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-black/10 mb-3">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[10px]">
                    FRAME {item.frame}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#595550]">
                    <span>{item.location}</span>
                    <span className="text-[#BA6341] font-semibold">{item.altitude}</span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-[#262626] group-hover:text-[#BA6341] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] font-mono text-[#78716C]">
                    🎞️ {item.film}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. 自然收音專欄 (Field Audio Recording Section) ─── */}
      <section
        id="field-audio"
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-20"
      >
        <div className="bg-[#FFFEFA] rounded-3xl border border-[#E0D8CB] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#BA6341]" />
              <span className="font-mono text-xs font-semibold text-[#BA6341] tracking-wider uppercase">
                FIELD RECORDING · 步道收音
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#233F31] leading-tight">
              在山嶺與日常之間，
              <br />
              收錄清冽山風與溪流。
            </h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              把長途徒步時南阿爾卑斯山的清澈水聲、黃刀鎮零下二十度的踏雪聲，錄製在 Podcast《森女孩的話與畫》中。戴上耳機，如同與我並肩走在山徑上。
            </p>
            <div className="pt-2">
              <a
                href="https://open.spotify.com/show/1pusMjoawvb6plDusPEePP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#233F31] hover:bg-[#BA6341] text-[#FAF7F2] font-semibold text-xs transition-colors shadow-xs"
              >
                <span>在 Spotify 上收聽最新單集</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-2xl border border-[#E5DEC7] p-2 bg-[#FAF7F2] shadow-xs">
              <iframe
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/show/1pusMjoawvb6plDusPEePP?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="森女孩的話與畫 Spotify 節目播放器"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. 雜誌版權發行頁尾 (Editorial Colophon / Footer) ─── */}
      <footer className="border-t-2 border-[#233F31] bg-[#F5EFE6] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-mono text-[#595550]">
          <div className="md:col-span-5 space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#233F31]">
              森女孩的話與畫 · FOREST YAKI
            </h3>
            <p className="text-[#595550] leading-relaxed">
              獨立荒野觀察、長程縱走紀錄與手作生活誌。
              <br />
              紀錄走過的路，還有那些閃閃發光的平靜日常。
            </p>
          </div>

          <div className="md:col-span-4 space-y-2">
            <span className="font-bold text-[#262626] uppercase">ISSUE ARCHIVES</span>
            <ul className="space-y-1">
              <li>
                <Link href="/stories" className="hover:text-[#BA6341]">
                  • 全部山林手帳庫 (Archive)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#BA6341]">
                  • 關於長途徒步者 Yaki 與 Ronnie
                </Link>
              </li>
              <li>
                <Link href="/classic" className="hover:text-[#BA6341] text-[#233F31]">
                  • 經典手帳典藏版 (Original Edition)
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2 text-left md:text-right">
            <span className="font-bold text-[#262626]">PRINT &amp; DIGITAL EDITION</span>
            <p className="text-[11px] text-[#78716C]">
              © {new Date().getFullYear()} FOREST YAKI.
              <br />
              ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

      {/* 相片燈箱 */}
      <PhotoLightbox
        photos={MAGAZINE_PHOTOS}
        currentIndex={activePhotoIndex}
        isOpen={activePhotoIndex !== null}
        onClose={() => setActivePhotoIndex(null)}
        setCurrentIndex={setActivePhotoIndex}
      />
    </div>
  );
}
