import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 🔥 បន្ថែមផ្នែកនេះសម្រាប់ Local Development
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Link ទៅ Backend របស់ប្រូ
        changeOrigin: true,
        secure: false,
      },
      // បើប្រូមានរូបភាពនៅ /uploads ដែរ
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})