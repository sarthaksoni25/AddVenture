console.log('vite config loaded');
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // 👇 add this block
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
