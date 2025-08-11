import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
<<<<<<< HEAD
=======
  base: './',
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './assets'),
    },
  },
  server: {
<<<<<<< HEAD
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
=======
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
      }
    }
  }
});