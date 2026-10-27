import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { INITIAL_CATEGORIES } from '../../data/initialData';

export function MenuItemModal({ isOpen, onClose, onSave, item = null }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Shashlik');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCategory(item.category || 'Shashlik');
      setPrice(item.price !== undefined ? String(item.price) : '');
      setDescription(item.description || '');
      setIsAvailable(item.isAvailable !== undefined ? item.isAvailable : true);
    } else {
      setName('');
      setCategory('Shashlik');
      setPrice('');
      setDescription('');
      setIsAvailable(true);
    }
    setErrors({});
  }, [item, isOpen]);

  const categories = INITIAL_CATEGORIES.filter((c) => c !== 'Barchasi');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Mahsulot nomini kiriting';
    }
    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice < 0) {
      newErrors.price = 'To‘g‘ri narx kiriting (0 yoki undan yuqori)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      category,
      price: numPrice,
      description: description.trim(),
      isAvailable,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo‘shish'}
      subtitle="Menyudagi mahsulot ma’lumotlarini kiriting"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Mahsulot nomi"
          placeholder="Masalan: Qozon kabob"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          error={errors.name}
          required
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Kategoriya"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categories.map((c) => ({ value: c, label: c }))}
          />

          <Input
            label="Narxi (so‘m)"
            type="number"
            placeholder="30 000"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
              if (errors.price) setErrors({ ...errors, price: null });
            }}
            error={errors.price}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Tavsif (ixtiyoriy)
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tarkibi yoki tayyorlanish usuli haqida qisqa ma’lumot..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 resize-none"
          />
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <p className="text-xs font-bold text-slate-800">Holati (Mavjudligi)</p>
            <p className="text-[11px] text-slate-500">
              {isAvailable ? 'Mahsulot buyurtmaga qo‘shilishi mumkin' : 'Vaqtinchalik tugagan'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" variant="primary">
            {item ? 'Saqlash' : 'Qo‘shish'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
