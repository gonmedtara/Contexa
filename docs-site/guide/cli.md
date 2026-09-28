# CLI reference

```bash
npx contexai [path] [flags]
npx contexai start [path] [flags]
npx contexai dev [path] [flags]    # contributors / package source
```

## Arguments

| Argument | Description |
|----------|-------------|
| `path` | Folder to scan. Defaults to the current working directory. |

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--port <n>` | `3927` | HTTP port |
| `--host <h>` | `127.0.0.1` | Bind address |
| `--no-open` | off | Do not open the browser |

## Environment

| Variable | Description |
|----------|-------------|
| `CONTEXAI_REPO` | Folder to scan (set by the CLI) |
| `PORT` / `NITRO_PORT` | Same as `--port` |
| `HOST` / `NITRO_HOST` | Same as `--host` |

## Examples

```bash
npx contexai
npx contexai ./apps/web --port 4000
npx contexai /tmp/demo --no-open
```
