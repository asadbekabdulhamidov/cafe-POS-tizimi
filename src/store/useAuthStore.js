import { create } from 'zustand';
import { storageService } from '../services/storageService';

export const useAuthStore = create((set) => ({
  user: storageService.getAuth(),
  isAuthenticated: !!storageService.getAuth(),

  login: (username, password) => {
    // Demo credentials: admin / 123456
    if (username.trim() === 'admin' && password === '123456') {
      const userData = {
        username: 'admin',
        name: 'Boshqaruvchi / Kassir',
        role: 'admin',
        loggedInAt: new Date().toISOString(),
      };
      storageService.setAuth(userData);
      set({ user: userData, isAuthenticated: true });
      return { success: true };
    }
    return { success: false, message: 'Login yoki parol noto‘g‘ri! (Demo: admin / 123456)' };
  },

  logout: () => {
    storageService.setAuth(null);
    set({ user: null, isAuthenticated: false });
  },
}));
