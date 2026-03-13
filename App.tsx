import React, { useState, useEffect, useRef, Suspense } from 'react';
import { DEFAULT_CATEGORIES } from './constants';
import { Category, LinkItem } from './types';
import Search from './components/Search';
import Grid from './components/Grid';
import Icon from './components/Icon';
import Sidebar from './components/Sidebar';
const Assistant = React.lazy(() => import('./components/Assistant'));
const LinkModal = React.lazy(() => import('./components/LinkModal'));
const Settings = React.lazy(() => import('./components/Settings'));
const CatModal = React.lazy(() => import('./components/CatModal'));
const PasswordModal = React.lazy(() => import('./components/Password'));
import { loadData, saveData, AppState } from './services/storage';

const App: React.FC = () => {
  // State initialization
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [searchFilter, setSearchFilter] = useState('');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Background Image State
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // Logo State
  const [logoText, setLogoText] = useState('科技刘导航站');
  const [logoImage, setLogoImage] = useState<string | null>(null);

  // Modal States
  const [linkModalData, setLinkModalData] = useState<{ categoryId: string, link?: LinkItem } | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Password Modal State
  type PasswordAction = 
    | { type: 'deleteLink'; categoryId: string; linkId: string }
    | { type: 'reset' }
    | { type: 'saveLink'; categoryId: string; linkData: LinkItem; isEdit: boolean }
    | { type: 'saveCategory'; categoryData: Category; isEdit: boolean }
    | { type: 'deleteCategory'; categoryId: string };

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordAction, setPasswordAction] = useState<PasswordAction | null>(null);

  // Initial Data Load
  useEffect(() => {
    const initApp = async () => {
      try {
        const cloudData = await loadData();
        
        if (cloudData) {
          setCategories(cloudData.categories);
          setBackgroundImage(cloudData.backgroundImage);
          setLogoText(cloudData.logoText);
          setLogoImage(cloudData.logoImage);
        } else {
          // Fallback to localStorage if KV is empty (first run or offline)
          const localCats = localStorage.getItem('nebula_categories');
          if (localCats) setCategories(JSON.parse(localCats));
          
          const localBg = localStorage.getItem('nebula_background');
          if (localBg) setBackgroundImage(localBg);

          const localLogoText = localStorage.getItem('nebula_logo_text');
          if (localLogoText) setLogoText(localLogoText);

          const localLogoImage = localStorage.getItem('nebula_logo_image');
          if (localLogoImage) setLogoImage(localLogoImage);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    initApp();
  }, []);

  // Centralized Persist Function
  // We use a ref to prevent saving during the initial load phase
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Debounce save to prevent too many API calls
    const timeoutId = setTimeout(() => {
      const currentState: AppState = {
        categories,
        backgroundImage,
        logoText,
        logoImage
      };
      
      // Save to KV (Cloud)
      saveData(currentState);

      // Also keep LocalStorage as a backup/cache
      localStorage.setItem('nebula_categories', JSON.stringify(categories));
      if (backgroundImage) localStorage.setItem('nebula_background', backgroundImage);
      else localStorage.removeItem('nebula_background');
      
      localStorage.setItem('nebula_logo_text', logoText);
      
      if (logoImage) localStorage.setItem('nebula_logo_image', logoImage);
      else localStorage.removeItem('nebula_logo_image');

    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [categories, backgroundImage, logoText, logoImage]);


  // --- State Updates Wrappers ---

  const handleCategoriesUpdate = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  const handleUpdateBackground = (bgImage: string | null) => {
      setBackgroundImage(bgImage);
  };

  const handleUpdateLogoText = (text: string) => {
    setLogoText(text);
  };

  const handleUpdateLogoImage = (image: string | null) => {
    setLogoImage(image);
  };

  const toggleAi = () => setIsAiOpen(!isAiOpen);

  // --- Link Management ---

  const handleDeleteLink = (categoryId: string, linkId: string) => {
    // Store the pending delete action and show password modal
    setPasswordAction({ type: 'deleteLink', categoryId, linkId });
    setIsPasswordModalOpen(true);
  };

  const handlePasswordConfirm = (password: string) => {
    const correctPassword = process.env.PASSWORD;
    
    if (!correctPassword) {
      alert('密码未配置，请联系管理员。');
      setIsPasswordModalOpen(false);
      setPendingDelete(null);
      return;
    }

    if (password !== correctPassword) {
      alert('密码错误，请重试。');
      return;
    }

    // Password is correct, handle action
    switch (passwordAction?.type) {
      case 'deleteLink': {
        const { categoryId, linkId } = passwordAction;
      const newCategories = categories.map(cat => {
        if (cat.id === categoryId) {
          return { ...cat, links: cat.links.filter(l => l.id !== linkId) };
        }
        return cat;
      });
      handleCategoriesUpdate(newCategories);
        break;
      }
      case 'reset': {
        setCategories(DEFAULT_CATEGORIES);
        setBackgroundImage(null);
        setLogoText('科技刘导航站');
        setLogoImage(null);

        localStorage.removeItem('nebula_categories');
        localStorage.removeItem('nebula_background');
        localStorage.removeItem('nebula_logo_text');
        localStorage.removeItem('nebula_logo_image');
        break;
      }
      case 'saveLink': {
        const { categoryId, linkData, isEdit } = passwordAction;
        const newCategories = categories.map(cat => {
          if (cat.id === categoryId) {
            if (isEdit) {
              return { 
                ...cat, 
                links: cat.links.map(l => l.id === linkData.id ? linkData : l) 
              };
            }
            return { ...cat, links: [...cat.links, linkData] };
          }
          return cat;
        });
        handleCategoriesUpdate(newCategories);
        setLinkModalData(null);
        break;
      }
      case 'saveCategory': {
        const { categoryData, isEdit } = passwordAction;
        let newCategories: Category[];
        
        if (isEdit) {
          newCategories = categories.map(cat =>
            cat.id === categoryData.id
              ? { ...cat, title: categoryData.title, icon: categoryData.icon }
              : cat
          );
        } else {
          newCategories = [...categories, categoryData];
        }

        handleCategoriesUpdate(newCategories);
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        break;
      }
      case 'deleteCategory': {
        const { categoryId } = passwordAction;
        const newCategories = categories.filter(cat => cat.id !== categoryId);
        handleCategoriesUpdate(newCategories);
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        break;
      }
      default:
        break;
    }

    // Close modal and reset state
    setIsPasswordModalOpen(false);
    setPasswordAction(null);
  };

  const handlePasswordCancel = () => {
    setIsPasswordModalOpen(false);
    setPasswordAction(null);
  };

  const openAddLinkModal = (categoryId: string) => {
    setLinkModalData({ categoryId, link: undefined });
  };

  const openEditLinkModal = (categoryId: string, link: LinkItem) => {
    setLinkModalData({ categoryId, link });
  };

  const handleSaveLink = (formData: LinkItem) => {
    if (!linkModalData) return;
    
    const { categoryId, link } = linkModalData;

    const linkData: LinkItem = link
      ? formData
      : {
        ...formData,
          id: formData.id || Date.now().toString(),
        };

    setPasswordAction({ type: 'saveLink', categoryId, linkData, isEdit: !!link });
    setIsPasswordModalOpen(true);
  };

  const handleReorderLinks = (categoryId: string, oldIndex: number, newIndex: number) => {
    const newCategories = categories.map(cat => {
      if (cat.id === categoryId) {
        const newLinks = [...cat.links];
        const [movedItem] = newLinks.splice(oldIndex, 1);
        newLinks.splice(newIndex, 0, movedItem);
        return { ...cat, links: newLinks };
      }
      return cat;
    });
    handleCategoriesUpdate(newCategories);
  };

  // --- Category Management ---

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (categoryData: Category) => {
    setPasswordAction({ type: 'saveCategory', categoryData, isEdit: !!editingCategory });
    setIsPasswordModalOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    setPasswordAction({ type: 'deleteCategory', categoryId });
    setIsPasswordModalOpen(true);
  };

  // --- System ---

  const handleResetData = () => {
    setPasswordAction({ type: 'reset' });
    setIsPasswordModalOpen(true);
  };

  const handleExportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "nebula-nav-config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportConfig = (importedData: any) => {
    if (!Array.isArray(importedData)) {
      alert("导入失败：数据格式不正确（应为分类数组）。");
      return;
    }
    // Basic structural check
    if (importedData.length > 0 && (!importedData[0].id || !importedData[0].links)) {
         alert("导入失败：数据结构不匹配。");
         return;
    }

    if (window.confirm(`准备导入 ${importedData.length} 个分类。这将覆盖当前的所有链接配置。确定吗？`)) {
        handleCategoriesUpdate(importedData);
        alert("导入成功！");
        setIsSettingsOpen(false);
    }
  };

  const handleToggleAi = () => {
    setIsAiOpen((prev) => {
      const next = !prev;
      // 打开 AI 时自动收起侧边栏，关闭时自动展开
      setIsSidebarCollapsed(next ? true : false);
      return next;
    });
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div 
        className={`min-h-screen relative bg-[#0f172a] overflow-x-hidden selection:bg-violet-500/30 selection:text-violet-200 ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
        style={backgroundImage ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        } : {}}
    >
      
      {/* Background Overlay for readability if custom image is set */}
      {backgroundImage && (
          <div className="fixed inset-0 bg-slate-950/60 pointer-events-none z-0" />
      )}

      {/* Background Decor Elements - Only show if NO custom background */}
      {!backgroundImage && (
        <>
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
        </>
      )}

      {/* Sidebar */}
      <Sidebar 
        categories={categories} 
        activeCategoryId="" // Optional, could implement scroll tracking if needed
        onAddCategory={openAddCategoryModal}
        logoText={logoText}
        logoImage={logoImage}
        collapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* Main Content Area - Shifted Right */}
      <div className={`
        relative z-10 flex flex-col items-center 
        ml-20 
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        min-h-screen
        transition-all duration-300
        ${isAiOpen ? 'mr-0 md:mr-[450px]' : ''}
      `}>
        
        {/* Top Bar - Now simpler without Logo */}
        <div className="w-full flex justify-end items-center gap-3 p-6">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors shadow-[0_0_0_rgba(129,140,248,0)] hover:shadow-[0_0_15px_rgba(129,140,248,0.8)]"
            title="设置"
          >
            <Icon name="Settings" size={20} />
          </button>

          <button 
          onClick={handleToggleAi}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-lg hover:shadow-violet-500/20 ml-1
              ${isAiOpen 
                ? 'bg-violet-600 text-white ring-2 ring-violet-400 ring-offset-2 ring-offset-[#0f172a]' 
                : 'bg-white/10 text-slate-200 hover:bg-white/20 backdrop-blur-md'}
            `}
          >
            <Icon name="Bot" size={20} />
            <span className="hidden sm:inline">AI 助手</span>
          </button>
        </div>

        <div className="w-full px-6 md:px-12 pb-12 flex flex-col items-center">
          {/* Search */}
          <Search onSearch={setSearchFilter} />

          {/* Links Grid */}
          <Grid 
            categories={categories} 
            filter={searchFilter}
            onDelete={handleDeleteLink}
            onEdit={openEditLinkModal}
            onAddLink={openAddLinkModal}
            onEditCategory={openEditCategoryModal}
            onReorder={handleReorderLinks}
          />
        </div>
        
        {/* Footer */}
        <footer className="mt-auto py-8 text-center text-slate-500 text-sm backdrop-blur-sm rounded-t-xl w-full max-w-md mx-auto">
          <p>© 2025 科技刘. 基于 Gemini 3 Pro构建</p>
        </footer>

      </div>

      <Suspense fallback={null}>
        {/* AI Side Panel */}
        <Assistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

        {/* Edit Link Modal (Reused for Adding) */}
        <LinkModal 
          isOpen={!!linkModalData}
          link={linkModalData?.link}
          onClose={() => setLinkModalData(null)}
          onSave={handleSaveLink}
        />

        {/* Category Modal */}
        <CatModal
          isOpen={isCategoryModalOpen}
          category={editingCategory}
          onClose={() => setIsCategoryModalOpen(false)}
          onSave={handleSaveCategory}
          onDelete={editingCategory ? handleDeleteCategory : undefined}
        />

        {/* Settings Modal */}
        <Settings 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onReset={handleResetData}
          onExport={handleExportConfig}
          onImport={handleImportConfig}
          onUpdateBackground={handleUpdateBackground}
          currentBackground={backgroundImage}
          logoText={logoText}
          onUpdateLogoText={handleUpdateLogoText}
          logoImage={logoImage}
          onUpdateLogoImage={handleUpdateLogoImage}
        />

        {/* Password Modal */}
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handlePasswordCancel}
          onConfirm={handlePasswordConfirm}
          title={
            passwordAction?.type === 'reset'
              ? '重置确认'
              : passwordAction?.type === 'saveLink' || passwordAction?.type === 'saveCategory'
                ? '保存确认'
                : '删除确认'
          }
          message={
            passwordAction?.type === 'reset'
              ? '请输入密码以重置所有导航数据。'
              : passwordAction?.type === 'saveLink'
                ? '请输入密码以保存对导航卡片的更改。'
                : passwordAction?.type === 'saveCategory'
                  ? '请输入密码以保存对分类的更改。'
                  : '请输入密码以删除此导航卡片或分类。'
          }
        />
      </Suspense>
    </div>
  );
};

export default App;