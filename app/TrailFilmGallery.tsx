"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import SectionHeader from "@/src/components/SectionHeader";
import PhotoLightbox, { LightboxPhoto } from "@/src/components/PhotoLightbox";

export const GALLERY_PHOTOS: LightboxPhoto[] = [
  {
    id: "gallery-1",
    src: "/images/gallery-1.jpg",
    imageUrl: "/images/gallery-1.jpg",
    title: "月光與極光",
    location: "Yellowknife, Canada",
    description: "月光與極光互相輝映，在極北的雪夜裡好美好美。",
    note: "月光與極光互相輝映，在極北的雪夜裡好美好美。",
    aspect: "aspect-[3/2]",
  },
  {
    id: "gallery-2",
    src: "/images/gallery-2.jpg",
    imageUrl: "/images/gallery-2.jpg",
    title: "被樹擁抱",
    location: "Forest Trail",
    description: "走累了停下腳步，靠在一棵巨大的老樹旁喘口氣。",
    note: "走累了停下腳步，靠在一棵巨大的老樹旁喘口氣。",
    aspect: "aspect-[3/4]",
  },
  {
    id: "gallery-3",
    src: "/images/gallery-3.jpg",
    imageUrl: "/images/gallery-3.jpg",
    title: "四千公里的好夥伴",
    location: "Pacific Crest Trail",
    description: "與我走過四千公里的好夥伴，每一步都有彼此的照應。",
    note: "與我走過四千公里的好夥伴，每一步都有彼此的照應。",
    aspect: "aspect-[4/3]",
  },
  {
    id: "gallery-4",
    src: "/images/gallery-4.jpg",
    imageUrl: "/images/gallery-4.jpg",
    title: "湖邊的一夜",
    location: "PCT · Crater Lake",
    description: "湛藍平靜的火山湖旁，在星空與微風中安靜睡了一晚。",
    note: "湛藍平靜的火山湖旁，在星空與微風中安靜睡了一晚。",
    aspect: "aspect-[4/3]",
  },
  {
    id: "gallery-5",
    src: "/images/gallery-5.jpg",
    imageUrl: "/images/gallery-5.jpg",
    title: "翻過埡口",
    location: "PCT · Forester Pass",
    description: "好不容易翻過了積雪的 Forester Pass，回頭是走過的壯麗。",
    note: "好不容易翻過了積雪的 Forester Pass，回頭是走過的壯麗。",
    aspect: "aspect-[4/3]",
  },
  {
    id: "gallery-6",
    src: "/images/gallery-6.jpg",
    imageUrl: "/images/gallery-6.jpg",
    title: "開滿花的圈谷",
    location: "雪山圈谷 · 3,886m",
    description: "五月的雪山圈谷，遇見了一整片盛開的高山杜鵑。",
    note: "五月的雪山圈谷，遇見了一整片盛開的高山杜鵑。",
    aspect: "aspect-[4/3]",
  },
];

export const photos = GALLERY_PHOTOS;

export default function TrailFilmGallery() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  const updateScrollState = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;

    const containerCenter = scrollLeft + clientWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    children.forEach((child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    setActiveSlide(closestIndex);
  };

  const handleScroll = () => {
    updateScrollState();
  };

  const scrollByCards = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollAmount = Math.max(container.clientWidth * 0.75, 340);
    const targetLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({
      left: targetLeft,
      behavior: "smooth",
    });
  };

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    if (children[index]) {
      const child = children[index];
      const targetScroll =
        child.offsetLeft - (container.clientWidth - child.offsetWidth) / 2;
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
      setActiveSlide(index);
    }
  };

  useEffect(() => {
    updateScrollState();
    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section
      id="film-gallery"
      className="py-20 sm:py-24 bg-[#FAF7F2] relative overflow-hidden"
    >
      {/* ─── Header Container ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <SectionHeader
            eyebrow="山野光影 · TRAIL PHOTOGRAPHY"
            title="山野光影"
            description="在步道與山脊間，用鏡頭留下自然沈靜的片刻。點擊照片可放大檢視。"
          />

          <div className="flex items-center gap-4 shrink-0 pb-1">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#737373]">
              <span>35MM &amp; DIGITAL ARCHIVE</span>
              <span>•</span>
              <span>{GALLERY_PHOTOS.length} FRAMES</span>
            </div>

            {/* Desktop Mini Header Controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByCards("left")}
                disabled={!canScrollLeft}
                aria-label="往左滾動照片"
                className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E0D8CB] shadow-xs flex items-center justify-center text-[#233F31] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => scrollByCards("right")}
                disabled={!canScrollRight}
                aria-label="往右滾動照片"
                className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#E0D8CB] shadow-xs flex items-center justify-center text-[#233F31] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white active:scale-95 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Unified Horizontal Carousel with Floating Semi-Transparent Arrows ─── */}
      <div className="relative max-w-7xl mx-auto group/carousel">
        {/* Left Floating Semi-transparent Button (Desktop) */}
        <button
          type="button"
          onClick={() => scrollByCards("left")}
          disabled={!canScrollLeft}
          aria-label="Previous photos"
          className={`hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/85 text-[#233F31] backdrop-blur-md border border-[#E0D8CB]/90 shadow-xl items-center justify-center transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer ${
            !canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-90 hover:opacity-100"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Floating Semi-transparent Button (Desktop) */}
        <button
          type="button"
          onClick={() => scrollByCards("right")}
          disabled={!canScrollRight}
          aria-label="Next photos"
          className={`hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/85 text-[#233F31] backdrop-blur-md border border-[#E0D8CB]/90 shadow-xl items-center justify-center transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 cursor-pointer ${
            !canScrollRight ? "opacity-0 pointer-events-none" : "opacity-90 hover:opacity-100"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scroll Track: snap-x snap-mandatory overflow-x-auto no-scrollbar */}
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-6 lg:px-8 py-4 scroll-smooth"
        >
          {GALLERY_PHOTOS.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhotoIndex(index)}
              className="w-[82vw] sm:w-[320px] md:w-[360px] lg:w-[380px] shrink-0 snap-center sm:snap-start rounded-2xl overflow-hidden bg-[#EFE9DE] shadow-md hover:shadow-xl border border-[#E2DACB] relative aspect-[4/5] cursor-zoom-in group select-none transition-all duration-300 hover:-translate-y-1"
            >
              <Image
                src={photo.src || photo.imageUrl || ""}
                alt={photo.title || photo.location}
                fill
                unoptimized
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 360px, 380px"
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Soft Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-70 transition-opacity pointer-events-none" />

              {/* Top Right Zoom Hint Button */}
              <div className="absolute top-4 right-4 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                    />
                  </svg>
                </span>
              </div>

              {/* Bottom Journal Information & Location Badge */}
              <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col gap-2 pointer-events-none z-10 text-white">
                <div className="flex items-center justify-between gap-2">
                  {/* Corner Location Badge */}
                  <span className="px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-medium tracking-wider text-white/95 flex items-center gap-1.5 shadow-xs">
                    <span className="text-[#E8C28A] text-[11px]">📍</span>
                    <span className="truncate max-w-[180px]">{photo.location}</span>
                  </span>

                  {photo.altitude && !photo.location.includes(photo.altitude) && (
                    <span className="text-xs font-mono text-white/85 bg-black/35 px-2.5 py-0.5 rounded-md backdrop-blur-xs shrink-0 border border-white/10">
                      {photo.altitude}
                    </span>
                  )}
                </div>

                <div className="mt-1">
                  <h4 className="font-semibold text-base text-white line-clamp-1 drop-shadow-xs group-hover:text-[#E8C28A] transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1 font-normal leading-relaxed">
                    {photo.description || photo.note}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Bottom Navigation & Mobile Indicators ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Frame Hint Text */}
        <p className="text-xs text-[#8C827A] font-sans text-center sm:text-left order-2 sm:order-1">
          ← 水平滑動或點擊箭頭翻閱 · 點擊卡片開啟大圖燈箱 →
        </p>

        {/* Interactive Dots & Counter Controls */}
        <div className="flex items-center gap-3 order-1 sm:order-2">
          {/* Mobile Prev Button */}
          <button
            type="button"
            onClick={() => scrollByCards("left")}
            disabled={!canScrollLeft}
            aria-label="Previous photo"
            className="md:hidden w-8 h-8 rounded-full bg-white border border-[#E0D8CB] shadow-xs flex items-center justify-center text-[#233F31] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FDF9F3] active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Indicator Dots */}
          <div className="flex items-center gap-1.5">
            {GALLERY_PHOTOS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToSlide(i)}
                aria-label={`切換至第 ${i + 1} 張照片`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === i
                    ? "w-6 bg-[#233F31]"
                    : "w-1.5 bg-[#233F31]/25 hover:bg-[#233F31]/50"
                }`}
              />
            ))}
          </div>

          <span className="text-xs font-mono text-[#737373]">
            0{activeSlide + 1} / 0{GALLERY_PHOTOS.length}
          </span>

          {/* Mobile Next Button */}
          <button
            type="button"
            onClick={() => scrollByCards("right")}
            disabled={!canScrollRight}
            aria-label="Next photo"
            className="md:hidden w-8 h-8 rounded-full bg-white border border-[#E0D8CB] shadow-xs flex items-center justify-center text-[#233F31] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FDF9F3] active:scale-95 transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ─── Lightbox Modal Component (Day 20) ─── */}
      <PhotoLightbox
        photos={GALLERY_PHOTOS}
        currentIndex={selectedPhotoIndex}
        isOpen={selectedPhotoIndex !== null}
        onClose={() => setSelectedPhotoIndex(null)}
        setCurrentIndex={(index) => setSelectedPhotoIndex(index)}
      />
    </section>
  );
}
