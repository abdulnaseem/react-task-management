import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  console.log('Vite mode:', mode); // optional for debugging

  return {
    plugins: [react()],
    server: mode === 'development' ? {
      proxy: {
        '/api': {
          target: 'https://your-render-backend-url.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    } : undefined,
  }
});
