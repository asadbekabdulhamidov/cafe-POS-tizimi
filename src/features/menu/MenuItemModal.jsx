import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function MenuItemModal({ isOpen, onClose, onSave, item = null }) {
  const { t, localize, lang } = useAppConfigStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Shashlik');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('dona');
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setCategory(item.category || 'Shashlik');
      setPrice(item.price !== undefined ? String(item.price) : '');
      const normalizedUnit =
        item.unit === 'porsiya' || item.unit === 'pors' ? 'pors' : item.unit || 'dona';
      setUnit(normalizedUnit);
      setDescription(item.description || '');
      setIsAvailable(item.isAvailable !== undefined ? item.isAvailable : true);
    } else {
      setName('');
      setCategory('Shashlik');
      setPrice('');
      setUnit('pors');
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
      newErrors.name = lang === 'cyrl' ? 'Маҳсулот номини киритинг' : 'Mahsulot nomini kiriting';
    }
    const numPrice = Number(price);
    if (!price || isNaN(numPrice) || numPrice < 0) {
      newErrors.price = lang === 'cyrl' ? 'Тўғри нарх киритинг' : 'To‘g‘ri narx kiriting';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      category,
      price: numPrice,
      unit: unit === 'porsiya' ? 'pors' : unit || 'pors',
      description: description.trim(),
      isAvailable,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? t('menu.edit') : t('menu.add_new')}
      subtitle={lang === 'cyrl' ? 'Менюдаги маҳсулот маълумотларини киритинг' : 'Menyudagi mahsulot ma’lumotlarini kiriting'}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('menu.col_name')}
          placeholder={lang === 'cyrl' ? 'Масалан: Қозон кабоб' : 'Masalan: Qozon kabob'}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          error={errors.name}
          required
          autoFocus
        />

        <Select
          label={t('menu.col_category')}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categories.map((c) => ({ value: c, label: localize(c) }))}
        />

        {/* Visual Unit Selector (Porsiya, Dona, Kilogramm, Litr) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            {t('menu.unit_label')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setUnit('pors')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 ${
                unit === 'pors'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/30 font-bold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xl shrink-0">🍲</span>
              <div className="min-w-0">
                <p className="text-xs leading-tight">{lang === 'cyrl' ? 'Порция (пор)' : 'Porsiya (pors)'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">0.5, 0.7, 1 pors</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUnit('dona')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 ${
                unit === 'dona'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-bold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xl shrink-0">🥖</span>
              <div className="min-w-0">
                <p className="text-xs leading-tight">{lang === 'cyrl' ? 'Дона' : 'Dona'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">0.5 yarimta, 1 dona</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUnit('kg')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 ${
                unit === 'kg'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-600 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30 font-bold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xl shrink-0">⚖️</span>
              <div className="min-w-0">
                <p className="text-xs leading-tight">{lang === 'cyrl' ? 'Килограмм' : 'Kilogramm (kg)'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">1.3 kg, go‘sht, osh</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setUnit('litr')}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer active:scale-95 ${
                unit === 'litr'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/30 font-bold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-xl shrink-0">🫖</span>
              <div className="min-w-0">
                <p className="text-xs leading-tight">{lang === 'cyrl' ? 'Литр (л)' : 'Litr (L)'}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Choy, sharbat</p>
              </div>
            </button>
          </div>
        </div>

        <Input
          label={`${t('menu.col_price')} (${t('currency.som')} / ${
            unit === 'kg'
              ? (lang === 'cyrl' ? 'кг' : 'kg')
              : unit === 'pors' || unit === 'porsiya'
              ? (lang === 'cyrl' ? 'пор' : 'pors')
              : (lang === 'cyrl' ? 'дона' : 'dona')
          })`}
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            {lang === 'cyrl' ? 'Тавсиф (ихтиёрий)' : 'Tavsif (ixtiyoriy)'}
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={lang === 'cyrl' ? 'Таркиби ёки тайёрланиш усули...' : 'Tarkibi yoki tayyorlanish usuli...'}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 dark:focus:border-emerald-500 resize-none"
          />
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{t('menu.col_status')}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isAvailable ? t('menu.available') : t('menu.unavailable')}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            {t('btn.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {item ? t('btn.save') : t('btn.add')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
