/**
 * LocalStorage Service for Choyxona POS
 * Manages persisting and loading all POS state.
 */

import {
  INITIAL_ROOMS,
  INITIAL_MENU,
  INITIAL_ACTIVE_ORDERS,
  INITIAL_CLOSED_ORDERS,
  INITIAL_SETTINGS,
} from '../data/initialData';

const KEYS = {
  AUTH: 'choyxona_auth',
  PIN: 'choyxona_pin',
  ROOMS: 'choyxona_rooms',
  MENU: 'choyxona_menu',
  ACTIVE_ORDERS: 'choyxona_active_orders',
  CLOSED_ORDERS: 'choyxona_closed_orders',
  SETTINGS: 'choyxona_settings',
};

export const storageService = {
  // Auth
  getAuth() {
    try {
      const data = localStorage.getItem(KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setAuth(user) {
    try {
      if (user) {
        localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
      } else {
        localStorage.removeItem(KEYS.AUTH);
      }
    } catch (e) {
      console.error('Failed to save auth to localStorage', e);
    }
  },

  // 4-digit PIN (default '1234')
  getPin() {
    try {
      return localStorage.getItem(KEYS.PIN) || '1234';
    } catch {
      return '1234';
    }
  },

  setPin(pin) {
    try {
      localStorage.setItem(KEYS.PIN, String(pin));
    } catch (e) {
      console.error('Failed to save pin to localStorage', e);
    }
  },

  // Rooms
  getRooms() {
    try {
      const data = localStorage.getItem(KEYS.ROOMS);
      const rooms = data ? JSON.parse(data) : INITIAL_ROOMS;
      return rooms.map((r) => ({
        ...r,
        type:
          r.type ||
          (r.name?.toLowerCase().includes('stol')
            ? 'stol'
            : r.name?.toLowerCase().includes('sori') || r.name?.toLowerCase().includes('so‘ri')
            ? 'sori'
            : 'xona'),
      }));
    } catch {
      return INITIAL_ROOMS;
    }
  },

  setRooms(rooms) {
    try {
      localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
    } catch (e) {
      console.error('Failed to save rooms to localStorage', e);
    }
  },

  // Menu
  getMenu() {
    try {
      const data = localStorage.getItem(KEYS.MENU);
      let menu = data ? JSON.parse(data) : INITIAL_MENU;
      // Ensure unit is present for all items
      menu = menu.map((m) => {
        let unit = m.unit;
        const lower = m.name?.toLowerCase() || '';

        if (!unit) {
          if (lower.includes('pors') || lower.includes('порц')) {
            unit = 'pors';
          } else if (
            lower.includes('kg') ||
            lower.includes('kilogramm') ||
            lower.includes('qozon') ||
            lower.includes('tandir go‘sht') ||
            lower.includes('tandir gosht')
          ) {
            unit = 'kg';
          } else {
            unit = 'dona';
          }
        } else if (unit === 'porsiya') {
          unit = 'pors';
        }
        return { ...m, unit };
      });

      // Ensure initial demo items like Choyxona oshi are available
      const existingIds = new Set(menu.map((m) => m.id));
      INITIAL_MENU.forEach((initItem) => {
        if (!existingIds.has(initItem.id)) {
          menu.unshift(initItem);
        }
      });

      return menu;
    } catch {
      return INITIAL_MENU;
    }
  },

  setMenu(menu) {
    try {
      localStorage.setItem(KEYS.MENU, JSON.stringify(menu));
    } catch (e) {
      console.error('Failed to save menu to localStorage', e);
    }
  },

  // Active Orders
  getActiveOrders() {
    try {
      const data = localStorage.getItem(KEYS.ACTIVE_ORDERS);
      return data ? JSON.parse(data) : INITIAL_ACTIVE_ORDERS;
    } catch {
      return INITIAL_ACTIVE_ORDERS;
    }
  },

  setActiveOrders(orders) {
    try {
      localStorage.setItem(KEYS.ACTIVE_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save active orders to localStorage', e);
    }
  },

  // Closed Orders (History)
  getClosedOrders() {
    try {
      const data = localStorage.getItem(KEYS.CLOSED_ORDERS);
      return data ? JSON.parse(data) : INITIAL_CLOSED_ORDERS;
    } catch {
      return INITIAL_CLOSED_ORDERS;
    }
  },

  setClosedOrders(orders) {
    try {
      localStorage.setItem(KEYS.CLOSED_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save closed orders to localStorage', e);
    }
  },

  // Settings
  getSettings() {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  setSettings(settings) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  // Reset demo data back to initial
  resetAllDemoData() {
    try {
      localStorage.setItem(KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
      localStorage.setItem(KEYS.MENU, JSON.stringify(INITIAL_MENU));
      localStorage.setItem(KEYS.ACTIVE_ORDERS, JSON.stringify(INITIAL_ACTIVE_ORDERS));
      localStorage.setItem(KEYS.CLOSED_ORDERS, JSON.stringify(INITIAL_CLOSED_ORDERS));
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      localStorage.setItem(KEYS.PIN, '1234');
      return true;
    } catch (e) {
      console.error('Failed to reset demo data', e);
      return false;
    }
  },
};
