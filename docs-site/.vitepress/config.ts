import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Contexa',
  description: 'Browse, lint, and edit AI context files from a local web UI',
  cleanUrls: true,
  themeConfig: {
    logo: '/logo.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'Publishing', link: '/guide/publishing' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'CLI reference', link: '/guide/cli' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Edit mode', link: '/guide/edit-and-commit' },
          { text: 'Publishing to npm', link: '/guide/publishing' },
          { text: 'Deploying these docs', link: '/guide/docs-hosting' },
        ],
      },
    ],
    socialLinks: [],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Contexa documentation',
    },
  },
})
