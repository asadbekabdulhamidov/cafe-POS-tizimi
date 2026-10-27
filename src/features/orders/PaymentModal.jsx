import React, { useState } from 'react';
import { CreditCard, Banknote, CheckCircle } from 'lucide-react';
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
  const change = Math.max(0, cashNumber - finalTotal);

  const handleConfirm = () => {
    onConfirmPayment({
      paymentMethod,
      discountAmount: discount,
      cashGiven: paymentMethod === 'naqd' ? cashNumber : undefined,
      change: paymentMethod === 'naqd' ? change : 0,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${localize(room.name)} — ${t('payment.modal_title')}`}
      subtitle={t('payment.modal_sub')}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
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

        {/* Order items brief recap */}
        <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
          <div className="font-semibold text-slate-500 dark:text-slate-400 pb-1.5 flex justify-between">
            <span>{t('receipt.product')} ({order.items.length})</span>
            <span>{t('receipt.total')}</span>
          </div>
          {order.items.map((item) => (
            <div key={item.id} className="py-1.5 flex justify-between items-center text-slate-700 dark:text-slate-300">
              <span className="truncate pr-2">
                {localize(item.name)} <span className="text-slate-400 dark:text-slate-500">x{item.quantity}</span>
              </span>
              <span className="font-medium shrink-0">
                {formatCurrency(item.price * item.quantity, true, lang)}
              </span>
            </div>
          ))}
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
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                paymentMethod === 'naqd'
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentMethod === 'naqd'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Banknote className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">{t('payment.cash')}</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('karta')}
              className={`p-3.5 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                paymentMethod === 'karta'
                  ? 'border-purple-600 dark:border-purple-500 bg-purple-50/80 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 ring-2 ring-purple-500/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  paymentMethod === 'karta'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold">{t('payment.card')}</span>
            </button>
          </div>
        </div>

        {/* Cash given & change calculation (if naqd) */}
        {paymentMethod === 'naqd' && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-2.5">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                {t('payment.cash_given')}
              </label>
              <input
                type="number"
                placeholder={String(finalTotal)}
                value={cashGiven}
                onChange={(e) => setCashGiven(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {cashNumber > 0 && (
              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-600 dark:text-slate-400">{t('payment.change')}</span>
                <span className={`font-bold ${change >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {change >= 0
                    ? formatCurrency(change, true, lang)
                    : `${lang === 'cyrl' ? 'Етмаяпти:' : 'Yetmayapti:'} ${formatCurrency(Math.abs(change), true, lang)}`}
                </span>
              </div>
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
