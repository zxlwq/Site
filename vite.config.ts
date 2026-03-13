import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // 把第三方依赖单独拆成 vendor 包
            vendor: ['react', 'react-dom', 'react-markdown', '@google/genai'],
            dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          },
        },
      },
      // 可选：把默认 500k 的警告阈值稍微放宽一点
      chunkSizeWarningLimit: 800,
    },
    define: {
      // Cloudflare Pages exposes environment variables at build time
      // 把用到的环境变量注入到前端 bundle 中
      'process.env.PASSWORD': JSON.stringify(env.PASSWORD || process.env.PASSWORD || ''),
      'process.env.AI_PROVIDER': JSON.stringify(env.AI_PROVIDER || process.env.AI_PROVIDER || ''),

      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''),
      'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY || process.env.OPENAI_API_KEY || ''),
      'process.env.QWEN_API_KEY': JSON.stringify(env.QWEN_API_KEY || process.env.QWEN_API_KEY || ''),
      'process.env.VOLCENGINE_API_KEY': JSON.stringify(env.VOLCENGINE_API_KEY || process.env.VOLCENGINE_API_KEY || ''),
      'process.env.NVIDIA_API_KEY': JSON.stringify(env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY || ''),

      'process.env.OPENAI_MODEL': JSON.stringify(env.OPENAI_MODEL || process.env.OPENAI_MODEL || ''),
      'process.env.QWEN_MODEL': JSON.stringify(env.QWEN_MODEL || process.env.QWEN_MODEL || ''),
      'process.env.VOLCENGINE_MODEL': JSON.stringify(env.VOLCENGINE_MODEL || process.env.VOLCENGINE_MODEL || ''),
      'process.env.NVIDIA_MODEL': JSON.stringify(env.NVIDIA_MODEL || process.env.NVIDIA_MODEL || ''),

      'process.env.UPSTASH_REDIS_REST_URL': JSON.stringify(env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_URL || ''),
      'process.env.UPSTASH_REDIS_REST_TOKEN': JSON.stringify(env.UPSTASH_REDIS_REST_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''),
    },
  };
});