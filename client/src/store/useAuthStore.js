import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  loading: false,

  setUser: (user) => set({ user, role: user?.role, isAuthenticated: !!user }),
  
  login: async (credentials) => {
    set({ loading: true });
    try {
      const response = await authAPI.login(credentials);
      set({ user: response.data, role: response.data.role, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } finally {
      set({ user: null, role: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
