import { existsSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join, resolve, sep } from 'node:path'
import { spawnSync } from 'node:child_process'

interface WriteBody {
  path?: string
  content?: string
  commit?: boolean
  message?: string
}

function assertInsideRepo(repoPath: string, relativePath: string): string {
  const absolute = resolve(repoPath, relativePath)
  const root = resolve(repoPath) + sep
  if (!absolute.startsWith(root) && absolute !== resolve(repoPath)) {
    throw createError({ statusCode: 400, statusMessage: 'Path escapes the scanned folder.' })
  }
  if (relativePath.split(/[/\\]/).includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'Path must be relative without .. segments.' })
  }
  return absolute
}

function git(repoPath: string, args: string[]) {
  return spawnSync('git', args, {
    cwd: repoPath,
    encoding: 'utf8',
    env: {
      ...process.env,
      // Avoid interactive editors during commit.
      GIT_EDITOR: 'true',
    },
  })
}

/**
 * POST /api/write
 * Write an edited context file; optionally stage and commit when the folder is a git repo.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<WriteBody>(event)
  const query = getQuery(event)
  const override = typeof query.repo === 'string' ? query.repo : undefined
  const repoPath = resolveRepoPath(override)

  const rel = body.path?.trim()
  if (!rel || typeof body.content !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Body requires path and content.' })
  }

  const absolute = assertInsideRepo(repoPath, rel)
  await mkdir(dirname(absolute), { recursive: true })
  await writeFile(absolute, body.content, 'utf8')

  const gitDir = join(repoPath, '.git')
  const wantsCommit = Boolean(body.commit)

  if (!existsSync(gitDir)) {
    if (wantsCommit) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Saved to disk, but this folder is not a git repository — cannot commit.',
      })
    }
    return {
      ok: true,
      repoPath,
      path: rel,
      bytes: Buffer.byteLength(body.content, 'utf8'),
      git: null,
    }
  }

  const add = git(repoPath, ['add', '--', rel])
  if (add.status !== 0) {
    throw createError({
      statusCode: 500,
      statusMessage: `File written, but git add failed: ${add.stderr || add.stdout}`,
    })
  }

  if (!wantsCommit) {
    return {
      ok: true,
      repoPath,
      path: rel,
      bytes: Buffer.byteLength(body.content, 'utf8'),
      git: { staged: true, committed: false },
    }
  }

  const name = git(repoPath, ['config', 'user.name'])
  const email = git(repoPath, ['config', 'user.email'])
  if (name.status !== 0 || !name.stdout.trim() || email.status !== 0 || !email.stdout.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'File written and staged, but git user.name / user.email are not configured in this repo (or globally). Set them, then retry commit.',
    })
  }

  const message = body.message?.trim() || `chore(context): update ${rel}`
  const commit = git(repoPath, ['commit', '-m', message, '--', rel])
  if (commit.status !== 0) {
    const detail = (commit.stderr || commit.stdout || '').trim()
    const nothingToCommit = /nothing to commit/i.test(detail)
    throw createError({
      statusCode: nothingToCommit ? 400 : 500,
      statusMessage: nothingToCommit
        ? 'File written, but there was nothing new to commit (content unchanged from HEAD).'
        : `File written and staged, but git commit failed: ${detail || 'unknown error'}`,
    })
  }

  return {
    ok: true,
    repoPath,
    path: rel,
    bytes: Buffer.byteLength(body.content, 'utf8'),
    git: { staged: true, committed: true, message },
  }
})
