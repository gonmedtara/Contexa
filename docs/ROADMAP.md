# Contexa roadmap

Status tracking for delivery phases. Keep this file in English.

| Phase | Goal | Status |
|-------|------|--------|
| 1 | Scanner + parser + read-only UI | Done |
| 2 | Prompt-engineering lint engine | Done |
| 3 | Installable npm package + CLI opens web UI (tree, view, lint) | Done |
| 4 | Diff + safe writes via git | Todo |
| 5 | Visual redesign (design system, Histoire) | Todo |

**Hard gate:** Phase 3 (npm dependency UX) must be validated before Phase 4 (writes).

## Phase 1 — detail

1. Scaffold Nuxt + TypeScript.
2. Shared types + server scanner.
3. Frontmatter / AST / sections parser.
4. `GET /api/context` + CLI repo path.
5. Read-only UI (list, frontmatter, accordion).

## Phase 2 — detail

1. `LintIssue` / `LintResult` types + rule registry.
2. Initial rules (modality, structure, redundancy, frontmatter, vague language, XML balance).
3. `GET /api/lint`.
4. Issues in the UI (per file / summary).

## Phase 3 — detail (current)

1. Package metadata for npm (`bin`, `files`, version, non-private).
2. Production CLI: serve built Nitro output, default scan = `cwd`.
3. Open the browser to the local UI on launch.
4. File **tree** arborescence in the sidebar.
5. Validate: install / link into another folder and run `npx contexa` successfully.

## Phase 4 — detail (not started)

1. Fix proposals tied to lint issues.
2. Unified diff before write.
3. Write only through git.

## Phase 5 — detail (not started)

1. Design brief.
2. UI migration (Reka UI + Tailwind).
3. Variant documentation.
