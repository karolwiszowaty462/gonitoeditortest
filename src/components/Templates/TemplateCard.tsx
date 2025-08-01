import React, { useRef, useEffect } from 'react';
import { 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  Calendar, 
  Download,
  MoreVertical 
} from 'lucide-react';
import { Template } from '../../store/templateStore';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDuplicate: (id: string) => void;
  onDelete: (template: Template) => void;
  onPreview: (template: Template) => void;
}

const categoryColors = {
  elektronika: 'bg-blue-100 text-blue-800',
  moda: 'bg-pink-100 text-pink-800',
  dom: 'bg-green-100 text-green-800',
  auto: 'bg-orange-100 text-orange-800',
  sport: 'bg-purple-100 text-purple-800',
  inne: 'bg-gray-100 text-gray-800',
};

const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDuplicate,
  onDelete,
  onPreview
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!showMenu && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 192
      });
    }
    
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Delete clicked for template:', template.name);
    onDelete(template);
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showMenu]);

  return (
    <>
      <div className="bg-slate-800 border border-slate-700 rounded-xl hover:border-slate-600 transition-all duration-200 group">
        {/* Thumbnail */}
        <div className="relative h-48 bg-slate-900 overflow-hidden rounded-t-xl">
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[template.category]}`}>
              {template.category}
            </span>
          </div>

          {/* Actions Menu Button */}
          <div className="absolute top-3 right-3">
            <button
              ref={buttonRef}
              onClick={handleMenuToggle}
              className="p-2 bg-slate-900/80 backdrop-blur-sm rounded-lg text-white hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
            {template.name}
          </h3>
          <p className="text-slate-400 text-sm mb-4 line-clamp-2">
            {template.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {template.baselinkerTags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                {tag}
              </span>
            ))}
            {template.baselinkerTags.length > 3 && (
              <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-md">
                +{template.baselinkerTags.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(template.updatedAt).toLocaleDateString('pl-PL')}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onPreview(template);
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(template);
                }}
                className="text-emerald-400 hover:text-emerald-300"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu - positioned absolutely on the page */}
      {showMenu && (
        <div 
          className="fixed bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 w-48"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
                onEdit(template); 
                setShowMenu(false); 
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            >
              <Edit className="w-4 h-4" />
              <span>Edytuj</span>
            </button>
            <button
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
                onPreview(template); 
                setShowMenu(false); 
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            >
              <Eye className="w-4 h-4" />
              <span>Podgląd</span>
            </button>
            <button
              onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation();
                onDuplicate(template.id); 
                setShowMenu(false); 
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
            >
              <Copy className="w-4 h-4" />
              <span>Duplikuj</span>
            </button>
            <button 
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-left"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(false);
              }}
            >
              <Download className="w-4 h-4" />
              <span>Eksportuj</span>
            </button>
            <hr className="border-slate-700 my-1" />
            <button
              onClick={handleDeleteClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
            >
              <Trash2 className="w-4 h-4" />
              <span>Usuń</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TemplateCard;