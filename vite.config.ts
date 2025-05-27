import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' // 插件，使用jsx语法
import { ConfigEnv, UserConfig } from 'vite'
import { fileURLToPath } from 'url'
// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const root = process.cwd() // 当前目录
  const env = loadEnv(mode, root) // 环境变量
  console.log('env', env)
  return {
    root,
    base: './',
    publicDir: fileURLToPath(new URL('./public', import.meta.url)),
    assetsInclude: fileURLToPath(new URL('./src/assets', import.meta.url)),
    plugins: [vue(), vueJsx()],
    server: {
      host: true,
      port: 8080,
      open: false,
      cors: true,
      proxy: {
        // 请求都会被转发到这里
        [env.VITE_APP_BASE_API]: {
          target: 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp('^' + env.VITE_APP_BASE_API), ''),
        },
      },
    },
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: fileURLToPath(new URL('./index.html', import.meta.url)),
        },
        output: {
          format: 'esm',
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
