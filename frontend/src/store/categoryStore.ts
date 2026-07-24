import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { api } from '../services/api';
import type { Category } from '../types';
import toast from 'react-hot-toast';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/categories');
      set({ categories: response.data.data.categories, isLoading: false });
    } catch (error: unknown) {
      set({ isLoading: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to fetch categories');
      }
    }
  },

  createCategory: async (name: string) => {
    try {
      const response = await api.post('/categories', { name });
      const newCategory = response.data.data.category;
      set({ categories: [...get().categories, newCategory] });
      toast.success('Category created');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to create category');
      throw error;
    }
  },

  updateCategory: async (id: string, name: string) => {
    try {
      const response = await api.put(`/categories/${id}`, { name });
      const updatedCategory = response.data.data.category;
      set({
        categories: get().categories.map((cat) => (cat._id === id ? updatedCategory : cat)),
      });
      toast.success('Category updated');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to update category');
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      set({
        categories: get().categories.filter((cat) => cat._id !== id),
      });
      toast.success('Category deleted');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to delete category');
      throw error;
    }
  },
}));