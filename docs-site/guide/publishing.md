# Publishing to npm

## First publish (local — required once)

`contexai` must be created interactively once. CI cannot bootstrap a brand-new package name via OIDC.

```bash
npm login
npm run build
npm publish --access public
```

Then on npmjs.com → package **contexai** → **Trusted Publisher** → GitHub Actions  
(`gonmedtara` / `Contexai` / `publish.yml`). Delete `NPM_TOKEN` from GitHub secrets.

Full detail: [`docs/publishing.md`](https://github.com/gonmedtara/Contexai/blob/main/docs/publishing.md).

## Later releases (GitHub Actions)

1. Actions → **Publish npm** → **Run workflow**
2. Pick `patch` / `minor` / `major`

## Smoke test

```bash
mkdir /tmp/contexai-smoke && cd /tmp/contexai-smoke
npm init -y
npm install contexai
npx contexai --no-open
```
