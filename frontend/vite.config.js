import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'd679-2402-d000-8138-8216-403d-c665-72cc-2064.ngrok-free.app'
    ],
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
