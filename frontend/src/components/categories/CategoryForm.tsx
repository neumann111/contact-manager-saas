import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useCategoryStore } from '../../store/categoryStore';
import type { Category } from '../../types';

interface CategoryFormProps {
  initialData?: Category | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { createCategory, updateCategory } = useCategoryStore();
  
  // Initialize state directly from props. 
  // Because we use a 'key' in the parent, this component will remount cleanly when data changes.
  const [name, setName] = useState(initialData?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (initialData) {
        await updateCategory(initialData._id, name);
      } else {
        await createCategory(name);
      }
      onSuccess();
    } catch {
      // Error handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Work, Family, VIP"
        required
        autoFocus
      />
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {initialData ? 'Save Changes' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
};