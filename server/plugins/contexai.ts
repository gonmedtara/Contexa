/**
 * Nitro plugin: log the folder being scanned at boot.
 * Path comes from the CLI env (CONTEXAI_REPO), never from a baked build path.
 */
export default defineNitroPlugin(async () => {
  try {
    const repoPath = resolveRepoPath()
    process.env.CONTEXAI_REPO = repoPath
    const { files } = await scanRepo(repoPath)
    console.info(
      `[contexai] scanning ${repoPath} — ${files.length} context file(s)`,
    )
  }
  catch (error) {
    console.warn('[contexai] initial scan failed:', error)
  }
})
