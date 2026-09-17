import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    // Single self-contained index.html (no separate JS/CSS files) so the
    // built app can be opened directly from a flash drive / local disk
    // without hitting browser CORS restrictions on module scripts.
    cssCodeSplit: false,
  },
})
