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
  process.env.NEXT_PUBLIC_SITE_URL || "https://forestyaki.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "森女孩的話與畫｜Yaki 的山林日誌與戶外創作",
    template: "%s｜森女孩的話與畫",
  },
  description: "走路、看書、畫畫，和黑狗 Ronnie 的山林日常。記錄長途徒步與生活散文。",
  verification: {
    google: "ViCWedDJe-0R04f0QeKsAEh6dbBKjZFsT3kOWYwIhxE",
  },
  openGraph: {
    title: "森女孩的話與畫｜Yaki 的山林日誌與戶外創作",
    description: "走路、看書、畫畫，和黑狗 Ronnie 的山林日常。記錄長途徒步與生活散文。",
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
    title: "森女孩的話與畫｜Yaki 的山林日誌與戶外創作",
    description: "走路、看書、畫畫，和黑狗 Ronnie 的山林日常。記錄長途徒步與生活散文。",
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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="ViCWedDJe-0R04f0QeKsAEh6dbBKjZFsT3kOWYwIhxE"
        />
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
