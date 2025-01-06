import { create } from 'zustand';
import axios from '@/utils/axios';

interface User {
  id: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
}

const getInitialToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: getInitialToken(),
  loading: true,

  initialize: async () => {
    if (typeof window === 'undefined') {
      set({ loading: false });
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/auth/me');
        set({ user: response.data, token, loading: false });
      } catch {
        localStorage.removeItem('token');
        set({ token: null, user: null, loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    set({ user: response.data.user, token: response.data.token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
    }
  },

  register: async (email, password) => {
    const response = await axios.post('/auth/register', { email, password });
    set({ user: response.data.user, token: response.data.token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.token);
    }
  },

  logout: () => {
    set({ user: null, token: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }
}));