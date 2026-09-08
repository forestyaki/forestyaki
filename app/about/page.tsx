import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "關於 Yaki｜森女孩的話與畫",
  description: "嗨，我是 Yaki。長途徒步者、寫字畫畫的人，和一隻小黑狗 Ronnie。",
  openGraph: {
    title: "關於 Yaki｜森女孩的話與畫",
    description: "嗨，我是 Yaki。長途徒步者、寫字畫畫的人，和一隻小黑狗 Ronnie。",
  },
  twitter: {
    card: "summary_large_image",
    title: "關於 Yaki｜森女孩的話與畫",
    description: "嗨，我是 Yaki。長途徒步者、寫字畫畫的人，和一隻小黑狗 Ronnie。",
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
    title: "開始走入百岳與中級山",
    location: "台灣 · 中央山脈與雪山山脈",
    description:
      "從合歡群峰到能高越嶺古道，第一次踩上高山箭竹與巨木林道，喜歡森林裡的泥土氣味，也開始習慣隨身帶一本小本子記錄山林。",
  },
  {
    year: "2021",
    title: "遇見小黑狗 Ronnie",
    location: "台北 / 步道路線",
    description:
      "Ronnie 來到我的生活裡。為了能一起安全地走進自然，開始研究適合毛孩的步道路線，注意坡度、水源與路況，並整理成筆記分享。",
  },
  {
    year: "2022",
    title: "太平洋屋脊步道（PCT）徒步",
    location: "美國西岸 · 4,270 公里",
    description:
      "背著帳篷與行囊，花了幾個月走過加州沙漠、內華達山脈的積雪隘口，一路走到美加邊境。在四千多公里的荒野裡，學會放慢腳步，誠實面對自己。",
  },
  {
    year: "2023",
    title: "紐西蘭 Te Araroa（TA）三千公里徒步",
    location: "紐西蘭南北島 · 3,000 公里",
    description:
      "從北島最北端的雷恩加角，一路走到南島的布拉夫。跨過河流與原始櫸木森林，把一路上的風聲收錄下來，成了日後錄製 Podcast 的養分。",
  },
  {
    year: "2024–至今",
    title: "《森女孩的話與畫》",
    location: "山野與生活日常",
    description:
      "建立了這個網站與 Podcast。把長途徒步的日記、生活散文與畫作整理在這裡，作為一個思想樹洞。",
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
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-[#595550]">
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
            <span>ABOUT YAKI · 關於我</span>
          </div>

          {/* 主標題 (Title) */}
          <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold text-[#262626] leading-tight sm:leading-[1.2] tracking-normal mb-6">
            在這裡安放走過的路，
            <br className="hidden sm:inline" />
            還有那些閃閃發光的平靜日常。
          </h1>

          {/* 前言引導 */}
          <p className="text-lg sm:text-xl font-normal text-[#4A4A4A] leading-relaxed">
            嗨，我是 Yaki。
            <br className="hidden sm:inline" />
            記錄生活的書寫與手作者，也是一名長途徒步與戶外漫遊者。曾與伴侶在太平洋屋脊步道（PCT）走過四千多公里的荒野，如今身邊還有一隻踏著輕快步伐的小黑狗 Ronnie。
          </p>
        </header>

        {/* 寬幅沈靜山野封面大圖 (16:9 比例，帶圓角與柔和陰影) */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-md border border-[#E0D8CB] mb-12 sm:mb-16 bg-[#EBE4D8]">
          <Image
            src="/hero-bg.jpg"
            alt="山林步道上的身影"
            fill
            priority
            className="object-cover object-[50%_40%] saturate-[0.88] contrast-[0.96]"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 sm:left-6 text-xs text-white/95 font-mono tracking-wider backdrop-blur-xs px-3 py-1 rounded-md bg-black/35 border border-white/20">
            Yaki &amp; Ronnie · On the Trail
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
              走路：把生活裡的雜音留在身後
            </h2>
            <div className="space-y-4 text-base font-normal text-[#4A4A4A] leading-relaxed">
              <p>
                在城市裡生活久了，注意力總是被各種訊息和行事曆切割。但走進山徑裡，事情就變得很單純——只要專注在眼前的這一步、下一處水源，還有天黑前的營地。
              </p>
              <p>
                走在太平洋屋脊步道（PCT）的時候，每天除了走路就是吃飯睡覺，身體雖然很累，心裡卻少見地安靜下來。
              </p>
              <p>
                踩在泥土和落葉上的每一步，都讓人感到踏實。在山裡安靜地走著，風和泥土會慢慢洗去生活裡的雜音。
              </p>
            </div>

            {/* 筆記手帳引言框 */}
            <div className="my-6 border-l-2 border-[#BA6341] bg-[#F4EFE6] p-5 rounded-r-2xl">
              <p className="italic text-[#262626] text-base leading-relaxed">
                「登山從來不是為了征服什麼，而是在山林面前，坦然承認自己的渺小，並找回自己的呼吸節奏。」
              </p>
              <span className="block mt-2 text-xs font-mono text-[#595550]">
                — 寫於 PCT High Sierra 營地
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
              寫字與畫畫：記下不想忘記的細節
            </h2>
            <div className="space-y-4 text-base font-normal text-[#4A4A4A] leading-relaxed">
              <p>
                相機能拍下風景的樣子，但有些細節容易被忽略——像是山頂吹過來的冷風、落日時雙手感受到的溫度，還有在營地煮熱水時升起的那一陣白煙。
              </p>
              <p>
                所以我的背包裡總會放著一本水彩速寫本和防水代針筆。走累了在稜線上休息，就拿出本子畫一畫眼前的山稜。
              </p>
              <p>
                手繪的線條也許不完美，但每一筆都是當下的記憶。這個網站就是為了把這些路上的碎片好好收錄起來。
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
              帶狗狗上山：Ronnie 教會我的事
            </h2>
            <div className="space-y-4 text-base font-normal text-[#4A4A4A] leading-relaxed">
              <p>
                我們爬山常常一心想著走到終點或三角點，但小狗不同。路邊一片晃動的樹葉、一窪清澈的小水坑，或者一陣穿過樹林的風，都能讓 Ronnie 停下腳步好奇張望。
              </p>
              <p>
                看著她迎頭走來、耳朵往後甩的樣子，總會提醒我：不要急著趕路，現在這個當下就很好。
              </p>
              <p>
                帶毛孩爬山也是一份責任。我們遵守無痕山林（LNT）原則，避開生態敏感區，只挑選對狗狗友善的路線，並隨時注意她的體力、關節與防蟲保健。
              </p>
            </div>

            {/* Ronnie 拍立得風格卡片 */}
            <div className="mt-6 bg-[#FFFEFA] border border-[#E2DACB] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#F5ECE3] flex items-center justify-center text-3xl shrink-0 shadow-inner">
                🐾
              </div>
              <div className="text-center sm:text-left">
                <div className="text-base font-semibold text-[#262626] mb-1">
                  健行夥伴：Ronnie
                </div>
                <p className="text-xs text-[#595550] leading-relaxed">
                  黑狗 · 山林漫遊中 · 專長：迎頭走來笑盈盈、在泥土路上踩小碎步、提醒大家該停下來吃點心。
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
                    <span className="text-xs font-mono text-[#595550]">
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
            {/* 結語卡片 */}
            <div className="bg-[#FFFEFA] border border-[#E0D7C7] rounded-3xl p-8 sm:p-10 shadow-sm max-w-xl mx-auto mb-10 relative overflow-hidden">
              {/* 紙膠帶裝飾 */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#E5DCB8]/75 transform -rotate-1 border-dashed border-[#D2C59D] border-x pointer-events-none" />

              <p className="text-base sm:text-lg font-medium text-[#262626] leading-relaxed mb-3">
                「走過的路、不想忘記的對話，
                <br />
                還有閃閃發光的日常。」
              </p>
              <div className="text-xs font-mono text-[#595550]">
                — Yaki &amp; Ronnie 🐾
              </div>
            </div>

            {/* 導覽膠囊按鈕 */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/stories"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#233F31] text-[#FAF7F2] font-semibold text-sm hover:bg-[#182C22] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <span>🌲</span>
                <span>看山林日誌</span>
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
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#595550]">
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
