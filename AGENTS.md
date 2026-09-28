# Contexai — contributor notes

Visual tool for AI context files. Install as an npm dependency, run the CLI, open the local UI.

```bash
npm install --save-dev contexai
npx contexai
```

## Targeted files

| Type | Patterns |
|------|----------|
| `agents` | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `copilot` | `.github/copilot-instructions.md`, `.github/instructions/**/*.instructions.md` |
| `copilot-agent` | `.github/agents/**/*.agent.md` |
| `copilot-prompt` | `.github/prompts/**/*.prompt.md` |
| `ide-rule` | IDE rule files under the editor `rules` directory |
| `windsurf` | `.windsurfrules` |
| `skill` | `**/SKILL.md` |

## Principles

- Prefer external criteria / templates (`criteria/*.yaml`, host `.contexai/*`) over frozen in-code lists.
- Zero required user config at launch.
- Brand mark: `brand/icon.png` (+ generated `public/logo.svg`, favicons).
- Lint modality language is grounded in RFC 2119 / RFC 8174 (BCP 14).

## Docs & release

- Live docs: https://gonmedtara.github.io/Contexai/
- Library docs sources: `docs-site/` (VitePress)
- Brand tokens (app + docs): `brand/tokens.css`
- Publish guide: `docs/publishing.md`
- Config reference: `docs/configuration.md`
