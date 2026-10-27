import { create } from 'zustand';
import { storageService } from '../services/storageService';

export const useAuthStore = create((set) => ({
  user: storageService.getAuth(),
  isAuthenticated: !!storageService.getAuth(),
  currentPin: storageService.getPin(),

  loginWithPin: (pin) => {
    const validPin = storageService.getPin() || '1234';
    if (String(pin).trim() === validPin) {
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
    return { success: false, message: 'PIN-kod noto‘g‘ri! (Demo PIN: 1234)' };
  },

  changePin: (newPin) => {
    if (!/^\d{4}$/.test(String(newPin))) {
      return { success: false, message: 'PIN-kod roppa-rosa 4 ta raqamdan iborat bo‘lishi kerak!' };
    }
    storageService.setPin(newPin);
    set({ currentPin: String(newPin) });
    return { success: true };
  },

  // Legacy username & password login fallback
  login: (username, password) => {
    if (username.trim() === 'admin' && (password === '123456' || password === '1234')) {
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
    return { success: false, message: 'Login yoki parol noto‘g‘ri!' };
  },

  logout: () => {
    storageService.setAuth(null);
    set({ user: null, isAuthenticated: false });
  },
}));
