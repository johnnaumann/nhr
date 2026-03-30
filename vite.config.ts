import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // When deploying to GitHub Pages, we build with GITHUB_PAGES_BASE_PATH set
  // (e.g. "/my-repo/") so assets resolve correctly for project pages.
  base: process.env.GITHUB_PAGES_BASE_PATH ?? '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
