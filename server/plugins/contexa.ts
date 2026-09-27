/**
 * Nitro plugin: resolves the target repo at server boot (CLI / env / cwd)
 * and logs a short summary. Scanning itself stays on-demand via the API
 * so later watch / write phases can refresh without restarting.
 */
export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  const repoPath =
    (config.contexa as { repoPath?: string } | undefined)?.repoPath
    || process.env.CONTEXA_REPO
    || process.cwd()

  process.env.CONTEXA_REPO = repoPath

  try {
    const { files } = await scanRepo(repoPath)
    console.info(
      `[contexa] scanning ${repoPath} — ${files.length} context file(s)`,
    )
  }
  catch (error) {
    console.warn('[contexa] initial scan failed:', error)
  }
})
