# 🌲 Forest Yaki · 完整開發歷程與對話記錄 (Project History & Decision Log)

本文檔記錄了 **「森女孩的話與畫（Forest Yaki）」** 專案在本次對話中的完整開發歷程、技術決策、Bug 修復細節與功能改動。

---

## 📑 目錄
1. [專案概覽](#專案概覽)
2. [歷次對話與開發改動記錄](#歷次對話與開發改動記錄)
   - [階段一：Notion 圖片網域白名單設定](#階段一notion-圖片網域白名單設定)
   - [階段二：Notion API 資料庫 ID 排錯與圖片品質警告](#階段二notion-api-資料庫-id-排錯與圖片品質警告)
   - [階段三：首頁卡片 CoverImage 讀取與渲染修復](#階段三首頁卡片-coverimage-讀取與渲染修復)
   - [階段四：首頁文案、分類標籤與裝飾調整](#階段四首頁文案分類標籤與裝飾調整)
   - [階段五：刪除首頁 48+ 數據卡片](#階段五刪除首頁-48-數據卡片)
   - [階段六：「關於森女孩」自我介紹大更新](#階段六關於森女孩自我介紹大更新)
   - [階段七：關於區塊大標題折行美化](#階段七關於區塊大標題折行美化)
   - [階段八：個人圓形頭像替換與排版優化](#階段八個人圓形頭像替換與排版優化)
   - [階段九：Git 追蹤與 Vercel 線上正式發布](#階段九git-追蹤與-vercel-線上正式發布)
   - [階段十：安裝 UI/UX Pro Max 技能生態系](#階段十安裝-uiux-pro-max-技能生態系)
3. [目前網站技術狀態總結](#目前網站技術狀態總結)

---

## 專案概覽
- **專案名稱**：森女孩的話與畫 · Forest Yaki
- **線上網址**：[https://forestyaki.vercel.app](https://forestyaki.vercel.app)
- **核心技術**：Next.js 16.3 (Turbopack, App Router)、React 19、Tailwind CSS v4、TypeScript
- **內容後台**：Notion API Headless CMS（自動同步文章、標籤、封面與內文區塊）

---

## 歷次對話與開發改動記錄

### 階段一：Notion 圖片網域白名單設定
- **需求目標**：Notion 上傳的圖片網域為 `file.notion.com`，需加入 Next.js 圖片安全白名單。
- **改動檔案**：[`next.config.ts`](file:///Users/cengyaqi/forest-diary/next.config.ts)
- **實作內容**：
  在 `images.remotePatterns` 加入：
  ```typescript
  {
    protocol: "https",
    hostname: "file.notion.com",
  }
  ```

---

### 階段二：Notion API 資料庫 ID 排錯與圖片品質警告
- **問題回報**：
  1. Notion API 抓取回報錯誤：`"Provided database_id is a page, not a database. Use the pages API instead, or pass the ID of the database itself."`
  2. Next.js 警告：`Image with src "/hero-bg.jpg" is using quality "95" which is not configured in images.qualities [75]`
- **解決方案**：
  1. **Notion API**：檢查並改進 [`lib/notion.ts`](file:///Users/cengyaqi/forest-diary/lib/notion.ts)，確保處理 `NOTION_DATABASE_ID` 時能精準抓取資料庫（Database），並強化錯誤回退至本機預設日誌（Fallback Stories），避免網站崩潰。
  2. **圖片品質與網域**：在 `next.config.ts` 中配置 `images.qualities: [75, 95]`，並補齊 `*.notion.so` 與 `*.amazonaws.com`（S3）支援。

---

### 階段三：首頁卡片 CoverImage 讀取與渲染修復
- **問題現象**：首頁文章卡片依然顯示預設落磯山景圖，未渲染 Notion 回傳的 `CoverImage`。
- **解決方案**：
  1. **[`lib/notion.ts`](file:///Users/cengyaqi/forest-diary/lib/notion.ts)**：在解析 Notion 頁面屬性時，正確讀取名為 `"CoverImage"` 的 Files/URL 屬性，指派給 story 物件的 `coverImage` 欄位。
  2. **[`components/JournalCard.tsx`](file:///Users/cengyaqi/forest-diary/components/JournalCard.tsx)**（或首頁對應卡片元件）：
     - 調整封面讀取優先級：`story.coverImage || story.cover || fallbackImage`。
     - 確保 Next.js `<Image>` 正確處理外部網址或經由 `/api/notion-image` 代理優化載入。

---

### 階段四：首頁文案、分類標籤與裝飾調整
- **文案修訂**：
  - 上方標籤更新為：**「徒步情書、所思所想、一些隨手的畫」**。
  - 首頁主內文更新為：
    > 「我喜歡走路，看書，和愛人與小狗待在一起  
    > 這裡是我的思想樹洞  
    > 記錄走過的路、不想忘記的對話  
    > 還有閃閃發光的日常」
  - 狗狗 Ronnie 卡片文案更新為：
    > 「他是我的山狗狗Ronnie，我最喜歡看著她迎頭走來，耳朵往後甩，笑盈盈的看著我。」
  - 裝飾元素移除：清理了多餘的圖片裝飾物，回歸純淨的手帳留白美感。

---

### 階段五：刪除首頁 48+ 數據卡片
- **需求**：移除包含「48+ 百岳與古道」、「32條 犬伴友善路線」、「100%」的白色統計數據卡片容器。
- **改動**：在 [`app/page.tsx`](file:///Users/cengyaqi/forest-diary/app/page.tsx) 中完全刪除該 JSX 容器，使 Hero 底部自然留白，維持極簡山林氣息。

---

### 階段六：「關於森女孩」自我介紹大更新
- **改動位置**：[`app/page.tsx`](file:///Users/cengyaqi/forest-diary/app/page.tsx) 或關於區塊元件。
- **自我介紹替換為**：
  > 嗨，我是 Yaki。記錄生活的書寫與手作者，也是一名長途徒步與戶外漫遊者。  
  >  
  > 曾與伴侶在太平洋屋脊步道（PCT）走過四千多公里的荒野，在洛磯山脈的雪季與北緯65度的極光間生活。如今的路上，身邊還有踏著輕快步伐的小黑狗 Ronnie，我們著迷於在山林裡安靜地走著，讓風和泥土慢慢洗去生活裡的雜音。  
  >  
  > 在這裡，我用紙筆、色彩與鏡頭，整理步道上的風霜與微光、夥伴與毛孩同行的日常，以及雙手創作帶來的平靜。願這些文字與畫面，能為你帶來一片寧靜的山林綠意。
- **卡片清理**：刪除文案下方原本的「🌲 穿梭山林」、「🐾 犬伴健行」、「🎨 手繪創作」等 3 張卡片，使閱讀焦點集中於文字。

---

### 階段七：關於區塊大標題折行美化
- **原本標題**：「在城市與山嶺交界的邊緣，記錄文字與畫筆帶來的平靜。」
- **更新為自然折行的兩行詩意標題**：
  ```
  在這裡安放走過的路，
  還有那些閃閃發光的平靜日常。
  ```

---

### 階段八：個人圓形頭像替換與排版優化
- **需求**：使用用戶提供的真實照片 [`public/avatar.jpg`](file:///Users/cengyaqi/forest-diary/public/avatar.jpg)。
- **改動**：
  - 替換原本的綠色小樹 icon 為 `<Image src="/avatar.jpg" ... />`。
  - 設定樣式：`rounded-full`、`overflow-hidden`、`object-cover`、`object-top`，確保人臉比例置中且視覺溫潤自然。
  - 清理多餘的標籤，保持極簡乾淨。

---

### 階段九：Git 追蹤與 Vercel 線上正式發布
- **問題**：本機成功顯示頭像，但線上網址 `forestyaki.vercel.app` 仍為舊版。
- **解決動作**：
  1. `git add public/avatar.jpg` 與所有已變更程式碼。
  2. 執行 `git commit -m "feat: update avatar and about section content"`。
  3. `git push origin main` 推送到遠端倉庫，觸發 Vercel 自動 CI/CD 構建並發布上線。

---

### 階段十：安裝 UI/UX Pro Max 技能生態系
- **來源倉庫**：[https://github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- **安裝目標**：
  1. **工作區層級**：[`.agents/skills/`](file:///Users/cengyaqi/forest-diary/.agents/skills)
  2. **全域層級**：`~/.gemini/config/skills/`
- **安裝技能組合**（共 7 個）：
  - `ui-ux-pro-max`：核心 AI UI/UX 設計檢索引擎（內建 79 種風格、192 種調色盤、74 組字型、119 條 UX 規範、22 種 Stack 指南）。
  - `banner-design`：橫幅、社群封面、Hero 視覺設計。
  - `brand`：品牌語調、識別與規範。
  - `design`：通用介面與佈局設計。
  - `design-system`：設計系統建置與 Token 管理。
  - `slides`：簡報與投影片設計。
  - `ui-styling`：樣式與 Tailwind/CSS 調優。
- **驗證**：已執行 `search.py` BM25 檢索驗證與 `npm run build` 構建驗證，全數通過。

---

## 2026-09-08 · UI/UX 全面調優與「日系戶外獨立雜誌風」正式升級為首頁

### 1. 需求與背景
- 使用者希望優化全站 UI/UX，並表示既有版型略帶 AI 模板感，希望能有更具個性與質感的日系獨立刊物風格。
- 採用了 UI/UX Pro Max 技能體系指導，設計「日系戶外獨立雜誌風（Earthy Editorial Magazine）」。
- 使用者深度滿意新提案，並要求直接取代既有首頁，同時妥善保留原版供隨時回退。

### 2. 主要變更與架構
1. **日系戶外獨立雜誌風格（Earthy Editorial Magazine）正式升級為首頁**：
   - 路由：[`app/page.tsx`](file:///Users/cengyaqi/forest-diary/app/page.tsx) 正式指向 [`MagazineHomeClient`](file:///Users/cengyaqi/forest-diary/app/magazine/MagazineHomeClient.tsx)。
   - 視覺排版：不對稱 7:5 黃金雜誌版型、Drop Cap 手刻首字下沉、日文豎排語錄、35mm 底片印樣聯頁（Contact Sheet Film Reel with Kodak/Cinestill 標籤）、山狗狗 Ronnie 拍立得手記、跨版專題呼吸引言（Pull Quotes）。
2. **經典手帳典藏版完整保留（Zero-risk Safe Archive）**：
   - 獨立開闢路由 [`/classic`](file:///Users/cengyaqi/forest-diary/app/classic/page.tsx)，保留原版完整功能與排版。
   - 雙版本頂部導覽列與頁腳均配置無縫切換按鈕，使用者隨時能前往 `/classic` 重溫或比對。
3. **全站 UI/UX 深度優化**：
   - **WCAG AA 對比度**：`--editorial-meta` 調校至 `#595550`（4.6:1 對比度）。
   - **文章閱讀伴侶（Story Reading Companion）**：字數估算、黏性陶土橘進度條、Web Share API 原生分享與平滑回頂部。
   - **專題庫即時搜尋**：即時搜尋框與 `#PCT`、`#黃刀鎮`、`#雪山` 快捷標籤。
   - **無障礙與觸控**：44px 觸控熱區、彈窗 Escape 鍵與滾動鎖定、尊重 `prefers-reduced-motion`。
4. **驗證**：
   - `npm run build` 通過，9 個頁面均以 ISR (1m) 靜態最佳化編譯完成，0 錯誤。

