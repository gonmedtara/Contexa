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

### Trusted Publishing (required for GitHub Actions)

1. Open https://www.npmjs.com/package/contexai → **Settings → Trusted Publisher → GitHub Actions**
2. Create a connection with **exactly**:

   | Field | Value |
   |-------|--------|
   | Organization or user | `gonmedtara` |
   | Repository | `Contexai` (capital **C** — case-sensitive) |
   | Workflow filename | `publish.yml` |
   | Environment | leave **empty** |
   | Allowed actions | include **`npm publish`** |

3. **Critical (since 3 Sep 2026):** new Trusted Publishers default to **`npm stage publish` only**. If you leave the default, `npm publish` from CI fails with a misleading **`404 … or you do not have permission`**. You must explicitly allow **`npm publish`**, or delete the connection and recreate it with that option checked.
4. Connections **cannot be edited** — delete and recreate if any field is wrong.
5. Do **not** set a GitHub `NPM_TOKEN` secret (none needed; a bad token interferes).
6. GitHub → **Settings → Actions → General → Workflow permissions → Read and write**
7. Actions → **Publish npm** → Run workflow (`patch` / `minor` / `major`)

### If CI fails with `404 Not Found - PUT …/contexai`

While provenance is signed but PUT returns 404 / “do not have permission”, the Trusted Publisher on npmjs.com does not match this workflow. Check the table above (especially **Repository case** and **Allowed actions → npm publish**).

### Fallback — local publish

```bash
npm version patch   # or minor / major
npm run build
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
