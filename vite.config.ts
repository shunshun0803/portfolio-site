import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/portfolio-site/',
  build: {
    // three.js のチャンク（約880kB）は遅延読み込みで初回表示に含まれないので、警告の閾値を上げる
    chunkSizeWarningLimit: 1000,
  },
})
