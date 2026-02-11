# 選單（側欄）結構說明 — 內部維護用

說明中心的側欄選單由 **Astro Starlight** 依設定與目錄自動產生，本文件供維護者對照與修改時參考。

---

## 1. 選單定義在哪裡

- **設定檔**：`astro.config.mjs` 內的 `sidebar` 陣列。
- **內容來源**：`src/content/docs/` 底下的目錄與 MDX 檔案；每個 `autogenerate: { directory: "xxx" }` 會對應 `src/content/docs/xxx/`，並依該目錄內的檔案自動列出子項目。

修改選單時需同時處理：(1) 在 `astro.config.mjs` 新增或調整 `sidebar` 項目；(2) 在 `src/content/docs/` 建立對應目錄與檔案。

---

## 2. 目前側欄結構對照表

| 順序 | 側欄顯示名稱       | 對應目錄 (`src/content/docs/`) | 說明           |
|------|--------------------|---------------------------------|----------------|
| 1    | 快速開始           | `getting-started/`              | 入門、建站流程 |
| 2    | 帳號登入與系統操作 | `account-and-login/`            | 登入、儲存     |
| 3    | 內容與設計編輯     | `content-and-design/`           | 模組、AI、圖片 |
| 4    | SEO 與搜尋排名     | `seo-and-ranking/`              | 關鍵字、ALT    |
| 5    | 流量追蹤工具       | `tracking-tools/`               | FB Pixel、GTM  |
| 6    | 網域與訂閱方案     | `domain-and-billing/`           | 網域、Pro、DNS |
| 7    | 應用系統           | `apps/`                         | 預約、擴充     |
| 8    | 故障排除           | `troubleshooting/`              | 常見錯誤解法   |
| 9    | 常見問題           | `faq/`                         | FAQ 彙整       |

---

## 3. 目錄與檔案的對應規則

- 每個區塊對應一個目錄，目錄內的 **`.mdx` 檔案**會自動變成側欄子項目。
- **`index.mdx`**：該區塊的總覽頁，對應 URL 為 `/區塊名/`（例如 `/getting-started/`）。
- 其他檔名會變成 URL 與側欄項目，例如 `getting-started/create-first-site.mdx` → 側欄「建立您的第一個網站」、URL `/getting-started/create-first-site/`。
- 側欄項目**標題**來自各 MDX 的 frontmatter `title`，不是檔名。

---

## 4. 如何新增一個「頂層區塊」

1. 在 **`astro.config.mjs`** 的 `sidebar` 陣列中新增一項，例如：
   ```js
   { label: "新區塊名稱", autogenerate: { directory: "new-section" } },
   ```
2. 在 **`src/content/docs/`** 下建立目錄 `new-section/`，並至少放一個 `index.mdx`（可再放其他 `.mdx`）。
3. 重新 build 後，側欄會出現新區塊與其子頁。

---

## 5. 如何在既有區塊下新增一頁

- 在對應目錄下新增一個 `.mdx` 檔即可，例如在 `src/content/docs/getting-started/` 新增 `new-page.mdx`。
- 不需改 `astro.config.mjs`，Starlight 會依目錄自動把新檔列入側欄；標題依該檔的 frontmatter `title`。

---

## 6. 多語系（英文）說明

- 英文內容放在 **`src/content/docs/en/`**，目錄結構需與繁體對應（例如 `en/getting-started/`、`en/faq/`）。
- 側欄的「區塊」是共用的，同一區塊下會依目前語系顯示對應語言的頁面；若某語系缺少某頁，該頁可能顯示未翻譯提示或連結到另一語系。

---

## 7. 相關檔案一覽

| 用途           | 檔案路徑 |
|----------------|----------|
| 選單設定       | `astro.config.mjs`（`sidebar` 陣列） |
| 繁體內容根目錄 | `src/content/docs/`（不含 `en/`） |
| 英文內容根目錄 | `src/content/docs/en/` |
| 撰寫規範       | `CONTRIBUTING.md` |

---

**最後更新**：依目前 `astro.config.mjs` 與 `src/content/docs/` 結構整理。變更選單或目錄後請同步更新本文件。
