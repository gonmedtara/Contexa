# Publishing Contexai to npm

## Prerequisites

- npm account with permission to publish the `contexai` package
- Node.js 20+
- One of the auth options below configured

## Auth (required once)

The publish workflow needs npm credentials. Pick **one**:

### Option A — `NPM_TOKEN` secret (simplest)

npm now rejects classic / weak tokens with:

`403 … Two-factor authentication or granular access token with bypass 2fa enabled is required`

Create a token that **bypasses 2FA**:

1. https://www.npmjs.com/settings/~/tokens → **Generate New Token**
2. Prefer one of:
   - **Automation** (classic CI token — bypasses 2FA by design), or
   - **Granular Access Token** with:
     - Permission: **Read and write** on package `contexai` (or all packages)
     - **Bypass two-factor authentication** enabled
     - Expiration: as you like
3. GitHub → **Settings → Secrets and variables → Actions**
4. Set secret `NPM_TOKEN` to the new value (replace the old token if you already had one)

Then re-run **Publish npm**.

### Option B — npm Trusted Publishing (OIDC, no long-lived token)

After the **first** successful publish (or after creating the empty package on npm):

1. npmjs.com → package `contexai` → **Settings → Trusted Publisher → GitHub Actions**
   - Organization or user: `gonmedtara`
   - Repository: `Contexai`
   - Workflow filename: `publish.yml`
   - Environment: leave empty
2. You can remove `NPM_TOKEN` afterward and publish with OIDC only

Also enable for the bump+push step:

- GitHub → **Settings → Actions → General → Workflow permissions → Read and write permissions**

## CI publish (recommended)

Workflow: `.github/workflows/publish.yml`

### Bump + publish from the Actions UI

1. Actions → **Publish npm** → **Run workflow**
2. Choose bump: `patch` / `minor` / `major`
3. The job will:
   - bump `package.json` (`npm version`)
   - build
   - `npm publish --access public --provenance`
   - push the release commit and `vX.Y.Z` tag to `main`

### Or publish an existing tag

```bash
npm version patch   # locally, if you prefer
git push && git push --tags
```

Tag shape must be `v` + `package.json` version (example: `v0.3.1`).

## Local publish (manual)

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
