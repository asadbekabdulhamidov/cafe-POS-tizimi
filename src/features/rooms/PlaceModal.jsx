import React, { useState, useEffect } from 'react';
import { DoorOpen, UtensilsCrossed, Layers } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function PlaceModal({ isOpen, onClose, onSave, place = null, existingPlaces = [] }) {
  const { t, lang } = useAppConfigStore();
  const [type, setType] = useState('stol'); // 'xona' | 'stol' | 'sori'
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('4-6 kishi');
  const [errors, setErrors] = useState({});

  const personWord = lang === 'cyrl' ? 'киши' : 'kishi';

  useEffect(() => {
    if (place) {
      setType(place.type || 'xona');
      setName(place.name || '');
      setCapacity(place.capacity || `4-6 ${personWord}`);
    } else {
      // Auto-suggest next number when creating new
      const currentType = type || 'stol';
      const typeLabel =
        currentType === 'xona'
          ? (lang === 'cyrl' ? 'хона' : 'xona')
          : currentType === 'sori'
          ? (lang === 'cyrl' ? 'сўри' : 'so‘ri')
          : (lang === 'cyrl' ? 'стол' : 'stol');
      const count = existingPlaces.filter((p) => (p.type || 'xona') === currentType).length + 1;
      setName(`${count}-${typeLabel}`);
      setCapacity(
        currentType === 'xona'
          ? `6-8 ${personWord}`
          : currentType === 'sori'
          ? `8-10 ${personWord}`
          : `4 ${personWord}`
      );
    }
    setErrors({});
  }, [place, isOpen, type, existingPlaces, lang, personWord]);

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
    if (!place) {
      const typeLabel =
        selectedType === 'xona'
          ? (lang === 'cyrl' ? 'хона' : 'xona')
          : selectedType === 'sori'
          ? (lang === 'cyrl' ? 'сўри' : 'so‘ri')
          : (lang === 'cyrl' ? 'стол' : 'stol');
      const count = existingPlaces.filter((p) => (p.type || 'xona') === selectedType).length + 1;
      setName(`${count}-${typeLabel}`);
      setCapacity(
        selectedType === 'xona'
          ? `6-8 ${personWord}`
          : selectedType === 'sori'
          ? `8-10 ${personWord}`
          : `4 ${personWord}`
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = lang === 'cyrl' ? 'Ном ёки рақамни киритинг' : 'Nom yoki raqamni kiriting';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      type,
      capacity: capacity.trim() || `4 ${personWord}`,
    });

    onClose();
  };

  const capacityPresets = [
    `2 ${personWord}`,
    `4 ${personWord}`,
    `6-8 ${personWord}`,
    `8-10 ${personWord}`,
    `12-15 ${personWord}`,
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={place ? t('place_modal.edit_title') : t('place_modal.add_title')}
      subtitle={t('place_modal.subtitle')}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Place Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {t('place_modal.type_label')}
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Xona */}
            <button
              type="button"
              onClick={() => handleTypeSelect('xona')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                type === 'xona'
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <DoorOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold">{t('place_modal.type_xona')}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{t('place_modal.type_xona_sub')}</span>
            </button>

            {/* Stol */}
            <button
              type="button"
              onClick={() => handleTypeSelect('stol')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                type === 'stol'
                  ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold">{t('place_modal.type_stol')}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{t('place_modal.type_stol_sub')}</span>
            </button>

            {/* So'ri */}
            <button
              type="button"
              onClick={() => handleTypeSelect('sori')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                type === 'sori'
                  ? 'border-amber-600 dark:border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold">{t('place_modal.type_sori')}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{t('place_modal.type_sori_sub')}</span>
            </button>
          </div>
        </div>

        {/* Name input */}
        <Input
          label={t('place_modal.name_label')}
          placeholder={lang === 'cyrl' ? 'Масалан: 5-стол, 3-хона ёки VIP сўри' : 'Masalan: 5-stol, 3-xona yoki VIP so‘ri'}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: null });
          }}
          error={errors.name}
          required
        />

        {/* Capacity input and presets */}
        <div>
          <Input
            label={t('place_modal.capacity_label')}
            placeholder={`4 ${personWord}`}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {capacityPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCapacity(preset)}
                className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  capacity === preset
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            {t('btn.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {place ? t('btn.save') : t('btn.add')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
