// Cloudflare Pages Functions: /api/ai

interface EventContext<Env, P extends string, Data> {
  request: Request;
  functionPath: string;
  waitUntil: (promise: Promise<any>) => void;
  passThroughOnException: () => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  env: Env;
  params: Record<P, string | string[]>;
  data: Data;
}

type PagesFunction<Env = unknown, Params extends string = any, Data extends Record<string, unknown> = Record<string, unknown>> = (
  context: EventContext<Env, Params, Data>
) => Response | Promise<Response>;

interface Env {
  GEMINI_API_KEY?: string;
  OPENAI_API_KEY?: string;
  QWEN_API_KEY?: string;
  VOLCENGINE_API_KEY?: string;
  NVIDIA_API_KEY?: string;

  OPENAI_MODEL?: string;
  QWEN_MODEL?: string;
  VOLCENGINE_MODEL?: string;
  NVIDIA_MODEL?: string;
}

type AIProvider = "gemini" | "openai" | "qwen" | "volcengine" | "nvidia";

interface IncomingMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

interface RequestBody {
  provider: AIProvider;
  historyMessages: IncomingMessage[];
  latestQuestion: string;
}

const buildOpenAIChatBody = (
  messages: IncomingMessage[],
  latestQuestion: string,
  model: string
) => {
  const history = messages.map((m) => ({
    role: m.role === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const allMessages = [
    {
      role: "system",
      content:
        "你叫科技刘，是一个嵌入在 Web 导航仪表盘中的智能 AI 助手。请用简体中文回答。保持回答简洁、专业，适合开发者和极客用户。使用 Markdown 格式化文本。",
    },
    ...history,
    { role: "user", content: latestQuestion },
  ];

  return {
    model,
    messages: allMessages,
    stream: false,
  };
};

const callOpenAICompatible = async (
  baseUrl: string,
  path: string,
  apiKey: string,
  model: string,
  historyMessages: IncomingMessage[],
  latestQuestion: string
): Promise<string> => {
  const body = buildOpenAIChatBody(historyMessages, latestQuestion, model);

  const url = `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upstream error: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content ?? "";
};

const callGemini = async (
  apiKey: string,
  historyMessages: IncomingMessage[],
  latestQuestion: string
): Promise<string> => {
  const history = historyMessages
    .map((m) => `${m.role === "user" ? "用户" : "助手"}: ${m.text}`)
    .join("\n");

  const prompt = `你叫科技刘，是一个嵌入在 Web 导航仪表盘中的智能 AI 助手。请用简体中文回答。保持回答简洁、专业，适合开发者和极客用户。使用 Markdown 格式化文本。

下面是最近的对话历史（可能为空）：
${history}

用户最新的问题是：
${latestQuestion}

请直接给出回答：`;

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(apiKey),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini upstream error: ${res.status} ${text}`);
  }

  const json = await res.json();
  const candidates = json.candidates ?? [];
  const first = candidates[0];
  const parts = first?.content?.parts ?? [];
  const textParts = parts
    .map((p: any) => (typeof p.text === "string" ? p.text : ""))
    .join("");
  return textParts || "";
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as RequestBody;
    const { provider, historyMessages, latestQuestion } = body;

    let text = "";

    switch (provider) {
      case "gemini": {
        const apiKey = context.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY 未配置");
        text = await callGemini(apiKey, historyMessages, latestQuestion);
        break;
      }

      case "openai": {
        const apiKey = context.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY 未配置");
        const model = context.env.OPENAI_MODEL || "gpt-4.1-mini";
        text = await callOpenAICompatible(
          "https://api.openai.com",
          "/v1/chat/completions",
          apiKey,
          model,
          historyMessages,
          latestQuestion
        );
        break;
      }

      case "qwen": {
        const apiKey = context.env.QWEN_API_KEY;
        if (!apiKey) throw new Error("QWEN_API_KEY 未配置");
        const model = context.env.QWEN_MODEL || "qwen-plus";
        text = await callOpenAICompatible(
          "https://dashscope.aliyuncs.com/compatible-mode",
          "/v1/chat/completions",
          apiKey,
          model,
          historyMessages,
          latestQuestion
        );
        break;
      }

      case "volcengine": {
        const apiKey = context.env.VOLCENGINE_API_KEY;
        if (!apiKey) throw new Error("VOLCENGINE_API_KEY 未配置");
        const model = context.env.VOLCENGINE_MODEL || "ep-xxxxxxxx";
        text = await callOpenAICompatible(
          "https://ark.cn-beijing.volces.com",
          "/api/v3/chat/completions",
          apiKey,
          model,
          historyMessages,
          latestQuestion
        );
        break;
      }

      case "nvidia": {
        const apiKey = context.env.NVIDIA_API_KEY;
        if (!apiKey) throw new Error("NVIDIA_API_KEY 未配置");
        const model = context.env.NVIDIA_MODEL || "gpt-4.1-mini";
        text = await callOpenAICompatible(
          "https://integrate.api.nvidia.com",
          "/v1/chat/completions",
          apiKey,
          model,
          historyMessages,
          latestQuestion
        );
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unsupported provider" }),
          { status: 400 }
        );
    }

    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("AI proxy error:", err);
    const message = err?.message || "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

