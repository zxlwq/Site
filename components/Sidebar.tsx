
import React, { useState } from 'react';
import { Category } from '../types';
import Icon from './Icon';

interface SidebarProps {
  categories: Category[];
  activeCategoryId?: string;
  onAddCategory?: () => void;
  logoText: string;
  logoImage?: string | null;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, activeCategoryId, onAddCategory, logoText, logoImage, collapsed = false, onToggleCollapse }) => {
  const [faviconError, setFaviconError] = useState(false);

  const scrollToCategory = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 40; // Adjust based on layout
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen
        w-20
        ${collapsed ? 'lg:w-20' : 'lg:w-64'}
        flex flex-col bg-slate-900/40 backdrop-blur-xl border-r border-white/5 z-40 transition-all duration-300
      `}
    >
      {/* Logo Area */}
      <div className="h-24 flex items-center justify-center lg:justify-start lg:px-4 border-b border-white/5 gap-3">
        {logoImage ? (
          <img src={logoImage} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-violet-500/20" />
        ) : faviconError ? (
          <div className="p-2 bg-gradient-to-tr from-violet-600 to-cyan-500 rounded-xl shadow-lg shadow-violet-500/20 flex-shrink-0">
            <Icon name="Grid" className="text-white" size={24} />
          </div>
        ) : (
          <img 
            src="/favicon.ico" 
            alt="Logo" 
            className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-violet-500/20 flex-shrink-0"
            onError={() => setFaviconError(true)}
            onLoad={() => setFaviconError(false)}
          />
        )}
        {!collapsed && (
          <h1 className="hidden lg:block text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-secondary via-fuchsia-300 to-violet-400 truncate" title={logoText}>
            {logoText}
          </h1>
        )}
      </div>

      {/* Collapse / Expand Control */}
      <div className="hidden lg:flex items-center justify-center border-b border-white/5 py-2">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center w-8 h-8 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shadow-[0_0_0_rgba(129,140,248,0)] hover:shadow-[0_0_15px_rgba(129,140,248,0.8)]"
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <Icon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => scrollToCategory(category.id)}
            className={`
              relative w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all duration-200 group
              hover:bg-white/5
            `}
            title={category.title}
          >
            {/* Glow background */}
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-violet-600/60 to-cyan-500/60 opacity-0 blur-sm group-hover:opacity-60 transition duration-300 pointer-events-none"></div>

            <div className="relative flex items-center justify-center lg:justify-start gap-3">
              {/* Icon */}
              <div className={`
                transition-colors
                ${activeCategoryId === category.id ? 'text-violet-400' : 'text-slate-400 group-hover:text-violet-400'}
              `}>
                <Icon name={category.icon || 'Hash'} size={22} />
              </div>
              {!collapsed && (
                <span className={`
                  hidden lg:block font-medium transition-colors truncate
                  ${activeCategoryId === category.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}
                `}>
                  {category.title}
                </span>
              )}
            </div>
          </button>
        ))}

        {/* Add Category Button */}
        <button
          onClick={onAddCategory}
          className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl transition-all duration-200 group border border-dashed border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5 mt-4"
          title="添加分类"
        >
          <div className="text-slate-500 group-hover:text-violet-400">
            <Icon name="Plus" size={22} />
          </div>
          {!collapsed && (
            <span className="hidden lg:block font-medium text-slate-500 group-hover:text-violet-300">
              添加分类
            </span>
          )}
        </button>
      </nav>

      {/* Footer / Extra Actions */}
      <div className="p-4 border-t border-white/5 flex flex-col items-center justify-center gap-4">
        <a 
          href="https://github.com/zxlwq" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 text-white hover:text-slate-300 transition-colors w-full p-2 rounded-lg hover:bg-white/5"
        >
          <Icon name="Github" size={20} />
          {!collapsed && (
            <span className="hidden lg:block text-sm">GitHub</span>
          )}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
