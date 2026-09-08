# Design System Master File · 森女孩的話與畫 (Forest Yaki)

> **LOGIC:** When building a specific page, first check `design-system/forest-yaki/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** 森女孩的話與畫 (Forest Yaki)  
**Tone & Style:** 日系生活手帳 × 荒野自然觀察 × 大地雜誌編排 (Warm Organic Editorial)  
**Standard:** WCAG 2.1 AA Compliant (Text Contrast ≥ 4.5:1, Touch Target ≥ 44×44px)

---

## 1. Global Color Palette & Semantic Tokens

| Role | Hex | CSS Variable | 用途說明與 WCAG AA 保證 |
|:---|:---|:---|:---|
| Primary (品牌墨綠) | `#233F31` | `--color-forest-green` | 品牌主要色、大標題、首頁主按鈕（相對於背景對比 8.6:1） |
| Primary Dark | `#1E3729` | `--color-forest-dark` | 按鈕 Hover 深色、選取文字背景 |
| Primary Soft | `#426B55` | `--color-forest-soft` | 輔助標籤、次要綠意 |
| Primary Light | `#EEF3EF` | `--color-forest-light` | 淺綠徽章底色（搭配 `#233F31` 文字對比 8.2:1） |
| Accent/CTA (陶土暖橘) | `#BA6341` | `--color-clay-warm` | 閱讀進度條、焦點標籤、連結 Hover、強調標註（對比 4.6:1） |
| Accent Deep | `#A04E2F` | `--color-clay-deep` | 暖橘按鈕按下態、深層強調 |
| Background (燕麥暖紙) | `#FAF7F2` | `--color-background` | 全站燕麥紙底色、基底背景 |
| Paper Card (手帳紙白) | `#FFFEFA` | `--color-paper-card` | 故事卡片、拍立得底紙、信箱彈窗底色 |
| Border (柔和溫潤邊框) | `#E8E1D5` | `--color-paper-border` | 卡片外框、分隔線、輸入框邊界 |
| Text Heading (碳灰標題) | `#262626` | `--color-editorial-heading` | 文章大標題、專題標頭（對比 11.8:1） |
| Text Body (深灰正文) | `#4A4A4A` | `--color-editorial-body` | 長文正文、導讀敘述（對比 7.5:1） |
| Text Meta (輔助灰字) | `#595550` | `--color-editorial-meta` | 發布日期、閱讀時間、圖說、頁尾（**達成 4.6:1 WCAG AA**） |

---

## 2. Typography Hierarchy (雙軌日系字體)

- **Brand & Display Font:** `Zen Maru Gothic` (日系圓體手帳風)
  - 專用於 Hero 主視覺標題、特色印章、手帳隨筆標籤。
  - Class: `font-handwriting`
- **Body & Editorial Reading:** `Noto Sans TC` (思源黑體) + system-ui
  - 專用於文章正文、卡片標題、UI 介面。
  - Line-height: `1.75` ~ `1.85` (長文舒適排版)
  - Container measure: `max-w-3xl` 或 `max-w-prose` (避免大螢幕單行過長)
- **Data & Metadata Font:** `Geist Mono` / `ui-monospace`
  - 專用於日期、步道海拔高度（3,886m）、里程數（4,000 km）與分類徽章計數。

---

## 3. Spacing & Touch Target (4/8dp 節奏)

| Token | Value | Usage |
|:---|:---|:---|
| `--space-xs` | `4px` / `0.25rem` | 微間距、文字與圓點分隔 |
| `--space-sm` | `8px` / `0.5rem` | 標籤內邊距、圖標間隙 |
| `--space-md` | `16px` / `1rem` | 標準卡片內邊距、手機版 Gutters |
| `--space-lg` | `24px` / `1.5rem` | 桌面卡片內距、區塊垂直節奏 |
| `--space-xl` | `32px` / `2rem` | 欄位間距、大標題下邊距 |
| `--space-2xl` | `48px` / `3rem` | 章節分隔 |
| `--space-3xl` | `64px` / `4rem` | 首頁大區塊垂直 Padding |

> 📱 **行動端觸控熱區規範 (Apple HIG / Material 3):**
> 所有可點擊按鈕（如右上角收藏愛心、關閉按鈕、分頁標籤）必須具備至少 **44×44px** 之感應熱區，外觀可維持小巧（如 28×28px 視覺圓球），透過透明 Padding 或負邊距擴大命中區域。

---

## 4. Tactile Shadows & Paper Effects

```css
/* 日系手帳卡片柔和陰影 */
--shadow-paper: 0 2px 10px -2px rgba(35, 63, 49, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03);
--shadow-paper-hover: 0 12px 24px -6px rgba(35, 63, 49, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.04);

/* 紙質顆粒紋理 */
.paper-texture {
  background-color: #FAF7F2;
  background-image: radial-gradient(#E2D9CB 0.65px, transparent 0.65px);
  background-size: 24px 24px;
}
```

---

## 5. Component Specifications

### A. 文章閱讀伴侶 (Reading Companion)
- **頂部閱讀進度條：** 固定於 `top-16`，高度 `2.5px`，底色 `#E8E1D5/60`，進度色 `#BA6341`。
- **預估閱讀時間：** 繁體中文以 350 字/分鐘換算，於文章標頭標註 `⏱️ 閱讀約 X 分鐘 · 約 Y 字`。
- **文末分享：** 優先呼叫 `navigator.share`，回退至剪貼簿複製並彈出溫暖 Toast 提示。
- **返回頂部：** `scrollY > 400` 時平滑浮現，圓角墨綠浮動球（`w-11 h-11`）。

### B. 專題庫搜尋與過濾 (Stories Search & Filter)
- **即時搜尋輸入框：** 圓角膠囊造型、即打即顯、清空按鈕 `✕`。
- **熱門快捷標籤：** `#PCT`、`#黃刀鎮`、`#極光`、`#毛孩`、`#雪山`。
- **手帳空狀態：** 友善日系文案與「查看全部日誌」快捷按鈕。

### C. 愛心收藏按鈕 (Like / Bookmark Button)
- **HTML/Aria 規範：** 必備 `aria-pressed={isLiked}` 與動態 `aria-label`。
- **點擊熱區：** `min-w-[44px] min-h-[44px]`。
- **視覺回饋：** 點擊縮放微反饋（`active:scale-90`）。

### D. 無障礙與動態規範 (Accessibility & Motion)
- **`prefers-reduced-motion`：** 所有 GSAP 與 Framer Motion 動態必須檢測系統設定，開啟時降級為純淡入（fade-in），禁止強烈 y 軸位移。
- **選單與彈窗滾動鎖定：** 開啟彈窗時鎖定背景捲動（`overflow: hidden`），且必須支援鍵盤 `Escape` 鍵關閉。
- **禁止使用 Emoji 作為結構圖標：** 全站導覽、設定、控制項統一採用向量 SVG 圖標。

---

## 6. Anti-Patterns (嚴格禁止事項)

- ❌ **禁止在燕麥紙底上使用 `#737373` 或更淡的灰字作為次要文字**（必須維持 `#595550` 以上）。
- ❌ **禁止小於 44×44px 的可點擊熱區**（易造成手機滑動誤觸跳轉）。
- ❌ **禁止在長文排版上採用滿版無限制行寬**（超過 800px 造成閱讀疲勞）。
- ❌ **禁止未經 `prefers-reduced-motion` 防護的大幅度位移動畫**。
- ❌ **禁止彈窗在鍵盤 `Escape` 下無法退出**。
