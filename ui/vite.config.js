import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const proxy = { '/api': 'http://localhost:8000' }

// Pide desde el HTML la imagen de la portada y la fuente del título, para que el navegador
// no espere a que cargue el JavaScript para descubrirlas. Los nombres llevan hash, por eso
// se buscan en el build.
function precargarPortada() {
  return {
    name: 'precargar-portada',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        const archivos = Object.keys(bundle ?? {})
        const buscar = (re) => archivos.find((f) => re.test(f))
        const movil = buscar(/render-menu-movil-[\w-]+\.webp$/)
        const escritorio = buscar(/render-menu-(?!movil)[\w-]+\.webp$/)
        const fuente = buscar(/TasteBread-[\w-]+\.otf$/)
        const tags = []
        if (movil) {
          tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'image', href: `/${movil}`, media: '(max-width: 640px)', fetchpriority: 'high' }, injectTo: 'head' })
        }
        if (escritorio) {
          tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'image', href: `/${escritorio}`, media: '(min-width: 641px)', fetchpriority: 'high' }, injectTo: 'head' })
        }
        if (fuente) {
          tags.push({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/otf', href: `/${fuente}`, crossorigin: '' }, injectTo: 'head' })
        }
        return tags
      },
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    precargarPortada(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo192x192.png'],
      manifest: {
        name: 'Little Bearstards',
        short_name: 'Bearstards',
        description: 'Ranking y estadísticas de Little Bearstards.',
        lang: 'es',
        start_url: '/',
        display: 'standalone',
        theme_color: '#241a55',
        background_color: '#000000',
        icons: [
          { src: 'logo192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'logo512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Fuentes e imágenes también se guardan para abrir sin conexión
        globPatterns: ['**/*.{js,css,html,png,svg,webp,woff2,otf}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//, /^\/admin\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname === '/api/ranking/',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-ranking',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname === '/api/auth/registro/',
            method: 'POST',
            handler: 'NetworkOnly',
            options: {
              backgroundSync: {
                name: 'cola-registro',
                options: { maxRetentionTime: 24 * 60 },
              },
            },
          },
        ],
        
      },
    }),
  ],
  server: { proxy },
  preview: { proxy },
})