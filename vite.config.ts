import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    port: 3001,
    host: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@demo': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
