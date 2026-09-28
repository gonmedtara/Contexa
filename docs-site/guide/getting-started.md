# Getting started

## Install in a project

```bash
npm install --save-dev contexai
```

## Run

```bash
npx contexai
```

This:

1. Scans the current working directory for AI context files
2. Starts a local web server (default `http://127.0.0.1:3927`)
3. Opens your browser

Point at another folder:

```bash
npx contexai /path/to/repo
```

## Detected files

- `AGENTS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md` and `.github/instructions/**/*.instructions.md`
- `.github/agents/**/*.agent.md` and `.github/prompts/**/*.prompt.md`
- IDE rule files under the editor `rules` directory
- `.windsurfrules`
- `**/SKILL.md`

## Docs site

Live documentation: [https://gonmedtara.github.io/Contexai/](https://gonmedtara.github.io/Contexai/)

## Next

- [CLI reference](./cli)
- [Configuration](./configuration)
- [Edit & git commit](./edit-and-commit)
