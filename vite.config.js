import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    proxy: {
      '/api-video': {
        target: 'https://media.signbsl.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-video/, '')
      }
    }
  }
});
