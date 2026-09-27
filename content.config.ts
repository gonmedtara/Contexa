import { defineContentConfig, defineCollection } from '@nuxt/content'

/**
 * Minimal collection so @nuxt/content stays enabled for ContentRenderer.
 * Repo context files are loaded from disk via the Nitro scanner, not this folder.
 */
export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
    }),
  },
})
