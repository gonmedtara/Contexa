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
          theme: 'github-light',
          langs: ['bash', 'shell', 'ts', 'js', 'json', 'yaml', 'md', 'vue', 'html'],
        },
      },
    },
  },
  runtimeConfig: {
    contexa: {
      // Overridden at runtime by CONTEXA_REPO / NUXT_CONTEXA_REPO_PATH (CLI).
      // Keep empty at build time so a published package does not bake a host path.
      repoPath: '',
    },
  },
})
