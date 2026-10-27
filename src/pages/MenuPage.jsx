import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
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
      toast.success(`"${itemData.name}" muvaffaqiyatli yangilandi!`);
    } else {
      addMenuItem(itemData);
      toast.success(`"${itemData.name}" menyuga qo‘shildi!`);
    }
  };

  const handleDeleteItem = (item) => {
    if (window.confirm(`Haqiqatan ham "${item.name}" mahsulotini menyudan o‘chirmoqchimisiz?`)) {
      deleteMenuItem(item.id);
      toast.success(`"${item.name}" menyudan o‘chirildi!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Menyu boshqaruvi</h2>
          <p className="text-xs text-slate-500">
            Jami {menu.length} ta mahsulot ro‘yxatda mavjud
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenAdd}
          className="shadow-sm shadow-emerald-600/20"
        >
          Yangi mahsulot qo‘shish
        </Button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="w-full md:w-80">
          <Input
            placeholder="Mahsulot nomi yoki toifasini qidirish..."
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

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
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
          title="Mahsulot topilmadi"
          description="Ushbu toifada yoki qidiruv bo‘yicha mahsulot mavjud emas."
          actionText="Yangi mahsulot qo‘shish"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Mahsulot nomi</th>
                  <th className="py-3.5 px-4">Kategoriya</th>
                  <th className="py-3.5 px-4">Narxi</th>
                  <th className="py-3.5 px-4">Holati</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMenu.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Name & Desc */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </div>
                      {item.description && (
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <Badge variant="default" size="sm">
                        {item.category}
                      </Badge>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatCurrency(item.price)}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => toggleItemAvailability(item.id)}
                        className="cursor-pointer"
                        title="Holatni o‘zgartirish uchun bosing"
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
                          {item.isAvailable ? 'Mavjud' : 'Tugagan'}
                        </Badge>
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="O‘chirish"
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
