import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: ['*', '.replit.dev'],
    historyApiFallback: true,
  },
  preview: {
    host: true,
    port: 3000
  }
})