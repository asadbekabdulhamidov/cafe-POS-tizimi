import React, { useState, useEffect } from 'react';
import { DoorOpen, UtensilsCrossed, Layers } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function PlaceModal({ isOpen, onClose, onSave, place = null, existingPlaces = [] }) {
  const [type, setType] = useState('stol'); // 'xona' | 'stol' | 'sori'
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('4-6 kishi');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (place) {
      setType(place.type || 'xona');
      setName(place.name || '');
      setCapacity(place.capacity || '4-6 kishi');
    } else {
      // Auto-suggest next number when creating new
      const currentType = type || 'stol';
      const typeLabel = currentType === 'xona' ? 'xona' : currentType === 'sori' ? 'so‘ri' : 'stol';
      const count = existingPlaces.filter((p) => (p.type || 'xona') === currentType).length + 1;
      setName(`${count}-${typeLabel}`);
      setCapacity(currentType === 'xona' ? '6-8 kishi' : currentType === 'sori' ? '8-10 kishi' : '4 kishi');
    }
    setErrors({});
  }, [place, isOpen, type, existingPlaces]);

  const handleTypeSelect = (selectedType) => {
    setType(selectedType);
    if (!place) {
      const typeLabel = selectedType === 'xona' ? 'xona' : selectedType === 'sori' ? 'so‘ri' : 'stol';
      const count = existingPlaces.filter((p) => (p.type || 'xona') === selectedType).length + 1;
      setName(`${count}-${typeLabel}`);
      setCapacity(
        selectedType === 'xona' ? '6-8 kishi' : selectedType === 'sori' ? '8-10 kishi' : '4 kishi'
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Nom yoki raqamni kiriting';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      type,
      capacity: capacity.trim() || '4 kishi',
    });

    onClose();
  };

  const capacityPresets = ['2 kishi', '4 kishi', '6-8 kishi', '8-10 kishi', '12-15 kishi'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={place ? 'Joy ma’lumotlarini tahrirlash' : 'Yangi joy qo‘shish'}
      subtitle="Oshxona kengayganda yangi xona, stol yoki so‘ri qo‘shing"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Place Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Joy turi
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Xona */}
            <button
              type="button"
              onClick={() => handleTypeSelect('xona')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                type === 'xona'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <DoorOpen className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold">Xona</span>
              <span className="text-[10px] text-slate-400">Alohida kabina</span>
            </button>

            {/* Stol */}
            <button
              type="button"
              onClick={() => handleTypeSelect('stol')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                type === 'stol'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/30'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <UtensilsCrossed className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold">Stol</span>
              <span className="text-[10px] text-slate-400">Zaldagi stol</span>
            </button>

            {/* So'ri */}
            <button
              type="button"
              onClick={() => handleTypeSelect('sori')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                type === 'sori'
                  ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-500/30'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Layers className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold">So‘ri</span>
              <span className="text-[10px] text-slate-400">Tapchan / Chorpoya</span>
            </button>
          </div>
        </div>

        {/* Name input */}
        <Input
          label="Nomi yoki raqami"
          placeholder="Masalan: 5-stol, 3-xona yoki VIP so‘ri"
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
            label="Sig‘imi"
            placeholder="Masalan: 4-6 kishi"
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
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit" variant="primary">
            {place ? 'Saqlash' : 'Qo‘shish'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
