# Contexa

Outil visuel pour inspecter (puis, plus tard, lint et éditer) les fichiers de contexte IA d’un dépôt.

Fichiers détectés : `AGENTS.md`, `CLAUDE.md`, règles IDE `*.mdc` / `*.md`, `.windsurfrules`, `**/SKILL.md`.

## Démarrage

```bash
npm install
npm run dev:sample
```

Ou sur un dépôt quelconque :

```bash
npm run dev -- /chemin/vers/depot
```

Sans argument, le dossier courant est scanné (zéro-config).

## Phases

Voir [AGENTS.md](./AGENTS.md) et [docs/ROADMAP.md](./docs/ROADMAP.md).

| Phase | Contenu |
|-------|---------|
| **1** (faite) | Scanner, parser, UI lecture seule |
| **2** (faite) | Linting prompt-engineering |
| **3** | Diff + écriture sécurisée via git |
| **4** | Refonte visuelle |

## Architecture Phase 1

1. **Scanner** (`server/utils/scanner.ts`) — parcours lecture seule → `{ path, type, content, frontmatter? }`.
2. **Parser** (`server/utils/parser.ts`) — YAML + AST markdown + sections h1/h2.
3. **UI** — liste, frontmatter lisible, sections pliables (`ContentRenderer`).

## API

- `GET /api/context` — scan + parse (`?repo=` optionnel).
- `GET /api/lint` — issues de lint (Phase 2).

## Stack

Nuxt 4 (structure app compatible Nuxt 3) · TypeScript · `@nuxt/content` / MDC · Nitro.
