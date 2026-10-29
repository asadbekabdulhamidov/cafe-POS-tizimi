import React from 'react';
import { Printer, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { usePOSStore } from '../../store/usePOSStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function ZReportModal({ isOpen, onClose, shift }) {
  const { settings } = usePOSStore();
  const { t, localize, lang } = useAppConfigStore();

  if (!shift) return null;

  const isCyrl = lang === 'cyrl';
  const diff = Number(shift.cashDifference) || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('shift.z_report')} — #${shift.shiftNumber}`}
      subtitle={
        isCyrl
          ? 'Смена ёпилиши бўйича расмий касса ҳисоботи'
          : 'Smena yopilishi bo‘yicha rasmiy kassa hisoboti'
      }
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Printable Thermal Receipt Style Container */}
        <div
          id="z-report-print-area"
          className="bg-white p-5 rounded-2xl border border-slate-200 text-slate-900 font-mono text-xs shadow-inner space-y-3 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800"
        >
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
            <h3 className="font-extrabold text-base tracking-wide uppercase font-sans">
              {localize(settings.choyxonaName) || 'Choyxona POS'}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {localize(settings.address)}
            </p>
            <p className="text-[11px] text-slate-500">
              {settings.phone}
            </p>
            <div className="mt-2.5 py-1 px-2 rounded bg-slate-100 dark:bg-slate-800 font-bold text-center text-xs tracking-wider">
              *** {t('shift.z_report').toUpperCase()} ***
            </div>
            <p className="text-xs font-black mt-1">
              {isCyrl ? 'СМЕНА' : 'SMENA'} #{shift.shiftNumber}
            </p>
          </div>

          {/* Shift Metadata */}
          <div className="py-2 border-b border-dashed border-slate-300 dark:border-slate-700 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('shift.cashier')}:</span>
              <span className="font-bold">{shift.cashierName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('shift.opened_at')}:</span>
              <span>{formatDateTime(shift.openedAt, lang)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('shift.closed_at')}:</span>
              <span>{formatDateTime(shift.closedAt, lang)}</span>
            </div>
          </div>

          {/* Cash Audit (Naqd kassa hisob-kitobi) */}
          <div className="py-2 border-b border-dashed border-slate-300 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('shift.opening_cash')}:</span>
              <span className="font-semibold">{formatCurrency(shift.openingCash, true, lang)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('reports.cash_payments')}:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(shift.cashTotal, true, lang)}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-dotted border-slate-200 dark:border-slate-700">
              <span className="text-slate-600 font-bold">{t('shift.cash_in_drawer')}:</span>
              <span className="font-extrabold">{formatCurrency(shift.expectedCashInDrawer, true, lang)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 font-bold">{t('shift.actual_cash')}:</span>
              <span className="font-black text-slate-900 dark:text-slate-100">
                {formatCurrency(shift.closingCashActual, true, lang)}
              </span>
            </div>

            {/* Difference / Kamomad / Ortiqcha */}
            <div className="flex justify-between font-bold pt-1">
              <span className="text-slate-600">{t('shift.difference')}:</span>
              <span
                className={
                  diff === 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : diff < 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-blue-600 dark:text-blue-400'
                }
              >
                {diff === 0
                  ? (isCyrl ? '0 сўм (Тўғри)' : '0 so‘m (To‘g‘ri)')
                  : diff < 0
                  ? `-${formatCurrency(Math.abs(diff), true, lang)} (${t('shift.shortage')})`
                  : `+${formatCurrency(diff, true, lang)} (${t('shift.surplus')})`}
              </span>
            </div>
          </div>

          {/* Non-cash Payments & Totals */}
          <div className="py-2 border-b border-dashed border-slate-300 dark:border-slate-700 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">{t('reports.card_payments')}:</span>
              <span className="font-semibold">{formatCurrency(shift.cardTotal, true, lang)}</span>
            </div>
            {shift.discountTotal > 0 && (
              <div className="flex justify-between text-rose-500">
                <span>{t('order.discount')}:</span>
                <span>-{formatCurrency(shift.discountTotal, true, lang)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">{t('shift.orders_count')}:</span>
              <span className="font-bold">{shift.totalOrdersCount} {isCyrl ? 'та' : 'ta'}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-1.5 border-t border-slate-300 dark:border-slate-700">
              <span className="uppercase">{t('reports.total_rev')}:</span>
              <span className="text-emerald-700 dark:text-emerald-400">
                {formatCurrency(shift.totalRevenue, true, lang)}
              </span>
            </div>
          </div>

          {shift.notes && (
            <div className="text-[11px] text-slate-500 italic py-1">
              <span className="font-bold not-italic">{t('shift.notes')}:</span> {shift.notes}
            </div>
          )}

          {/* Signatures */}
          <div className="pt-3 text-[10px] text-slate-500 space-y-3 font-sans">
            <div className="flex justify-between pt-2">
              <span>{isCyrl ? 'Кассир топширди: ________' : 'Kassir topshirdi: ________'}</span>
              <span>{isCyrl ? 'Қабул қилди: ________' : 'Qabul qildi: ________'}</span>
            </div>
            <p className="text-center text-[9px] text-slate-400 pt-1">
              {t('app.name')} • {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            {t('receipt.close')}
          </Button>
          <Button
            variant="primary"
            className="flex-1 shadow-sm"
            icon={Printer}
            onClick={handlePrint}
          >
            {t('receipt.print')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
