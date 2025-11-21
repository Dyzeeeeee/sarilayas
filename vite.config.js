import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  // Server config only for development (ngrok support)
  server: process.env.NODE_ENV === 'development' ? {
    allowedHosts: [
      '54ea7c6fbca7.ngrok-free.app',
      '.ngrok-free.app',
      '.ngrok.io'
    ]
  } : undefined
})
