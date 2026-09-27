# Contexa roadmap

Status tracking for delivery phases. Keep this file in English.

| Phase | Goal | Status |
|-------|------|--------|
| 1 | Scanner + parser + read-only UI | Done |
| 2 | Prompt-engineering lint engine (external criteria) | Done |
| 3 | Installable npm package + CLI opens web UI | Done |
| 4 | Edit tags + diff + safe writes via git | In progress |

**Hard gate:** Phase 3 (npm dependency UX) must stay valid before Phase 4 writes.

> Visual redesign is **out of scope**. Use the logo placeholder in the UI; replace `public/logo.svg` when the final mark is ready.

## Phase 1 — detail

1. Scaffold Nuxt + TypeScript.
2. Shared types + server scanner.
3. Frontmatter / AST / sections parser.
4. `GET /api/context` + CLI folder path.
5. Read-only UI (tree, frontmatter, accordion).

## Phase 2 — detail

1. Lint types + engine.
2. External criteria file (`criteria/lint.yaml`) with RFC 2119 grounding.
3. Host override via `.contexa/lint.yaml`.
4. `GET /api/lint` + UI.

## Phase 3 — detail

1. Package metadata for npm.
2. Production CLI + browser open.
3. File tree in the sidebar.
4. Validated install into another folder.

## Phase 4 — detail (current)

1. Edit mode with selectable tag templates (`criteria/edit-tags.yaml`).
2. Adapt inserted tags in the editor.
3. Unified diff before write.
4. Write only through a git-aware path.
5. Logo placeholder (no redesign phase).
