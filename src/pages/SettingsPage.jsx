import React, { useState } from 'react';
import {
  RotateCcw,
  Save,
  Database,
  Building,
  Phone,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from 'sonner';

export function SettingsPage() {
  const { settings, updateSettings, resetAllDemoData } = usePOSStore();

  const [formData, setFormData] = useState({
    choyxonaName: settings.choyxonaName || 'Choyxona POS',
    address: settings.address || '',
    phone: settings.phone || '',
    receiptHeader: settings.receiptHeader || 'Xush kelibsiz!',
    receiptFooter: settings.receiptFooter || 'Tashrifingiz uchun rahmat!',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Sozlamalar muvaffaqiyatli saqlandi!');
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Diqqat! Barcha demo ma’lumotlar (xonalar, buyurtmalar, to‘lovlar) dastlabki holatga qaytariladi. Davom etasizmi?'
      )
    ) {
      resetAllDemoData();
      toast.success('Demo ma’lumotlar muvaffaqiyatli qayta tiklandi!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Tizim sozlamalari</h2>
          <p className="text-xs text-slate-500">
            Choyxona ma’lumotlari va chek parametrlarini sozlash
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
          >
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">
              Choyxona rekvizitlari
            </h3>

            <Input
              label="Choyxona nomi"
              name="choyxonaName"
              value={formData.choyxonaName}
              onChange={handleChange}
              icon={Building}
              placeholder="Masalan: Choyxona Osh Markazi"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Manzil"
                name="address"
                value={formData.address}
                onChange={handleChange}
                icon={Building}
                placeholder="Toshkent shahri, Chilonzor"
              />

              <Input
                label="Telefon raqam"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                placeholder="+998 71 200 00 00"
              />
            </div>

            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 pt-2">
              Chek parametrlari
            </h3>

            <Input
              label="Chek sarlavhasi (Header matni)"
              name="receiptHeader"
              value={formData.receiptHeader}
              onChange={handleChange}
              icon={FileText}
              placeholder="Xush kelibsiz!"
            />

            <Input
              label="Chek osti yozuvi (Footer matni)"
              name="receiptFooter"
              value={formData.receiptFooter}
              onChange={handleChange}
              icon={FileText}
              placeholder="Tashrifingiz uchun rahmat!"
            />

            <div className="pt-3 flex justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                Sozlamalarni saqlash
              </Button>
            </div>
          </form>

          {/* Reset Demo Data Section */}
          <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-rose-800 text-sm">
                  Demo ma’lumotlarni qayta tiklash
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Agar test jarayonida xonalar yoki buyurtmalarni o‘chirgan yoki tozalagan
                  bo‘lsangiz, tizimni dastlabki holatga qaytarishingiz mumkin.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="danger"
                size="sm"
                icon={RotateCcw}
                onClick={handleReset}
              >
                Dastlabki demo ma’lumotlarga qaytarish
              </Button>
            </div>
          </div>
        </div>

        {/* Right Info Cards (1 col) */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-800">Tizim haqida</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>Choyxona POS</strong> — choyxona va milliy taomlar oshxonalari uchun
              ixtisoslashtirilgan tezkor buyurtma va hisob-kitob tizimi.
            </p>
            <div className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Versiya:</span>
                <span className="font-bold text-slate-700">1.0.0 (Frontend Edition)</span>
              </div>
              <div className="flex justify-between">
                <span>Arxitektura:</span>
                <span className="font-bold text-slate-700">React + Vite + Zustand</span>
              </div>
              <div className="flex justify-between">
                <span>Xotira:</span>
                <span className="font-bold text-slate-700">localStorage</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200/70 text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4 text-emerald-700" />
              <span>Backend integratsiyasi</span>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Tizim barcha biznes logikasi va ma’lumotlar oqimini modulli service va store
              qatlamida saqlaydi. Kelgusida Node.js va PostgreSQL backendiga ulash uchun
              faqatgina <code className="bg-white/80 px-1 py-0.5 rounded text-[11px]">storageService.js</code>{' '}
              faylini API so‘rovlari bilan almashtirish kifoya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
