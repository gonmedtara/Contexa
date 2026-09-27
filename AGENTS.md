# Contexa — project context

Visual tool for managing AI context files in a repository or folder.

## Product shape

Contexa is an **npm dependency** you install in a repo (or any folder). Running the CLI opens a local web UI that:

1. Discovers AI markdown / rule files in that tree
2. Shows them in a **file tree** (arborescence)
3. Lets you **view** sections and frontmatter (read-only until the write phase)
4. Lets you **lint** those files with prompt-engineering rules

```bash
npm install -D contexa
npx contexa
# or
npx contexa /path/to/folder
```

Zero-config: with no path argument, the current working directory is scanned.

## Problem

These files duplicate across AI tools, drift over time, and are painful to edit as raw markdown — yet wording has real impact (semantic weight of “must” vs “should”, XML-ish structure, redundancy across files).

## Targeted files

| Type | Patterns |
|------|----------|
| `agents` | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `ide-rule` | IDE rule files `*.mdc` / `*.md` under the editor `rules` directory |
| `windsurf` | `.windsurfrules` |
| `skill` | `**/SKILL.md` |

## Roadmap

### Phase 1 — Scanner + read-only viewer (done)

- Nitro scanner: walk a folder from a CLI argument (default: `cwd`).
- Parser: YAML frontmatter separate from body; body → AST; navigable h1/h2 sections.
- Read-only UI: file list, readable frontmatter, accordion sections.
- **Constraint:** no disk writes.

### Phase 2 — Prompt-engineering lint engine (done)

- Deterministic rules on parsed files (modality, empty sections, missing frontmatter, cross-file redundancy, vague language, structure, XML-ish tag balance).
- `GET /api/lint` + issue badges / panel in the UI (still no writes).
- Extensible rule registry (`server/utils/lint/rules/`).

### Phase 3 — Installable npm package + CLI web UI (done)

- Publishable / linkable npm package (`contexa` bin).
- `npx contexa [path]` starts the local server, opens the browser, scans the host folder.
- Tree navigation + view + lint work when Contexa is installed **as a dependency of another project**.
- Validated via `npm pack` → install in a throwaway host folder → scan/lint/UI OK.
- **Gate:** packaging must stay valid before any write/diff phase (Phase 4).

### Phase 4 — Diff + safe writes via git

- Propose fixes, show a diff, write to disk only through a controlled git flow.
- No silent direct writes.

### Phase 5 — Visual redesign

- Design brief, UI refresh, Vue components (Reka UI + Tailwind), variant docs (Histoire).
- No full theme system before this phase.

## Implementation principles

- Do not hard-code assumptions that block linting or later writes (stable shared types, pure scan/parse).
- Read-only through Phase 3; disk mutation starts in Phase 4.
- Zero required user config at launch.

## Commands

```bash
# Develop Contexa itself
npm install
npm run dev:sample
npm run build

# Use as a dependency (host repo)
npm install -D contexa
npx contexa
npx contexa ./some/folder
```

## API (Phases 1–2)

- `GET /api/context` — scan + parse (`?repo=` optional).
- `GET /api/lint` — prompt-engineering issues for the same folder.
