import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allows SPA routes (e.g. /products, /product/:slug) to work on dev refresh
    historyApiFallback: true,
  },
  preview: {
    // Also needed for `vite preview` (production preview)
    // For actual production servers, see public/_redirects or .htaccess
  },
})

