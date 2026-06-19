import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import vueDevTools from 'vite-plugin-vue-devtools';

function umamiPlugin() {
    return {
        name: 'umami',
        transformIndexHtml() {
            return [
                {
                    tag: 'script',
                    attrs: {
                        defer: true,
                        src: 'https://cloud.umami.is/script.js',
                        'data-website-id': '8a96c320-b541-482f-acd4-6fc1b3ec22dc'
                    },
                    injectTo: 'head'
                }
            ];
        }
    };
}

export default defineConfig({
    root: 'src',
    base: './',
    build: {
        outDir: '../dist',
        assetsDir: ''
    },
    plugins: [
        vue(),
        tailwindcss(),
        vueDevTools(),
        umamiPlugin(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['icon-32.png', 'icon-512.png'],
            manifest: {
                name: 'Oheya',
                short_name: 'Oheya',
                theme_color: '#000000',
                icons: [
                    {
                        src: 'icon-32.png',
                        sizes: '32x32',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-1024.png',
                        sizes: '1024x1024',
                        type: 'image/png'
                    }
                ]
            },
            devOptions: {
                enabled: true
            }
        })
    ]
});
