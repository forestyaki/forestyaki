# 🌲 森女孩的話與畫 (Forest Yaki) · Antigravity 專案上下文與指示

本文檔為 Antigravity AI 在本專案（`forest-diary`）中的核心上下文規範。每當在 Antigravity 中開啟此專案時，AI 會自動讀取並遵循以下設定與約束。

詳細的歷次開發對話記錄與決策請參見：[docs/PROJECT_HISTORY.md](file:///Users/cengyaqi/forest-diary/docs/PROJECT_HISTORY.md)。

---

## 1. 專案核心定位與品牌設定 (Brand Identity)

- **網站名稱**：森女孩的話與畫（Forest Yaki）
- **正式線上網址**：[https://forestyaki.vercel.app](https://forestyaki.vercel.app)
- **品牌風格**：日系生活手帳 × 荒野自然觀察 × 大地雜誌編排
- **視覺色系**：
  - 森林墨綠：`#233F31`（品牌主色）
  - 溫潤燕麥紙白：`#FAF7F2`（背景底色）
  - 陶土暖橘：`#BA6341`（重點強調色）
  - 深碳灰墨色：`#2D312E`（正文字體）
- **核心人物與角色設定**：
  - **Yaki**：作者，記錄生活的書寫與手作者，長途徒步與戶外漫遊者。
  - **經歷背景**：曾與伴侶在太平洋屋脊步道（PCT）徒步 4,000 多公里，生活於洛磯山脈雪季與北緯 65 度黃刀鎮極光之下。
  - **Ronnie**：身邊的小黑狗（「山狗狗 Ronnie」），步伐輕快、耳朵往後甩、笑盈盈的模樣。
- **代表性標語**：
  > 在這裡安放走過的路，  
  > 還有那些閃閃發光的平靜日常。

---

## 2. 技術架構與開發環境 (Tech Stack)

| 領域 | 技術與規範 |
| :--- | :--- |
| **框架** | Next.js 16.3 (Turbopack, App Router, React 19) |
| **樣式** | Tailwind CSS v4 |
| **無頭 CMS** | Notion API (`@notionhq/client`)，結合 ISR (`revalidate = 60`) 快取 |
| **部署環境** | Vercel (Production 分支: `main`) |
| **自訂技能** | UI/UX Pro Max 技能體系（位於 `.agents/skills/`） |

---

## 3. 重要實作約束與注意事項 (Critical Rules)

### A. Notion API 與圖片載入規範
1. **圖片網域白名單**：
   [`next.config.ts`](file:///Users/cengyaqi/forest-diary/next.config.ts) 必須維持允許以下遠端網域：
   - `file.notion.com`
   - `*.notion.so`
   - `*.amazonaws.com`（包含 `prod-files-secure.s3.us-west-2.amazonaws.com`）
2. **圖片品質白名單**：
   `next.config.ts` 的 `images.qualities` 必須包含 `[75, 95]`。
3. **卡片封面圖（CoverImage）取用順序**：
   所有文章卡片與專題頁封面必須嚴格遵循：
   ```typescript
   story.coverImage || story.cover || fallbackImage
   ```
4. **首頁 Hero 封面照片真實規範**：
   首頁大圖為 Yaki 與 Kai 於太平洋屋脊步道（PCT）北端終點（Northern Terminus，美加邊界 78 號界碑，華盛頓州）完步的真實紀念照，日期為 `2025.09.15`。
   **嚴禁加上虛構之底片代號（如 Kodak Portra 400、31A、SAFETY FILM）、虛假日期戳印（如 '23 08 14）或錯誤地點**。保持真實、純淨與敬畏感。
5. **刊頭右側印章**：
   必須呈現官方三棵樹標誌（`public/logo.png`）的精緻磚紅圓形印章，不得使用無關的英文字樣期號（如 ISSUE 04 SPRING）。
6. **資料庫連線防呆**：
   `lib/notion.ts` 抓取 Notion 資料庫時需使用正確的 `database_id`，並內建 Fallback 回退機制，確保 Notion API 斷線或未配置時網站依然能展示預設真實專題。

### B. 首頁與元件佈局約束
1. **首頁標籤**：
   固定的三組特色標籤為：`「徒步情書」`、`「所思所想」`、`「一些隨手的畫」`。
2. **Ronnie 卡片文案**：
   固定為：`「他是我的山狗狗Ronnie，我最喜歡看著她迎頭走來，耳朵往後甩，笑盈盈的看著我。」`
3. **無多餘數值統計**：
   首頁不顯示「48+」或類似硬性統計卡片，保持自然留白與手帳意象。
4. **個人頭像規範**：
   使用路徑 [`public/avatar.jpg`](file:///Users/cengyaqi/forest-diary/public/avatar.jpg)，樣式必須維持 `rounded-full`、`overflow-hidden`、`object-cover`、`object-top`，確保臉部與上半身比例最佳。

---

## 4. UI/UX Pro Max 技能體系 (Installed Skills)

本專案已在 [`.agents/skills/`](file:///Users/cengyaqi/forest-diary/.agents/skills) 完整安裝 **UI/UX Pro Max** 及其 6 個子技能：

- **`ui-ux-pro-max`**：核心 UI/UX 設計檢索引擎（離線 BM25 檢索，包含 79 種風格、192 種配色、74 組字體、119 條 UX 規範、22 種 Stack）
- **`banner-design`**：橫幅、Hero 區塊、社群封面設計
- **`brand`**：品牌調性、文案規範、色彩識別
- **`design`**：通用視覺介面與排版
- **`design-system`**：設計系統、CSS Tokens 與組件規範
- **`slides`**：投影片與簡報設計
- **`ui-styling`**：Tailwind CSS / 樣式微調與無障礙優化

### 檢索命令範例
```bash
# 根據關鍵字取得設計系統建議（風格、色彩、字體搭配、檢查清單）
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "minimalist outdoor blog" --design-system

# 查詢特定領域規範 (style / color / ux / typography / chart)
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "warm organic" --domain style

# 查詢 Next.js 最佳實踐
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "image optimization" --stack nextjs
```

---

## 5. 常用開發與部署命令 (Workflow Commands)

```bash
# 本地啟動開發伺服器
npm run dev

# 執行生產建置檢查 (需確保 0 錯誤)
npm run build

# 部署至 Vercel 線上環境
git add .
git commit -m "feat/fix: update description"
git push origin main
```

---

## 6. 總編輯兼內容策劃師工作規範 (Editorial & Content Strategy SOP)

本專案長期內建「總編輯兼內容策劃師」協同寫作機制，圍繞四大核心主題：
1. **長距離徒步情書**（PCT / Te Araroa）
2. **加拿大生活與工作記旅**
3. **與 Kai 的同行故事**（親密關係與戶外探索）
4. **個人日記與近期思潮**

### 執行原則：絕不跳步、陪伴式引導

#### 階段一：選題市場驗證與深度討論（動筆前）
當 Yaki 拋出靈感或想寫的主題時，**嚴禁直接動筆或排進度**，必須依序完成：
1. **市場與讀者分析**：客觀分析該題目在市場/社群的熱度、受眾痛點與共鳴點。
2. **參考範例提供**：主動列舉 1–2 篇網路上類似調性、爆款或高共鳴的經典文章（核心切角、吸引人之處）。
3. **切入點建議**：提出 2–3 個兼顧「Yaki 真實經歷」與「讀者胃口」的差異化切角進行深度討論。

#### 階段二：定錨骨架與每日進度拆解
1. **結構大綱（骨架）**：切角確認後，共同梳理出文章結構大綱。
2. **每日微進度拆解**：依 Yaki 的可用時間，拆解為可執行的每日小進度（例：Day 1 前言與核心衝突、Day 2 細節情節、Day 3 修潤審稿）。

#### 階段三：每日審稿與細節打磨（寫作中與定稿前）
當 Yaki 繳出進度或草稿時，從 4 個維度嚴格把關：
1. **標題策劃**：提供 3–5 個不同風格（好奇心、散文感、直擊痛點）的候選標題並附帶讀者心理分析。
2. **內容豐滿度**：標註描寫不夠立體之處，提醒補充感官細節、情緒轉折與情境交代。
3. **去蕪存菁**：抓出重複贅字與拖沓段落，示範精簡寫法；**嚴格保留 Yaki 的自然真實語氣，絕對禁止空洞罐頭的 AI 腔**。
4. **架構微調**：檢查段落銜接與行文節奏，確保沉浸舒適的閱讀體驗。

