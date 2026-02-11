# Kano 說明中心 — 產品規格

> 建立網頁只是數位轉型的起點，透過數據追蹤與 SEO 優化，才能讓網站真正成為引流的關鍵。

## 內容結構

### 側邊欄分類（`astro.config.mjs`）

| 順序 | 分類 | 目錄 | 說明 |
|------|------|------|------|
| 1 | 快速開始 | `getting-started` | 什麼是 Kano、建立第一個網站、AI 建站、無需程式、SSL、還原 |
| 2 | 帳號登入與系統操作 | `account-and-login` | 登入、自動儲存 |
| 3 | 內容與設計編輯 | `content-and-design` | 模組、AI、圖片、品牌色 |
| 4 | SEO 與搜尋排名 | `seo-and-ranking` | 關鍵字、圖片 ALT、AI 優化、點擊高沒下單 |
| 5 | 流量追蹤工具 | `tracking-tools` | FB Pixel、GTM、故障排除 |
| 6 | 網域與訂閱方案 | `domain-and-billing` | 自訂網域、DNS、Pro 版、取消訂閱、升級退款 |
| 7 | 應用系統 | `apps` | 響應式、地圖訂位、會員、預約 |
| 8 | 故障排除 | `troubleshooting` | 登入、儲存、按鈕、AI、圖片、品牌色、多站 |
| 9 | 常見問題 | `faq` | FAQ 彙整 |

### 多語系

| Locale | 目錄 | 說明 |
|--------|------|------|
| 繁體中文 | `src/content/docs/` (root) | 預設語系 |
| English | `src/content/docs/en/` | 部分頁面已翻譯 |

## FAQ 內容摘要

供客服、內訓與交接快速對照，完整內容請至 [help.kano.site](https://help.kano.site)。

### 帳號登入與系統操作

- **登入失敗：** 若顯示「驗證已過期」，請關閉分頁並確保網址為 `kano.site`，再重新由登入頁點擊「用 Google 登入」。
- **進度儲存：** 系統每 2 秒自動儲存。注意：草稿僅保留 14 天，逾期將自動清理。
- **按鈕無法點擊：** 請檢查各步驟必填項（如品牌名稱、服務圖片、品牌深淺色設定、自訂按鈕網址格式）是否皆已填寫完整。

### 內容與設計編輯

- **AI 功能無法使用：** 請確認帳號內的 AI 點數是否充足，或是否觸發了功能使用頻率限制。
- **圖片規範：** 支援 JPG、PNG、WebP，單檔最大 10MB。如過於頻繁上傳（每分鐘 > 5 次）請稍後再試。
- **品牌色：** 須為 # 開頭的六位數色碼（如 #FF5733）。

### SEO 與搜尋排名

- **如何排在 Google 第一頁？** 關鍵字加入 [地區] + [品牌類型]；圖片 ALT 填入餐點名稱；善用「AI 優化」佈局高流量關鍵字。
- **點擊率高卻沒下單？** 將「聯絡我們」改為「領取今日隱藏優惠」或「預約免排隊」；使用品牌「深色」作為按鈕背景。

### 流量追蹤工具

- **FB Pixel：** 在 [設定] > [追蹤] 貼入 Pixel ID，即可紀錄訪客行為並執行再行銷廣告。
- **GTM：** 貼入 GTM ID 後，可自由裝載 LINE 轉換代碼或 Google 廣告追蹤，無需更動原始碼。

### 網域與訂閱方案

- **網域設定：** 可在 Godaddy 等平台購買。Kano 優勢在於即便沒有購買網域也可以直接發布（使用 Kano 網址）。
- **Pro 版價值：** 支援自訂網域、移除浮水印、提供進階分析工具。
- **取消訂閱：** 網站會運作至到期日為止，到期後降回免費版。

### 平台比較

| 平台 | 優點 | 缺點 | Next Kitchen 顧問點評 |
| :--- | :--- | :--- | :--- |
| **Kano** | 極速建站、餐飲思維、SEO 自動化、數據整合 | 版位較固定 | 最適合追求效率、想快速驗證市場的品牌。 |
| **Portaly** | 適合個人品牌、連結樹狀結構 | 擴充性有限 | 較偏向 Link-in-bio 的跳板頁。 |
| **Wix** | 拖拉自由度極高 | 載入速度慢、SEO 優化門檻高 | 對新手來說選項過多、學習成本高。 |
| **WordPress** | 功能最強大、SEO 天花板高 | 門檻與維護成本極高 | 適合有專屬行銷團隊或工程師的大型企業。 |

## 內容檔案對照

| 分類 | 主要 MDX 檔案 |
|------|---------------|
| getting-started | index, ai-website-builder, create-first-site, how-long-to-launch, no-coding-needed, site-revert, ssl-security |
| account-and-login | index, auto-save, google-login |
| content-and-design | index, ai-features, brand-colors, images, modules |
| seo-and-ranking | index, ai-optimization, high-click-no-order, image-alt, keywords, seo-first-page |
| tracking-tools | index, fb-pixel, gtm, troubleshooting |
| domain-and-billing | index, cancel-subscription, custom-domain, dns-setup, pro-plan, subscription-expiry-data, upgrade-refund |
| apps | index, bookings/*, google-map-booking, membership, responsive-design |
| troubleshooting | index, login-verification-expired, auto-save-draft, button-not-clickable, ai-not-working, image-upload-limits, brand-color-format, multiple-sites-one-account |
| faq | index |

## 內部開發文件（kano-help-center/docs/）

| 文件 | 用途 |
|------|------|
| integration-with-kano-site.md | 主站 /help 導向、sitemap、DNS |
| cloudflare-pages-deploy.md | Cloudflare Pages 建置設定與排錯 |
| edit-link-github.md | 「編輯此頁」baseUrl、monorepo 路徑 |
| rag-and-agent.md | Agent RAG 資料來源、chunk 策略、索引結構 |
| internal-qa-mapping.md | 內訓與客服 QA 對照表、快速連結 |

## 技術規格

- **框架：** Astro 5 + Starlight
- **內容：** MDX，sidebar 由目錄結構自動生成
- **搜尋：** Pagefind（預設）；可選 Algolia DocSearch
- **部署：** Cloudflare Pages，monorepo 根目錄 `kano-help-center`
