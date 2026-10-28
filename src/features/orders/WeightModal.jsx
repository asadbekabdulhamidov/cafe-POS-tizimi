import React, { useState, useEffect } from 'react';
import { Scale, Check, Plus, Minus } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function WeightModal({
  isOpen,
  onClose,
  menuItem,
  initialWeight = 1,
  onConfirmWeight,
}) {
  const { t, localize, lang } = useAppConfigStore();
  const [weight, setWeight] = useState(String(initialWeight || 1));

  useEffect(() => {
    if (isOpen) {
      setWeight(String(initialWeight || (menuItem?.unit === 'kg' ? 1 : 1)));
    }
  }, [isOpen, initialWeight, menuItem]);

  if (!menuItem) return null;

  const numWeight = Math.max(0.01, Number(weight) || 0);
  const totalPrice = Math.round(numWeight * menuItem.price);

  // Quick teahouse weights
  const quickWeights = [0.5, 0.7, 1.0, 1.2, 1.3, 1.5, 2.0, 2.5, 3.0];

  const handleSetQuick = (w) => {
    setWeight(String(w));
  };

  const handleAdjust = (delta) => {
    const cur = Number(weight) || 0;
    const next = Math.max(0.1, Math.round((cur + delta) * 10) / 10);
    setWeight(String(next));
  };

  const handleConfirm = (e) => {
    e?.preventDefault();
    if (numWeight > 0) {
      onConfirmWeight(menuItem, numWeight);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${localize(menuItem.name)} — ${t('weight.title')}`}
      subtitle={t('weight.sub')}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleConfirm} className="space-y-4">
        {/* Price info card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
              {lang === 'cyrl' ? '1 кг нархи:' : '1 kg narxi:'}
            </span>
            <p className="font-bold text-base text-emerald-950 dark:text-emerald-100">
              {formatCurrency(menuItem.price, true, lang)}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Weight input with large font */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('weight.input_label')}
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAdjust(-0.1)}
              className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-base cursor-pointer shrink-0"
              title="-0.1 kg"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="relative flex-1">
              <input
                type="number"
                step="0.05"
                min="0.05"
                max="50"
                autoFocus
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full text-center text-2xl font-black rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="1.3"
              />
              <span className="absolute right-3.5 top-3.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                {lang === 'cyrl' ? 'кг' : 'kg'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleAdjust(0.1)}
              className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-base cursor-pointer shrink-0"
              title="+0.1 kg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick weight buttons */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
            {t('weight.quick')}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {quickWeights.map((w) => {
              const isSelected = Number(weight) === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => handleSetQuick(w)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {w} {lang === 'cyrl' ? 'кг' : 'kg'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculated Total Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            {numWeight} {lang === 'cyrl' ? 'кг' : 'kg'} × {formatCurrency(menuItem.price, true, lang)}
          </span>
          <span className="text-base font-extrabold text-emerald-800 dark:text-emerald-400">
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
            className="flex-1 shadow-md shadow-emerald-600/20"
            icon={Check}
          >
            {t('weight.add_to_order')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
