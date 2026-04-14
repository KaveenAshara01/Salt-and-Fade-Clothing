import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '937b-2402-d000-813c-84a-4d60-6d07-7f4e-bd8b.ngrok-free.app'
    ],
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
