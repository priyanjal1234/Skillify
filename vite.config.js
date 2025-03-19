import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  define: {
    global: {}
  },
  server: {
    historyApiFallback: true, // Ensures client-side routing works in development
  },
  build: {
    outDir: 'dist', // Ensure this matches Vercel's expected output directory
  },
})
