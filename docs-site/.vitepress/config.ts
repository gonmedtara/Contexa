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
    ['link', { rel: 'icon', href: '/Contexai/favicon.ico', sizes: 'any' }],
    ['link', { rel: 'icon', href: '/Contexai/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'apple-touch-icon', href: '/Contexai/apple-touch-icon.png', sizes: '180x180' }],
  ],
  themeConfig: {
    logo: '/icon.svg',
    siteTitle: 'Contexai',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Configuration', link: '/guide/configuration' },
      { text: 'Publishing', link: '/guide/publishing' },
      { text: 'npm', link: 'https://www.npmjs.com/package/contexai' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'CLI reference', link: '/guide/cli' },
          { text: 'Configuration', link: '/guide/configuration' },
          { text: 'Edit mode', link: '/guide/edit-and-commit' },
          { text: 'Roadmap', link: '/guide/roadmap' },
          { text: 'Publishing to npm', link: '/guide/publishing' },
          { text: 'Deploying these docs', link: '/guide/docs-hosting' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gonmedtara/Contexai' },
      {
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>npm</title><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L11.99 19.15H5.113z"/></svg>',
        },
        link: 'https://www.npmjs.com/package/contexai',
        ariaLabel: 'npm package',
      },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Source: <a href="https://github.com/gonmedtara/Contexai">github.com/gonmedtara/Contexai</a> · Package: <a href="https://www.npmjs.com/package/contexai">npmjs.com/package/contexai</a>',
    },
  },
})
