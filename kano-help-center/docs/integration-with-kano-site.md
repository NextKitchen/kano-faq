# Integration with kano.site

When you have access to the main kano.site repo (`kano.site-main`), do the following so the main site points to this Help Center.

## 1. Point /help to Help Center

- In `apps/main/app/[locale]/(public)/help/page.tsx`, either:
  - Redirect to `https://help.kano.site` (e.g. with `redirect('https://help.kano.site')` in a server component), or
  - Keep the current landing and set each category card `href` to the corresponding Help Center URL (e.g. `https://help.kano.site/getting-started/`).

## 2. Update sitemap

- In `apps/main/app/sitemap.ts`, add the Help Center base URL to the sitemap or link to it from the main sitemap if you use a sitemap index.

## 3. DNS

- Set `help.kano.site` CNAME to your Cloudflare Pages URL (e.g. `kano-help-center.pages.dev`).

## 4. Editor / settings Help links

- Any in-app Help links (e.g. in the editor or settings) should point to `https://help.kano.site` or a specific path like `https://help.kano.site/zh-Hant/content-and-design/`.
