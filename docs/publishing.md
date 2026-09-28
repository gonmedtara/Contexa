# Publishing Contexa to npm

## Prerequisites

- npm account with permission to publish the `contexa` package
- Node.js 20+
- One of the auth options below configured

## Auth (required once)

The publish workflow needs npm credentials. Pick **one**:

### Option A — `NPM_TOKEN` secret (simplest)

1. npmjs.com → Access Tokens → **Granular Access Token** or **Automation**
   - Permission: Read and write for package `contexa` (or publish for your user)
2. GitHub repo → **Settings → Secrets and variables → Actions**
3. New secret name: `NPM_TOKEN`, value: the token

### Option B — npm Trusted Publishing (OIDC, no long-lived token)

1. Publish the package at least once with Option A, **or** create it on npm first
2. npmjs.com → package `contexa` → **Settings → Trusted Publisher → GitHub Actions**
   - Organization or user: `gonmedtara`
   - Repository: `Contexa`
   - Workflow filename: `publish.yml`
   - Environment: leave empty (this workflow does not use an environment)
3. You can remove `NPM_TOKEN` afterward if you want OIDC-only

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
mkdir /tmp/contexa-smoke && cd /tmp/contexa-smoke
npm init -y
npm install contexa
npx contexa --no-open
```
