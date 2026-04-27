import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const proxyTarget =
    env.VITE_API_PROXY_TARGET || 'http://localhost:8080'

  return {
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
          api: 'modern-compiler',
          additionalData: `@use "@/assets/styles/variables.scss" as *;`,
          silenceDeprecations: ['import', 'legacy-js-api', 'global-builtin'],
        },
      },
    },
    server: {
      port: 8090,
      proxy: {
        '/sunny': {
          target: proxyTarget,
          changeOrigin: false,
        },
      },
    },
    build: {
      sourcemap: mode !== 'production',
      outDir: 'dist',
    },
  }
})
