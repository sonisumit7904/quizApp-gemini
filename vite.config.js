import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();

// const targetUrl = 'http://localhost:8080';
const targetUrl = 'https://quiz2-utkarsh.up.railway.app';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_GOOGLE_API_KEY': JSON.stringify(process.env.VITE_GOOGLE_API_KEY)
  },
  server: {
    proxy: {
      '/Quiz': {
        target: targetUrl,
        changeOrigin: true,
        secure: false,
      },
      '/Question': {
        target: targetUrl,
        changeOrigin: true,
        secure: false,
      }
    }
  }
})