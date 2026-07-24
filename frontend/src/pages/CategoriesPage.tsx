import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FolderKanban } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Spinner } from '../components/ui/Spinner';
import { useCategoryStore } from '../store/categoryStore';
import { CategoryForm } from '../components/categories/CategoryForm';
import type { Category } from '../types';

export const CategoriesPage: React.FC = () => {
  const { categories, isLoading, fetchCategories, deleteCategory } = useCategoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? Contacts in this category will become uncategorized.')) {
      await deleteCategory(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Organize your contacts into manageable groups.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FolderKanban className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No categories yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Create your first category to start organizing your contacts.
            </p>
            <Button onClick={handleOpenCreate} variant="outline">
              Create Category
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <li key={category._id} className="p-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <FolderKanban className="w-5 h-5 text-brand-500" />
                  <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(category)}>
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(category._id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'New Category'}
      >
        <CategoryForm 
          key={editingCategory ? editingCategory._id : 'new-category'}
          initialData={editingCategory} 
          onSuccess={handleCloseModal} 
          onCancel={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};