
export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string; // Optional URL or Lucide icon name
  description?: string;
}

export interface Category {
  id: string;
  title: string;
  icon?: string;
  links: LinkItem[];
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  isStreaming?: boolean;
}

export interface AppConfig {
  userName: string;
  searchEngineUrl: string;
}

export enum AIProvider {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  QWEN = 'qwen',
  VOLCENGINE = 'volcengine',
  NVIDIA = 'nvidia',
}
