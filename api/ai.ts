import type { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const body = req.body as RequestBody;
    const { provider, historyMessages, latestQuestion } = body;

    let text = "";

    switch (provider) {
      case "gemini": {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error("GEMINI_API_KEY 未配置");
        text = await callGemini(apiKey, historyMessages, latestQuestion);
        break;
      }

      case "openai": {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error("OPENAI_API_KEY 未配置");
        const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
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
        const apiKey = process.env.QWEN_API_KEY;
        if (!apiKey) throw new Error("QWEN_API_KEY 未配置");
        const model = process.env.QWEN_MODEL || "qwen-plus";
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
        const apiKey = process.env.VOLCENGINE_API_KEY;
        if (!apiKey) throw new Error("VOLCENGINE_API_KEY 未配置");
        const model = process.env.VOLCENGINE_MODEL || "ep-xxxxxxxx";
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
        const apiKey = process.env.NVIDIA_API_KEY;
        if (!apiKey) throw new Error("NVIDIA_API_KEY 未配置");
        const model = process.env.NVIDIA_MODEL || "gpt-4.1-mini";
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
        res.status(400).json({ error: "Unsupported provider" });
        return;
    }

    res.status(200).json({ text });
  } catch (err: any) {
    console.error("AI proxy error:", err);
    const message = err?.message || "Unknown error";
    res.status(500).json({ error: message });
  }
}

