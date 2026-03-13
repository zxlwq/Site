/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PASSWORD?: string;

  /**
   * 默认 AI 提供商：
   * gemini | openai | qwen | volcengine | nvidia
   */
  readonly AI_PROVIDER?: string;

  /** 各家 AI 提供商的 API Key */
  readonly GEMINI_API_KEY?: string;
  readonly OPENAI_API_KEY?: string;
  readonly QWEN_API_KEY?: string;
  readonly VOLCENGINE_API_KEY?: string;
  readonly NVIDIA_API_KEY?: string;

  /** 可选：各家模型名称（不填则使用内置默认值） */
  readonly OPENAI_MODEL?: string;
  readonly QWEN_MODEL?: string;
  readonly VOLCENGINE_MODEL?: string;
  readonly NVIDIA_MODEL?: string;

  /**
   * Upstash Redis（用于 Vercel / Netlify / 其它 Node 平台的云端同步）
   */
  readonly UPSTASH_REDIS_REST_URL?: string;
  readonly UPSTASH_REDIS_REST_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface ProcessEnv {
    PASSWORD?: string;

    AI_PROVIDER?: string;
    GEMINI_API_KEY?: string;
    OPENAI_API_KEY?: string;
    QWEN_API_KEY?: string;
    VOLCENGINE_API_KEY?: string;
    NVIDIA_API_KEY?: string;

    OPENAI_MODEL?: string;
    QWEN_MODEL?: string;
    VOLCENGINE_MODEL?: string;
    NVIDIA_MODEL?: string;

    UPSTASH_REDIS_REST_URL?: string;
    UPSTASH_REDIS_REST_TOKEN?: string;
  }
}

