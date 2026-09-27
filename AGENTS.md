# Contexa — project context

Visual tool for managing AI context files in a repository or folder.

## Product shape

Contexa is an **npm dependency** you install in a repo (or any folder). Running the CLI opens a local web UI that:

1. Discovers AI markdown / rule files in that tree
2. Shows them in a **file tree**
3. Lets you **view** and **lint** those files
4. Lets you **edit** with reusable tag templates, then **diff + write** safely via git

Install:

```bash
npm install --save-dev contexa
```

Run:

```bash
npx contexa
```

Or:

```bash
npx contexa /path/to/folder
```

Zero-config: with no path argument, the current working directory is scanned.

## Problem

These files duplicate across AI tools, drift over time, and are painful to edit as raw markdown — yet wording has real impact (semantic weight of MUST vs SHOULD, XML-ish structure, redundancy across files).

## Targeted files

| Type | Patterns |
|------|----------|
| `agents` | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `copilot` | `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md` |
| `ide-rule` | IDE rule files `*.mdc` / `*.md` under the editor `rules` directory |
| `windsurf` | `.windsurfrules` |
| `skill` | `**/SKILL.md` |

## Roadmap

### Phase 1 — Scanner + read-only viewer (done)

- Nitro scanner, parser (frontmatter + AST + sections), read-only UI.
- No disk writes.

### Phase 2 — Prompt-engineering lint engine (done)

- Lint engine with **externalized criteria** (`criteria/lint.yaml`, host override `.contexa/lint.yaml`).
- Criteria grounded in RFC 2119 / RFC 8174 (BCP 14), not hardcoded magic strings only.
- `GET /api/lint` + UI badges / panel.

### Phase 3 — Installable npm package + CLI web UI (done)

- `npx contexa [path]` serves the UI for the host folder (tree, view, lint).
- Gate before writes.

### Phase 4 — Edit tags + diff + safe writes via git (in progress)

- Edit mode: pick existing tags (MUST/SHOULD/MAY, XML blocks such as `<examples>`, `<rules>`, …), adapt them in the file.
- Show a diff, then write through a controlled git-aware flow.
- No silent writes.
- Brand mark uses a **logo placeholder** until a final logo asset is provided.

## Implementation principles

- Prefer external criteria / templates over frozen in-code lists.
- Zero required user config at launch.
- Logo slot is a placeholder (`public/logo.svg`) — replace later without redesigning the app.

## Commands

Develop Contexa itself:

```bash
npm install
npm run dev:sample
npm run build
```

Use as a dependency:

```bash
npm install --save-dev contexa
npx contexa
npx contexa ./some/folder
```

## API

- `GET /api/context` — scan + parse (`?repo=` optional)
- `GET /api/lint` — lint issues
- `GET /api/edit/tags` — tag templates for edit mode
- `POST /api/write` — write an edited file (Phase 4)
