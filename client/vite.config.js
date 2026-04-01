import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../server/dist',
    emptyOutDir: true, // This is critical! It stops Vite from freezing/prompting on CI servers.
  }
})
