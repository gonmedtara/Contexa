<script setup lang="ts">
useHead({
  titleTemplate: title => (title ? `${title} · Contexai` : 'Contexai'),
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'icon', href: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
  ],
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
