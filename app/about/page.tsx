import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "關於森女孩 · 漫步山徑的創作者",
  description:
    "在山嶺與稿紙之間，拾起最純粹的生活微光。認識 Yaki 與她的荒野足跡。",
  openGraph: {
    title: "關於森女孩 · 漫步山徑的創作者",
    description:
      "在山嶺與稿紙之間，拾起最純粹的生活微光。認識 Yaki 與她的荒野足跡。",
  },
  twitter: {
    card: "summary_large_image",
    title: "關於森女孩 · 漫步山徑的創作者",
    description:
      "在山嶺與稿紙之間，拾起最純粹的生活微光。認識 Yaki 與她的荒野足跡。",
  },
};

interface Milestone {
  year: string;
  title: string;
  location: string;
  description: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "2019",
    title: "初探百岳與中級山秘境",
    location: "台灣 · 中央山脈與雪山山脈",
    description:
      "從合歡群峰到能高越嶺古道，第一次踩上高山箭竹與巨木林道，深深著迷於森林的泥土氣息與魔幻晨光，開啟了隨身攜帶速寫本記錄山林的習慣。",
  },
  {
    year: "2021",
    title: "遇見犬伴「小栗」",
    location: "台北 / 台灣步道踏查",
    description:
      "四個月大的黃金獵犬「小栗」加入生活。為了讓毛孩安全享受自然，開始實地探訪全台犬伴友善步道，評估水質、陰涼度與關節坡度，並以手繪圖文分享路線指南。",
  },
  {
    year: "2022",
    title: "太平洋屋脊步道（PCT）徒步挑戰",
    location: "美國西岸 · 4,270 公里",
    description:
      "背起帳篷與極簡行囊，歷經數月穿越加州沙漠、內華達山脈的積雪隘口，一路抵達華盛頓州邊境。在千米之上的壯麗與荒寂裡，學會放慢腳步、誠實面對內心。",
  },
  {
    year: "2023",
    title: "紐西蘭 Te Araroa（TA）縱貫荒野",
    location: "紐西蘭南北島 · 3,000 公里",
    description:
      "從雷恩加角的浩瀚海岸線，一路徒步走到南島最南端的布拉夫。跨越冰川溪流與原始櫸木森林，將沿途採集的風聲與故事化為日後的聲音誌創作養分。",
  },
  {
    year: "2024–至今",
    title: "《森女孩的話與畫》手帳基地誕生",
    location: "山野與生活日常",
    description:
      "正式成立專屬網站與 Podcast 音聲誌。結合長程徒步踏查、自然散文隨筆與手繪插畫，願為每一位嚮往山林的朋友，點亮一盞平靜溫暖的手帳微光。",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A4A4A] font-sans selection:bg-[#E8DDD1] selection:text-[#1E3729]">
      {/* ─── 頂部導覽列 (Sticky Navigation Bar) ─── */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E1D5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* 返回首頁 */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#233F31] hover:text-[#BA6341] transition-colors shrink-0"
          >
            <span aria-hidden="true">←</span>
            <span>返回首頁</span>
          </Link>

          {/* Logo 與站名 */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 overflow-hidden rounded-full border border-[#D5E2D8] bg-[#EBF1EC] shadow-2xs shrink-0">
              <Image
                src="/logo.png"
                alt="森女孩的話與畫 Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-[#262626] group-hover:text-[#BA6341] transition-colors whitespace-nowrap">
              森女孩的話與畫
            </span>
          </Link>

          {/* 右側捷徑 */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-[#737373]">
            <Link href="/stories" className="hover:text-[#BA6341] transition-colors">
              山林日誌
            </Link>
            <Link href="/#film-gallery" className="hover:text-[#BA6341] transition-colors">
              山野光影
            </Link>
            <Link href="/#podcast" className="hover:text-[#BA6341] transition-colors">
              Podcast
            </Link>
          </div>
        </div>
      </header>

      {/* ─── 內文單欄排版 (Max-w-3xl Editorial Layout) ─── */}
      <main className="max-w-3xl mx-auto px-6 pt-12 pb-24">
        {/* 頂部 Header */}
        <header className="mb-10 sm:mb-12">
          {/* 小標 (Eyebrow) */}
          <div className="inline-flex items-center gap-2 text-sm font-medium tracking-widest text-[#BA6341] uppercase mb-3">
            <span className="w-5 h-px bg-[#BA6341] shrink-0" aria-hidden="true" />
            <span>ABOUT YAKI · 關於森女孩</span>
          </div>

          {/* 主標題 (Title) */}
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#262626] leading-tight sm:leading-[1.2] tracking-normal mb-6">
            在山嶺與稿紙之間，
            <br className="hidden sm:inline" />
            拾起最純粹的生活微光。
          </h1>

          {/* 前言引導 */}
          <p className="text-lg sm:text-xl font-normal text-[#4A4A4A] leading-relaxed">
            嗨，我是森女孩 Yaki ( ´▽｀)
            <br className="hidden sm:inline" />
            平日是文字與插畫創作者，一到週末就成了往山裡奔跑的長程徒步者。帶著四歲的黃金獵犬「小栗」，在千米之上的雲霧與萬里荒野裡，尋找內心最誠實平靜的呼吸節奏。
          </p>
        </header>

        {/* 寬幅沈靜山野封面大圖 (16:9 比例，帶圓角與柔和陰影) */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md border border-[#E0D8CB] mb-12 sm:mb-16 bg-[#EBE4D8]">
          <Image
            src="/hero-bg.jpg"
            alt="森女孩與健行夥伴在山林步道終點"
            fill
            priority
            className="object-cover object-[50%_40%] saturate-[0.88] contrast-[0.96]"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 sm:left-6 text-xs text-white/95 font-mono tracking-wider backdrop-blur-xs px-3 py-1 rounded-md bg-black/35 border border-white/20">
            Mori &amp; Kuri · On the Sierra Trail, 2024
          </div>
        </div>

        {/* 專訪式散文區塊 */}
        <article className="space-y-14 sm:space-y-16">
          {/* 章節一 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#BA6341] tracking-wider uppercase">
              <span>CHAPTER 01</span>
              <span>•</span>
              <span>WILDERNESS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] leading-snug">
              走進荒野：從每一步踩踏中找回平靜
            </h2>
            <div className="space-y-4 text-base font-normal text-[#4A4A4A] leading-relaxed">
              <p>
                很多人常問我：「是什麼讓你一次次打包沈重的背包，把自己放逐到沒有手機訊號、沒有熱水澡的荒山野嶺？」
              </p>
              <p>
                對我而言，現代城市的生活總是充滿了被切割的注意力與倒數計時的行事曆。但在山徑上，事情變得無比純粹——眼前只有這一步的高度、下一座水源點的距離，以及午後雲層可能帶來的雷陣雨。
              </p>
              <p>
                在太平洋屋脊步道（PCT）走過加州熾熱沙漠與內華達山脈的暴雪隘口時，身體的極限反倒讓思緒沉澱下來。每當雙腳踩在泥土與松針上發出清脆的沙沙聲，我就知道，自己正被這座星球溫柔地接納著。
              </p>
            </div>

            {/* 筆記手帳引言框 */}
            <div className="my-6 border-l-2 border-[#BA6341] bg-[#F4EFE6] p-5 rounded-r-2xl">
              <p className="italic text-[#262626] text-base leading-relaxed">
                「登山從來不是為了征服山，而是在高聳的山壁前，學會坦然承認自己的渺小與脆弱，並在每口冷冽的空氣裡，重新學會呼吸。」
              </p>
              <span className="block mt-2 text-xs font-mono text-[#737373]">
                — 寫於 PCT 內華達山脈 High Sierra 營地
              </span>
            </div>
          </section>

          {/* 章節二 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#BA6341] tracking-wider uppercase">
              <span>CHAPTER 02</span>
              <span>•</span>
              <span>CREATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] leading-snug">
              畫筆與文字：記錄無法被相機完全留住的溫度
            </h2>
            <div className="space-y-4 text-base font-normal text-[#4A4A4A] leading-relaxed">
              <p>
                相機的快門只需要千分之一秒，就能留下一張色彩鮮豔的高解析照片；但有些感受，是快門留不住的——比如山頂迎面撲來的寒風濕度、落日餘暉照在雙手時那幾分鐘的短暫溫暖，還有夥伴煮沸一杯熱咖啡時升起的白煙。
              </p>
              <p>
                因此，我的背包側袋裡永遠放著一本浸滿水氣與泥漬的水彩速寫本，以及幾支防水針筆。每當走到一個想駐足的鞍部，我便坐下來，花三十分鐘描繪稜線的起伏。
              </p>
              <p>
                畫畫時，你必須凝視它很久很久。那些筆觸裡的歪斜與水痕，都是當下大自然與我的對話。而《森女孩的話與畫》，就是把這些閃閃發光的碎片整理成冊的秘密基地。
              </p>
            </div>
          </section>

          {/* 章節三 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#BA6341] tracking-wider uppercase">
              <span>CHAPTER 03</span>
              <span>•</span>
              <span>COMPANION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] leading-snug">
              犬伴同行：四隻腳丈量的山林風景
            </h2>
            <div className="space-y-4 text-base font-normal text-[#4A4A4A] leading-relaxed">
              <p>
                如果說山林教會了我沉思，那我的夥伴犬「小栗」（四歲的黃金獵犬）則教會了我活在當下。
              </p>
              <p>
                人類登山往往心心念念著頂峰與三角點，但小栗不同。一隻停在蕨類上的秋蟬、一窪清涼的高山溪水、甚至一陣穿過樹冠的微風，都能讓牠停下腳步，耳朵輕輕揚起，滿心歡喜。
              </p>
              <p>
                帶著毛孩走入山林，是一份更深重的責任。我們實踐「無痕山林」（Leave No Trace）原則，避開生態脆弱區與國家公園保護核心，專注踏查台灣合適的中級山古道與林道，並紀錄水質、防蚤防蜱以及關節保健須知，希望為更多想帶著毛孩走入自然的旅人提供實用指南。
              </p>
            </div>

            {/* 小栗拍立得風格卡片 */}
            <div className="mt-6 bg-[#FFFEFA] border border-[#E2DACB] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#F5ECE3] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                🐾
              </div>
              <div className="text-center sm:text-left">
                <div className="text-base font-semibold text-[#262626] mb-1">
                  健行夥伴：小栗（Kuri）
                </div>
                <p className="text-xs text-[#737373] leading-relaxed">
                  黃金獵犬 · 健行齡 4 年 · 專長：嗅聞松針香氣、在溪水裡踏浪、提醒主人該休息吃肉乾。
                </p>
              </div>
            </div>
          </section>

          {/* ─── 山野足跡時間線 (Milestones Timeline) ─── */}
          <section className="pt-8 border-t border-[#E8E1D5]">
            <div className="inline-flex items-center gap-2 text-sm font-medium tracking-widest text-[#BA6341] uppercase mb-3">
              <span className="w-5 h-px bg-[#BA6341] shrink-0" aria-hidden="true" />
              <span>MILESTONES &amp; JOURNEYS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] mb-8">
              山野足跡時間線
            </h2>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#E0D8CB] space-y-10">
              {MILESTONES.map((item) => (
                <div key={item.year} className="relative group">
                  {/* Timeline Point Dot */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-3.5 h-3.5 rounded-full bg-[#BA6341] border-3 border-[#FAF7F2] shadow-xs group-hover:scale-125 transition-transform" />

                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-sm font-bold text-[#BA6341] bg-[#FBF0EB] px-2.5 py-0.5 rounded-md">
                      {item.year}
                    </span>
                    <span className="text-xs font-mono text-[#737373]">
                      {item.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#262626] mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm font-normal text-[#4A4A4A] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── 底部溫暖結語與膠囊導覽按鈕 ─── */}
          <section className="pt-10 border-t border-[#E8E1D5] text-center">
            {/* 暖心結語卡片 */}
            <div className="bg-[#FFFEFA] border border-[#E0D7C7] rounded-3xl p-8 sm:p-10 shadow-sm max-w-xl mx-auto mb-10 relative overflow-hidden">
              {/* 紙膠帶裝飾 */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#E5DCB8]/75 transform -rotate-1 border-dashed border-[#D2C59D] border-x pointer-events-none" />

              <p className="text-base sm:text-lg font-medium text-[#262626] leading-relaxed mb-3">
                「願每座山都溫柔以待，
                <br />
                願每一次起步，都能在森林的風聲裡找回自己。」
              </p>
              <div className="text-xs font-mono text-[#737373]">
                — 森女孩 Yaki &amp; 小栗 🌿
              </div>
            </div>

            {/* 導覽膠囊按鈕 */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#233F31] text-[#FAF7F2] font-semibold text-sm hover:bg-[#182C22] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <span>🌲</span>
                <span>探索山林日誌</span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFFEFA] text-[#262626] border border-[#E0D8CB] font-medium text-sm hover:border-[#BA6341] hover:text-[#BA6341] shadow-2xs hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <span>🏡</span>
                <span>回到首頁頂部</span>
              </Link>
            </div>
          </section>
        </article>
      </main>

      {/* ─── 簡約頁尾 (Footer) ─── */}
      <footer className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-12">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div>© 2024–2026 森女孩的話與畫 · FOREST GIRL&apos;S WORDS &amp; ART</div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#BA6341] transition-colors">
              首頁
            </Link>
            <Link href="/about" className="hover:text-[#BA6341] transition-colors font-semibold text-[#262626]">
              關於森女孩
            </Link>
            <Link href="/stories" className="hover:text-[#BA6341] transition-colors">
              山林日誌
            </Link>
            <Link
              href="/#podcast"
              className="hover:text-[#BA6341] transition-colors font-semibold text-[#262626]"
            >
              Podcast
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
