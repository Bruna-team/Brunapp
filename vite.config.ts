import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        display_override: ['window-controls-overlay'],
        lang: 'es-ES',
        name: 'Bruna',
        short_name: 'Bruna',
        description: 'Software Web Administrativo Bruna',
        theme_color: '#FFB300',
        background_color: '#43A047',
        icons: [
          {
            src: '/512px.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/192px.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/144px.svg',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/32px.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: "/screenshots/screenshot-desktop.png",
            sizes: "1280x800",
            type: "image/png",
            form_factor: "wide"
          },
          {
            src: "/screenshots/screenshot-mobile.png",
            sizes: "640x1136",
            type: "image/png"
          }
        ]
      },
      // workbox: {
      //   runtimeCaching: [{
      //     urlPattern: ({url}) => {
      //       return url.pathname.startsWith('/api')
      //     },
      //     handler: 'CacheFirst' as const,
      //     options: {
      //       cacheName: 'api-cache',
      //       cacheableResponse: {
      //         statuses: [0, 200]
      //       }
      //     }
      //   }]
      // }
    })
  ],
  build: {
    rollupOptions: {
      moduleContext: {
        './node_modules/pdfmake/build/vfs_fonts.js': 'window',
      },
    }
  },
  optimizeDeps: {
    include: ["quill-blot-formatter"],
  },
})
