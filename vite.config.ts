import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/lyricforge/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg'],
      manifest: {
        name: 'LyricForge',
        short_name: 'LyricForge',
        description: 'Paste lyrics you can use, clean & analyze flow, generate Suno-ready style prompts. Client-side only.',
        theme_color: '#0a0a12',
        background_color: '#0a0a12',
        display: 'standalone',
        orientation: 'any',
        start_url: '/lyricforge/',
        scope: '/lyricforge/',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
        navigateFallback: '/lyricforge/index.html',
      },
    }),
  ],
  build: { target: 'es2020', sourcemap: false },
})
