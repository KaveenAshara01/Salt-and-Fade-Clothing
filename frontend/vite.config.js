import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '581b-2402-d000-8138-dfc7-c9c0-52eb-21a7-89ec.ngrok-free.app'
    ],
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
