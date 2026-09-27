# Contexa

Browse, lint, and edit AI context files in a repository via a local web UI.

```bash
npm install --save-dev contexa
npx contexa
```

Optional path:

```bash
npx contexa /path/to/repo
```

## What it does

- Discovers AI context files (`AGENTS.md`, `CLAUDE.md`, Copilot instructions, IDE rules, `.windsurfrules`, `SKILL.md`, …)
- Shows them in a file tree
- Lints with externalized criteria (`criteria/lint.yaml`, overridable via `.contexa/lint.yaml`)
- Edit mode with reusable tags (MUST/SHOULD, XML blocks) + diff + optional git commit

## Documentation

Full docs (CLI options, config files, publishing): see the [docs site](./docs-site/) (`npm run docs:dev`).

Quick links in this repo:

- [Publishing to npm](./docs/publishing.md)
- [Configuration reference](./docs/configuration.md)

## Develop

```bash
npm install
npm run dev:sample
npm run build
npm start -- ./fixtures/sample-repo
```

## Stack

Nuxt 4 · TypeScript · Nitro · VitePress (docs)
