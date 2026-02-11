# 「編輯此頁」導向 GitHub 設定

說明中心頁尾的「編輯頁面」會連到 GitHub 上對應檔案的編輯頁面，讓訪客可以建議修改（與 [Cloudflare Docs](https://developers.cloudflare.com/) 相同做法）。若沒有寫入權限，GitHub 會顯示「You need to fork this repository to propose changes」，訪客可 fork 後提 PR。

## 為何會出現 404？

點「編輯頁面」後若出現 GitHub 404，通常代表：

1. **Repo 不存在** — 設定的 `editLink.baseUrl` 指向的倉庫（如 `NextKitchen/kano-help-center`）尚未建立或網址錯誤。
2. **Repo 為私人** — 倉庫存在但為 private，目前登入帳號沒有權限會看到 404。
3. **分支名稱不符** — `baseUrl` 裡寫的是 `main`，但該 repo 預設分支是 `master` 或其他名稱。
4. **路徑不符（monorepo）** — 若說明中心程式碼在「某 repo 的子目錄」（例如 `kano-faq-main/kano-help-center/`），`baseUrl` 必須包含該子目錄，否則路徑會錯。

## 正確設定 baseUrl

在 `astro.config.mjs` 的 `editLink.baseUrl`：

- **獨立 repo**（整個 repo 就是 kano-help-center）  
  例如：`https://github.com/NextKitchen/kano-help-center/edit/main/`  
  最終連結會是：`baseUrl` + `src/content/docs/.../xxx.mdx`。

- **Monorepo 子目錄**（例如 repo 為 `kano-faq-main`，說明中心在 `kano-help-center/`）  
  設為：`https://github.com/NextKitchen/kano-faq-main/edit/main/kano-help-center/`  
  最終連結會是：`.../kano-help-center/src/content/docs/.../xxx.mdx`。

## 用環境變數覆寫（選用）

建置時可設定 `PUBLIC_EDIT_LINK_BASE_URL` 覆寫預設 baseUrl，例如：

```bash
PUBLIC_EDIT_LINK_BASE_URL="https://github.com/NextKitchen/kano-faq-main/edit/main/kano-help-center/" pnpm build
```

或在 `.env`：

```
PUBLIC_EDIT_LINK_BASE_URL=https://github.com/NextKitchen/kano-faq-main/edit/main/kano-help-center/
```

## 與 Cloudflare Docs 相同的行為

一旦 `baseUrl` 指向**存在且為 public** 的 GitHub repo：

- 有寫入權限的使用者：會進入該檔案的編輯畫面。
- 無寫入權限的使用者：GitHub 會顯示「You need to fork this repository to propose changes」與「Fork this repository」按鈕，無需額外實作。
