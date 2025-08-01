import React, { useState, useEffect } from 'react';
import Header from '../components/Layout/Header';
import TemplateCard from '../components/Templates/TemplateCard';
import { useTemplateStore, Template } from '../store/templateStore';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Filter, Trash2, X, AlertTriangle } from 'lucide-react';

const Templates: React.FC = () => {
  const { templates, duplicateTemplate, deleteTemplate, initializeTemplates } = useTemplateStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('wszystkie');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    initializeTemplates();
  }, [initializeTemplates]);

  const categories = [
    'wszystkie',
    'elektronika',
    'moda', 
    'dom',
    'auto',
    'sport',
    'inne'
  ];

  const filteredTemplates = selectedCategory === 'wszystkie' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleEdit = (template: Template) => {
    navigate(`/editor/${template.id}`);
  };

  const handlePreview = (template: Template) => {
    console.log('Preview template:', template);
  };

  const handleCreateNew = () => {
    navigate('/editor');
  };

  const handleDeleteClick = (template: Template) => {
    setTemplateToDelete(template);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      deleteTemplate(templateToDelete.id);
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTemplateToDelete(null);
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <Header 
        title="Szablony"
        subtitle={`${filteredTemplates.length} ${filteredTemplates.length === 1 ? 'szablon' : 'szablonów'}`}
        showSearch={true}
        onCreateNew={handleCreateNew}
      />
      
      <div className="flex-1 p-6 bg-slate-900 overflow-y-auto min-h-0">
        {/* Filters and View Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Templates Grid/List */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-slate-800 rounded-xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedCategory === 'wszystkie' ? 'Ładowanie szablonów...' : `Brak szablonów w kategorii "${selectedCategory}"`}
              </h3>
              <p className="text-slate-400 mb-6">
                {selectedCategory === 'wszystkie' 
                  ? 'Szablony są ładowane. Jeśli nie widzisz szablonów, odśwież stronę.'
                  : 'Rozpocznij tworzenie swojego pierwszego szablonu aukcji.'
                }
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Stwórz nowy szablon
              </button>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onEdit={handleEdit}
                onDuplicate={duplicateTemplate}
                onDelete={handleDeleteClick}
                onPreview={handlePreview}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && templateToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Usuń szablon</h3>
                <p className="text-slate-400 text-sm">Ta akcja jest nieodwracalna</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-slate-300 mb-2">
                Czy na pewno chcesz usunąć szablon:
              </p>
              <div className="bg-slate-900 border border-slate-600 rounded-lg p-3">
                <p className="text-white font-medium">{templateToDelete.name}</p>
                <p className="text-slate-400 text-sm">{templateToDelete.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                    {templateToDelete.category}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {new Date(templateToDelete.updatedAt).toLocaleDateString('pl-PL')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Anuluj
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Usuń szablon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;