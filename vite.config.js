import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // ផ្ទុក .env ដើម្បីយកមកប្រើក្នុងនេះបាន
  const env = loadEnv(mode, process.cwd(), '');

  return {
    optimizeDeps: {
      include: ['xlsx'],
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          // ប្រើ Variable ពី .env ឬបើអត់មានប្រើ localhost:3000
          target: env.VITE_API_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})