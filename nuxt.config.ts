// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  css: ['~/assets/css/main.css'],
  content: {
    build: {
      markdown: {
        highlight: {
          // Dark tokens to match --cx-code-block-bg in brand/tokens.css
          theme: 'github-dark',
          langs: ['bash', 'shell', 'ts', 'js', 'json', 'yaml', 'md', 'vue', 'html'],
        },
      },
    },
  },
  runtimeConfig: {
    contexai: {
      // Overridden at runtime by CONTEXAI_REPO / NUXT_CONTEXAI_REPO_PATH (CLI).
      // Keep empty at build time so a published package does not bake a host path.
      repoPath: '',
    },
  },
})
