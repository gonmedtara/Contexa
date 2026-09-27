# Contexa

npm dependency that opens a local web UI to **browse**, **tree-navigate**, and **lint** AI context files in a repository or folder.

Detected files: `AGENTS.md`, `CLAUDE.md`, IDE rule `*.mdc` / `*.md`, `.windsurfrules`, `**/SKILL.md`.

## Use in a project

```bash
npm install -D contexa
npx contexa
```

Optional path (defaults to the current working directory):

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
| **2** (done) | Prompt-engineering lint |
| **3** (done) | Installable npm package + CLI web UI (gate before writes) |
| **4** | Diff + safe writes via git |
| **5** | Visual redesign |

## Architecture (Phases 1–2)

1. **Scanner** (`server/utils/scanner.ts`) — read-only walk → `{ path, type, content, frontmatter? }`.
2. **Parser** (`server/utils/parser.ts`) — YAML + markdown AST + h1/h2 sections.
3. **Lint** (`server/utils/lint/`) — deterministic prompt-engineering rules.
4. **UI** — file tree, frontmatter, accordion sections, lint panel.

## API

- `GET /api/context` — scan + parse (`?repo=` optional).
- `GET /api/lint` — lint issues.

## Stack

Nuxt 4 · TypeScript · `@nuxt/content` / MDC · Nitro.
