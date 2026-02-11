# Kano Agent：RAG 資料來源與 Chunk 策略

本文件說明如何將 Kano 說明中心作為 Kano Agent（說明中心與後台右下角 AI 助手）的 RAG（Retrieval Augmented Generation）知識來源，供開發與維運參考。

## 說明中心嵌入

在 **help.kano.site** 本站右下角已嵌入 Kano Agent 浮動視窗：使用者瀏覽說明中心時可點擊按鈕開啟對話，輸入操作問題後由 AI 基於本說明中心文件即時回答。答案來源為本 RAG 索引，並於入口處註明「答案來自 Kano 說明中心」與 [說明中心連結](https://help.kano.site)。

## 資料來源

- **主要來源**：`https://help.kano.site` 已發布的說明中心頁面。
- **備援/離線來源**：本 repo 的 Markdown/MDX 原始檔，可從 GitHub API 或 raw 取得，例如：
  - `https://github.com/NextKitchen/kano-help-center/blob/main/src/content/docs/` 底下各 `.mdx` 檔案。
- **建議**：以 **單一來源**（help.kano.site 或 GitHub raw）為準，避免重複索引與版本不一致。

## Chunk 策略

為讓 Agent 能精準檢索「一問一答」：

1. **以 H2 為單位**：每個 `## 標題` 底下的內容視為一個 chunk，必要時可再以 H3 細分。
2. **一主題一文件**：`/troubleshooting/` 底下的每篇 MDX 對應單一問題，整篇可視為一個大 chunk 或依「問題 / 解決步驟 / 若仍無法」拆成 2～3 個 chunk。
3. **自包含**：每個 chunk 內應含足夠 context（例如標題、前後一兩句），避免只檢索到片段而無法回答。
4. **Token 上限**：若以 token 數切 chunk，建議單 chunk 約 256～512 tokens，並保留相鄰 chunk 重疊（overlap）約 50 tokens 以維持語意連貫。

## 建議的索引結構

| 欄位 | 說明 |
|------|------|
| `id` | 唯一 ID（如 `troubleshooting-login-verification-expired`） |
| `source` | 來源 URL 或檔案路徑 |
| `title` | 頁面或 H2 標題 |
| `content` | chunk 內文（純文字，strip MD/MDX 語法） |
| `locale` | `zh-Hant` / `en` |

## 後台入口說明

在後台嵌入 Kano Agent 時，建議在入口旁註明：「答案來自 Kano 說明中心」，並提供 [說明中心連結](https://help.kano.site)，讓使用者可進一步查閱或確認。

## 更新流程

- 說明中心內容更新並部署後，RAG 索引需 **重新爬取或增量更新**，Agent 才會反映最新內容。
- **Build**：`pnpm build` 會先執行 `scripts/generate-chunks.mjs` 產生 `public/chunks.json`，再進行 Astro 建置。
- **Ingest**：部署完成後呼叫 `POST https://help.kano.site/api/ingest`，並在 Header 帶上 `Authorization: Bearer <INGEST_SECRET>`。CI 已設定在部署成功後可選用此步驟（需在 GitHub 與 Cloudflare 設定同名 secret）。
- 亦可手動觸發 re-index 或排程定期全量更新（例如每日）。

## 技術備註

- **Vectorize**：需在 Cloudflare 建立 Vectorize index（如 `kano-help-chunks`），並在 wrangler 綁定 `VECTOR_INDEX`。Embedding 使用 Workers AI `@cf/baai/bge-m3`，建立 index 時請依該模型維度設定（如 1024）。
- **Chat API**：`POST /api/chat` 接受 `{ message, locale }`，回傳 `{ answer }`。
