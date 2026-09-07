"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

export interface LightboxPhoto {
  id: string;
  location: string;
  subLocation?: string;
  altitude?: string;
  imageUrl?: string;
  src?: string;
  aspect?: string;
  title?: string;
  note?: string;
  description?: string;
  exif?: string;
  date?: string;
}

export interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  currentIndex: number | null;
  isOpen: boolean;
  onClose: () => void;
  setCurrentIndex: (index: number) => void;
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  setCurrentIndex,
}: PhotoLightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const activeIndex = currentIndex !== null ? currentIndex : 0;
  const currentPhoto = photos[activeIndex];

  const handlePrev = useCallback(() => {
    if (photos.length === 0) return;
    const prev = activeIndex > 0 ? activeIndex - 1 : photos.length - 1;
    setCurrentIndex(prev);
  }, [activeIndex, photos.length, setCurrentIndex]);

  const handleNext = useCallback(() => {
    if (photos.length === 0) return;
    const next = activeIndex < photos.length - 1 ? activeIndex + 1 : 0;
    setCurrentIndex(next);
  }, [activeIndex, photos.length, setCurrentIndex]);

  // 鍵盤導航：Escape 關閉、方向鍵左右切換
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // 鎖定背景頁面捲動
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // 手機觸控滑動手勢支援 (Touch gestures)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const diffX = e.changedTouches[0].clientX - touchStartX.current;
    const diffY = e.changedTouches[0].clientY - touchStartY.current;

    // 水平滑動距離大於垂直滑動，且位移超過 50px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handlePrev(); // 向右滑動 -> 上一張
      } else {
        handleNext(); // 向左滑動 -> 下一張
      }
    } else if (diffY > 100 && Math.abs(diffY) > Math.abs(diffX)) {
      // 向下滑動超過 100px -> 關閉燈箱
      onClose();
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!isOpen || !currentPhoto) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex flex-col justify-between bg-stone-950/85 backdrop-blur-md select-none font-sans"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="山野光影寫真大圖檢視"
        >
          {/* ─── 頂部控制列 ─── */}
          <div
            className="w-full flex items-center justify-between px-6 py-4 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 左側：攝影專題標記 */}
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#BA6341]" aria-hidden="true" />
              <span className="text-xs font-mono tracking-widest text-stone-300 uppercase">
                TRAIL FILM GALLERY · 35MM &amp; DIGITAL
              </span>
            </div>

            {/* 右側：關閉按鈕 */}
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-stone-200 hover:text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs hover:scale-105 active:scale-95"
              aria-label="關閉燈箱 (Esc)"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ─── 主畫面展示區 (左右切換箭頭 + 原始比例照片) ─── */}
          <div className="relative flex-1 flex items-center justify-center px-4 sm:px-14 md:px-20 min-h-0">
            {/* 上一張按鈕 */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white/90 hover:text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-lg hover:scale-105 active:scale-95"
              aria-label="上一張 (左方向鍵)"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 下一張按鈕 */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white/90 hover:text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs shadow-lg hover:scale-105 active:scale-95"
              aria-label="下一張 (右方向鍵)"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* 照片本體 (無強制裁切，完整呈現構圖) */}
            <motion.div
              key={currentPhoto.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative max-h-[72vh] sm:max-h-[78vh] max-w-[92vw] sm:max-w-[85vw] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentPhoto.src || currentPhoto.imageUrl}
                alt={currentPhoto.title || currentPhoto.location}
                className="max-h-[72vh] sm:max-h-[78vh] max-w-[92vw] sm:max-w-[85vw] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </motion.div>
          </div>

          {/* ─── 底部手帳沉浸資訊條 (Journal Metadata Bar) ─── */}
          <div
            className="w-full z-20 px-4 sm:px-8 py-4 sm:py-5 bg-stone-950/70 border-t border-white/10 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              {/* 照片地點、隨筆小記與參數 */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h4 className="text-white font-bold text-base sm:text-lg font-sans">
                    {currentPhoto.title || currentPhoto.location}
                  </h4>

                  {currentPhoto.subLocation && (
                    <span className="text-xs text-stone-400 font-sans">
                      {currentPhoto.subLocation}
                    </span>
                  )}

                  {currentPhoto.altitude && !currentPhoto.location.includes(currentPhoto.altitude) && (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-stone-300 text-[11px] font-mono border border-white/15">
                      ⛰️ {currentPhoto.altitude}
                    </span>
                  )}
                </div>

                {(currentPhoto.description || currentPhoto.note) && (
                  <p className="text-stone-300 text-xs sm:text-sm font-normal leading-relaxed">
                    {currentPhoto.description || currentPhoto.note}
                  </p>
                )}

                {currentPhoto.exif && (
                  <p className="text-stone-400 text-[11px] font-mono">
                    📷 {currentPhoto.exif}
                  </p>
                )}
              </div>

              {/* 當前張數指示 (例如 3 / 6) */}
              <div className="shrink-0 self-end sm:self-center">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-medium text-stone-200">
                  <span className="text-[#E8C28A] font-bold">{activeIndex + 1}</span>
                  <span className="mx-1 text-stone-500">/</span>
                  <span>{photos.length}</span>
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
