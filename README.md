# Contexai

Browse, lint, and edit AI context files in a repository via a local web UI.

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

**Live docs:** [https://gonmedtara.github.io/Contexa/](https://gonmedtara.github.io/Contexa/)

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

Brand colors live in [`brand/tokens.css`](./brand/tokens.css) (shared by the app and the docs site).

## Stack

Nuxt 4 · TypeScript · Nitro · VitePress (docs)
