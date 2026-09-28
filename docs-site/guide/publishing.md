# Publishing to npm

## One-time GitHub / npm setup

You need **either**:

1. **Repo secret `NPM_TOKEN`** — npm automation/granular token with publish rights, or
2. **Trusted Publisher** on npmjs.com for workflow `publish.yml` (repo `gonmedtara/Contexa`)

Also set **Settings → Actions → Workflow permissions → Read and write** so the bump step can push the version commit and tag.

Full detail: see repo [`docs/publishing.md`](https://github.com/gonmedtara/Contexa/blob/main/docs/publishing.md).

## Publish from GitHub Actions

1. Actions → **Publish npm** → **Run workflow**
2. Pick `patch` / `minor` / `major`
3. Workflow bumps version, publishes to npm, pushes commit + `vX.Y.Z` tag

## Manual

```bash
npm version patch
npm run build
npm pack --dry-run
npm publish --access public
git push && git push --tags
```

## Smoke test

```bash
mkdir /tmp/contexai-smoke && cd /tmp/contexai-smoke
npm init -y
npm install contexai
npx contexai --no-open
```
