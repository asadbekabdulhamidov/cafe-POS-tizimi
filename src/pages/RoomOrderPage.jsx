import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Save,
  Clock,
  Utensils,
  ShoppingBag,
  X,
  DoorOpen,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { PaymentModal } from '../features/orders/PaymentModal';
import { ReceiptModal } from '../features/orders/ReceiptModal';
import { formatCurrency, formatTime, generateId } from '../utils/formatters';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { toast } from 'sonner';

export function RoomOrderPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const {
    rooms,
    menu,
    getActiveOrderForRoom,
    startOrderForRoom,
    saveOrder,
    closeBill,
    isProcessingPayment,
  } = usePOSStore();

  const room = rooms.find((r) => r.id === roomId);

  // Active category and search
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');

  // Discount toggle & input
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountInput, setDiscountInput] = useState('');

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [closedReceipt, setClosedReceipt] = useState(null);

  // Mobile active tab: 'menu' | 'cart'
  const [mobileTab, setMobileTab] = useState('menu');

  // Load or initialize order in local state
  const currentOrder = getActiveOrderForRoom(roomId);

  // Working state for order
  const [workingItems, setWorkingItems] = useState([]);
  const [workingDiscount, setWorkingDiscount] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  // Sync working state when store's currentOrder changes
  useEffect(() => {
    if (currentOrder) {
      setWorkingItems(currentOrder.items || []);
      setWorkingDiscount(currentOrder.discountAmount || 0);
      setDiscountInput(currentOrder.discountAmount ? String(currentOrder.discountAmount) : '');
    } else {
      setWorkingItems([]);
      setWorkingDiscount(0);
      setDiscountInput('');
    }
    setIsDirty(false);
  }, [currentOrder?.id, currentOrder?.updatedAt, currentOrder?.items, currentOrder?.discountAmount]);

  // Filtered menu items - called unconditionally
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      if (activeCategory !== 'Barchasi' && item.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCat = item.category.toLowerCase().includes(query);
        return matchesName || matchesCat;
      }
      return true;
    });
  }, [menu, activeCategory, searchQuery]);

  // Subtotal for working order
  const subtotal = useMemo(() => {
    return workingItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [workingItems]);

  const finalTotal = Math.max(0, subtotal - workingDiscount);

  // Item counts in order mapped by menuItemId for quick badge
  const orderQuantities = useMemo(() => {
    const map = {};
    workingItems.forEach((i) => {
      map[i.menuItemId] = (map[i.menuItemId] || 0) + i.quantity;
    });
    return map;
  }, [workingItems]);

  // If room is not found, early return now that all hooks are called
  if (!room) {
    return (
      <div className="py-12">
        <EmptyState
          icon={DoorOpen}
          title="Xona topilmadi"
          description="Bunday raqamli xona mavjud emas."
          actionText="Xonalar ro‘yxatiga qaytish"
          onAction={() => navigate('/rooms')}
        />
      </div>
    );
  }

  // Add dish to order
  const handleAddItem = (menuItem) => {
    if (!menuItem.isAvailable) {
      toast.error('Bu mahsulot hozirda mavjud emas!');
      return;
    }

    setWorkingItems((prev) => {
      const idx = prev.findIndex((i) => i.menuItemId === menuItem.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + 1,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: generateId('item'),
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: Number(menuItem.price),
            quantity: 1,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });

    setIsDirty(true);
  };

  // Change quantity
  const handleUpdateQuantity = (itemId, delta) => {
    setWorkingItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
    setIsDirty(true);
  };

  // Remove item
  const handleRemoveItem = (itemId) => {
    setWorkingItems((prev) => prev.filter((i) => i.id !== itemId));
    setIsDirty(true);
  };

  // Apply discount
  const handleApplyDiscount = () => {
    const val = Number(discountInput) || 0;
    if (val < 0) {
      toast.error('Chegirma manfiy bo‘lishi mumkin emas');
      return;
    }
    if (val > subtotal) {
      toast.error('Chegirma umumiy summadan katta bo‘lishi mumkin emas');
      return;
    }
    setWorkingDiscount(val);
    setShowDiscountInput(false);
    setIsDirty(true);
    toast.success(`Chegirma qo‘llandi: ${formatCurrency(val)}`);
  };

  // Save current order
  const handleSaveOrder = () => {
    if (workingItems.length === 0) {
      toast.error('Buyurtmada hech qanday mahsulot yo‘q!');
      return;
    }

    let active = currentOrder;
    if (!active) {
      active = startOrderForRoom(room.id);
    }

    const orderToSave = {
      ...active,
      roomId: room.id,
      roomName: room.name,
      items: workingItems,
      discountAmount: workingDiscount,
      subtotal,
      finalTotal,
    };

    saveOrder(orderToSave);
    setIsDirty(false);
    toast.success(`${room.name} uchun buyurtma muvaffaqiyatli saqlandi!`);
  };

  // Confirm and close bill
  const handleConfirmPayment = async ({ paymentMethod, discountAmount }) => {
    let active = currentOrder;
    if (!active) {
      active = startOrderForRoom(room.id);
    }

    const orderToSave = {
      ...active,
      roomId: room.id,
      roomName: room.name,
      items: workingItems,
      discountAmount: discountAmount ?? workingDiscount,
      subtotal,
      finalTotal: Math.max(0, subtotal - (discountAmount ?? workingDiscount)),
    };
    saveOrder(orderToSave);

    const res = await closeBill(room.id, {
      paymentMethod,
      discountAmount: discountAmount ?? workingDiscount,
      closedBy: 'admin',
    });

    if (res.success) {
      setIsPaymentModalOpen(false);
      setClosedReceipt(res.order);
      toast.success(`${room.name} hisobi yopildi va to‘lov qabul qilindi!`);
    } else {
      toast.error(res.message || 'Xatolik yuz berdi');
    }
  };

  const isOccupied = room.status === 'band';

  return (
    <div className="space-y-4">
      {/* Top Navigation bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/rooms')}
          >
            Xonalar
          </Button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{room.name}</h1>
              <Badge variant={isOccupied ? 'band' : 'bosh'}>
                {isOccupied ? 'Band' : 'Bo‘sh'}
              </Badge>
              {isDirty && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Saqlanmagan o‘zgarishlar
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">Sig‘imi: {room.capacity}</p>
          </div>
        </div>

        {/* Right action button shortcuts */}
        <div className="flex items-center gap-2">
          {workingItems.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={Save}
              onClick={handleSaveOrder}
              disabled={!isDirty}
            >
              Saqlash
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={Receipt}
            onClick={() => {
              if (workingItems.length === 0) {
                toast.error('To‘lov qilish uchun avval buyurtmaga mahsulot qo‘shing!');
                return;
              }
              setIsPaymentModalOpen(true);
            }}
            disabled={workingItems.length === 0}
            className="shadow-sm shadow-emerald-600/20"
          >
            Hisobni yopish
          </Button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="grid grid-cols-2 gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileTab('menu')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mobileTab === 'menu'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Taomlar menyusi</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('cart')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
            mobileTab === 'cart'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Buyurtma ({workingItems.reduce((s, i) => s + i.quantity, 0)})</span>
          {workingItems.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-3" />
          )}
        </button>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Menu Products (7 cols on lg) */}
        <div
          className={`space-y-4 lg:col-span-7 ${
            mobileTab === 'cart' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Search & Category filter */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <Input
              placeholder="Mahsulot nomi yoki toifasi bo‘yicha qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {INITIAL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dishes Grid */}
          {filteredMenu.length === 0 ? (
            <EmptyState
              icon={Utensils}
              title="Mahsulot topilmadi"
              description="Qidiruv yoki toifa bo‘yicha hech narsa chiqmadi."
              actionText="Filtrlarni tozalash"
              onAction={() => {
                setActiveCategory('Barchasi');
                setSearchQuery('');
              }}
            />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredMenu.map((item) => {
                const inOrderQty = orderQuantities[item.id] || 0;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleAddItem(item)}
                    className={`bg-white rounded-2xl p-4 border transition-all duration-150 flex flex-col justify-between group cursor-pointer relative ${
                      !item.isAvailable
                        ? 'opacity-50 pointer-events-none border-slate-200'
                        : inOrderQty > 0
                        ? 'border-emerald-300 ring-1 ring-emerald-200/60 shadow-sm hover:shadow-md'
                        : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    {/* Badge showing quantity in current order */}
                    {inOrderQty > 0 && (
                      <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                        {inOrderQty}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600">
                          {item.category}
                        </span>
                        {!item.isAvailable && (
                          <span className="text-rose-600 font-semibold">Tugagan</span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900">
                        {formatCurrency(item.price)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddItem(item);
                        }}
                        className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                        title="Buyurtmaga qo‘shish"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Current Order Table & Summary (5 cols on lg) */}
        <div
          className={`space-y-4 lg:col-span-5 ${
            mobileTab === 'menu' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col min-h-[500px]">
            {/* Order Card Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span>Joriy buyurtma</span>
                </h3>
                <p className="text-xs text-slate-500">
                  {room.name} • {workingItems.reduce((s, i) => s + i.quantity, 0)} ta mahsulot
                </p>
              </div>

              {currentOrder?.createdAt && (
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> Boshlangan:
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {formatTime(currentOrder.createdAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Order Items List */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[380px] divide-y divide-slate-100">
              {workingItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700">Buyurtma bo‘sh</h4>
                  <p className="text-xs text-slate-400 max-w-xs mt-1">
                    Chap tarafdagi menyudan mahsulotlarni tanlab qo‘shing.
                  </p>
                </div>
              ) : (
                workingItems.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-xs sm:text-sm text-slate-800 truncate">
                        {item.name}
                      </h5>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatCurrency(item.price)} / dona
                      </p>
                    </div>

                    {/* Quantity controls (- qty +) */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer text-xs"
                        title="Kamaytirish"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-7 text-center text-xs font-bold text-slate-800">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer text-xs"
                        title="Ko‘paytirish"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line total & delete */}
                    <div className="text-right shrink-0 min-w-[70px]">
                      <p className="text-xs font-bold text-slate-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Summary & Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200/80 rounded-b-2xl space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Mahsulotlar jami:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>

              {/* Discount Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600">Chegirma:</span>
                  {!showDiscountInput && (
                    <button
                      type="button"
                      onClick={() => setShowDiscountInput(true)}
                      className="text-emerald-700 font-semibold hover:underline text-[11px] cursor-pointer"
                    >
                      {workingDiscount > 0 ? 'O‘zgartirish' : '+ Qo‘shish'}
                    </button>
                  )}
                </div>
                <span className="font-semibold text-emerald-700">
                  {workingDiscount > 0 ? `-${formatCurrency(workingDiscount)}` : '0 so‘m'}
                </span>
              </div>

              {/* Discount Input Form */}
              {showDiscountInput && (
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Chegirma summasi (so‘m)"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Button size="sm" variant="primary" onClick={handleApplyDiscount}>
                    Qo‘llash
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowDiscountInput(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Final Total */}
              <div className="pt-2 border-t border-slate-200 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Yakuniy summa:
                  </span>
                </div>
                <span className="text-xl font-black text-emerald-800">
                  {formatCurrency(finalTotal)}
                </span>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  icon={Save}
                  onClick={handleSaveOrder}
                  disabled={workingItems.length === 0 || !isDirty}
                  className="w-full justify-center"
                >
                  Buyurtmani saqlash
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  icon={Receipt}
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={workingItems.length === 0}
                  className="w-full justify-center shadow-md shadow-emerald-600/20"
                >
                  Hisobni yopish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Checkout Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        room={room}
        order={{
          id: currentOrder?.id || generateId('ord'),
          items: workingItems,
          discountAmount: workingDiscount,
          subtotal,
          finalTotal,
        }}
        onConfirmPayment={handleConfirmPayment}
        isProcessing={isProcessingPayment}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!closedReceipt}
        onClose={() => {
          setClosedReceipt(null);
          navigate('/rooms');
        }}
        order={closedReceipt}
      />
    </div>
  );
}
