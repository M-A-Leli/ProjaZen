import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist'
  },
  server: {
    port: 3001,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
