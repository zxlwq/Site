import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import Icon, { Icons } from './Icon';

interface CatModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
  onSave: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
}

const CatModal: React.FC<CatModalProps> = ({ isOpen, category, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Hash');
  const [iconSearch, setIconSearch] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      if (category) {
        setTitle(category.title);
        setSelectedIcon(category.icon || 'Hash');
      } else {
        setTitle('');
        setSelectedIcon('Hash');
      }
      setIconSearch('');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: category ? category.id : Date.now().toString(),
      title,
      icon: selectedIcon,
      links: category ? category.links : []
    });
    onClose();
  };

  const handleDelete = () => {
    if (category && onDelete) {
      if (window.confirm(`确定要删除分类 "${category.title}" 及其所有链接吗？`)) {
        onDelete(category.id);
        onClose();
      }
    }
  };

  // Filter icons based on search
  const filteredIcons = Object.keys(Icons).filter(iconName => 
    iconName.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl transform transition-all scale-100 flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Icon name={category ? "Edit2" : "Plus"} size={20} className="text-violet-400" />
            {category ? '编辑分类' : '新建分类'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
            <Icon name="X" size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">分类名称</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                placeholder="例如：常用工具"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-3">选择图标</label>
              
              {/* Icon Search */}
              <div className="relative mb-3">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="搜索图标..."
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-6 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                {filteredIcons.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`
                      p-2 rounded-lg flex items-center justify-center transition-all aspect-square
                      ${selectedIcon === iconName 
                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 ring-1 ring-white/20' 
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}
                    `}
                    title={iconName}
                  >
                    <Icon name={iconName} size={20} />
                  </button>
                ))}
                {filteredIcons.length === 0 && (
                  <div className="col-span-6 text-center text-slate-500 py-4 text-sm">
                    未找到相关图标
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 mt-4 border-t border-white/5 flex-shrink-0">
             {category && onDelete && (
              <button 
                type="button" 
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors mr-auto"
                title="删除分类"
              >
                <Icon name="Trash2" size={18} />
              </button>
            )}

            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors ml-auto"
            >
              取消
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors flex items-center gap-2"
            >
              <Icon name="Check" size={18} />
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatModal;