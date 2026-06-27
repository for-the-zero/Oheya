import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
    root: 'src',
    base: './',
    host: '0.0.0.0',
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        assetsDir: '',
        rollupOptions: {
            onwarn(warning, warn) {
                if((warning as { code?: string }).code === 'INVALID_ANNOTATION'){return;};
                warn(warning);
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]',
            },
        },
    },
    plugins: [
        vue({vapor: true}),
        tailwindcss(),
        vueDevTools(),
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
