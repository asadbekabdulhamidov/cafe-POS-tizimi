import React, { useState, useMemo } from 'react';
import {
  LogOut,
  Clock,
  Wallet,
  Banknote,
  CreditCard,
  Receipt,
  AlertTriangle,
  CheckCircle2,
  Coins,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { usePOSStore } from '../../store/usePOSStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';
import { toast } from 'sonner';

export function CloseShiftModal({ isOpen, onClose, onShiftClosed }) {
  const { currentShift, getCurrentShiftStats, closeShift } = usePOSStore();
  const { t, lang } = useAppConfigStore();

  const isCyrl = lang === 'cyrl';
  const stats = useMemo(() => {
    return getCurrentShiftStats();
  }, [getCurrentShiftStats, isOpen]);

  const expectedCash = stats?.expectedCashInDrawer || 0;
  const [actualCash, setActualCash] = useState(String(expectedCash));
  const [notes, setNotes] = useState('');

  // Update actualCash when modal opens or stats change
  React.useEffect(() => {
    if (isOpen && stats) {
      setActualCash(String(stats.expectedCashInDrawer || 0));
    }
  }, [isOpen, stats]);

  if (!currentShift || !stats) return null;

  const numActual = Number(actualCash) || 0;
  const difference = numActual - expectedCash;

  const durationHours = Math.max(
    0.1,
    Math.round(
      ((Date.now() - new Date(currentShift.openedAt).getTime()) / (1000 * 60 * 60)) * 10
    ) / 10
  );

  const handleConfirmClose = (e) => {
    e.preventDefault();

    const confirmMsg = isCyrl
      ? `#${currentShift.shiftNumber}-сменани ёпиб, Z-Ҳисоботни чиқармоқчимисиз?`
      : `#${currentShift.shiftNumber}-smenani yopib, Z-Hisobotni chiqarmoqchimisiz?`;

    if (!window.confirm(confirmMsg)) return;

    const result = closeShift({
      actualCash: numActual,
      notes: notes.trim(),
    });

    if (result.success) {
      toast.success(
        isCyrl
          ? `#${result.shift.shiftNumber}-смена муваффақиятли ёпилди!`
          : `#${result.shift.shiftNumber}-smena muvaffaqiyatli yopildi!`
      );
      onClose();
      if (onShiftClosed) {
        onShiftClosed(result.shift);
      }
    } else {
      toast.error(result.message || 'Xatolik yuz berdi');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('shift.close')} (#${currentShift.shiftNumber})`}
      subtitle={
        isCyrl
          ? 'Кассани текшириш, пулларни санаш ва сменани якунлаш'
          : 'Kassani tekshirish, pullarni sanash va smenani yakunlash'
      }
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleConfirmClose} className="space-y-4">
        {/* Header shift info card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {t('shift.cashier')}
            </span>
            <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
              {currentShift.cashierName}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" />
              {t('shift.duration')}
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {durationHours} {isCyrl ? 'соат' : 'soat'} ({formatDateTime(currentShift.openedAt, lang)})
            </span>
          </div>
        </div>

        {/* Revenue & Cash breakdown grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Boshlang'ich kassa */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">
              {t('shift.opening_cash')}
            </span>
            <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {formatCurrency(stats.openingCash, true, lang)}
            </span>
          </div>

          {/* Naqd tushum */}
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/50">
            <span className="text-emerald-700 dark:text-emerald-300 text-[11px] block flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5" />
              {t('reports.cash_payments')}
            </span>
            <span className="font-bold text-sm text-emerald-900 dark:text-emerald-100">
              +{formatCurrency(stats.cashTotal, true, lang)}
            </span>
          </div>

          {/* Karta tushumi */}
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/50">
            <span className="text-purple-700 dark:text-purple-300 text-[11px] block flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" />
              {t('reports.card_payments')}
            </span>
            <span className="font-bold text-sm text-purple-900 dark:text-purple-100">
              {formatCurrency(stats.cardTotal, true, lang)}
            </span>
          </div>

          {/* Jami savdo & Cheklar */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600">
            <span className="text-slate-600 dark:text-slate-300 text-[11px] block flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5" />
              {t('reports.total_rev')} ({stats.ordersCount} {isCyrl ? 'чек' : 'chek'})
            </span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              {formatCurrency(stats.totalRevenue, true, lang)}
            </span>
          </div>
        </div>

        {/* Expected vs Actual Cash in Drawer */}
        <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                {t('shift.cash_in_drawer')}
              </span>
              <p className="font-extrabold text-base text-amber-950 dark:text-amber-100">
                {formatCurrency(expectedCash, true, lang)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActualCash(String(expectedCash))}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold hover:bg-amber-300 transition-colors cursor-pointer"
            >
              {t('payment.exact_amount')}
            </button>
          </div>

          {/* Actual Cash Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {t('shift.actual_cash')}
            </label>
            <div className="relative">
              <input
                type="number"
                step="1000"
                min="0"
                value={actualCash}
                onChange={(e) => setActualCash(e.target.value)}
                placeholder="0"
                className="w-full text-xl font-black py-2 pl-3 pr-16 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 uppercase">
                {t('currency.som')}
              </span>
            </div>
          </div>

          {/* Difference / Discrepancy indicator */}
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold ${
              difference === 0
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/60 dark:border-emerald-700 dark:text-emerald-300'
                : difference < 0
                ? 'bg-rose-50 border-rose-300 text-rose-800 dark:bg-rose-950/60 dark:border-rose-700 dark:text-rose-300'
                : 'bg-blue-50 border-blue-300 text-blue-800 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {difference === 0 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              )}
              <span>{t('shift.difference')}:</span>
            </div>

            <span>
              {difference === 0
                ? t('shift.no_diff')
                : difference < 0
                ? `${t('shift.shortage')}: -${formatCurrency(Math.abs(difference), true, lang)}`
                : `${t('shift.surplus')}: +${formatCurrency(difference, true, lang)}`}
            </span>
          </div>
        </div>

        {/* Notes input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            {t('shift.notes')}
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              isCyrl
                ? 'Масалан: Касса топширилди, камомад йўқ'
                : 'Masalan: Kassa topshirildi, kamomad yo‘q'
            }
            className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button variant="secondary" className="flex-1" onClick={onClose} type="button">
            {t('btn.cancel')}
          </Button>
          <Button
            variant="danger"
            className="flex-1 shadow-sm"
            icon={LogOut}
            type="submit"
          >
            {t('shift.close')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
