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

const cleanShortChineseDescription = (text: string): string => {
  const noMd = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();

  // 去掉常见标点与换行空格
  const noPunc = noMd
    .replace(/[\r\n\t]/g, " ")
    .replace(/[，。！？、；：,.!?:;'"“”‘’（）()【】[\]<>《》]/g, "")
    .replace(/\s+/g, "");

  return noPunc.slice(0, 15);
};

export const generateLinkDescription = async (
  provider: AIProvider,
  title: string,
  url: string
): Promise<string> => {
  const prompt = `请根据以下网站信息，生成一个非常简短的中文描述（不超过15个字，不要包含标点符号，不要换行）：
网站标题: ${title || "（空）"}
网站链接: ${url || "（空）"}

只输出描述文本：`;

  const text = await callBackendAI(provider, [], prompt);
  return cleanShortChineseDescription(text);
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

