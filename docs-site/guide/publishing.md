# Publishing to npm

See also the repo file [`docs/publishing.md`](https://github.com/) (mirrored below).

## Manual

```bash
npm version patch
npm run build
npm pack --dry-run
npm publish --access public
git push && git push --tags
```

## GitHub Actions

Workflow: `.github/workflows/publish.yml`

- Triggers on tags `v*` / GitHub Release / manual dispatch
- Builds then `npm publish --access public --provenance`

### Auth options

1. **Trusted Publishing (OIDC)** — configure on npmjs.com (preferred, no long-lived token)
2. **`NPM_TOKEN`** repository secret — automation token fallback

## Smoke test after publish

```bash
mkdir /tmp/contexa-smoke && cd /tmp/contexa-smoke
npm init -y
npm install contexa
npx contexa --no-open
```
