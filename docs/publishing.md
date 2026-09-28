# Publishing Contexai to npm

## Prerequisites

- npm account (with **2FA enabled**)
- Node.js 20+

## First publish (required once — do this locally)

`contexai` does **not** exist on npm yet. GitHub Actions **cannot** create the first version via OIDC Trusted Publishing (that setting only appears after the package exists). CI tokens often fail npm’s 2FA rules on first publish.

**Stop re-running the Publish Action until this is done.**

```bash
cd /path/to/Contexai
npm login          # browser / OTP
npm run build
npm publish --access public
```

Confirm: https://www.npmjs.com/package/contexai

Then configure CI (below). Later releases can be fully automated.

## CI after the package exists

### Trusted Publishing (recommended, no long-lived token)

1. npmjs.com → **contexai** → **Settings → Trusted Publisher → GitHub Actions**
   - Organization or user: `gonmedtara`
   - Repository: `Contexai`
   - Workflow filename: `publish.yml`
   - Environment: leave empty
   - Allowed actions: include `npm publish`
2. Delete the GitHub secret `NPM_TOKEN` if present (a bad token overrides OIDC)
3. GitHub → **Settings → Actions → General → Workflow permissions → Read and write**
4. Actions → **Publish npm** → Run workflow (`patch` / `minor` / `major`)

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
