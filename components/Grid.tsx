import React, { useState } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  rectSortingStrategy 
} from '@dnd-kit/sortable';
import { Category, LinkItem as LinkItemType } from '../types';
import Icon from './Icon';
import LinkItem from './LinkItem';

interface GridProps {
  categories: Category[];
  filter: string;
  onEdit?: (categoryId: string, link: LinkItemType) => void;
  onDelete?: (categoryId: string, linkId: string) => void;
  onEditCategory?: (category: Category) => void;
  onAddLink?: (categoryId: string) => void;
  onReorder?: (categoryId: string, oldIndex: number, newIndex: number) => void;
}

const Grid: React.FC<GridProps> = ({ 
  categories, 
  filter, 
  onEdit,
  onDelete,
  onEditCategory,
  onAddLink,
  onReorder
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<LinkItemType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts to prevent accidental drags on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const categoryId = event.active.data.current?.categoryId;
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      const link = category.links.find(l => l.id === event.active.id);
      if (link) setActiveLink(link);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    setActiveLink(null);

    if (!over || !onReorder) return;

    // Check if we dropped on a valid item
    if (active.id !== over.id) {
      const categoryId = active.data.current?.categoryId;
      const targetCategoryId = over.data.current?.categoryId;

      // Only allow sorting within the same category for now
      if (categoryId === targetCategoryId && categoryId) {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
          const oldIndex = category.links.findIndex(l => l.id === active.id);
          const newIndex = category.links.findIndex(l => l.id === over.id);
          
          if (oldIndex !== -1 && newIndex !== -1) {
            onReorder(categoryId, oldIndex, newIndex);
          }
        }
      }
    }
  };

  // Filter logic
  const filteredCategories = categories.map(cat => ({
    ...cat,
    links: cat.links.filter(link => 
      link.title.toLowerCase().includes(filter.toLowerCase()) || 
      (link.description && link.description.toLowerCase().includes(filter.toLowerCase()))
    )
  })).filter(cat => cat.links.length > 0 || filter === '');

  if (filteredCategories.length === 0) {
    return (
      <div className="text-center text-slate-500 mt-12">
        <p>未找到匹配 "{filter}" 的链接</p>
      </div>
    );
  }

  // If searching, disable drag and drop to avoid confusion
  if (filter !== '') {
    return (
      <div className="flex flex-col gap-12 w-full max-w-full pb-20">
        {filteredCategories.map((category) => (
          <div key={category.id} className="flex flex-col animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6 group/header">
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3 px-1">
                <span className="w-2 h-8 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span>
                {category.title}
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {category.links.map((link) => (
                <LinkItem 
                  key={link.id} 
                  link={link} 
                  categoryId={category.id} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-12 w-full max-w-full pb-20">
        {filteredCategories.map((category) => (
          <div key={category.id} id={category.id} className="flex flex-col animate-fade-in-up scroll-mt-24">
            <div className="flex items-center gap-4 mb-6 group/header">
              <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3 px-1">
                <span className="w-2 h-8 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span>
                {category.title}
              </h1>
              {onEditCategory && (
                <button
                  onClick={() => onEditCategory(category)}
                  className="opacity-0 group-hover/header:opacity-100 p-1 text-slate-500 hover:text-violet-400 transition-all"
                  title="编辑分类"
                >
                  <Icon name="Edit2" size={18} />
                </button>
              )}
            </div>
            
            <SortableContext 
              items={category.links.map(l => l.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {category.links.map((link) => (
                  <LinkItem 
                    key={link.id}
                    link={link}
                    categoryId={category.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}

                {/* Add Link Button */}
                {onAddLink && (
                  <button
                    onClick={() => onAddLink(category.id)}
                    className="group relative rounded-2xl h-full min-h-[100px] flex items-center justify-center border border-dashed border-white/10 hover:border-violet-500/50 hover:bg-white/5 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-violet-400 transition-colors">
                      <Icon name="Plus" size={32} />
                      <span className="text-sm font-medium">添加链接</span>
                    </div>
                  </button>
                )}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
      
      {/* Drag Overlay for smooth visual feedback */}
      <DragOverlay>
        {activeId && activeLink ? (
           <div className="w-full h-full opacity-90 scale-105 cursor-grabbing">
              <div className="relative z-10 flex items-center bg-slate-800/90 backdrop-blur-md border border-violet-500/50 rounded-2xl h-full shadow-2xl p-5 gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                    <img 
                      src={`https://www.google.com/s2/favicons?domain=${activeLink.url}&sz=128`} 
                      alt="" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1 gap-1">
                    <span className="font-semibold truncate text-violet-300 text-lg">
                      {activeLink.title}
                    </span>
                    <span className="text-sm text-slate-400 truncate">
                       {activeLink.description}
                    </span>
                  </div>
              </div>
           </div>
        ) : null}
      </DragOverlay>

    </DndContext>
  );
};

export default Grid;