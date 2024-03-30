import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import comlink from 'vite-plugin-comlink';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        chunkSizeWarningLimit: 1024,
    },
    server: {
        port: 2014,
    },
    plugins: [comlink(), react()],
    worker: {
        plugins: () => [comlink()],
    },
});
