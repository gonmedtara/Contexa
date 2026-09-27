// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    contexa: {
      // Overridden by CONTEXA_REPO (set via bin/contexa.mjs CLI arg).
      repoPath: process.env.CONTEXA_REPO || resolve(process.cwd()),
    },
  },
})
