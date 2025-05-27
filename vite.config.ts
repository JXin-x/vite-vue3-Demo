import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' // 插件，使用jsx语法
import { ConfigEnv, UserConfig } from 'vite'
import { fileURLToPath } from 'url'
import { viteMockServe } from 'vite-plugin-mock'
import AutoImport from 'unplugin-auto-import/vite'
import Component from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { IconsResolver } from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
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
        plugins: [
            vue(),
            vueJsx(),
            viteMockServe({
                mockPath: 'mock', //数据模拟需要拦截的请求路径
                enable: true // 本地开发开启mock
            }),
            // 自动导入组件
            AutoImport({
                resolvers: [ElementPlusResolver(), IconsResolver()],
                dts: fileURLToPath(new URL('./types/auto-imports.d.ts', import.meta.url))
            }),
            // 自动注册组件
            Component({
                resolvers: [ElementPlusResolver(), IconsResolver()],
                dts: fileURLToPath(new URL('./types/components.d.ts', import.meta.url))
            }),
            Icons({
                autoInstall: true
            })
        ],
        server: {
            host: true,
            port: 8080,
            open: false,
            cors: true,
            proxy: {
                // 请求都会被转发到这里
                [env.VITE_APP_BASE_API]: {
                    target: 'http://localhost:8000',
                    changeOrigin: true
                    //rewrite: (path) => path.replace(new RegExp('^' + env.VITE_APP_BASE_API), '')
                },
                [env.VITE_APP_MOCK_BASEURL]: {
                    target: 'http://localhost:8080',
                    changeOrigin: true
                }
            }
        },
        build: {
            sourcemap: false,
            chunkSizeWarningLimit: 4000,
            rollupOptions: {
                input: {
                    index: fileURLToPath(new URL('./index.html', import.meta.url))
                },
                output: {
                    format: 'esm',
                    chunkFileNames: 'static/js/[name]-[hash].js',
                    entryFileNames: 'static/js/[name]-[hash].js',
                    assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
                }
            }
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    }
})
