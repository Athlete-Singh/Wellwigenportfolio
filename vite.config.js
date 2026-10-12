import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// OLD CODE (commented by AI)
/*
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,
    host: true,
    allowedHosts: [
      'document-carwash-oxidant.ngrok-free.dev',
      'localhost',
      '.ngrok-free.dev',
      '.ngrok.io',
    ],
    proxy: {
      '/consultation': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
*/
// NEW CODE - performance optimization: vendor chunk splitting, esbuild console drop, modern build target
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177,
    host: true,
    allowedHosts: [
      'document-carwash-oxidant.ngrok-free.dev',
      'localhost',
      '.ngrok-free.dev',
      '.ngrok.io',
    ],
    proxy: {
      '/consultation': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react-router-dom') || id.includes('react-helmet-async')) {
              return 'vendor-router';
            }
            if (id.includes('react-dom') || id.includes('react/')) {
              return 'vendor-react';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('socket.io-client')) {
              return 'vendor-socket';
            }
          }
        },
      },
    },
  },
})