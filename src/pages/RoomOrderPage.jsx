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
  ArrowRightLeft,
  Printer,
  Scale,
  ArrowRight,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { PaymentModal } from '../features/orders/PaymentModal';
import { ReceiptModal } from '../features/orders/ReceiptModal';
import { TransferModal } from '../features/orders/TransferModal';
import { WeightModal } from '../features/orders/WeightModal';
import { PortionModal } from '../features/orders/PortionModal';
import { formatCurrency, formatTime, formatQuantity, generateId } from '../utils/formatters';
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
    transferOrder,
    isProcessingPayment,
  } = usePOSStore();

  const { t, localize, lang } = useAppConfigStore();

  const room = rooms.find((r) => r.id === roomId);

  // Active category and search
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');

  // Discount toggle & input
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountInput, setDiscountInput] = useState('');

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isPreCheckModalOpen, setIsPreCheckModalOpen] = useState(false);
  const [weightModalItem, setWeightModalItem] = useState(null);
  const [portionModalItem, setPortionModalItem] = useState(null);
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
          title={lang === 'cyrl' ? 'Жой топилмади' : 'Joy topilmadi'}
          description={lang === 'cyrl' ? 'Бундай жой мавжуд эмас.' : 'Bunday joy mavjud emas.'}
          actionText={lang === 'cyrl' ? 'Жойлар рўйхатига қайтиш' : 'Joylar ro‘yxatiga qaytish'}
          onAction={() => navigate('/rooms')}
        />
      </div>
    );
  }

  // Add dish to order (supports kg and dona)
  const handleAddItem = (menuItem, customWeight = null) => {
    if (!menuItem.isAvailable) {
      toast.error(
        lang === 'cyrl'
          ? 'Бу маҳсулот ҳозирда мавжуд эмас!'
          : 'Bu mahsulot hozirda mavjud emas!'
      );
      return;
    }

    const isKg = menuItem.unit === 'kg';
    const isPors = menuItem.unit === 'pors' || menuItem.unit === 'porsiya';

    // If item is sold by kg and no custom weight was passed, open WeightModal
    if (isKg && customWeight === null) {
      setWeightModalItem(menuItem);
      return;
    }

    // If item is sold by portion (pors) and no custom portion was passed, open PortionModal
    if (isPors && customWeight === null) {
      setPortionModalItem(menuItem);
      return;
    }

    const qtyToAdd = customWeight !== null ? Number(customWeight) : 1;

    setWorkingItems((prev) => {
      const idx = prev.findIndex((i) => i.menuItemId === menuItem.id);
      if (idx >= 0) {
        const updated = [...prev];
        const currentQty = Number(updated[idx].quantity) || 0;
        const newQty = Math.round((currentQty + qtyToAdd) * 100) / 100;
        updated[idx] = {
          ...updated[idx],
          quantity: newQty,
          unit: menuItem.unit || updated[idx].unit || 'dona',
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
            unit: menuItem.unit || 'dona',
            quantity: Math.round(qtyToAdd * 100) / 100,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });

    setIsDirty(true);
    if (customWeight !== null) {
      const unitLabel = isKg
        ? (lang === 'cyrl' ? 'кг' : 'kg')
        : isPors
        ? (lang === 'cyrl' ? 'пор' : 'pors')
        : (lang === 'cyrl' ? 'та' : 'ta');

      toast.success(
        lang === 'cyrl'
          ? `${localize(menuItem.name)} (${qtyToAdd} ${unitLabel}) қўшилди!`
          : `${menuItem.name} (${qtyToAdd} ${unitLabel}) qo‘shildi!`
      );
    }
  };

  // Change quantity (delta or explicit)
  const handleUpdateQuantity = (itemId, delta, explicitValue = null) => {
    setWorkingItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            if (explicitValue !== null) {
              const val = Math.max(0.01, Number(explicitValue));
              return { ...item, quantity: Math.round(val * 100) / 100 };
            }
            const nextQty = Math.round((Number(item.quantity) + delta) * 100) / 100;
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
      toast.error(
        lang === 'cyrl'
          ? 'Чегирма манфий бўлиши мумкин эмас'
          : 'Chegirma manfiy bo‘lishi mumkin emas'
      );
      return;
    }
    if (val > subtotal) {
      toast.error(
        lang === 'cyrl'
          ? 'Чегирма умумий суммадан катта бўлиши мумкин эмас'
          : 'Chegirma umumiy summadan katta bo‘lishi mumkin emas'
      );
      return;
    }
    setWorkingDiscount(val);
    setShowDiscountInput(false);
    setIsDirty(true);
    toast.success(
      lang === 'cyrl'
        ? `Чегирма қўлланди: ${formatCurrency(val, true, lang)}`
        : `Chegirma qo‘llandi: ${formatCurrency(val, true, lang)}`
    );
  };

  // Save current order
  const handleSaveOrder = () => {
    if (workingItems.length === 0) {
      toast.error(
        lang === 'cyrl'
          ? 'Буюртмада ҳеч қандай маҳсулот йўқ!'
          : 'Buyurtmada hech qanday mahsulot yo‘q!'
      );
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
    toast.success(
      lang === 'cyrl'
        ? `${localize(room.name)} учун буюртма сақланди!`
        : `${room.name} uchun buyurtma muvaffaqiyatli saqlandi!`
    );
  };

  // Confirm and close bill
  const handleConfirmPayment = async ({
    paymentMethod,
    discountAmount,
    cashGiven,
    change,
  }) => {
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
      cashGiven,
      change,
      closedBy: 'admin',
    });

    if (res.success) {
      setIsPaymentModalOpen(false);
      setClosedReceipt(res.order);
      toast.success(
        lang === 'cyrl'
          ? `${localize(room.name)} ҳисоби ёпилди ва тўлов қабул қилинди!`
          : `${room.name} hisobi yopildi va to‘lov qabul qilindi!`
      );
    } else {
      toast.error(res.message || 'Xatolik yuz berdi');
    }
  };

  // Transfer order to another empty place
  const handleConfirmTransfer = (fromId, toId) => {
    if (isDirty) {
      handleSaveOrder();
    }
    const res = transferOrder(fromId, toId);
    if (res.success) {
      setIsTransferModalOpen(false);
      toast.success(
        lang === 'cyrl'
          ? `Буюртма ${localize(res.toRoom.name)}га муваффақиятли кўчирилди!`
          : `Buyurtma ${res.toRoom.name}ga muvaffaqiyatli ko‘chirildi!`
      );
      navigate(`/rooms/${toId}`);
    } else {
      toast.error(res.message || 'Xatolik yuz berdi');
    }
  };

  // Open pre-check bill
  const handleOpenPreCheck = () => {
    if (workingItems.length === 0) {
      toast.error(
        lang === 'cyrl'
          ? 'Пре-чек чиқариш учун аввал буюртмага маҳсулот қўшинг!'
          : 'Pre-chek chiqarish uchun avval buyurtmaga mahsulot qo‘shing!'
      );
      return;
    }
    if (isDirty) {
      handleSaveOrder();
    }
    setIsPreCheckModalOpen(true);
  };

  const isOccupied = room.status === 'band';

  return (
    <div className="space-y-4">
      {/* Top Navigation bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 transition-colors duration-150">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate('/rooms')}
          >
            {t('order.back_to_places')}
          </Button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                {localize(room.name)}
              </h1>
              <Badge variant={isOccupied ? 'band' : 'bosh'}>
                {isOccupied ? t('places.band') : t('places.bosh')}
              </Badge>
              {isDirty && (
                <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800/60">
                  {lang === 'cyrl' ? 'Сақланмаган ўзгаришлар' : 'Saqlanmagan o‘zgarishlar'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('place_modal.capacity_label')}: {localize(room.capacity)}
            </p>
          </div>
        </div>

        {/* Right action button shortcuts */}
        <div className="flex items-center flex-wrap gap-2">
          {workingItems.length > 0 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                icon={Printer}
                onClick={handleOpenPreCheck}
                title={t('precheck.title')}
              >
                <span className="hidden sm:inline">{t('precheck.btn')}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                icon={ArrowRightLeft}
                onClick={() => setIsTransferModalOpen(true)}
                title={t('transfer.title')}
              >
                <span className="hidden sm:inline">{t('transfer.btn')}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={Save}
                onClick={handleSaveOrder}
                disabled={!isDirty}
              >
                {t('btn.save')}
              </Button>
            </>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={Receipt}
            onClick={() => {
              if (workingItems.length === 0) {
                toast.error(
                  lang === 'cyrl'
                    ? 'Тўлов қилиш учун аввал буюртмага маҳсулот қўшинг!'
                    : 'To‘lov qilish uchun avval buyurtmaga mahsulot qo‘shing!'
                );
                return;
              }
              setIsPaymentModalOpen(true);
            }}
            disabled={workingItems.length === 0}
            className="shadow-sm shadow-emerald-600/20"
          >
            {t('order.close_bill')}
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
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>{t('order.menu_tab')}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('cart')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 relative ${
            mobileTab === 'cart'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>
            {t('order.cart_tab')} ({workingItems.reduce((s, i) => s + i.quantity, 0)})
          </span>
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
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors duration-150">
            <Input
              placeholder={t('order.search_dish')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {INITIAL_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                const label = cat === 'Barchasi' ? t('cat.all') : localize(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dishes Grid */}
          {filteredMenu.length === 0 ? (
            <EmptyState
              icon={Utensils}
              title={lang === 'cyrl' ? 'Маҳсулот топилмади' : 'Mahsulot topilmadi'}
              description={
                lang === 'cyrl'
                  ? 'Қидирув ёки тоифа бўйича ҳеч нарса чиқмади.'
                  : 'Qidiruv yoki toifa bo‘yicha hech narsa chiqmadi.'
              }
              actionText={lang === 'cyrl' ? 'Филтрларни тозалаш' : 'Filtrlarni tozalash'}
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
                    className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all duration-150 flex flex-col justify-between group cursor-pointer relative ${
                      !item.isAvailable
                        ? 'opacity-50 pointer-events-none border-slate-200 dark:border-slate-800'
                        : inOrderQty > 0
                        ? 'border-emerald-300 dark:border-emerald-700 ring-1 ring-emerald-200/60 dark:ring-emerald-900/40 shadow-sm hover:shadow-md'
                        : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                    }`}
                  >
                    {/* Badge showing quantity in current order */}
                    {inOrderQty > 0 && (
                      <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-[11px] font-bold px-2 h-6 rounded-full flex items-center justify-center shadow-md">
                        {inOrderQty}{' '}
                        {item.unit === 'kg'
                          ? (lang === 'cyrl' ? 'кг' : 'kg')
                          : item.unit === 'pors' || item.unit === 'porsiya'
                          ? (lang === 'cyrl' ? 'пор' : 'pors')
                          : ''}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-600 dark:text-slate-300">
                          {localize(item.category)}
                        </span>
                        {item.unit === 'kg' && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-[10px] tracking-wider uppercase">
                            KG
                          </span>
                        )}
                        {(item.unit === 'pors' || item.unit === 'porsiya') && (
                          <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-extrabold text-[10px] tracking-wider uppercase">
                            PORS
                          </span>
                        )}
                        {!item.isAvailable && (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold">
                            {t('order.out_of_stock')}
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                        {localize(item.name)}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                          {localize(item.description)}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                          {formatCurrency(item.price, true, lang)}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                          /{' '}
                          {item.unit === 'kg'
                            ? (lang === 'cyrl' ? 'кг' : 'kg')
                            : item.unit === 'pors' || item.unit === 'porsiya'
                            ? (lang === 'cyrl' ? 'пор' : 'pors')
                            : (lang === 'cyrl' ? 'дона' : 'dona')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddItem(item);
                        }}
                        className={`h-7 px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer text-xs font-bold active:scale-95 ${
                          item.unit === 'kg'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-600 hover:text-white'
                            : item.unit === 'pors' || item.unit === 'porsiya'
                            ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white'
                        }`}
                        title={
                          item.unit === 'kg'
                            ? t('weight.title')
                            : item.unit === 'pors' || item.unit === 'porsiya'
                            ? t('portion.title')
                            : t('btn.add')
                        }
                      >
                        {item.unit === 'kg' ? (
                          <>
                            <Scale className="w-3.5 h-3.5" />
                            <span>kg</span>
                          </>
                        ) : item.unit === 'pors' || item.unit === 'porsiya' ? (
                          <>
                            <Utensils className="w-3.5 h-3.5" />
                            <span>pors</span>
                          </>
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
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
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col min-h-[500px] transition-colors duration-150">
            {/* Order Card Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 rounded-t-2xl">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('order.current_order')}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {localize(room.name)} • {workingItems.reduce((s, i) => s + i.quantity, 0)} {t('unit.items')}
                </p>
              </div>

              {currentOrder?.createdAt && (
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" /> {t('order.started')}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {formatTime(currentOrder.createdAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Order Items List */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[380px] divide-y divide-slate-100 dark:divide-slate-800">
              {workingItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {t('order.empty_cart')}
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                    {t('order.empty_cart_desc')}
                  </p>
                </div>
              ) : (
                workingItems.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                          {localize(item.name)}
                        </h5>
                        {item.unit === 'kg' && (
                          <span className="px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-[9px] uppercase">
                            KG
                          </span>
                        )}
                        {(item.unit === 'pors' || item.unit === 'porsiya') && (
                          <span className="px-1 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 font-extrabold text-[9px] uppercase">
                            PORS
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {formatCurrency(item.price, true, lang)} /{' '}
                        {item.unit === 'kg'
                          ? (lang === 'cyrl' ? 'кг' : 'kg')
                          : item.unit === 'pors' || item.unit === 'porsiya'
                          ? (lang === 'cyrl' ? 'пор' : 'pors')
                          : (lang === 'cyrl' ? 'дона' : 'dona')}
                      </p>
                    </div>

                    {/* Quantity controls (- qty +) */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            item.unit === 'kg' || item.unit === 'pors' || item.unit === 'porsiya'
                              ? -0.1
                              : -1
                          )
                        }
                        className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
                        title={
                          item.unit === 'kg'
                            ? '-0.1 kg'
                            : item.unit === 'pors' || item.unit === 'porsiya'
                            ? '-0.1 pors'
                            : '-1'
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      {item.unit === 'kg' ? (
                        <div className="flex items-center gap-0.5 px-0.5">
                          <input
                            type="number"
                            step="0.05"
                            min="0.05"
                            value={item.quantity}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              if (!isNaN(v) && v > 0) {
                                handleUpdateQuantity(item.id, 0, v);
                              }
                            }}
                            className="w-11 text-center text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded border border-slate-200 dark:border-slate-600 py-0.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="text-[10px] font-bold text-slate-500 uppercase">
                            {lang === 'cyrl' ? 'кг' : 'kg'}
                          </span>
                        </div>
                      ) : item.unit === 'pors' || item.unit === 'porsiya' ? (
                        <div className="flex items-center gap-0.5 px-0.5">
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={item.quantity}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              if (!isNaN(v) && v > 0) {
                                handleUpdateQuantity(item.id, 0, v);
                              }
                            }}
                            className="w-11 text-center text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded border border-slate-200 dark:border-slate-600 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                            {lang === 'cyrl' ? 'пор' : 'pors'}
                          </span>
                        </div>
                      ) : (
                        <span className="w-6 text-center text-xs font-bold text-slate-800 dark:text-slate-100">
                          {item.quantity}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            item.unit === 'kg' || item.unit === 'pors' || item.unit === 'porsiya'
                              ? 0.1
                              : 1
                          )
                        }
                        className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
                        title={
                          item.unit === 'kg'
                            ? '+0.1 kg'
                            : item.unit === 'pors' || item.unit === 'porsiya'
                            ? '+0.1 pors'
                            : '+1'
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      {item.unit === 'kg' && (
                        <button
                          type="button"
                          onClick={() => {
                            const found = menu.find((m) => m.id === item.menuItemId) || item;
                            setWeightModalItem(found);
                          }}
                          className="p-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/60 transition-colors ml-0.5 cursor-pointer"
                          title={t('weight.title')}
                        >
                          <Scale className="w-3 h-3" />
                        </button>
                      )}

                      {(item.unit === 'pors' || item.unit === 'porsiya') && (
                        <button
                          type="button"
                          onClick={() => {
                            const found = menu.find((m) => m.id === item.menuItemId) || item;
                            setPortionModalItem(found);
                          }}
                          className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors ml-0.5 cursor-pointer"
                          title={t('portion.title')}
                        >
                          <Utensils className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Line total & delete */}
                    <div className="text-right shrink-0 min-w-[70px]">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(item.price * item.quantity, true, lang)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                      title={t('btn.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Summary & Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200/80 dark:border-slate-800 rounded-b-2xl space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{t('order.subtotal')}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(subtotal, true, lang)}</span>
              </div>

              {/* Discount Row */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600 dark:text-slate-400">{t('order.discount')}</span>
                  {!showDiscountInput && (
                    <button
                      type="button"
                      onClick={() => setShowDiscountInput(true)}
                      className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline text-[11px] cursor-pointer"
                    >
                      {workingDiscount > 0 ? t('order.change_discount') : t('order.add_discount')}
                    </button>
                  )}
                </div>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                  {workingDiscount > 0 ? `-${formatCurrency(workingDiscount, true, lang)}` : `0 ${t('currency.som')}`}
                </span>
              </div>

              {/* Discount Input Form */}
              {showDiscountInput && (
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                  <input
                    type="number"
                    placeholder={lang === 'cyrl' ? 'Чегирма суммаси (сўм)' : 'Chegirma summasi (so‘m)'}
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <Button size="sm" variant="primary" onClick={handleApplyDiscount}>
                    {t('order.apply')}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowDiscountInput(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Final Total */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {t('order.final_total')}
                  </span>
                </div>
                <span className="text-xl font-black text-emerald-800 dark:text-emerald-400">
                  {formatCurrency(finalTotal, true, lang)}
                </span>
              </div>

              {/* Action Buttons: 2 rows */}
              <div className="space-y-2 pt-2">
                {/* Secondary utility row */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Printer}
                    onClick={handleOpenPreCheck}
                    disabled={workingItems.length === 0}
                    className="w-full justify-center text-xs"
                  >
                    {t('precheck.btn')}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={ArrowRightLeft}
                    onClick={() => setIsTransferModalOpen(true)}
                    disabled={workingItems.length === 0}
                    className="w-full justify-center text-xs"
                  >
                    {t('transfer.btn')}
                  </Button>
                </div>

                {/* Primary main row */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    icon={Save}
                    onClick={handleSaveOrder}
                    disabled={workingItems.length === 0 || !isDirty}
                    className="w-full justify-center font-bold"
                  >
                    {t('order.save_order')}
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    icon={Receipt}
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={workingItems.length === 0}
                    className="w-full justify-center font-bold shadow-md shadow-emerald-600/20"
                  >
                    {t('order.close_bill')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Cart & Checkout Pill for iPhone */}
      {mobileTab === 'menu' && workingItems.length > 0 && (
        <div className="fixed bottom-18 left-3.5 right-3.5 lg:hidden z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <button
            type="button"
            onClick={() => setMobileTab('cart')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white px-4 py-3 rounded-2xl shadow-xl shadow-emerald-950/20 border border-emerald-500/40 flex items-center justify-between backdrop-blur-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white/20 text-white font-extrabold text-xs flex items-center justify-center">
                {workingItems.reduce((s, i) => s + i.quantity, 0)}
              </span>
              <span className="text-xs font-bold">{t('order.cart_tab')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight">{formatCurrency(finalTotal, true, lang)}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      )}

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

      {/* Transfer Place Modal */}
      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        currentRoom={room}
        order={{
          id: currentOrder?.id || generateId('ord'),
          items: workingItems,
          subtotal,
          discountAmount: workingDiscount,
          finalTotal,
        }}
        onConfirmTransfer={handleConfirmTransfer}
      />

      {/* Pre-Check Modal (Oraliq hisob-kitob varaqasi) */}
      <ReceiptModal
        isOpen={isPreCheckModalOpen}
        onClose={() => setIsPreCheckModalOpen(false)}
        isPreCheck={true}
        order={{
          id: currentOrder?.id || generateId('ord'),
          roomName: room.name,
          items: workingItems,
          subtotal,
          discountAmount: workingDiscount,
          finalTotal,
          createdAt: currentOrder?.createdAt || new Date().toISOString(),
        }}
      />

      {/* Weight Modal for Kilogram Dishes (Osh, Go'sht, etc.) */}
      <WeightModal
        isOpen={!!weightModalItem}
        onClose={() => setWeightModalItem(null)}
        menuItem={weightModalItem}
        initialWeight={
          weightModalItem
            ? workingItems.find((i) => i.menuItemId === weightModalItem.id)?.quantity || 1
            : 1
        }
        onConfirmWeight={(mItem, w) => {
          handleAddItem(mItem, w);
        }}
      />

      {/* Portion Modal for Dishes sold by portions (Osh, Lag'mon, Sho'rva, Manti, etc.) */}
      <PortionModal
        isOpen={!!portionModalItem}
        onClose={() => setPortionModalItem(null)}
        menuItem={portionModalItem}
        initialPortion={
          portionModalItem
            ? workingItems.find((i) => i.menuItemId === portionModalItem.id)?.quantity || 1
            : 1
        }
        onConfirmPortion={(mItem, p) => {
          handleAddItem(mItem, p);
        }}
      />

      {/* Final Closed Receipt Modal */}
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
