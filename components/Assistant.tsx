import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendMessageStream, DEFAULT_AI_PROVIDER } from '../services/ai';
import { AIProvider, ChatMessage, MessageRole } from '../types';
import Icon from './Icon';

interface AssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const Assistant: React.FC<AssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: MessageRole.MODEL,
      text: "你好！我是科技刘。今天有什么可以在代码或导航方面帮你的吗？"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<AIProvider>(DEFAULT_AI_PROVIDER);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 从本地存储恢复上次使用的 AI 提供商
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('ai_provider');
    if (saved && Object.values(AIProvider).includes(saved as AIProvider)) {
      setProvider(saved as AIProvider);
    }
  }, []);

  // 变化时写入本地存储
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('ai_provider', provider);
  }, [provider]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyText = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error('复制失败', err);
    }
  };

  const handleReeditMessage = (text: string) => {
    setInputValue(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: MessageRole.USER,
      text: inputValue
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);

    const modelMsgId = (Date.now() + 1).toString();
    // Add placeholder for streaming response
    setMessages(prev => [...prev, {
      id: modelMsgId,
      role: MessageRole.MODEL,
      text: '',
      isStreaming: true
    }]);

    try {
      const historyMessages = [...messages, newUserMsg];
      const stream = sendMessageStream(provider, historyMessages, newUserMsg.text);

      let fullText = '';
      
      for await (const chunk of stream) {
        const textChunk = chunk.text || '';
        fullText += textChunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, text: fullText }
            : msg
        ));
      }
      
      // Finalize message
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: MessageRole.MODEL,
        text: "**错误：** 无法连接到 AI。请检查您的 API 配置。"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed bg-slate-900/95 backdrop-blur-xl shadow-2xl z-50 flex flex-col transition-all duration-300
        ${isFullscreen ? 'inset-0 w-full border-none' : 'inset-y-0 right-0 w-full md:w-[450px] border-l border-white/10'}
      `}
    >
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
        <div className="flex items-center gap-2 text-violet-400">
          <Icon name="Sparkles" size={20} />
          <h2 className="font-semibold text-lg text-white">科技刘助手</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-slate-800 text-xs text-slate-200 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-violet-500"
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
          >
            <option value={AIProvider.GEMINI}>Gemini</option>
            <option value={AIProvider.OPENAI}>OpenAI</option>
            <option value={AIProvider.QWEN}>Qwen</option>
            <option value={AIProvider.VOLCENGINE}>火山方舟</option>
            <option value={AIProvider.NVIDIA}>NVIDIA</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            title={isFullscreen ? '退出全屏' : '全屏'}
          >
            <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={18} />
          </button>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            title="关闭"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'} items-start gap-2`}
          >
            {/* 左侧操作按钮：复制 / 重新编辑 */}
            <div className={`flex flex-col gap-1 ${msg.role === MessageRole.USER ? 'order-1' : 'order-1'}`}>
              {msg.text && (
                <>
                  {msg.role === MessageRole.USER && (
                    <button
                      type="button"
                      onClick={() => handleReeditMessage(msg.text)}
                      className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                      title="重新编辑"
                    >
                      <Icon name="Edit3" size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleCopyText(msg.text)}
                    className="p-1 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
                    title="复制"
                  >
                    <Icon name="Copy" size={14} />
                  </button>
                </>
              )}
            </div>

            <div 
              className={`
                order-2
                max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                ${msg.role === MessageRole.USER 
                  ? 'bg-violet-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 border border-white/5 rounded-tl-none'}
              `}
            >
              {msg.role === MessageRole.MODEL ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
              {msg.isStreaming && (
                <span className="inline-block w-2 h-4 ml-1 bg-violet-400 animate-pulse align-middle" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-slate-900/50">
        <div className="relative flex items-end gap-2 bg-slate-800/50 border border-white/10 rounded-xl p-2 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            placeholder="问点什么..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm resize-none focus:outline-none py-2 px-2 h-auto max-h-32 min-h-[40px]"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="p-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex-shrink-0"
          >
            {isLoading ? <Icon name="Loader2" className="animate-spin" size={18} /> : <Icon name="Send" size={18} />}
          </button>
        </div>
        <div className="text-xs text-slate-500 mt-2 text-center">
          使用 {provider.toUpperCase()} 提供的模型。AI 可能会犯错。
        </div>
      </div>
    </div>
  );
};

export default Assistant;