import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base: './'` makes the build work on any GitHub Pages repo path
// (e.g. https://<user>.github.io/<repo>/) without extra config.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
