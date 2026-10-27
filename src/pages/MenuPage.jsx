import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { MenuItemModal } from '../features/menu/MenuItemModal';
import { formatCurrency } from '../utils/formatters';
import { INITIAL_CATEGORIES } from '../data/initialData';
import { toast } from 'sonner';

export function MenuPage() {
  const { menu, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability } =
    usePOSStore();
  const { t, localize, lang } = useAppConfigStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Barchasi');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Filtered menu
  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      if (selectedCategory !== 'Barchasi' && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        return matchesName || matchesCategory;
      }
      return true;
    });
  }, [menu, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData);
      toast.success(
        lang === 'cyrl'
          ? `"${itemData.name}" муваффақиятли янгиланди!`
          : `"${itemData.name}" muvaffaqiyatli yangilandi!`
      );
    } else {
      addMenuItem(itemData);
      toast.success(
        lang === 'cyrl'
          ? `"${itemData.name}" менюга қўшилди!`
          : `"${itemData.name}" menyuga qo‘shildi!`
      );
    }
  };

  const handleDeleteItem = (item) => {
    const confirmMsg =
      lang === 'cyrl'
        ? `Ҳақиқатан ҳам "${item.name}" маҳсулотини менюдан ўчирмоқчимисиз?`
        : `Haqiqatan ham "${item.name}" mahsulotini menyudan o‘chirmoqchimisiz?`;

    if (window.confirm(confirmMsg)) {
      deleteMenuItem(item.id);
      toast.success(
        lang === 'cyrl'
          ? `"${item.name}" менюдан ўчирилди!`
          : `"${item.name}" menyudan o‘chirildi!`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('menu.title')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'cyrl' ? 'Жами' : 'Jami'} {menu.length} {t('unit.items')} {lang === 'cyrl' ? 'маҳсулот рўйхатда мавжуд' : 'mahsulot ro‘yxatda mavjud'}
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenAdd}
          className="shadow-sm shadow-emerald-600/20"
        >
          {t('menu.add_new')}
        </Button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors duration-150">
        <div className="w-full md:w-80">
          <Input
            placeholder={lang === 'cyrl' ? 'Маҳсулот номи ёки тоифасини қидириш...' : 'Mahsulot nomi yoki toifasini qidirish...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {INITIAL_CATEGORIES.map((cat) => {
            const count =
              cat === 'Barchasi'
                ? menu.length
                : menu.filter((i) => i.category === cat).length;
            const isActive = selectedCategory === cat;
            const label = cat === 'Barchasi' ? t('cat.all') : localize(cat);

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Table / Cards */}
      {filteredMenu.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title={lang === 'cyrl' ? 'Маҳсулот топилмади' : 'Mahsulot topilmadi'}
          description={lang === 'cyrl' ? 'Ушбу тоифада ёки қидирув бўйича маҳсулот мавжуд эмас.' : 'Ushbu toifada yoki qidiruv bo‘yicha mahsulot mavjud emas.'}
          actionText={t('menu.add_new')}
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-150">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">{t('menu.col_name')}</th>
                  <th className="py-3.5 px-4">{t('menu.col_category')}</th>
                  <th className="py-3.5 px-4">{t('menu.col_price')}</th>
                  <th className="py-3.5 px-4">{t('menu.col_status')}</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">{t('menu.col_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredMenu.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Name & Desc */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {localize(item.name)}
                      </div>
                      {item.description && (
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                          {localize(item.description)}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <Badge variant="default" size="sm">
                        {localize(item.category)}
                      </Badge>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(item.price, true, lang)}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleItemAvailability(item.id)}
                        className="cursor-pointer"
                        title={lang === 'cyrl' ? 'Ҳолатни ўзгартириш' : 'Holatni o‘zgartirish'}
                      >
                        <Badge
                          variant={item.isAvailable ? 'success' : 'danger'}
                          size="sm"
                          className="hover:opacity-80 transition-opacity"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isAvailable ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          {item.isAvailable ? t('menu.available') : t('menu.unavailable')}
                        </Badge>
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title={t('menu.edit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title={t('menu.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        item={editingItem}
      />
    </div>
  );
}
