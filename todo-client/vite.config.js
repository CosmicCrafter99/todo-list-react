import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/todo-list-react/todo-client/', // Путь до приложения
    server: {
        open: true,
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001/', // URL бэкенда
                changeOrigin: true,
            },
        },
    },
});