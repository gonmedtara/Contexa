# Publishing Contexa to npm

## Prerequisites

- npm account with permission to publish the `contexa` package
- Node.js 20+
- Clean git working tree on the version you want to release

## Local publish (manual)

1. Bump the version:

```bash
npm version patch   # or minor / major
```

2. Build and pack (also runs on `prepack`):

```bash
npm run build
npm pack --dry-run   # review included files
```

Confirm the tarball contains at least:

- `bin/`
- `.output/`
- `criteria/`
- `package.json`

3. Publish:

```bash
npm publish --access public
```

4. Push the version tag:

```bash
git push && git push --tags
```

## CI publish (recommended)

This repo includes `.github/workflows/publish.yml`.

### Option A — npm Trusted Publishing (OIDC)

1. On npmjs.com → package settings → **Trusted Publisher** → GitHub Actions  
   - Repository: `your-org/contexa`  
   - Workflow: `publish.yml`
2. Push a tag `vX.Y.Z` matching `package.json` version, or use **Release** on GitHub.
3. The workflow builds and runs `npm publish` without a long-lived token.

### Option B — `NPM_TOKEN` secret

1. Create an npm automation token.
2. Add repository secret `NPM_TOKEN`.
3. The publish workflow uses `NODE_AUTH_TOKEN`.

## What gets published

Controlled by `package.json` → `files` and `.npmignore`.

Do **not** publish:

- `fixtures/`
- local `.nuxt` / `.data`
- internal planning notes

## Verify after publish

```bash
mkdir /tmp/contexa-smoke && cd /tmp/contexa-smoke
npm init -y
npm install contexa
npx contexa --no-open
```
