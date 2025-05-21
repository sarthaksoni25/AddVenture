import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  plugins: [react()],
  server: {
    ...(isDev && {
      https: {
        key: fs.readFileSync('../certs/key.pem'),
        cert: fs.readFileSync('../certs/cert.pem'),
      },
    }),
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
