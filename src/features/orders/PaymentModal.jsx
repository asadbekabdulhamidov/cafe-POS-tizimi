import React, { useState } from 'react';
import {
  CreditCard,
  Banknote,
  CheckCircle,
  Coins,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatters';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function PaymentModal({
  isOpen,
  onClose,
  room,
  order,
  onConfirmPayment,
  isProcessing = false,
}) {
  const { t, localize, lang } = useAppConfigStore();
  const [paymentMethod, setPaymentMethod] = useState('naqd'); // 'naqd' | 'karta'
  const [cashGiven, setCashGiven] = useState('');

  if (!order || !room) return null;

  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const discount = Math.min(subtotal, Math.max(0, Number(order.discountAmount) || 0));
  const finalTotal = Math.max(0, subtotal - discount);

  const cashNumber = Number(cashGiven) || 0;
  const difference = cashNumber - finalTotal;
  const hasChange = difference >= 0;
  const isShort = cashNumber > 0 && difference < 0;

  // Handle quick cash bill addition or setting
  const handleSetCash = (amount) => {
    setCashGiven(String(amount));
  };

  const handleAddCash = (amount) => {
    setCashGiven(String((Number(cashGiven) || 0) + amount));
  };

  const handleConfirm = () => {
    onConfirmPayment({
      paymentMethod,
      discountAmount: discount,
      cashGiven: paymentMethod === 'naqd' ? (cashNumber > 0 ? cashNumber : finalTotal) : undefined,
      change: paymentMethod === 'naqd' && hasChange ? difference : 0,
    });
  };

  // Common denominations in UZS
  const commonBills = [50000, 100000, 200000];
  // Calculate next round up 50k or 100k
  const rounded50k = Math.ceil(finalTotal / 50000) * 50000;
  const rounded100k = Math.ceil(finalTotal / 100000) * 100000;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${localize(room.name)} — ${t('payment.modal_title')}`}
      subtitle={t('payment.modal_sub')}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Total Display */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 text-center">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            {t('payment.total_to_pay')}
          </p>
          <p className="text-3xl font-black text-emerald-900 dark:text-emerald-100 mt-1">
            {formatCurrency(finalTotal, true, lang)}
          </p>
          {discount > 0 && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
              ({t('order.discount')} {formatCurrency(discount, true, lang)})
            </p>
          )}
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {t('payment.method')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('naqd')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                paymentMethod === 'naqd'
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  paymentMethod === 'naqd'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Banknote className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">{t('payment.cash')}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('karta')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                paymentMethod === 'karta'
                  ? 'border-purple-600 dark:border-purple-500 bg-purple-50/80 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  paymentMethod === 'karta'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold">{t('payment.card')}</span>
            </button>
          </div>
        </div>

        {/* Cash given & change calculation (if naqd) */}
        {paymentMethod === 'naqd' && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('payment.received_amount')}</span>
                </label>
                {cashGiven && (
                  <button
                    type="button"
                    onClick={() => setCashGiven('')}
                    className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
                  >
                    {lang === 'cyrl' ? 'Тозалаш' : 'Tozalash'}
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="number"
                  placeholder={String(finalTotal)}
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-base font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-400">
                  {t('currency.som')}
                </span>
              </div>
            </div>

            {/* Quick Bill / Denomination Buttons */}
            <div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                {t('payment.quick_bills')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {/* Exact amount button */}
                <button
                  type="button"
                  onClick={() => handleSetCash(finalTotal)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                    cashNumber === finalTotal
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600'
                  }`}
                >
                  ✓ {t('payment.exact_amount')}
                </button>

                {/* Rounded amount if different from exact */}
                {rounded50k > finalTotal && (
                  <button
                    type="button"
                    onClick={() => handleSetCash(rounded50k)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all"
                  >
                    {formatCurrency(rounded50k, true, lang)}
                  </button>
                )}

                {rounded100k > finalTotal && rounded100k !== rounded50k && (
                  <button
                    type="button"
                    onClick={() => handleSetCash(rounded100k)}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all"
                  >
                    {formatCurrency(rounded100k, true, lang)}
                  </button>
                )}

                {/* Increments */}
                <button
                  type="button"
                  onClick={() => handleAddCash(10000)}
                  className="px-2 py-1 text-xs font-medium rounded-lg border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                >
                  +10 000
                </button>
                <button
                  type="button"
                  onClick={() => handleAddCash(50000)}
                  className="px-2 py-1 text-xs font-medium rounded-lg border bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                >
                  +50 000
                </button>
              </div>
            </div>

            {/* Change Display Card */}
            {cashNumber > 0 && (
              hasChange ? (
                <div className="p-3 bg-emerald-100/70 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                      {t('payment.change_amount')}
                    </span>
                    <p className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-0.5">
                      {formatCurrency(difference, true, lang)}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                    {lang === 'cyrl' ? 'Қайтарилади' : 'Qaytariladi'}
                  </span>
                </div>
              ) : isShort ? (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    {t('payment.short_by')}
                  </span>
                  <span className="font-bold text-rose-700 dark:text-rose-300 text-sm">
                    {formatCurrency(Math.abs(difference), true, lang)}
                  </span>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={isProcessing}
          >
            {t('payment.cancel')}
          </Button>
          <Button
            variant="primary"
            className="flex-1 shadow-md shadow-emerald-600/20"
            icon={CheckCircle}
            onClick={handleConfirm}
            loading={isProcessing}
          >
            {t('payment.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
