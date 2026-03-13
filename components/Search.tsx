import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { SEARCH_ENGINE_OPTIONS } from '../constants';

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEngine, setSelectedEngine] = useState(SEARCH_ENGINE_OPTIONS[0]);
  const [isEngineOpen, setIsEngineOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isEngineOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-engine-selector') && !target.closest('.search-engine-dropdown')) {
        setIsEngineOpen(false);
        setButtonPosition(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEngineOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if it's a URL
    if (query.match(/^(http|https):\/\/[^ "]+$/)) {
      window.location.href = query;
      return;
    }

    // Use selected engine
    window.location.href = `${selectedEngine.url}${encodeURIComponent(query)}`;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const handleEngineSelect = (id: string) => {
    const engine = SEARCH_ENGINE_OPTIONS.find(opt => opt.id === id);
    if (engine) {
      setSelectedEngine(engine);
      setIsEngineOpen(false);
      setButtonPosition(null);
    }
  };

  const updateButtonPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setButtonPosition({
        top: rect.bottom + 12,
        left: rect.left
      });
    }
  };

  const handleToggleDropdown = () => {
    if (!isEngineOpen) {
      updateButtonPosition();
      setIsEngineOpen(true);
    } else {
      setIsEngineOpen(false);
      setButtonPosition(null);
    }
  };

  // Update position on scroll and resize
  useEffect(() => {
    if (!isEngineOpen) return;
    
    const handleUpdate = () => {
      updateButtonPosition();
    };
    
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);
    
    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isEngineOpen]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto mb-12 relative z-10">
       <div className="mb-8 text-center animate-fade-in-down relative">
        {/* Glow Effect for Time */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-violet-600/30 to-cyan-500/30 blur-[60px] rounded-full pointer-events-none"></div>

        <h1 className="relative z-10 text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-secondary tracking-tighter drop-shadow-lg">
          {currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </h1>
        <p className="relative z-10 text-slate-400 mt-2 text-lg font-light tracking-wide uppercase">
          {currentTime.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <form onSubmit={handleSearch} className="w-full relative group" autoComplete="off">
        {/* Glow Effect - Enhanced opacity when not focused */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full blur opacity-60 group-focus-within:opacity-100 transition duration-500 group-hover:opacity-80"></div>
        
        <div className="relative flex items-center search-engine-selector">
          {/* Engine Selector inside input container */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
            <button
              ref={buttonRef}
              type="button"
              onClick={handleToggleDropdown}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/95 border border-white/20 text-xs md:text-sm text-slate-100 hover:border-violet-400 hover:text-violet-200 hover:bg-slate-700/95 transition-colors shadow-lg"
            >
              <img 
                src={`https://www.google.com/s2/favicons?domain=${selectedEngine.url.split('/')[2]}&sz=16`}
                alt=""
                className="w-4 h-4 object-contain flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="truncate max-w-[80px] md:max-w-[120px]">{selectedEngine.label}</span>
              <Icon
                name="ChevronDown"
                size={14}
                className={`transition-transform flex-shrink-0 ${isEngineOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInput}
            placeholder="搜索网站..."
            className="w-full py-4 pl-36 pr-10 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full text-lg text-white placeholder-slate-500 shadow-2xl focus:outline-none focus:ring-1 focus:ring-white/20 transition-all relative z-10"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
             {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="p-2 text-slate-500 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                title="清除"
              >
                <Icon name="X" size={18} />
              </button>
            )}
          </div>

          {/* Dropdown Panel - Rendered via Portal to body */}
          {isEngineOpen && buttonPosition && typeof document !== 'undefined' && createPortal(
            <div 
              className="search-engine-dropdown fixed w-60 max-h-72 overflow-y-auto rounded-2xl bg-slate-900/95 border border-white/10 shadow-2xl backdrop-blur-xl z-[9999]"
              style={{
                top: `${buttonPosition.top}px`,
                left: `${buttonPosition.left}px`
              }}
            >
              <div className="py-2">
                {SEARCH_ENGINE_OPTIONS.map((engine) => (
                  <button
                    key={engine.id}
                    type="button"
                    onClick={() => handleEngineSelect(engine.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${
                      engine.id === selectedEngine.id
                        ? 'text-violet-200 bg-violet-500/15'
                        : 'text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{engine.label}</span>
                    {engine.id === selectedEngine.id && (
                      <Icon name="Check" size={14} className="text-violet-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )}
        </div>
      </form>
    </div>
  );
};

export default Search;