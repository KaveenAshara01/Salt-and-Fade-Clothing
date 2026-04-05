import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['a792-2402-d000-8138-147a-f8f3-da54-d2b1-fe1e.ngrok-free.app'],
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
