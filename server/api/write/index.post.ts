import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'

interface WriteBody {
  path?: string
  content?: string
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
 * POST /api/write — write an edited context file to disk (no git commit).
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

  return {
    ok: true,
    repoPath,
    path: rel,
    bytes: Buffer.byteLength(body.content, 'utf8'),
  }
})
