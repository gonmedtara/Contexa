# Deploying these docs

Built with **[VitePress](https://vitepress.dev/)**.

## Local

```bash
npm run docs:dev      # http://localhost:5173/Contexa/
npm run docs:build    # docs-site/.vitepress/dist
npm run docs:preview
```

## GitHub Pages — one-time setup (required)

The deploy job fails with **404 / Not Found** until Pages is enabled for Actions:

1. Open [Settings → Pages](https://github.com/gonmedtara/Contexa/settings/pages)
2. **Build and deployment → Source:** **GitHub Actions** (not “Deploy from a branch”)
3. Save — GitHub creates the `github-pages` environment on first deploy
4. Re-run the **Docs** workflow (Actions → Docs → Re-run), or push a docs change

**Live site:** [https://gonmedtara.github.io/Contexa/](https://gonmedtara.github.io/Contexa/)

(`base: '/Contexa/'` is set in `docs-site/.vitepress/config.ts` for project Pages.)

Brand colors are shared with the app via [`brand/tokens.css`](https://github.com/gonmedtara/Contexa/blob/main/brand/tokens.css).

## Workflow

`.github/workflows/docs.yml` builds VitePress and deploys with `actions/deploy-pages`.

## Other hosts

Upload `docs-site/.vitepress/dist` to Cloudflare Pages, Netlify, Vercel, etc.

If you serve from the domain root instead of `/Contexa/`, change `base` to `'/'` in the VitePress config.
