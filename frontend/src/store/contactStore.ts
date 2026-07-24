import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { api } from '../services/api';
import type { Contact, Pagination, DashboardStats } from '../types';
import toast from 'react-hot-toast';

interface FetchContactsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isFavorite?: boolean;
  sort?: string;
  order?: 'asc' | 'desc';
}

interface ContactState {
  contacts: Contact[];
  pagination: Pagination | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  fetchContacts: (params?: FetchContactsParams) => Promise<void>;
  fetchStats: () => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  pagination: null,
  stats: null,
  isLoading: false,
  isStatsLoading: false,

  fetchContacts: async (params = {}) => {
    set({ isLoading: true });
    try {
      // Convert params object to query string
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.append(key, String(value));
        }
      });

      const response = await api.get(`/contacts?${searchParams.toString()}`);
      set({
        contacts: response.data.data.contacts,
        pagination: response.data.data.pagination,
        isLoading: false,
      });
    } catch (error: unknown) {
      set({ isLoading: false });
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to fetch contacts');
    }
  },

  fetchStats: async () => {
    set({ isStatsLoading: true });
    try {
      const response = await api.get('/contacts/stats/dashboard');
      set({ stats: response.data.data.stats, isStatsLoading: false });
    } catch (error: unknown) {
      set({ isStatsLoading: false });
      if (isAxiosError(error)) toast.error('Failed to load dashboard statistics');
    }
  },

  deleteContact: async (id: string) => {
    try {
      await api.delete(`/contacts/${id}`);
      set({
        contacts: get().contacts.filter((contact) => contact._id !== id),
      });
      // Optionally trigger fetchStats here if you want dashboard to update silently
      toast.success('Contact deleted');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to delete contact');
      throw error;
    }
  },
}));