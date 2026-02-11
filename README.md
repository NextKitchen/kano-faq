# Kano FAQ / Help Center

[Kano](https://kano.site) 說明中心專案，以 [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) 建置，部署至 `https://help.kano.site`。

## 專案結構

```
kano-faq-main/
├── .github/workflows/deploy-help-center.yml   # monorepo 部署流程
├── kano-help-center/                          # 說明中心應用
│   ├── src/content/docs/                     # 文件內容 (MDX)
│   ├── docs/                                 # 內部開發文件
│   └── ...
├── README.md
└── PRODUCT_SPEC.md
```

## 開發

```bash
cd kano-help-center
pnpm install
pnpm dev
```

開啟 [http://localhost:4321](http://localhost:4321)。

## 建置

```bash
cd kano-help-center
pnpm build
```

輸出目錄：`kano-help-center/dist`。

## 部署

- **觸發條件**：push 到 `main` 且變更 `kano-help-center/**`，或手動觸發
- **CI/CD**：`.github/workflows/deploy-help-center.yml`（指定 `working-directory: kano-help-center`）
- **部署目標**：Cloudflare Pages，專案名稱 `kano-help-center`
- **必要 Secrets**：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`
- **DNS**：`help.kano.site` CNAME 指向 Cloudflare Pages URL

Cloudflare 儀表板若需設定根目錄，請設為 `kano-help-center`。詳見 [kano-help-center/docs/cloudflare-pages-deploy.md](kano-help-center/docs/cloudflare-pages-deploy.md)。

## 相關文件

| 文件 | 說明 |
|------|------|
| [kano-help-center/README.md](kano-help-center/README.md) | 說明中心技術細節、內容編輯、搜尋 |
| [PRODUCT_SPEC.md](PRODUCT_SPEC.md) | 產品規格、內容結構、FAQ 摘要 |
| [kano-help-center/docs/integration-with-kano-site.md](kano-help-center/docs/integration-with-kano-site.md) | 與 kano.site 主站整合 |
| [kano-help-center/docs/rag-and-agent.md](kano-help-center/docs/rag-and-agent.md) | RAG 資料來源與 chunk 策略（Agent 索引） |
| [kano-help-center/docs/internal-qa-mapping.md](kano-help-center/docs/internal-qa-mapping.md) | 內訓與客服 QA 對照表 |
| [kano-help-center/docs/edit-link-github.md](kano-help-center/docs/edit-link-github.md) | 「編輯此頁」導向 GitHub 設定 |

## 連結

- [Kano](https://kano.site)
- [說明中心](https://help.kano.site)
- [聯絡支援](mailto:support@kano.site)
