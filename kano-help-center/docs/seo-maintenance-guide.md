# 說明中心 SEO 維護指南（內部）

本文件說明 **Kano 說明中心（help.kano.site）** 的 SEO 設定方式，以及日常維護與新增文件時需要注意的事項，給產品 / 內容 / 工程同仁參考。

---

## 一、系統層 SEO 設定總覽

- **框架**：Astro + Starlight
- **網址**：`https://help.kano.site`
- **主要機制**：
  - **Meta title / description**：由各頁 MDX frontmatter 的 `title`、`description` 自動帶入
  - **Canonical**：Starlight 依路由自動產生 `<link rel="canonical">`
  - **多語系 hreflang**：依 `locales` 設定自動產生 `<link rel="alternate" hreflang="...">`
  - **Open Graph / Twitter meta**：由 Starlight 預設 + `astro.config.mjs` 內全域 `head` 設定
  - **Sitemap**：`@astrojs/sitemap` 於 build 時產生 `sitemap-index.xml`
  - **robots.txt**：手動維護於 `kano-help-center/public/robots.txt`
  - **結構化資料（JSON-LD）**：自訂 `Head.astro` 輸出 FAQPage / Article / WebSite / BreadcrumbList

### 1.1 相關檔案位置

- **Astro / Starlight 設定**：`kano-help-center/astro.config.mjs`
- **Head 覆寫（JSON-LD 等）**：`kano-help-center/src/components/overrides/Head.astro`
- **內容集合定義**：`kano-help-center/src/content.config.ts`
- **中文內容**：`kano-help-center/src/content/docs/`
- **英文內容**：`kano-help-center/src/content/docs/en/`
- **robots.txt**：`kano-help-center/public/robots.txt`

---

## 二、內容編輯時的 SEO 寫作規範

以下規範主要適用於 `src/content/docs/**/*.mdx`（中英文皆同），細節可搭配 `CONTRIBUTING.md`。

### 2.1 Frontmatter：title / description

- **title**
  - 包含使用者實際會搜尋的關鍵字（錯誤訊息、情境、品牌詞）
  - 建議 60 字元以內（中文可略短），清楚知道「這篇解決什麼問題」
  - 例：`title: 登入時顯示「驗證已過期」該怎麼辦？`

- **description**
  - 當作 Meta Description，約 80–120 字元，點出主題 + 1–2 個關鍵字組合
  - 第一句直接回答「這篇可以幫我解決什麼？」
  - 例（中文）：  
    `description: Kano 說明中心：登入失敗、驗證過期、自動儲存、草稿保留、按鈕無法點擊等帳號與系統操作常見問題解答。`
  - 例（英文，有冒號請以引號包住）：  
    `description: "Kano FAQ: login, site creation, AI, images, SEO, tracking, domain & billing, plan comparison. Frequently asked questions and answers."`

> **注意**：description 內若包含 `:`，請整段用引號包起來，避免 YAML 解析錯誤。

### 2.2 文章結構

- **一頁一主題**：每個 MDX 只處理單一明確問題或主題（例如「登入驗證過期」或「圖片 ALT 設定」）
- **H2/H3 層級清楚**：方便 Pagefind 搜尋與 RAG chunk
  - `## 概述`：2–3 句說明適用情境與解決什麼問題
  - `## 解決步驟 / 操作說明`：以條列或步驟呈現
  - `## 常見問題`：Q&A 形式補充
  - `## 相關連結`：連到其他說明中心頁面
- **自我完備**：每個區塊自成段落，RAG 抽到單一區塊時仍看得懂

### 2.3 關鍵字與用語

- 以使用者語言為主，而不是內部術語：
  - ✅「按鈕點不了」「登入驗證過期」  
  - ❌「CTA」、「token 失效」作為主標題
- 在以下位置自然出現關鍵字：
  - 標題（title）
  - 第一段（概述）
  - 小節標題（H2/H3）
  - 錯誤訊息請照畫面原文撰寫（方便全文搜尋）

### 2.4 內部連結與導覽

- 若同主題有「總覽」與「細節」，請互相連結：
  - 例：`/seo-and-ranking/` ↔ `/seo-and-ranking/seo-first-page/`
- FAQ / 故障排除頁面，優先連回：
  - 對應的操作教學（如建站流程、網域設定）
  - 對應的 SEO / 追蹤工具頁面

---

## 三、目前技術 SEO 實作細節

### 3.1 Sitemap 與 robots.txt

- **Sitemap**
  - 由 `@astrojs/sitemap` 產生 `sitemap-index.xml`（內含 `sitemap-0.xml`）
  - 設定位置：`astro.config.mjs` → `integrations: [sitemap(), starlight({ ... })]`
- **robots.txt**
  - 位置：`public/robots.txt`
  - 目前內容（如需修改，請同步與產品 / SEO 討論）：
    - `User-agent: *`
    - `Allow: /`
    - `Sitemap: https://help.kano.site/sitemap-index.xml`

### 3.2 Head / meta 與 JSON-LD

- **Head 來源**
  - Starlight 預設透過 frontmatter 建立：
    - `<title>`
    - `<meta name="description">`
    - `<meta property="og:title">`、`og:description`、`og:url`、`og:site_name`
    - `<link rel="canonical">`
    - `<link rel="alternate" hreflang="...">`
  - `astro.config.mjs` 中的 `head` 可再補充：
    - `meta name="author" content="Kano"`
    - `meta property="og:type" content="website"`
    - `meta property="og:site_name" content="Kano Help Center"`
    - `meta name="twitter:card" content="summary_large_image"`

- **自訂 Head 覆寫：`Head.astro`**
  - 位置：`src/components/overrides/Head.astro`
  - 功能：在保留原有 head tag 的前提下，額外輸出 JSON-LD：
    - `BreadcrumbList`：首頁 + 當前頁面
    - `FAQPage`：`/faq/` 與 `/en/faq/`
    - `WebSite`：首頁 `/`、`/en/`
    - `Article`：一般文件頁（大部分 docs）

> **原則**：若非必要，不直接改 Starlight 核心邏輯；優先透過 frontmatter、`astro.config.mjs` 的 `head`、以及 `Head.astro` 維護。

---

## 四、新增或修改內容時的 Checklist

新增／調整 MDX 時，請至少確認以下項目：

- **Frontmatter**
  - **title**：包含關鍵字，60 字內，符合 UI 文案
  - **description**：80–120 字，點出主題與關鍵字；若含 `:` 記得加引號
- **結構**
  - 有 `## 概述`，首段直接說明這篇在解決什麼
  - H2/H3 層級合理，方便搜尋與 RAG
- **連結**
  - 有連到相關頁面（教學、FAQ、故障排除）
  - 故障排除頁面有「相關連結」區塊
- **多語系（若有英文版）**
  - 英文 `title` / `description` 意圖與中文版對齊
  - 路徑結構對應（`/path/` ↔ `/en/path/`）

---

## 五、部署前驗證流程

每次對 SEO 設定或大量內容調整後，建議在本機或預覽環境做以下檢查：

1. **建置**
   - 在 `kano-help-center/` 執行：
     - `pnpm build`
2. **檢查 sitemap / robots**
   - 檢視 `dist/sitemap-index.xml`、`dist/sitemap-0.xml`
   - 檢視 `dist/robots.txt` 是否仍為預期內容
3. **抽查幾個重點頁面**
   - 首頁 `/`、`/en/`
   - `/seo-and-ranking/`、`/seo-and-ranking/seo-first-page/`
   - `/faq/`、`/troubleshooting/`
   - 查看頁面 `<head>`：
     - title / meta description 是否合理
     - canonical / hreflang 是否存在且正確
     - 是否有預期的 JSON-LD（FAQ / Article / WebSite / BreadcrumbList）
4. **搜尋體驗**
   - 使用頁面內搜尋（Pagefind）測試幾個關鍵字：
     - 「登入驗證過期」「圖片 ALT」「SEO 第一頁」等
   - 確認能找到正確頁面與區塊

---

## 六、何時要找工程協助？

以下情境建議找工程確認或協作：

- 要新增新的 JSON-LD 類型（例如 `HowTo` 或更多 FAQ 條目自動化）
- 要調整 sitemap 規則（排除某些路徑、改結構）
- 要更改 `Head.astro` 行為（例如改 Breadcrumb 結構、切換 og:type 策略）
- 要接第三方 SEO / 分析工具（例如新增 script 或額外 meta）

一般新增／修改文件內容（含 title / description / 內文結構）則可由內容或產品同仁直接依本文件維護。

