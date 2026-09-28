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

Create a token that **bypasses 2FA** (required for the first publish of a new name like `contexai`):

1. Enable **2FA** on your npm account if it is not already on  
   https://www.npmjs.com/settings/~/account
2. https://www.npmjs.com/settings/~/tokens → **Generate New Token** → **Granular Access Token**
3. Settings that matter:
   - **Packages**: **All packages** (a token limited to `contexai` can fail while the package does not exist yet)
   - **Permissions**: **Read and write** that can **publish** (not “stage only”)
   - **Bypass two-factor authentication**: **must be checked at creation** (cannot flip later)
4. Copy the token (`npm_…`)
5. GitHub → **Settings → Secrets and variables → Actions** → edit `NPM_TOKEN` → paste the **new** value (delete/recreate the secret if unsure)
6. Re-run **Publish npm**

**Do not** use a classic “Publish” token. Prefer granular + Bypass 2FA (or classic **Automation** if your account still offers it).

### Alternative — first publish from your machine

```bash
npm login
npm run build
npm publish --access public
```

Enter the 2FA code when prompted. That creates `contexai` on npm. Then set Trusted Publisher (Option B) and you can remove `NPM_TOKEN` from GitHub.

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
