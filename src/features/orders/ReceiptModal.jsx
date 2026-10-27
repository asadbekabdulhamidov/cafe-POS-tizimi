import React from 'react';
import { Printer } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { usePOSStore } from '../../store/usePOSStore';

export function ReceiptModal({ isOpen, onClose, order }) {
  const { settings } = usePOSStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chek ma’lumotlari"
      subtitle="Hisob muvaffaqiyatli yopildi"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Printable Receipt Paper styled container */}
        <div
          id="pos-receipt"
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs font-mono text-xs text-slate-800 space-y-3"
        >
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h4 className="font-bold text-base font-sans tracking-tight text-slate-900">
              {settings.choyxonaName || 'Choyxona POS'}
            </h4>
            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
              {settings.address || 'Toshkent shahri'}
            </p>
            <p className="text-[11px] text-slate-500 font-sans">
              Tel: {settings.phone || '+998 71 200 00 00'}
            </p>
            <p className="text-[11px] font-sans text-emerald-700 font-semibold mt-1">
              {settings.receiptHeader || 'Xush kelibsiz!'}
            </p>
          </div>

          {/* Meta Info */}
          <div className="py-1 text-[11px] space-y-1 border-b border-dashed border-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Xona:</span>
              <span className="font-bold">{order.roomName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Chek raqami:</span>
              <span>#{order.id.slice(-6).toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sana va vaqt:</span>
              <span>{formatDateTime(order.closedAt || order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kassir:</span>
              <span>{order.closedBy || 'admin'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">To‘lov turi:</span>
              <span className="font-bold uppercase">
                {order.paymentMethod === 'karta' ? 'Karta / Terminal' : 'Naqd pul'}
              </span>
            </div>
          </div>

          {/* Items list */}
          <div className="py-2 border-b border-dashed border-slate-300">
            <div className="flex justify-between font-bold pb-1 text-slate-600">
              <span>Mahsulot</span>
              <span>Jami</span>
            </div>
            <div className="space-y-1.5 mt-1">
              {(order.items || []).map((item, idx) => (
                <div key={item.id || idx} className="flex justify-between items-baseline">
                  <div className="truncate pr-2">
                    <span>{item.name}</span>
                    <div className="text-[10px] text-slate-500">
                      {item.quantity} x {formatCurrency(item.price)}
                    </div>
                  </div>
                  <span className="font-semibold shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="py-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Mahsulotlar jami:</span>
              <span>{formatCurrency(order.subtotal || order.finalTotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Chegirma:</span>
                <span>-{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-slate-300">
              <span>JAMI TO‘LANDI:</span>
              <span className="text-emerald-700">{formatCurrency(order.finalTotal)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[11px] text-slate-500 font-sans">
            <p>{settings.receiptFooter || 'Tashrifingiz uchun rahmat!'}</p>
            <p className="text-[10px] text-slate-400 mt-1">
              Tizim: Choyxona POS Frontend
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Yopish
          </Button>
          <Button
            variant="primary"
            className="flex-1 shadow-sm"
            icon={Printer}
            onClick={handlePrint}
          >
            Chekni chop etish
          </Button>
        </div>
      </div>
    </Modal>
  );
}
