<p align="center">
  <img src="brand/icon.png" alt="Contexai" width="96" height="96">
</p>

<h1 align="center">Contexai</h1>

<p align="center">Browse, lint, and edit AI context files in a repository via a local web UI.</p>

<p align="center">
  <img src="docs/images/contexai-ui.png" alt="Contexai app screenshot" width="900">
</p>

```bash
npm install --save-dev contexai
npx contexai
```

Optional path:

```bash
npx contexai /path/to/repo
```

## What it does

- Discovers AI context files (`AGENTS.md`, `CLAUDE.md`, Copilot instructions, IDE rules, `.windsurfrules`, `SKILL.md`, …)
- Shows them in a file tree
- Lints with externalized criteria (`criteria/lint.yaml`, overridable via `.contexai/lint.yaml`)
- Edit mode with reusable tags (frontmatter, MUST/SHOULD, XML blocks) + diff + save

## Documentation

**Live docs:** [https://gonmedtara.github.io/Contexai/](https://gonmedtara.github.io/Contexai/)

Local preview: `npm run docs:dev` (sources in `docs-site/`).

Also in this repo:

- [Publishing to npm](./docs/publishing.md)
- [Configuration reference](./docs/configuration.md)

## Develop

```bash
npm install
npm run dev:sample
npm run build
npm start -- ./fixtures/sample-repo
```

Brand assets: [`brand/icon.png`](./brand/icon.png) · colors in [`brand/tokens.css`](./brand/tokens.css).

## Stack

Nuxt 4 · TypeScript · Nitro · VitePress (docs)
