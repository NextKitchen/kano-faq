import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://help.kano.site",
  integrations: [
    starlight({
      title: "Kano Help Center",
      logo: {
        src: "./src/assets/logo.svg",
        alt: "Kano",
        replacesText: true,
      },
      favicon: "/favicon.ico",
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { label: "快速開始", autogenerate: { directory: "getting-started" } },
        { label: "帳號登入與系統操作", autogenerate: { directory: "account-and-login" } },
        { label: "內容與設計編輯", autogenerate: { directory: "content-and-design" } },
        { label: "SEO 與搜尋排名", autogenerate: { directory: "seo-and-ranking" } },
        { label: "流量追蹤工具", autogenerate: { directory: "tracking-tools" } },
        { label: "網域與訂閱方案", autogenerate: { directory: "domain-and-billing" } },
        { label: "應用系統", autogenerate: { directory: "apps" } },
        { label: "常見問題", autogenerate: { directory: "faq" } },
      ],
      locales: {
        root: { label: "繁體中文", lang: "zh-Hant" },
        en: { label: "English", lang: "en" },
      },
      defaultLocale: "root",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/NextKitchen/kano-help-center" },
      ],
      editLink: {
        baseUrl: "https://github.com/NextKitchen/kano-help-center/edit/main/",
      },
      // Search: add Algolia DocSearch when approved (https://docsearch.algolia.com/)
      // plugins: [starlightDocSearch({ appId: '...', apiKey: '...', indexName: '...' })],
      components: {
        Footer: "./src/components/overrides/Footer.astro",
      },
    }),
  ],
});
