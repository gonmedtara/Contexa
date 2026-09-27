# CLI reference

```bash
npx contexa [path] [flags]
npx contexa start [path] [flags]
npx contexa dev [path] [flags]    # contributors / package source
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
| `CONTEXA_REPO` | Folder to scan (set by the CLI) |
| `PORT` / `NITRO_PORT` | Same as `--port` |
| `HOST` / `NITRO_HOST` | Same as `--host` |

## Examples

```bash
npx contexa
npx contexa ./apps/web --port 4000
npx contexa /tmp/demo --no-open
```
