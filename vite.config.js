import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  base: './',
  experimental: {
    renderBuiltUrl() {
      return { relative: true }
    },
  },
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        about: fileURLToPath(new URL('./about.html', import.meta.url)),
        contacts: fileURLToPath(new URL('./contacts.html', import.meta.url)),
      },
    },
  },
})
