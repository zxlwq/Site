import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (data: any) => void;
  onUpdateBackground: (bgImage: string | null) => void;
  currentBackground: string | null;
  logoText: string;
  onUpdateLogoText: (text: string) => void;
  logoImage: string | null;
  onUpdateLogoImage: (image: string | null) => void;
}

type TabType = 'appearance' | 'system';

const Settings: React.FC<SettingsProps> = ({ 
  isOpen, 
  onClose, 
  onReset, 
  onExport, 
  onImport,
  onUpdateBackground,
  currentBackground,
  logoText,
  onUpdateLogoText,
  logoImage,
  onUpdateLogoImage
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  
  // Background State
  const [bgUrl, setBgUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Import Config State
  const importFileRef = useRef<HTMLInputElement>(null);

  // Logo State
  const [localLogoText, setLocalLogoText] = useState(logoText);
  const [logoUrl, setLogoUrl] = useState('');
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [faviconError, setFaviconError] = useState(false);

  useEffect(() => {
    setLocalLogoText(logoText);
    // Reset favicon error state when modal opens
    if (isOpen) {
      setFaviconError(false);
    }
  }, [logoText, isOpen]);

  if (!isOpen) return null;

  // --- Handlers ---
  const handleBgUrlSubmit = () => {
    if (bgUrl.trim()) {
      onUpdateBackground(bgUrl.trim());
      setBgUrl('');
    }
  };

  const handleBgFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) alert("图片建议小于 2MB。");
      const reader = new FileReader();
      reader.onload = (e) => {
        try { onUpdateBackground(e.target?.result as string); } 
        catch (error) { alert("图片过大无法保存。"); }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoBlur = () => {
    if (localLogoText.trim() !== logoText) {
      onUpdateLogoText(localLogoText.trim() || '科技刘导航站');
    }
  };

  const handleLogoUrlSubmit = () => {
    if (logoUrl.trim()) {
      onUpdateLogoImage(logoUrl.trim());
      setLogoUrl('');
    }
  };

  const handleLogoFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) alert("Logo 建议小于 1MB。");
      const reader = new FileReader();
      reader.onload = (e) => {
        try { onUpdateLogoImage(e.target?.result as string); } 
        catch (error) { alert("图片过大无法保存。"); }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        onImport(json);
      } catch (error) {
        alert("文件格式错误，无法解析 JSON。");
      }
    };
    reader.readAsText(file);
    // Reset to allow selecting same file again
    event.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      
      {/* Main Container: Glassmorphism Effect */}
      <div className="relative w-full max-w-4xl h-[650px] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-72 bg-white/5 border-r border-white/5 flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 text-white pl-2">
            <h2 className="text-2xl font-bold tracking-tight">设置</h2>
          </div>

          <nav className="flex-1 space-y-3">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 text-base font-medium
                ${activeTab === 'appearance' 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <Icon name="Palette" size={22} />
              个性化
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 text-base font-medium
                ${activeTab === 'system' 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <Icon name="Database" size={22} />
              系统与数据
            </button>
          </nav>

          <div className="text-xs text-slate-500 text-center mt-auto pt-4 border-t border-white/5">
            科技刘导航站 v1.0
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent">
          {/* Header */}
          <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/5 shrink-0">
            <h3 className="text-xl font-medium text-white">
              {activeTab === 'appearance' ? '外观与风格' : '系统管理'}
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
              <Icon name="X" size={24} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            
            {/* --- Appearance Tab --- */}
            {activeTab === 'appearance' && (
              <div className="space-y-12">
                
                {/* Logo Section */}
                <section className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-white">站点标识</h4>
                    <span className="text-sm text-slate-500">自定义左上角的 Logo 与标题</span>
                  </div>

                  <div className="flex items-start gap-10">
                     {/* Logo Preview */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-32 h-32 rounded-2xl bg-slate-800/50 border border-white/10 flex items-center justify-center overflow-hidden group shadow-xl">
                        {logoImage ? (
                          <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
                        ) : faviconError ? (
                          <div className="w-full h-full bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center">
                            <Icon name="Grid" className="text-white" size={48} />
                          </div>
                        ) : (
                          <img 
                            src="/favicon.ico" 
                            alt="Logo" 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              setFaviconError(true);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                            onLoad={() => setFaviconError(false)}
                          />
                        )}
                        {logoImage && (
                          <button 
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer border-none" 
                            onClick={() => onUpdateLogoImage(null)}
                            title="删除图片"
                          >
                            <Icon name="Trash2" className="text-red-400" size={28} />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 mt-1">Logo 预览</p>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-6 pt-1">
                       <div>
                          <label className="text-sm font-medium text-slate-300 mb-2.5 block">网站标题文字</label>
                          <input 
                            type="text" 
                            value={localLogoText}
                            onChange={(e) => setLocalLogoText(e.target.value)}
                            onBlur={handleLogoBlur}
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-5 py-3 text-base text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                            placeholder="输入网站名称"
                          />
                       </div>

                       <div>
                          <label className="text-sm font-medium text-slate-300 mb-2.5 block">Logo 图片</label>
                          <div className="flex gap-4">
                             <div className="flex-1 relative">
                                <input 
                                  type="text"
                                  value={logoUrl}
                                  onChange={(e) => setLogoUrl(e.target.value)}
                                  placeholder="粘贴图片 URL..."
                                  className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-5 pr-12 py-3 text-sm text-white focus:border-violet-500 outline-none"
                                />
                                <button 
                                  onClick={handleLogoUrlSubmit} 
                                  disabled={!logoUrl}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-violet-400 disabled:opacity-30 transition-colors"
                                >
                                   <Icon name="Check" size={18} />
                                </button>
                             </div>
                             <input type="file" ref={logoFileInputRef} onChange={handleLogoFileUpload} accept="image/*" className="hidden" />
                             <button 
                                onClick={() => logoFileInputRef.current?.click()} 
                                className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700 text-slate-200 rounded-xl text-sm border border-white/10 transition-colors flex items-center gap-2 font-medium"
                             >
                                <Icon name="Upload" size={18} /> 本地上传
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                </section>

                <div className="h-px bg-white/5 w-full" />

                {/* Background Section */}
                <section className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-white">全局背景</h4>
                    <span className="text-sm text-slate-500">设置整个页面的壁纸</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {/* Preview Card */}
                     <div className="relative rounded-2xl overflow-hidden bg-slate-800/50 aspect-video md:aspect-auto border border-white/10 group shadow-lg">
                        {currentBackground ? (
                          <img src={currentBackground} alt="Bg" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
                             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                               <Icon name="Image" size={24} className="text-slate-500"/>
                             </div>
                             <span className="text-sm text-slate-500">默认背景</span>
                          </div>
                        )}
                        {currentBackground && (
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                             <button onClick={() => onUpdateBackground(null)} className="text-white text-sm bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2 transition-colors">
                               <Icon name="RotateCcw" size={14} /> 恢复默认
                             </button>
                           </div>
                        )}
                     </div>

                     {/* Actions */}
                     <div className="md:col-span-2 space-y-6">
                        <div>
                          <label className="text-sm font-medium text-slate-300 mb-2.5 block">网络图片地址</label>
                          <div className="relative">
                            <input 
                                type="text"
                                value={bgUrl}
                                onChange={(e) => setBgUrl(e.target.value)} 
                                placeholder="粘贴高清图片 URL..."
                                className="w-full bg-slate-800/50 border border-white/10 rounded-xl pl-5 pr-12 py-3 text-sm text-white focus:border-violet-500 outline-none"
                            />
                            <button 
                              onClick={handleBgUrlSubmit} 
                              disabled={!bgUrl}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-violet-400 disabled:opacity-30 transition-colors"
                            >
                                <Icon name="Check" size={18} />
                            </button>
                          </div>
                        </div>

                        <div>
                           <label className="text-sm font-medium text-slate-300 mb-2.5 block">或从本地上传</label>
                           <input type="file" ref={fileInputRef} onChange={handleBgFileUpload} accept="image/*" className="hidden" />
                           <button 
                             onClick={() => fileInputRef.current?.click()} 
                             className="w-full py-3 border border-dashed border-white/20 rounded-xl text-sm text-slate-400 hover:text-white hover:border-violet-500/50 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2 bg-slate-800/20"
                           >
                             <Icon name="Upload" size={18} /> 选择图片文件 (建议 1920x1080)
                           </button>
                        </div>
                     </div>
                  </div>
                </section>
              </div>
            )}

            {/* --- System Tab --- */}
            {activeTab === 'system' && (
              <div className="space-y-10">
                 {/* Backup */}
                 <section className="flex flex-col gap-5">
                    <h4 className="text-lg font-semibold text-white">数据备份</h4>
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-slate-800/30">
                       <div className="max-w-md">
                          <p className="text-base text-slate-200 font-medium">导出配置文件</p>
                          <p className="text-sm text-slate-500 mt-1">将您的所有分类和链接数据下载为 JSON 文件。</p>
                       </div>
                       <button onClick={onExport} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-white/10 text-sm flex items-center gap-2 transition-colors font-medium">
                          <Icon name="Download" size={18} /> 导出
                       </button>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-2xl border border-white/5 bg-slate-800/30">
                       <div className="max-w-md">
                          <p className="text-base text-slate-200 font-medium">导入配置文件</p>
                          <p className="text-sm text-slate-500 mt-1">从 JSON 文件恢复您的分类和链接数据。</p>
                       </div>
                       <input type="file" ref={importFileRef} onChange={handleImportFile} accept=".json" className="hidden" />
                       <button onClick={() => importFileRef.current?.click()} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-white/10 text-sm flex items-center gap-2 transition-colors font-medium">
                          <Icon name="UploadCloud" size={18} /> 导入
                       </button>
                    </div>
                 </section>

                 <div className="h-px bg-white/5 w-full" />

                 {/* Danger Zone */}
                 <section className="flex flex-col gap-5">
                    <h4 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                       <Icon name="AlertTriangle" size={20} /> 危险区域
                    </h4>
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                       <div className="max-w-md">
                          <p className="text-base text-red-200 font-medium">重置所有数据</p>
                          <p className="text-sm text-red-500/70 mt-1">此操作将清除所有本地缓存和设置，且无法撤销。</p>
                       </div>
                       <button onClick={onReset} className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/30 rounded-xl text-sm flex items-center gap-2 transition-all font-medium">
                          <Icon name="RotateCcw" size={18} /> 确认重置
                       </button>
                    </div>
                 </section>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;