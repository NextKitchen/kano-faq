# Cloudflare Pages 部署設定

若建置失敗（`build command exited with code: 1`），請依下列步驟檢查：

## 1. 環境變數（Cloudflare 儀表板）

在 Pages 專案 → **設定** → **環境變數** 中新增：

| 變數名稱 | 值 | 說明 |
|----------|-----|------|
| `NODE_VERSION` | `20` | 指定 Node.js 版本 |
| `PNPM_VERSION` | `9` | 指定 pnpm 版本（可選） |

## 2. 建置設定

| 設定項 | 值 |
|--------|-----|
| 建置指令 | `pnpm build` |
| 建置輸出目錄 | `dist` |
| 根目錄 | 若倉庫為 `kano-faq-main`，請設為 `kano-help-center` |

## 3. 專案結構

- 若連接到 **`kano-faq-main`** 倉庫：**根目錄** 必須設為 `kano-help-center`
- 若連接到 **`kano-help-center`** 倉庫：根目錄留空

## 4. 已加入的設定檔

- `.nvmrc`：指定 Node 20
- `package.json` 的 `engines` 與 `packageManager`

## 5. Rate Limit（/api/chat 每 IP 每分鐘 5 次）

若要啟用 Chat API 的 rate limit，請在 Pages 專案 → **設定** → **Functions** → **KV 命名空間綁定** 中新增：

| 變數名稱 | KV 命名空間 |
|----------|-------------|
| `RATE_LIMIT_KV` | 建立新的 KV namespace 或選擇既有者 |

若未設定此綁定，則不進行 rate limit（所有請求皆放行）。

## 6. 若仍失敗

請到 Cloudflare Pages 的 **部署** → 點選失敗的部署 → 查看 **完整建置日誌**，將錯誤訊息回報以進一步排查。
