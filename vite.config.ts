import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import comlink from 'vite-plugin-comlink';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [comlink(), react()],
    server: {
        port: 2014,
    },
    worker: {
        plugins: () => [comlink()],
    },
});
