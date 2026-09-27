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

/**
 * POST /api/write
 * Phase 4: write an edited context file, optionally stage/commit via git.
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
  let git: { staged?: boolean, committed?: boolean, message?: string } | null = null

  if (existsSync(gitDir)) {
    spawnSync('git', ['add', '--', rel], { cwd: repoPath, encoding: 'utf8' })
    git = { staged: true }

    if (body.commit) {
      const message = body.message?.trim() || `chore(context): update ${rel}`
      const result = spawnSync('git', ['commit', '-m', message], {
        cwd: repoPath,
        encoding: 'utf8',
      })
      git.committed = result.status === 0
      git.message = message
      if (result.status !== 0) {
        throw createError({
          statusCode: 500,
          statusMessage: `File written and staged, but git commit failed: ${result.stderr || result.stdout}`,
        })
      }
    }
  }

  return {
    ok: true,
    repoPath,
    path: rel,
    bytes: Buffer.byteLength(body.content, 'utf8'),
    git,
  }
})
