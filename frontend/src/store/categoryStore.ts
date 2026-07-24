import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { api } from '../services/api';
import type { Category } from '../types';
import { showToast } from '../utils/showToast';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (data: { name: string; description?: string }) => Promise<void>;
  updateCategory: (id: string, data: { name?: string; description?: string }) => Promise<void>;
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
        showToast.error(error.response?.data?.message || 'Failed to fetch categories');
      }
    }
  },

  // UPDATED: Now accepts 'data' object instead of just 'name' string
  createCategory: async (data) => {
    try {
      const response = await api.post('/categories', data);
      const newCategory = response.data.data.category;
      set({ categories: [...get().categories, newCategory] });
      showToast.success('Category created');
    } catch (error: unknown) {
      if (isAxiosError(error)) showToast.error(error.response?.data?.message || 'Failed to create category');
      throw error;
    }
  },

  // UPDATED: Now accepts 'id' and 'data' object
  updateCategory: async (id, data) => {
    try {
      const response = await api.put(`/categories/${id}`, data);
      const updatedCategory = response.data.data.category;
      set({
        categories: get().categories.map((cat) => (cat._id === id ? updatedCategory : cat)),
      });
      showToast.success('Category updated');
    } catch (error: unknown) {
      if (isAxiosError(error)) showToast.error(error.response?.data?.message || 'Failed to update category');
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      set({
        categories: get().categories.filter((cat) => cat._id !== id),
      });
      showToast.success('Category deleted');
    } catch (error: unknown) {
      if (isAxiosError(error)) showToast.error(error.response?.data?.message || 'Failed to delete category');
      throw error;
    }
  },
}));