import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { api } from '../services/api';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  updateProfile: (data: { firstName: string; lastName: string; email: string }) => Promise<void>;
  updatePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, accessToken, refreshToken } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success('Welcome back!');
    } catch (error: unknown) {
      set({ isLoading: false });
      
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to login');
      } else {
        toast.error('An unexpected error occurred');
      }
      
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', userData);
      const { user, accessToken, refreshToken } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      set({ user, isAuthenticated: true, isLoading: false });
      toast.success('Account created successfully!');
    } catch (error: unknown) {
      set({ isLoading: false });
      
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Failed to register');
      } else {
        toast.error('An unexpected error occurred');
      }
      
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
    toast.success('Logged out successfully');
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
      return;
    }

    try {
      const response = await api.get('/auth/me');
      set({ 
        user: response.data.data.user, 
        isAuthenticated: true, 
        isCheckingAuth: false 
      });
    } catch {
      set({ isCheckingAuth: false, isAuthenticated: false, user: null });
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/auth/profile', data);
      set({ user: response.data.data.user });
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  },

  updatePassword: async (data) => {
    try {
      const response = await api.put('/auth/password', data);
      // Update tokens since changing password generates new ones
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      toast.success('Password updated successfully');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to update password');
      throw error;
    }
  },

  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      // Must explicitly set Content-Type for FormData
      const response = await api.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set({ user: response.data.data.user });
      toast.success('Avatar updated successfully');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to upload avatar');
      throw error;
    }
  },
}));