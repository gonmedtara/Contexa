# Contexa — contributor notes

Visual tool for AI context files. Install as an npm dependency, run the CLI, open the local UI.

```bash
npm install --save-dev contexa
npx contexa
```

## Targeted files

| Type | Patterns |
|------|----------|
| `agents` | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `copilot` | `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md` |
| `ide-rule` | IDE rule files under the editor `rules` directory |
| `windsurf` | `.windsurfrules` |
| `skill` | `**/SKILL.md` |

## Principles

- Prefer external criteria / templates (`criteria/*.yaml`, host `.contexa/*`) over frozen in-code lists.
- Zero required user config at launch.
- Logo slot: replace `public/logo.svg` when ready.
- Lint modality language is grounded in RFC 2119 / RFC 8174 (BCP 14).

## Docs & release

- Library docs: `docs-site/` (VitePress)
- Publish guide: `docs/publishing.md`
- Config reference: `docs/configuration.md`
