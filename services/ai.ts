import type { ChatMessage } from "../types";
import { AIProvider, MessageRole } from "../types";

export interface AIStreamChunk {
  text: string;
}

const getEnv = (key: string): string | undefined => {
  // 兼容 Node 端与 Vite 前端
  if (typeof process !== "undefined" && process.env && process.env[key] !== undefined) {
    return process.env[key];
  }
  if (typeof import.meta !== "undefined" && (import.meta as any).env && (import.meta as any).env[key] !== undefined) {
    return (import.meta as any).env[key];
  }
  return undefined;
};

const getDefaultProvider = (): AIProvider => {
  const raw = (getEnv("AI_PROVIDER") || "gemini").toLowerCase();
  switch (raw) {
    case "openai":
      return AIProvider.OPENAI;
    case "qwen":
    case "dashscope":
      return AIProvider.QWEN;
    case "volcengine":
    case "ark":
      return AIProvider.VOLCENGINE;
    case "nvidia":
      return AIProvider.NVIDIA;
    default:
      return AIProvider.GEMINI;
  }
};

export const DEFAULT_AI_PROVIDER = getDefaultProvider();

// ===== 后端代理实现（Gemini + OpenAI + Qwen + Volcengine + NVIDIA 统一走 Cloudflare Functions） =====

const callBackendAI = async (
  provider: AIProvider,
  historyMessages: ChatMessage[],
  latestQuestion: string
): Promise<string> => {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      provider,
      historyMessages,
      latestQuestion,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI 后端错误：${res.status} ${text}`);
  }

  const json = await res.json();
  return json.text ?? "";
};

// ===== 对外统一入口 =====

export async function* sendMessageStream(
  provider: AIProvider,
  historyMessages: ChatMessage[],
  latestQuestion: string
): AsyncIterable<AIStreamChunk> {
  switch (provider) {
    case AIProvider.GEMINI: {
      const text = await callBackendAI(provider, historyMessages, latestQuestion);
      if (text) {
        yield { text };
      }
      break;
    }

    case AIProvider.OPENAI: {
      const text = await callBackendAI(provider, historyMessages, latestQuestion);
      if (text) {
        yield { text };
      }
      break;
    }

    case AIProvider.QWEN: {
      const text = await callBackendAI(provider, historyMessages, latestQuestion);
      if (text) {
        yield { text };
      }
      break;
    }

    case AIProvider.VOLCENGINE: {
      const text = await callBackendAI(provider, historyMessages, latestQuestion);
      if (text) {
        yield { text };
      }
      break;
    }

    case AIProvider.NVIDIA: {
      const text = await callBackendAI(provider, historyMessages, latestQuestion);
      if (text) {
        yield { text };
      }
      break;
    }

    default: {
      const text = await callBackendAI(provider, historyMessages, latestQuestion);
      if (text) {
        yield { text };
      }
      break;
    }
  }
}

