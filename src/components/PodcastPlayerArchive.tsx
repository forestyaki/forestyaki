"use client";

import React, { useState } from "react";

export interface PodcastEpisode {
  id: string;
  episodeNumber: string;
  title: string;
  category: string;
  categoryBadgeClass: string;
  date: string;
  duration: string;
  description: string;
  soundscapeNote: string;
  spotifyUrl: string;
  embedUrl: string;
}

export const EPISODES_DATA: PodcastEpisode[] = [
  {
    id: "ep-08",
    episodeNumber: "EP.08",
    title: "【近況分享】來給極光打工💚：在北緯 66 度與零下 20 度的雪地生活",
    category: "荒野生活 · 極地打工",
    categoryBadgeClass: "bg-[#BA6341] text-white",
    date: "2024.11.18",
    duration: "28 分鐘",
    description:
      "告別了夏秋溫暖的山徑，今年冬天我來到北極圈。這集想跟你聊聊在冰天雪地裡等待極光的漫長夜晚、凍僵的手指、以及極度酷寒中讓人感到無比溫暖的人情故事。",
    soundscapeNote: "❄️ 聲音特色：零下 20 度的踩雪沙沙聲、暴風雪拍打木屋窗框的沉靜風聲。",
    spotifyUrl: "https://open.spotify.com/episode/7vNfQ5V4tQ4H1yX5J5v9dE",
    embedUrl: "https://open.spotify.com/embed/episode/7vNfQ5V4tQ4H1yX5J5v9dE?utm_source=generator&theme=0",
  },
  {
    id: "ep-07",
    episodeNumber: "EP.07",
    title: "Te Araroa 3,000 公里荒野收音：橫跨紐西蘭雙島的風雨旅程",
    category: "長程徒步 · 荒野收音",
    categoryBadgeClass: "bg-[#233F31] text-[#FAF7F2]",
    date: "2024.09.25",
    duration: "42 分鐘",
    description:
      "歷時四個月走過紐西蘭南阿爾卑斯山脈。在這集裡收錄了高山隘口的呼嘯山風、冰川溶雪潺潺流過溪谷的清涼聲響，以及一個人在荒野長途跋涉時對生活的誠實思索。",
    soundscapeNote: "🌊 聲音特色：南阿爾卑斯山冰川溪流沖刷鵝卵石的原音、清晨山毛櫸林鳥鳴。",
    spotifyUrl: "https://open.spotify.com/show/1pusMjoawvb6plDusPEePP",
    embedUrl: "https://open.spotify.com/embed/show/1pusMjoawvb6plDusPEePP?utm_source=generator&theme=0",
  },
  {
    id: "ep-06",
    episodeNumber: "EP.06",
    title: "與狗同行小指南：帶著小黑狗 Ronnie 走步道的日常與注意事項",
    category: "與狗同行 · 步道生活",
    categoryBadgeClass: "bg-[#C16744] text-white",
    date: "2024.08.12",
    duration: "35 分鐘",
    description:
      "小黑狗 Ronnie 陪我走過許多步道。從水源檢查、跳蚤壁蝨預防、到注意狗狗的體力，帶著狗狗爬山雖然要多花心思，卻能看見截然不同的自然視角。",
    soundscapeNote: "🐾 聲音特色：Ronnie 踩過淺溪的水花聲、松針步道上的輕快小跑聲。",
    spotifyUrl: "https://open.spotify.com/show/1pusMjoawvb6plDusPEePP",
    embedUrl: "https://open.spotify.com/embed/show/1pusMjoawvb6plDusPEePP?utm_source=generator&theme=0",
  },
  {
    id: "ep-05",
    episodeNumber: "EP.05",
    title: "山林畫筆對話：為什麼我總要在登頂時坐下來畫一張水彩？",
    category: "創作隨筆 · 話與畫",
    categoryBadgeClass: "bg-[#715A46] text-[#FAF7F2]",
    date: "2024.07.03",
    duration: "30 分鐘",
    description:
      "快門只需要千分之一秒，但畫筆迫使我坐在稜線上凝視山峰半個小時。分享隨身攜帶的水彩速寫本秘密、風中乾透的顏料筆觸，以及記錄自然的另一種維度。",
    soundscapeNote: "🎨 聲音特色：針筆在水彩紙上沙沙作畫的聲音、高山稜線的遼闊微風。",
    spotifyUrl: "https://open.spotify.com/show/1pusMjoawvb6plDusPEePP",
    embedUrl: "https://open.spotify.com/embed/show/1pusMjoawvb6plDusPEePP?utm_source=generator&theme=0",
  },
];

export default function PodcastPlayerArchive() {
  const [activeEmbedId, setActiveEmbedId] = useState<string | null>(null);

  const toggleEmbed = (id: string) => {
    setActiveEmbedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      {EPISODES_DATA.map((ep) => {
        const isEmbedOpen = activeEmbedId === ep.id;

        return (
          <article
            key={ep.id}
            className="bg-[#FFFEFA] rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs hover:shadow-sm hover:border-[#BA6341]/40 transition-all duration-300"
          >
            {/* 頂部資訊列：EP 編號、分類、日期與時長 */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#BA6341] bg-[#FBF0EB] px-2.5 py-0.5 rounded-md">
                  {ep.episodeNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${ep.categoryBadgeClass}`}
                >
                  {ep.category}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-mono text-[#737373]">
                <span>⏱️ {ep.duration}</span>
                <span>•</span>
                <span>{ep.date}</span>
              </div>
            </div>

            {/* 單集大標題 */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#262626] font-sans leading-snug mb-3">
              <a
                href={ep.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#BA6341] transition-colors"
              >
                {ep.title}
              </a>
            </h3>

            {/* 單集散文摘要 */}
            <p className="text-sm sm:text-base font-normal text-[#4A4A4A] leading-relaxed mb-4">
              {ep.description}
            </p>

            {/* 聲音特色小標籤 */}
            <div className="text-xs text-[#737373] bg-[#FAF7F2] border border-[#EBE4D5] rounded-xl px-4 py-2.5 mb-5 font-mono">
              {ep.soundscapeNote}
            </div>

            {/* 嵌入播放器（展開狀態） */}
            {isEmbedOpen && (
              <div className="mb-5 overflow-hidden rounded-2xl border border-[#E5DEC7] bg-[#FAF7F2] p-1.5 shadow-inner transition-all animate-fadeIn">
                <iframe
                  style={{ borderRadius: "12px" }}
                  src={ep.embedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full rounded-xl"
                  title={`${ep.title} 播放器`}
                />
              </div>
            )}

            {/* 底部操作按鈕列 */}
            <div className="pt-3 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleEmbed(ep.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isEmbedOpen
                      ? "bg-[#BA6341] text-white shadow-2xs"
                      : "bg-[#233F31] text-[#FAF7F2] hover:bg-[#182C22] shadow-2xs"
                  }`}
                  aria-label={isEmbedOpen ? "收起播放器" : "在頁面中播放本集"}
                >
                  <span>{isEmbedOpen ? "▲ 收起播放器" : "▶️ 在頁面播放"}</span>
                </button>
              </div>

              {/* 在 Spotify 收聽完整單集連結 */}
              <a
                href={ep.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#262626] hover:text-[#1DB954] transition-colors"
              >
                <span>在 Spotify 收聽完整單集</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
