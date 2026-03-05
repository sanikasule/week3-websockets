import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": "/src" },
  },
  base: '/week3-websockets/',
  server: {
    proxy: {
      '/v1': {
        target: 'https://preprodapisix.omnenest.com',
        changeOrigin: true,
        secure: false,
      },
      '/v2': {
        target: 'https://preprodapisix.omnenest.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
