# 🌲 森女孩的話與畫 · Forest Yaki

> 走進千米之上的荒野山徑，以文字、手繪與底片記錄自然與生活微光。

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Notion API](https://img.shields.io/badge/Notion-CMS-black?style=flat-square&logo=notion)](https://developers.notion.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://forestyaki.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

🌐 **正式線上網址**：[https://forestyaki.vercel.app](https://forestyaki.vercel.app)

---

## 📖 專案介紹 (About The Project)

**「森女孩的話與畫（Forest Yaki）」** 是一個結合荒野長程縱走紀實、戶外生活觀察、犬伴健行路線與藝術插畫手作的個人品牌網站。

全站採用日系手帳與山林大地色調（Forest Green `#233F31`、Terracotta `#BA6341`、Warm Oatmeal Paper `#FAF7F2`），將個人生活手帳的溫潤親和力，與新聞專題雜誌的高質感編排融為一體，為讀者帶來富有留白呼吸感與沉浸感的閱讀體驗。

---

## ✨ 主要特色 (Key Features)

### 1. 溫馨手帳風格首頁 (Warm Journal Homepage)
* **Hero 意象與實體拍立得卡片**：呈現淡蘭古道中路與毛孩 Ronnie 的漫步合影、貼紙膠帶手帳小語與微互動動態。
* **精選日誌預覽專區（#stories）**：
  * 固定呈現最新 3 篇山林手帳卡片（包含 16:10 圓角封面、平滑 Hover 放大效果、分類標籤、發布日期與嚴格雙行文字摘要 `line-clamp-2`）。
  * 底部配置醒目墨綠色圓角膠囊按鈕「`瀏覽全部山林日誌 →`」，直通專屬文章專題庫。
* **山野光影相簿牆（Trail Film Gallery）**：收錄黃刀鎮極光、巨木擁抱、雪山金頂與圈谷花海等攝影紀實，支援優雅的 Lightbox 燈箱放大檢視。
* **山野迴響與社群（Podcast & Tree Hole）**：整合 Spotify《森女孩的話與畫》精簡播放器與山林樹洞寄信互動機制。

### 2. 《報導者》風格獨立專題頁面 (`/stories` Journal Archive)
* **頂部主打推薦（Featured Hero Banner）**：
  * 自動選取最新發布或標註為 `Featured` 的專題文章。
  * 7:5 寬幅橫幅佈局：左側高解析度封面（含微光脈衝「`焦點專題 · FEATURED`」標籤與發布日期），右側引言導讀、閱讀時間與「`閱讀完整專題`」CTA 按鈕。
* **子分類標籤即時過濾（Category Filter）**：
  * 支援「全部、長程縱走、單日步道、海外遠征、生活散文」等標籤。
  * 整合分類文章計數徽章（如：`全部 6`、`長程縱走 2`）與前端即時流暢重排。
* **完整專題卡片網格（Article Grid）**：桌面版 3 欄、平板 2 欄、手機版單欄自適應排版。

### 3. Notion 無頭 CMS 即時內容同步 (Headless CMS)
* 透過 `@notionhq/client` 與 Notion API 串接，直接以 Notion 作為文章管理後台（支援標題、分類、封面圖、引言、Slug、內文區塊渲染）。
* **ISR 快取更新（Incremental Static Regeneration）**：設定 `revalidate = 60`，兼顧靜態頁面的極速載入優勢與即時發布更新。
* **高可用性優雅回退**：內置高品質真實山林專題備援資料集（`lib/stories.ts`），確保離線或 Notion 資料庫尚未建立時網站依然完整運作。

### 4. 現代 SEO 與 Google Search Console 驗證
* 完整設定 OpenGraph 與 Twitter Card 社群分享卡片。
* 整合 Google 網站驗證標籤（`google-site-verification`），已正式通過 Google Search Console 索引驗證。
* 規範化 URL 與語義化 HTML5 標籤結構，對搜尋引擎極其友善。

---

## 🛠️ 技術棧 (Tech Stack)

| 領域 | 技術 / 工具 | 說明 |
| :--- | :--- | :--- |
| **核心框架** | **Next.js 16.3 (Turbopack)** | 使用 App Router 架構、ISR 快取與 Server Components |
| **開發庫** | **React 19** | 最新 React 元件模型與 Hook 架構 |
| **樣式與設計系統** | **Tailwind CSS v4** | 高度自訂日系手帳大地色系與極致排版控制 |
| **動畫與微互動** | **Motion (Framer Motion v13)** / **GSAP** | 流暢平滑的頁面轉場、卡片彈簧動畫與 Hero 入場動態 |
| **無頭內容管理** | **Notion API** | 以 Notion Database 儲存日誌並透過 SDK 撈取資料 |
| **部署與託管** | **Vercel** | 邊緣網路自動建置、全域 CDN 快取與自動 HTTPS |

---

## 📂 專案目錄架構 (Project Structure)

```text
forest-diary/
├── app/
│   ├── layout.tsx                # 全站根版面 (含 Google 驗證標籤與全站 SEO 設定)
│   ├── page.tsx                  # 首頁 (Server Component，資料獲取)
│   ├── HomeClient.tsx            # 首頁 Client 元件 (Hero, 最新 3 篇手帳, 相簿, Podcast)
│   ├── TrailFilmGallery.tsx      # 山野光影膠卷牆元件
│   ├── about/page.tsx            # 關於森女孩 (YAKI) 品牌介紹頁
│   ├── not-found.tsx             # 404 迷路頁面
│   └── stories/
│       ├── page.tsx              # /stories 獨立列表頁 (ISR 60s)
│       ├── StoriesClient.tsx     # 報導者風格專題列表 (Featured Hero + Filter + Grid)
│       └── [slug]/
│           ├── page.tsx          # 日誌內文頁 (動態載入 Notion 區塊)
│           ├── loading.tsx       # 骨架屏載入動態
│           └── not-found.tsx     # 文章不存在時的手帳提示卡片
├── components/
│   ├── SectionHeader.tsx         # 通用統一區塊標頭元件
│   ├── PhotoLightbox.tsx         # 相片燈箱檢視元件
│   └── NotionRenderer.tsx        # Notion 區塊文字與圖片轉譯器
├── lib/
│   ├── notion.ts                 # Notion Client 封裝與 SDK 查詢邏輯
│   └── stories.ts                # 精選山林備援日誌資料集
└── public/
    ├── images/                   # 真實高畫質山林健行攝影與個人相片
    └── logo.png                  # 森女孩品牌 Logo
```

---

## 🚀 本地開發與快速上手 (Getting Started)

### 1. 複製儲存庫
```bash
git clone https://github.com/forestyaki/forestyaki.git
cd forestyaki
```

### 2. 安裝依賴
```bash
npm install
```

### 3. 設定環境變數
在專案根目錄建立 `.env.local` 檔案，填入您的 Notion 整合資訊：
```env
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://forestyaki.vercel.app
```

### 4. 啟動開發伺服器
```bash
npm run dev
```
開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000) 即可開始瀏覽。

### 5. 生產環境打包測試
```bash
npm run build
npm run start
```

---

## 📋 Notion 資料庫欄位規範 (Notion Database Schema)

若需透過 Notion 即時管理文章，請在您的 Notion Database 中建立以下屬性（Properties）：

| 欄位名稱 | 屬性類型 (Type) | 說明 | 範例 |
| :--- | :--- | :--- | :--- |
| **Title** | `title` | 文章標題 | 走入南太平洋的荒野長征：Te Araroa |
| **Category** | `select` | 文章子分類 | 長程縱走 / 單日步道 / 海外遠征 / 生活散文 |
| **slug** | `rich_text` | 自訂網址代稱 | `te-araroa-new-zealand` |
| **Summary** | `rich_text` | 引言摘要（卡片固定顯示 2 行） | 背上 14 公斤重裝，穿越南阿爾卑斯山的雪嶺... |
| **Date** | `date` | 健行或撰寫日期 | `2024-11-18` |
| **CoverImage** | `url` | 外部封面圖連結（選填） | `https://...` 或直接使用 Notion Page Cover |
| **Published** | `checkbox` | 是否公開發布於網站 | `[x]` 打勾代表發布 |
| **Featured** | `checkbox` | 是否設為本季主打推薦專題 | `[x]` 打勾代表優先呈現於 Hero 橫幅 |

---

## 📬 聯絡與社群 (Connect)

* **官方網站**：[https://forestyaki.vercel.app](https://forestyaki.vercel.app)
* **Instagram**：[@forestyaki](https://www.instagram.com/forestyaki/)
* **Spotify Podcast**：《森女孩的話與畫》

---

## 📄 授權 (License)

本專案之程式碼依據 [MIT License](LICENSE) 條款開放，相片與文字內容著作權由 **森女孩 Yaki** 所有，保留所有權利。
