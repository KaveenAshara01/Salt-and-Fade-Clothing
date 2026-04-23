import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app'  // wildcard: allows any ngrok tunnel URL
    ],
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
