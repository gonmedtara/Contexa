/**
 * Nitro plugin: log the folder being scanned at boot.
 * Path comes from the CLI env (CONTEXA_REPO), never from a baked build path.
 */
export default defineNitroPlugin(async () => {
  try {
    const repoPath = resolveRepoPath()
    process.env.CONTEXA_REPO = repoPath
    const { files } = await scanRepo(repoPath)
    console.info(
      `[contexa] scanning ${repoPath} — ${files.length} context file(s)`,
    )
  }
  catch (error) {
    console.warn('[contexa] initial scan failed:', error)
  }
})
