import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/styles/main.scss'],
  devServer: {
    port: 3001
  },
  modules: [
    '@vite-pwa/nuxt'
  ],
  runtimeConfig: {
    apiTarget: process.env.NUXT_API_TARGET || 'http://localhost:3000/api',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || '/api-proxy'
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    includeAssets: ['favicon.ico', 'robots.txt', 'pwa-192x192.png', 'pwa-512x512.png'],
    manifest: {
      name: 'Community Hub',
      short_name: 'CommunityHub',
      description: 'Plataforma comunitaria para gestionar actividades, eventos y participacion ciudadana.',
      theme_color: '#0f172a',
      background_color: '#f6f7fb',
      display: 'standalone',
      start_url: '/dashboard',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        }
      ]
    },
    workbox: {
      navigateFallback: '/offline',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      runtimeCaching: [
        {
          urlPattern: '^https?:\\/\\/.*\\/(api|api-proxy)\\/.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'communityhub-api',
            networkTimeoutSeconds: 5,
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: '^https?:\\/\\/.*\\/_nuxt\\/.*',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'communityhub-assets'
          }
        },
        {
          urlPattern: '^https?:\\/\\/.*\\/(.*\\.(?:png|jpg|jpeg|svg|webp|gif|woff2|woff|ttf))$',
          handler: 'CacheFirst',
          options: {
            cacheName: 'communityhub-media',
            expiration: {
              maxEntries: 80,
              maxAgeSeconds: 60 * 60 * 24 * 30
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
      type: 'module',
      suppressWarnings: true,
    }
  }
})
