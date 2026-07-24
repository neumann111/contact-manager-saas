import { create } from 'zustand';
import { isAxiosError } from 'axios';
import { api } from '../services/api';
import type { User, LoginCredentials, RegisterCredentials } from '../types';
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
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
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
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to login');
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
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to register');
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
      set({ user: response.data.data.user, isAuthenticated: true, isCheckingAuth: false });
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
      const response = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ user: response.data.data.user });
      toast.success('Avatar updated successfully');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to upload avatar');
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email.');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to send reset link');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true });
    try {
      // 1. Reset the password and get new tokens
      const response = await api.patch(`/auth/reset-password/${token}`, { password });
      const { accessToken, refreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // 2. Fetch the user's profile data so the Dashboard doesn't crash
      const userResponse = await api.get('/auth/me');
      
      // 3. Update global state and fire the success toast
      set({ isAuthenticated: true, user: userResponse.data.data.user });
      toast.success('Password reset successfully! Welcome back.');
    } catch (error: unknown) {
      if (isAxiosError(error)) toast.error(error.response?.data?.message || 'Failed to reset password');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));