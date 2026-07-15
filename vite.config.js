import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/sass/app.scss', 'resources/js/index.tsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: Number(process.env.VITE_PORT ?? 5180),
        strictPort: false,
        hmr: {
            host: 'localhost',
        },
        watch: {
            usePolling: !!process.env.LARAVEL_SAIL,
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                loadPaths: ['node_modules'],
            },
        },
    },
    resolve: {
        alias: {
            process: 'process/browser',
        },
    },
    optimizeDeps: {
        include: ['process/browser'],
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
});
