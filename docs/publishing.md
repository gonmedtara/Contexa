# Publishing Contexai to npm

## Prerequisites

- npm account (with **2FA enabled**)
- Node.js 20+

## First publish (required once — do this locally)

OIDC Trusted Publishing **cannot** create a brand-new package (package settings only exist after the first version). Bootstrap once locally:

```bash
cd /path/to/Contexai
npm login          # browser / OTP
npm run build
npm publish --access public
```

Confirm: https://www.npmjs.com/package/contexai — then configure CI (below).

## CI after the package exists

### Trusted Publishing (recommended, no long-lived token)

1. npmjs.com → **contexai** → **Settings → Trusted Publisher → GitHub Actions**
   - Organization or user: `gonmedtara`
   - Repository: `Contexai`
   - Workflow filename: `publish.yml`
   - Environment: leave empty (must match the workflow — ours has none)
   - Allowed actions: include `npm publish`
2. Delete the GitHub secret `NPM_TOKEN` if present (a bad token forces token auth and breaks OIDC)
3. GitHub → **Settings → Actions → General → Workflow permissions → Read and write**
4. Actions → **Publish npm** → Run workflow (`patch` / `minor` / `major`)

**If CI fails with `404 Not Found - PUT …/contexai` while the package already exists:** Trusted Publishing needs **npm ≥ 11.5.1**. Older CLIs (e.g. npm 10 on Node 22) produce that misleading 404 even when OIDC + provenance look fine. The publish workflow pins Node 24 and upgrades npm.

### Fallback — `NPM_TOKEN` secret

Only if Trusted Publishing is not set up yet:

1. Granular Access Token with **All packages**, **Read and write (publish)**, **Bypass 2FA** checked at creation  
   https://www.npmjs.com/settings/~/tokens
2. GitHub secret `NPM_TOKEN` = that token

Classic “Publish” tokens will keep failing with `403 … bypass 2fa`.

## Local publish (manual releases)

```bash
npm version patch   # or minor / major
npm run build
npm pack --dry-run
npm publish --access public
git push && git push --tags
```

## What gets published

Controlled by `package.json` → `files`.

Do **not** publish fixtures, `.nuxt`, or planning notes.

## Verify after publish

```bash
mkdir /tmp/contexai-smoke && cd /tmp/contexai-smoke
npm init -y
npm install contexai
npx contexai --no-open
```
