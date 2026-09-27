# Configuration

Contexa works with zero config. Optional files and environment variables customize behavior.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CONTEXA_REPO` | `process.cwd()` | Absolute folder to scan (set automatically by the CLI). |
| `CONTEXA_PACKAGE_ROOT` | package install path | Where bundled `criteria/` lives (set by the CLI). |
| `PORT` / `NITRO_PORT` | `3927` | HTTP port for the web UI. |
| `HOST` / `NITRO_HOST` | `127.0.0.1` | Bind address. |

## CLI flags

```bash
npx contexa [path] [--port 3927] [--host 127.0.0.1] [--no-open]
npx contexa start [path] …
npx contexa dev [path] …          # package source / contributors only
```

| Flag | Description |
|------|-------------|
| `path` | Folder to scan (default: current working directory). |
| `--port <n>` | HTTP port. |
| `--host <h>` | Bind host. |
| `--no-open` | Do not open a browser tab. |

## Host override files

Place these in the **scanned** folder (your project), not inside `node_modules/contexa`:

### `.contexa/lint.yaml`

Overrides / extends packaged lint criteria from `criteria/lint.yaml`.

Rules merge by `id`. Set `enabled: false` to disable a default rule.

```yaml
meta:
  version: 1
rules:
  - id: vague-language
    enabled: false
  - id: modality-signals
    shouldToMustRatioWarning: 3
```

See packaged defaults: `criteria/lint.yaml` (RFC 2119 / RFC 8174 based).

### `.contexa/edit-tags.yaml`

Overrides / extends edit-mode tag templates from `criteria/edit-tags.yaml`.

```yaml
tags:
  - id: team-must
    label: TEAM MUST
    category: modality
    description: Team-specific hard rule
    snippet: |
      The team MUST …
```

## Packaged criteria (read-only defaults)

| File | Purpose |
|------|---------|
| `criteria/lint.yaml` | Lint rule definitions and patterns |
| `criteria/edit-tags.yaml` | MUST/SHOULD/XML snippets for edit mode |

## Git commit (edit → save)

When **Also create a git commit** is checked:

1. The scanned folder must be a git repository (`.git` present).
2. `user.name` and `user.email` must be configured (`git config user.name` / `user.email`).
3. There must be a real content change vs HEAD.

Otherwise the file is still written (and staged when git exists), and the UI shows a clear error for the commit step.
