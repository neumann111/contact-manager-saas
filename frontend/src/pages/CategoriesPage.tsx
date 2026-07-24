import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderKanban } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { useCategoryStore } from '../store/categoryStore';
import type { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const { categories, isLoading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategoryStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure? Contacts in this category will be marked as uncategorized.')) {
      await deleteCategory(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, { name, description });
      } else {
        await createCategory({ name, description });
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text">Categories</h1>
          <p className="text-sm lg:text-base text-text-muted mt-1">Organize your contacts into custom groups.</p>
        </div>
        <Button 
          onClick={handleOpenCreate}
          className="bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-sm transition-all border-transparent"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      ) : categories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border-dashed border-2 border-border bg-surface-secondary/30 shadow-none">
          <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4 border border-brand-500/20">
            <FolderKanban className="w-8 h-8 text-brand-600 dark:text-brand-400" />
          </div>
          <h3 className="text-lg font-bold text-text mb-2">No categories yet</h3>
          <p className="text-text-muted text-sm max-w-sm mb-6">
            Create categories like "Work", "Family", or "VIP Clients" to keep your network organized.
          </p>
          <Button onClick={handleOpenCreate}>Create Your First Category</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category._id} 
              className="group flex flex-col p-6 shadow-sm hover:shadow-md transition-all border-border bg-surface"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 border border-brand-500/20 group-hover:scale-105 transition-transform">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(category)}
                    aria-label={`Edit ${category.name}`}
                    className="p-2 text-text-muted hover:text-brand-500 hover:bg-brand-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category._id)}
                    aria-label={`Delete ${category.name}`}
                    className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-text mb-2 group-hover:text-brand-500 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-text-muted line-clamp-2">
                {category.description || 'No description provided.'}
              </p>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Category Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="e.g., Suppliers"
            className="bg-surface border-border focus:border-brand-500" 
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text">Description (Optional)</label>
            <textarea
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text transition-colors hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 placeholder:text-text-muted/50"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of contacts belong here?"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
              className="bg-surface hover:bg-surface-secondary border-border hover:border-border-strong text-text transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={isSaving}
              className="bg-brand-600 hover:bg-brand-500 text-white border-transparent shadow-sm"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};