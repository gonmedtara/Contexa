# Contexa

npm dependency that opens a local web UI to browse, tree-navigate, lint, and edit AI context files in a repository or folder.

Detected files include `AGENTS.md`, `CLAUDE.md`, GitHub Copilot instructions, IDE rule files, `.windsurfrules`, and `**/SKILL.md`.

## Use in a project

Install as a dev dependency:

```bash
npm install --save-dev contexa
```

Then launch (scans the current working directory by default):

```bash
npx contexa
```

Or point at another folder:

```bash
npx contexa /path/to/repo
```

The CLI starts a local server and opens the browser. No config file required.

## Develop this repo

```bash
npm install
npm run dev:sample
npm run build
npm start -- ./fixtures/sample-repo
```

## Phases

See [AGENTS.md](./AGENTS.md) and [docs/ROADMAP.md](./docs/ROADMAP.md).

| Phase | Scope |
|-------|--------|
| **1** (done) | Scanner, parser, read-only UI |
| **2** (done) | Prompt-engineering lint (criteria externalized) |
| **3** (done) | Installable npm package + CLI web UI |
| **4** (in progress) | Edit mode (tag templates) + diff + safe writes via git |

## Architecture

1. **Scanner** — read-only walk → typed context files (including Copilot).
2. **Parser** — YAML + markdown AST + h1/h2 sections.
3. **Lint** — rules driven by `criteria/lint.yaml` (overridable via `.contexa/lint.yaml`).
4. **Edit tags** — templates from `criteria/edit-tags.yaml` (MUST/SHOULD, XML blocks, …).
5. **UI** — logo placeholder, file tree, view/edit, lint panel, diff before write.

## Lint criteria

Default criteria ship in [`criteria/lint.yaml`](./criteria/lint.yaml), based on **RFC 2119 / RFC 8174 (BCP 14)**. Host projects may override by adding `.contexa/lint.yaml`.

## API

- `GET /api/context` — scan + parse (`?repo=` optional)
- `GET /api/lint` — lint issues
- `GET /api/edit/tags` — editable tag templates
- `POST /api/write` — apply an edited file (Phase 4; git-aware)

## Stack

Nuxt 4 · TypeScript · `@nuxt/content` / MDC · Nitro.
