import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://forest-yaki.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "森女孩的話與畫 ｜ Yaki 的山林手帳與荒野漫遊",
    template: "%s ｜ 森女孩的話與畫",
  },
  description:
    "走進千米之上的荒野山徑，以文字、手繪與底片記錄自然與生活微光。",
  openGraph: {
    title: "森女孩的話與畫 ｜ Yaki 的山林手帳與荒野漫遊",
    description:
      "走進千米之上的荒野山徑，以文字、手繪與底片記錄自然與生活微光。",
    url: siteUrl,
    siteName: "森女孩的話與畫",
    locale: "zh_TW",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&h=630&q=85",
        width: 1200,
        height: 630,
        alt: "森女孩的話與畫 - 山野景致",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "森女孩的話與畫 ｜ Yaki 的山林手帳與荒野漫遊",
    description:
      "走進千米之上的荒野山徑，以文字、手繪與底片記錄自然與生活微光。",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&h=630&q=85",
    ],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Zen+Maru+Gothic:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
