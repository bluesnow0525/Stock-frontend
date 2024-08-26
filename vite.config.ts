import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 指定端口
    open: true, // 自动打开浏览器
  },
  preview: {
    port: 5174, // 设置预览时的端口号
  },
  esbuild: {
    target: 'esnext',  // 配置为支持 Top-level await 的目标环境
  },
});
