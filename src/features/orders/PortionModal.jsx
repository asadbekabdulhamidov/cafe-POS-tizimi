import React, { useState, useEffect } from 'react';
import { Utensils, Check, Plus, Minus, PieChart } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function PortionModal({
  isOpen,
  onClose,
  menuItem,
  initialPortion = 1,
  onConfirmPortion,
}) {
  const { t, localize, lang } = useAppConfigStore();
  const [portion, setPortion] = useState(String(initialPortion || 1));

  useEffect(() => {
    if (isOpen) {
      setPortion(String(initialPortion || 1));
    }
  }, [isOpen, initialPortion]);

  if (!menuItem) return null;

  const numPortion = Math.max(0.05, Number(portion) || 0);
  const totalPrice = Math.round(numPortion * menuItem.price);

  // Quick teahouse portions (0.5 yarimta, 0.7, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0)
  const quickPortions = [
    { value: 0.5, label: lang === 'cyrl' ? '0.5 (Ярим)' : '0.5 (Yarim)', badge: '0.5' },
    { value: 0.7, label: lang === 'cyrl' ? '0.7 пор' : '0.7 pors', badge: '0.7' },
    { value: 1.0, label: lang === 'cyrl' ? '1 та (Тўлиқ)' : '1 ta (To‘liq)', badge: '1.0' },
    { value: 1.5, label: lang === 'cyrl' ? '1.5 пор' : '1.5 pors', badge: '1.5' },
    { value: 2.0, label: lang === 'cyrl' ? '2 та' : '2 ta', badge: '2.0' },
    { value: 2.5, label: '2.5', badge: '2.5' },
    { value: 3.0, label: '3.0', badge: '3.0' },
    { value: 4.0, label: '4.0', badge: '4.0' },
  ];

  const handleSetQuick = (val) => {
    setPortion(String(val));
  };

  const handleAdjust = (delta) => {
    const cur = Number(portion) || 0;
    const next = Math.max(0.1, Math.round((cur + delta) * 10) / 10);
    setPortion(String(next));
  };

  const handleConfirm = (e) => {
    e?.preventDefault();
    if (numPortion > 0) {
      onConfirmPortion(menuItem, numPortion);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${localize(menuItem.name)} — ${t('portion.title')}`}
      subtitle={t('portion.sub')}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleConfirm} className="space-y-4">
        {/* Price info card */}
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider block">
              {t('portion.price_per_pors')}
            </span>
            <p className="font-extrabold text-base text-indigo-950 dark:text-indigo-100">
              {formatCurrency(menuItem.price, true, lang)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        {/* Portion input with large font */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('portion.input_label')}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAdjust(-0.1)}
              className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-base cursor-pointer shrink-0 active:scale-95 transition-all"
              title="-0.1 pors"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="50"
                autoFocus
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                className="w-full text-center text-2xl font-black rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="1.0"
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                {lang === 'cyrl' ? 'пор' : 'pors'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleAdjust(0.1)}
              className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-base cursor-pointer shrink-0 active:scale-95 transition-all"
              title="+0.1 pors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick portion buttons (0.5, 0.7, 1, 1.5, 2...) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            {t('portion.quick')}
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {quickPortions.map((p) => {
              const isSelected = Math.abs(Number(portion) - p.value) < 0.001;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => handleSetQuick(p.value)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center active:scale-95 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <span className="leading-tight">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculated Total Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {numPortion} {lang === 'cyrl' ? 'пор' : 'pors'} × {formatCurrency(menuItem.price, true, lang)}
          </span>
          <span className="text-base font-extrabold text-indigo-700 dark:text-indigo-400">
            = {formatCurrency(totalPrice, true, lang)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            {t('btn.cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Check}
            className="flex-1 justify-center bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
          >
            {t('portion.add_to_order')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
