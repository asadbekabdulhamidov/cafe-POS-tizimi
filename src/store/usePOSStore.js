import { create } from 'zustand';
import { storageService } from '../services/storageService';
import { generateId } from '../utils/formatters';

export const usePOSStore = create((set, get) => ({
  rooms: storageService.getRooms(),
  menu: storageService.getMenu(),
  activeOrders: storageService.getActiveOrders(),
  closedOrders: storageService.getClosedOrders(),
  settings: storageService.getSettings(),
  isProcessingPayment: false,

  // Helper to persist everything
  _persist: () => {
    const { rooms, menu, activeOrders, closedOrders, settings } = get();
    storageService.setRooms(rooms);
    storageService.setMenu(menu);
    storageService.setActiveOrders(activeOrders);
    storageService.setClosedOrders(closedOrders);
    storageService.setSettings(settings);
  },

  // Get active order for a given roomId
  getActiveOrderForRoom: (roomId) => {
    const { activeOrders, rooms } = get();
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return null;

    if (room.activeOrderId) {
      return activeOrders.find((o) => o.id === room.activeOrderId && o.status === 'active') || null;
    }
    return activeOrders.find((o) => o.roomId === roomId && o.status === 'active') || null;
  },

  // Open an order for room (if room is empty or doesn't have active order)
  startOrderForRoom: (roomId) => {
    const { rooms, activeOrders } = get();
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return null;

    // Check if room already has active order
    const existing = get().getActiveOrderForRoom(roomId);
    if (existing) return existing;

    const newOrderId = generateId('ord');
    const newOrder = {
      id: newOrderId,
      roomId: room.id,
      roomName: room.name,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [],
      discountAmount: 0,
      subtotal: 0,
      finalTotal: 0,
    };

    const updatedRooms = rooms.map((r) =>
      r.id === roomId ? { ...r, status: 'band', activeOrderId: newOrderId } : r
    );
    const updatedOrders = [...activeOrders, newOrder];

    set({ rooms: updatedRooms, activeOrders: updatedOrders });
    get()._persist();
    return newOrder;
  },

  // Save an entire order (or update an existing active order)
  saveOrder: (orderData) => {
    const { rooms, activeOrders } = get();
    const existingIndex = activeOrders.findIndex((o) => o.id === orderData.id);

    // Calculate subtotal & final total
    const subtotal = (orderData.items || []).reduce(
      (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    );
    const discountAmount = Number(orderData.discountAmount) || 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const updatedOrder = {
      ...orderData,
      subtotal,
      discountAmount,
      finalTotal,
      updatedAt: new Date().toISOString(),
      status: 'active',
    };

    let newActiveOrders = [...activeOrders];
    if (existingIndex >= 0) {
      newActiveOrders[existingIndex] = updatedOrder;
    } else {
      newActiveOrders.push(updatedOrder);
    }

    // Ensure room is marked as 'band' and linked
    const updatedRooms = rooms.map((r) =>
      r.id === orderData.roomId ? { ...r, status: 'band', activeOrderId: updatedOrder.id } : r
    );

    set({ rooms: updatedRooms, activeOrders: newActiveOrders });
    get()._persist();
    return updatedOrder;
  },

  // Add a dish to a room's active order
  addItemToRoom: (roomId, menuItem) => {
    let order = get().getActiveOrderForRoom(roomId);
    if (!order) {
      order = get().startOrderForRoom(roomId);
    }

    const items = [...order.items];
    const existingItemIndex = items.findIndex((i) => i.menuItemId === menuItem.id);

    if (existingItemIndex >= 0) {
      // Increase quantity
      items[existingItemIndex] = {
        ...items[existingItemIndex],
        quantity: items[existingItemIndex].quantity + 1,
      };
    } else {
      // Snapshot price and name
      items.push({
        id: generateId('item'),
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: Number(menuItem.price),
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
    }

    return get().saveOrder({ ...order, items });
  },

  // Update quantity of an item in room's active order
  updateItemQuantity: (roomId, itemId, delta) => {
    const order = get().getActiveOrderForRoom(roomId);
    if (!order) return null;

    let items = order.items
      .map((item) => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    return get().saveOrder({ ...order, items });
  },

  // Remove an item directly
  removeItemFromRoom: (roomId, itemId) => {
    const order = get().getActiveOrderForRoom(roomId);
    if (!order) return null;

    const items = order.items.filter((item) => item.id !== itemId);
    return get().saveOrder({ ...order, items });
  },

  // Update order discount
  setDiscount: (roomId, discountAmount) => {
    const order = get().getActiveOrderForRoom(roomId);
    if (!order) return null;

    return get().saveOrder({ ...order, discountAmount: Number(discountAmount) || 0 });
  },

  // Close the bill and complete payment
  closeBill: async (roomId, { paymentMethod = 'naqd', discountAmount = 0, closedBy = 'admin' } = {}) => {
    const state = get();
    if (state.isProcessingPayment) {
      return { success: false, message: 'To‘lov jarayonda...' };
    }

    set({ isProcessingPayment: true });

    try {
      const room = state.rooms.find((r) => r.id === roomId);
      if (!room) {
        set({ isProcessingPayment: false });
        return { success: false, message: 'Xona topilmadi!' };
      }

      const activeOrder = state.getActiveOrderForRoom(roomId);
      if (!activeOrder) {
        set({ isProcessingPayment: false });
        return { success: false, message: 'Ushbu xonada faol buyurtma topilmadi yoki hisob allaqachon yopilgan!' };
      }

      // Check if order already closed
      if (activeOrder.status === 'closed') {
        set({ isProcessingPayment: false });
        return { success: false, message: 'Bu hisob allaqachon yopilgan!' };
      }

      const subtotal = (activeOrder.items || []).reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );
      const discount = Number(discountAmount ?? activeOrder.discountAmount) || 0;
      const finalTotal = Math.max(0, subtotal - discount);

      const closedOrder = {
        ...activeOrder,
        status: 'closed',
        closedAt: new Date().toISOString(),
        paymentMethod: paymentMethod === 'karta' ? 'karta' : 'naqd',
        discountAmount: discount,
        subtotal,
        finalTotal,
        closedBy,
      };

      // Remove from active orders, add to closed orders
      const remainingActiveOrders = state.activeOrders.filter((o) => o.id !== activeOrder.id);
      const newClosedOrders = [closedOrder, ...state.closedOrders];

      // Reset room state to empty ('bosh')
      const updatedRooms = state.rooms.map((r) =>
        r.id === roomId ? { ...r, status: 'bosh', activeOrderId: null } : r
      );

      set({
        rooms: updatedRooms,
        activeOrders: remainingActiveOrders,
        closedOrders: newClosedOrders,
        isProcessingPayment: false,
      });

      get()._persist();
      return { success: true, order: closedOrder };
    } catch (error) {
      set({ isProcessingPayment: false });
      return { success: false, message: error.message || 'Xatolik yuz berdi' };
    }
  },

  // Menu CRUD actions
  addMenuItem: (itemData) => {
    const { menu } = get();
    const newItem = {
      id: generateId('m'),
      name: itemData.name.trim(),
      category: itemData.category || 'Boshqa',
      price: Math.max(0, Number(itemData.price) || 0),
      isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : true,
      description: itemData.description?.trim() || '',
    };

    const updatedMenu = [newItem, ...menu];
    set({ menu: updatedMenu });
    get()._persist();
    return newItem;
  },

  updateMenuItem: (id, itemData) => {
    const { menu } = get();
    const updatedMenu = menu.map((item) =>
      item.id === id
        ? {
            ...item,
            name: itemData.name?.trim() ?? item.name,
            category: itemData.category ?? item.category,
            price: itemData.price !== undefined ? Math.max(0, Number(itemData.price)) : item.price,
            isAvailable: itemData.isAvailable !== undefined ? itemData.isAvailable : item.isAvailable,
            description: itemData.description?.trim() ?? item.description,
          }
        : item
    );

    set({ menu: updatedMenu });
    get()._persist();
  },

  deleteMenuItem: (id) => {
    const { menu } = get();
    const updatedMenu = menu.filter((item) => item.id !== id);
    set({ menu: updatedMenu });
    get()._persist();
  },

  toggleItemAvailability: (id) => {
    const { menu } = get();
    const updatedMenu = menu.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    set({ menu: updatedMenu });
    get()._persist();
  },

  // Places (Rooms, Tables, So'rilar) CRUD
  addPlace: (placeData) => {
    const { rooms } = get();
    const newPlace = {
      id: generateId(placeData.type || 'joy'),
      name: placeData.name.trim(),
      type: placeData.type || 'xona',
      capacity: placeData.capacity?.trim() || '4-6 kishi',
      status: 'bosh',
      activeOrderId: null,
    };
    const updated = [...rooms, newPlace];
    set({ rooms: updated });
    get()._persist();
    return newPlace;
  },

  updatePlace: (id, placeData) => {
    const { rooms, activeOrders } = get();
    const updatedRooms = rooms.map((r) =>
      r.id === id
        ? {
            ...r,
            name: placeData.name?.trim() ?? r.name,
            type: placeData.type ?? r.type,
            capacity: placeData.capacity?.trim() ?? r.capacity,
          }
        : r
    );
    const updatedOrders = activeOrders.map((o) =>
      o.roomId === id ? { ...o, roomName: placeData.name?.trim() ?? o.roomName } : o
    );

    set({ rooms: updatedRooms, activeOrders: updatedOrders });
    get()._persist();
    return { success: true };
  },

  deletePlace: (id) => {
    const { rooms } = get();
    const place = rooms.find((r) => r.id === id);
    if (!place) {
      return { success: false, message: 'Joy topilmadi!' };
    }
    if (place.status === 'band') {
      return {
        success: false,
        message: 'Bu joy hozirda band! O‘chirishdan oldin hisobni yoping.',
      };
    }
    const updated = rooms.filter((r) => r.id !== id);
    set({ rooms: updated });
    get()._persist();
    return { success: true };
  },

  // Update Settings
  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    get()._persist();
  },

  // Reset to initial demo state
  resetAllDemoData: () => {
    storageService.resetAllDemoData();
    set({
      rooms: storageService.getRooms(),
      menu: storageService.getMenu(),
      activeOrders: storageService.getActiveOrders(),
      closedOrders: storageService.getClosedOrders(),
      settings: storageService.getSettings(),
    });
  },
}));
