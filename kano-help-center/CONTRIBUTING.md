# Contributing to Kano Help Center

Thank you for considering contributing to the Kano Help Center.

## How to contribute

1. Fork the repository (if public) or create a branch.
2. Edit or add content under `src/content/docs/` (or `src/content/docs/en/` for English).
3. Use **MDX** for pages; keep a clear title and description in the frontmatter.
4. Submit a pull request with a short description of the change.

## Content guidelines

- Write in clear, concise 繁體中文 or English.
- Use the existing sidebar structure; new sections can be added in `astro.config.mjs` and as new directories under `src/content/docs/`.
- Link to related pages with relative paths (e.g. `/getting-started/create-first-site`).

### Single-page structure template

Each doc page should be self-contained and follow a consistent structure so that each section can be used as a single chunk for search and AI (RAG):

```mdx
---
title: [用戶會搜尋的標題，60 字內]
description: [補充說明，可含關鍵字]
---

## 概述
[2–3 句點出主題與適用情境]

## [情境/步驟 1]
[具體內容]

## [情境/步驟 2]
[具體內容]

## 常見問題
- **Q: ...** A: ...
- **Q: ...** A: ...

## 相關連結
- [連結 1](/path/)
- [連結 2](/path/)
```

- **One topic per page**: Each MDX file should cover a single, discrete topic.
- **Clear H2/H3 hierarchy**: So each block can be retrieved as one chunk.
- **Self-contained chunks**: Each section should have enough context to answer a question without requiring surrounding text.

### Terminology (用語一致性)

Use the same terms as the product UI and this list. Add new terms here when introducing them.

| 術語 | 說明 |
|------|------|
| 自動儲存 | 系統每 2 秒自動儲存，不需手動按儲存 |
| 草稿 | 未發布的編輯狀態；草稿保留 14 天 |
| Pro 版 / Pro 方案 | 付費方案，支援自訂網域、移除浮水印、進階分析 |
| Kano 子網域 | 例如 `yourname.kano.site` |
| 自訂網域 | 用戶自己購買的網域，如 `www.yoursite.com` |
| 發布 | 將目前編輯內容推送到線上網站 |
| 建站精靈 | 4 步驟建立網站的流程 |
| AI 點數 | 帳號內用於 AI 功能的點數額度 |
| 品牌色（深色/淺色） | # 開頭六位色碼，用於按鈕與主題 |
| 設定 > 追蹤 | 後台設定 FB Pixel、GTM 的位置 |

### SEO and AI-friendly writing

- **Titles**: Include target keywords (e.g. 「Kano 登入失敗」), ideally under 60 characters.
- **First paragraph**: Answer the main question or intent directly.
- **Description**: Use as meta description; keep it concise and keyword-rich.
- **User vocabulary**: Use phrases users actually search for (e.g. 「驗證過期」「按鈕點不了」).

### Troubleshooting pages

For each troubleshooting entry, use this format so it can be retrieved and answered by the Kano Agent:

```mdx
---
title: [錯誤訊息或問題描述]
description: [關鍵字與簡短說明]
---

## 問題
[用戶看到的錯誤或情境]

## 解決步驟
1. ...
2. ...
3. ...

## 若仍無法解決
請聯絡 [support@kano.site](mailto:support@kano.site)。

## 相關連結
- [相關頁面](/path/)
```

## Questions

For product or account questions, contact [support@kano.site](mailto:support@kano.site).
