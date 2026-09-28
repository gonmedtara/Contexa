import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Contexai',
  description: 'Browse, lint, and edit AI context files from a local web UI',
  // Project Pages URL: https://gonmedtara.github.io/Contexai/
  base: '/Contexai/',
  cleanUrls: true,
  // Match the app UI (light-only brand tokens).
  appearance: false,
  markdown: {
    // Dark token colors on the dark code pane (--vp-code-block-bg).
    theme: 'github-dark',
  },
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap',
      },
    ],
  ],
  themeConfig: {
    // Text wordmark for now; set `logo: '/logo.svg'` when the final mark is ready.
    siteTitle: 'Contexai',
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
      message: 'Contexai documentation',
    },
  },
})
