import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LinkItem as LinkItemType } from '../types';
import Icon from './Icon';

interface LinkItemProps {
  link: LinkItemType;
  categoryId: string;
  onEdit?: (categoryId: string, link: LinkItemType) => void;
  onDelete?: (categoryId: string, linkId: string) => void;
}

const LinkItem: React.FC<LinkItemProps> = ({ link, categoryId, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id, data: { categoryId, link } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative rounded-2xl transition-all duration-300 hover:-translate-y-1 touch-none"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-70 transition duration-500"></div>

      {/* Content Container */}
      <div className="relative z-10 flex items-start bg-slate-800/40 backdrop-blur-md border border-white/5 rounded-2xl h-full min-h-[110px] shadow-lg group-hover:bg-slate-900/90 transition-colors duration-300">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-5 w-full h-full rounded-2xl"
          onClick={(e) => {
            if (isDragging) e.preventDefault();
          }}
        >
          {/* Logo Section */}
          <div className="flex-shrink-0 w-12 h-12 flex items-start justify-center pt-0.5">
            {link.icon && !/^(https?:)?\/\//i.test(link.icon) ? (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/70 text-violet-300 group-hover:text-violet-200 transition-transform duration-300 group-hover:scale-110">
                <Icon name={link.icon} size={28} />
              </div>
            ) : (
              <>
            <img 
                  src={link.icon ? link.icon : `https://www.google.com/s2/favicons?domain=${link.url}&sz=128`} 
              alt="" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const fallback = (e.target as HTMLElement).nextElementSibling;
                if (fallback) fallback.classList.remove('hidden');
              }}
            />
            {/* Fallback Icon */}
            <div className="hidden text-slate-500 group-hover:text-violet-400 transition-colors">
              <Icon name="ExternalLink" size={28} />
            </div>
              </>
            )}
          </div>
          
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <span className="font-semibold transition-colors text-slate-200 group-hover:text-violet-300 pr-6 text-lg break-words line-clamp-2">
              {link.title}
            </span>
            {link.description && (
              <span className="text-sm text-slate-500 truncate group-hover:text-slate-400 pr-6">
                {link.description}
              </span>
            )}
          </div>
        </a>

        {/* Edit Actions */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none group-hover:pointer-events-auto">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit?.(categoryId, link);
            }}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking buttons
            className="p-1 text-slate-500 hover:text-violet-400 transition-colors"
            title="编辑链接"
          >
            <Icon name="Edit2" size={18} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(categoryId, link.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
            title="删除链接"
          >
            <Icon name="Trash2" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkItem;