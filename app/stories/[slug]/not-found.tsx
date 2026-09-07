import Link from "next/link";

export default function StoryNotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#4A4A4A] font-sans flex flex-col items-center justify-center p-6 selection:bg-[#E8DDD1] selection:text-[#1E3729]">
      <div className="max-w-md w-full text-center bg-[#FFFEFA] border border-[#E0D7C7] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Washi Tape Accent */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#E5DCB8]/75 transform -rotate-1 border-dashed border-[#D2C59D] border-x pointer-events-none" />

        <div className="text-4xl mb-4">🍃</div>
        <h1 className="text-2xl font-bold text-[#262626] mb-2">
          這篇故事正在山林霧氣中書寫
        </h1>
        <p className="text-sm font-normal text-[#4A4A4A] mb-8 leading-relaxed">
          抱歉，找不到該篇山林日誌。可能是文章代碼有誤，或是文章尚未正式公開發布。
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#stories"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#233F31] text-[#FAF7F2] text-xs font-semibold hover:bg-[#182C22] transition-all shadow-xs"
          >
            <span>🌲</span>
            <span>返回日誌列表</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FAF7F2] border border-[#E0D8CB] text-[#262626] text-xs font-medium hover:border-[#BA6341] transition-all"
          >
            <span>🏡</span>
            <span>回到首頁</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
