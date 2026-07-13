import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 使用最标准的 Vite 配置
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
})
