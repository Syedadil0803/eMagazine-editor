import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    port: 3001,
    host: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
