import React from "react";

export interface SectionHeaderProps {
  /** 頂部小標文字 (Eyebrow)，例如「山林日誌 · JOURNAL ARCHIVE」 */
  eyebrow?: React.ReactNode;
  /** 主標題 (Title) */
  title: React.ReactNode;
  /** 副標題或前言說明 (Description，選填) */
  description?: React.ReactNode;
  /** 容器額外 class */
  className?: string;
  /** 標題額外 class */
  titleClassName?: string;
  /** 副標額外 class */
  descriptionClassName?: string;
  /** 對齊方式，預設為 left */
  align?: "left" | "center";
}

/**
 * 通用區塊標題元件 (SectionHeader)
 * 遵循 Day 5 設計系統標準：
 * - 頂部小標 (Eyebrow)：左側細橫線 + 陶土橘文字 (#BA6341)、text-xs md:text-sm、font-medium、tracking-widest、全大寫
 * - 主標題 (Title)：全站統一標準黑體 (font-sans)、font-semibold (600)、顏色 text-[#262626]、text-2xl md:text-3xl、leading-snug、tracking-normal
 * - 副標題 (Description)：顏色 text-[#4A4A4A]、font-normal (400)、text-base、leading-relaxed
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  align = "left",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`flex flex-col ${
        isCenter ? "items-center text-center" : "items-start text-left"
      } ${className}`}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-sm font-medium tracking-widest text-[#BA6341] uppercase mb-2">
          <span className="w-5 h-px bg-[#BA6341] shrink-0" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
      )}

      <h2
        className={`font-sans text-2xl md:text-3xl font-bold text-[#262626] tracking-normal leading-snug ${titleClassName}`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-2 text-base font-normal text-[#4A4A4A] leading-relaxed max-w-2xl ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
