export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// NEW: Auth Payload Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string; // <-- ADD THIS LINE
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  user: string;
  category?: {
    _id: string;
    name: string;
  } | null;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  company?: string;
  isFavorite: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  results?: number;
  data: T;
}

export interface DashboardStats {
  totalContacts: number;
  favoriteContacts: number;
  recentlyAdded: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
    createdAt: string;
  }>;
  recentlyUpdated: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
    updatedAt: string;
  }>;
  categorySummary: Array<{
    _id: string | null;
    name: string;
    count: number;
  }>;
}