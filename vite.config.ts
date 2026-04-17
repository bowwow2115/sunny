import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/sunny/app/' : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`,
      },
    },
  },
  server: {
    port: 8090,
    proxy: {
      '/sunny': {
        target: 'http://192.168.1.254:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: mode !== 'production',
    outDir: 'dist',
  },
}))
