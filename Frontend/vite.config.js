import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.futuratextiles.in',  // ✅ FIXED: https
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: 'https://api.futuratextiles.in',  // ✅ FIXED: https
        changeOrigin: true,
        secure: true,
      }
    }
  }
})