import React, { useState, useEffect } from 'react';
import { LinkItem } from '../types';
import Icon from './Icon';
import { generateLinkDescription } from '../services/gemini';

interface LinkModalProps {
  isOpen: boolean;
  link?: LinkItem | null; // Optional/Null means creating a new link
  onClose: () => void;
  onSave: (updatedLink: LinkItem) => void;
}

const LinkModal: React.FC<LinkModalProps> = ({ isOpen, link, onClose, onSave }) => {
  const [formData, setFormData] = useState<LinkItem>({ id: '', title: '', url: '', description: '', icon: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (link) {
        setFormData(link);
      } else {
        // Reset for new link
        setFormData({ id: '', title: '', url: '', description: '', icon: '' });
      }
    }
  }, [link, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleGenerateDescription = async () => {
    if (!formData.title && !formData.url) {
      alert("请先填写标题或网址，以便 AI 生成描述。");
      return;
    }

    setIsGenerating(true);
    try {
      const desc = await generateLinkDescription(formData.title, formData.url);
      if (desc) {
        setFormData(prev => ({ ...prev, description: desc }));
      } else {
        alert("AI 暂时无法生成描述，请稍后再试。");
      }
    } catch (error) {
      console.error(error);
      alert("生成失败，请检查网络设置。");
    } finally {
      setIsGenerating(false);
    }
  };

  const isEditMode = !!link;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all scale-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Icon name={isEditMode ? "Edit2" : "Plus"} size={20} className="text-violet-400" />
            {isEditMode ? '编辑链接' : '添加链接'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
            <Icon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">标题</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              placeholder="例如 GitHub"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              自定义图标 <span className="text-xs text-slate-500">(可选)</span>
            </label>
            <input
              type="text"
              value={formData.icon || ''}
              onChange={e => setFormData({ ...formData, icon: e.target.value })}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              placeholder="https://... 或 Lucide 图标名（如 Github）"
            />
            <p className="mt-1 text-xs text-slate-500">填入图标 URL 将直接显示图片，填入 Lucide 图标名称则显示矢量图标。</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">网址 (URL)</label>
            <input 
              type="url" 
              required
              value={formData.url}
              onChange={e => setFormData({...formData, url: e.target.value})}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1 flex justify-between items-center">
              <span>描述</span>
              <span className="text-xs text-slate-500">AI 辅助</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.description || ''}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="简短描述"
              />
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating || (!formData.title && !formData.url)}
                className={`
                  absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all
                  ${isGenerating ? 'bg-violet-500/20 text-violet-300' : 'text-slate-400 hover:text-violet-400 hover:bg-white/5'}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                title="AI 智能生成描述"
              >
                <Icon 
                  name={isGenerating ? "Loader2" : "Sparkles"} 
                  size={16} 
                  className={isGenerating ? "animate-spin" : ""} 
                />
              </button>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8 pt-4 border-t border-white/5">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit" 
              className="flex-1 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex justify-center items-center gap-2"
            >
              <Icon name="Check" size={18} />
              {isEditMode ? '保存更改' : '添加链接'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;