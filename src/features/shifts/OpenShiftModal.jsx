import React, { useState } from 'react';
import { UserCheck, Wallet, PlayCircle, Coins } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../utils/formatters';
import { usePOSStore } from '../../store/usePOSStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';
import { toast } from 'sonner';

export function OpenShiftModal({ isOpen, onClose }) {
  const { openShift, shifts } = usePOSStore();
  const { t, lang } = useAppConfigStore();

  const isCyrl = lang === 'cyrl';
  const [cashierName, setCashierName] = useState('Alisher (Kassir)');
  const [openingCash, setOpeningCash] = useState('500000');
  const [error, setError] = useState('');

  const nextShiftNumber = (shifts[0]?.shiftNumber || 0) + 1;
  const quickCashiers = ['Alisher (Kassir)', 'Sardor (Kassir)', 'Madina (Kassir)', 'Jasur (Kassir)'];
  const quickAmounts = [0, 200000, 500000, 1000000];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cashierName.trim()) {
      setError(isCyrl ? 'Кассир исмини киритинг!' : 'Kassir ismini kiriting!');
      return;
    }

    const numCash = Math.max(0, Number(openingCash) || 0);
    const result = openShift({
      cashierName: cashierName.trim(),
      openingCash: numCash,
    });

    if (result.success) {
      toast.success(
        isCyrl
          ? `${cashierName} учун #${result.shift.shiftNumber}-смена муваффақиятли очилди!`
          : `${cashierName} uchun #${result.shift.shiftNumber}-smena muvaffaqiyatli ochildi!`
      );
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('shift.open')} (#${nextShiftNumber})`}
      subtitle={
        isCyrl
          ? 'Янги иш сменасини очиш ва касса қолдиғини белгилаш'
          : 'Yangi ish smenasini ochish va kassa qoldig‘ini belgilash'
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Cashier input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            {t('shift.cashier')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={cashierName}
              onChange={(e) => {
                setCashierName(e.target.value);
                if (error) setError('');
              }}
              placeholder={isCyrl ? 'Кассир исми ва фамилияси' : 'Kassir ismi va familiyasi'}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
            <UserCheck className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
          </div>
          {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}

          {/* Quick Cashier selection pills */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {quickCashiers.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCashierName(name)}
                className={`text-[11px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  cashierName === name
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {name.replace(' (Kassir)', '')}
              </button>
            ))}
          </div>
        </div>

        {/* Opening cash balance (Mayda pullar / boshlang'ich kassa) */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              {t('shift.opening_cash')}
            </span>
          </div>

          <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-tight">
            {isCyrl
              ? 'Касса ғазнасида кун бошида мавжуд бўлган майда қайтим пуллари (сдача).'
              : 'Kassa g‘aznasida kun boshida mavjud bo‘lgan mayda qaytim pullari (sdacha).'}
          </p>

          <div className="relative">
            <input
              type="number"
              step="1000"
              min="0"
              value={openingCash}
              onChange={(e) => setOpeningCash(e.target.value)}
              placeholder="500 000"
              className="w-full text-xl font-black py-2.5 pl-3 pr-16 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400 uppercase">
              {t('currency.som')}
            </span>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setOpeningCash(String(amt))}
                className={`py-1 px-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  Number(openingCash) === amt
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {amt === 0 ? '0' : amt >= 1000000 ? `${amt / 1000000} mln` : `${amt / 1000}k`}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">
            {t('btn.cancel')}
          </Button>
          <Button variant="primary" className="flex-1 shadow-sm" icon={PlayCircle} type="submit">
            {t('shift.open')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
