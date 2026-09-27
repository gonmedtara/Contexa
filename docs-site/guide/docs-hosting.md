# Deploying these docs

This documentation site is built with **[VitePress](https://vitepress.dev/)** — a simple static docs tool that fits libraries well (markdown, search, clean sidebar).

## Why VitePress

| Option | Pros | Cons |
|--------|------|------|
| **VitePress** (chosen) | Simple, fast, great markdown UX, GitHub Pages friendly | Separate from the Nuxt app |
| Nuxt Content docs app | Same stack as Contexa | Heavier for “just docs” |
| Docus / Histoire | Nice for component catalogs | More setup than needed here |

## Local

```bash
npm run docs:dev      # http://localhost:5173
npm run docs:build    # docs-site/.vitepress/dist
npm run docs:preview
```

## GitHub Pages (included)

Workflow: `.github/workflows/docs.yml`

1. Repo **Settings → Pages → Source: GitHub Actions**
2. Push to `main` (or run the workflow manually)
3. Site deploys from `docs-site/.vitepress/dist`

## Other hosts

Upload `docs-site/.vitepress/dist` to any static host:

- Cloudflare Pages
- Netlify
- Vercel (static)
- Any S3 / nginx static bucket

Set the VitePress `base` in `docs-site/.vitepress/config.ts` if the site is not served from the domain root (for example `base: '/contexa/'` for project Pages).
