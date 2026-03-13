import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Using the flash model for quick, responsive chat
const MODEL_NAME = 'gemini-2.5-flash';

// Lazy initialization singleton
let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("Google Gemini API Key is missing. Please check your environment variables.");
      throw new Error("API Key is missing");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const createChatSession = (): Chat => {
  try {
    const ai = getAI();
    return ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: "你叫科技刘，是一个嵌入在 Web 导航仪表盘中的智能 AI 助手。请用简体中文回答。保持回答简洁、专业，适合开发者和极客用户。使用 Markdown 格式化文本。",
      },
    });
  } catch (error) {
    console.error("Failed to create chat session:", error);
    throw error;
  }
};

export const sendMessageToGeminiStream = async (
  chat: Chat,
  message: string
): Promise<AsyncIterable<GenerateContentResponse>> => {
  try {
    const streamResult = await chat.sendMessageStream({ message });
    return streamResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Generates a short description for a website based on its title and URL.
 */
export const generateLinkDescription = async (title: string, url: string): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `请根据以下网站信息，生成一个非常简短的中文描述（不超过15个字，不要包含标点符号）：
    网站标题: ${title}
    网站链接: ${url}
    
    描述：`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Description Generation Error:", error);
    return "";
  }
};