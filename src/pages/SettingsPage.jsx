import React, { useState } from 'react';
import {
  RotateCcw,
  Save,
  Database,
  Building,
  Phone,
  FileText,
  ShieldCheck,
  KeyRound,
  Sun,
  Moon,
  Languages,
  Download,
  Smartphone,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PWAInstallModal } from '../components/ui/PWAInstallModal';
import { toast } from 'sonner';

export function SettingsPage() {
  const { settings, updateSettings, resetAllDemoData } = usePOSStore();
  const { currentPin, changePin } = useAuthStore();
  const { theme, setTheme, lang, setLang, t } = useAppConfigStore();

  const [formData, setFormData] = useState({
    choyxonaName: settings.choyxonaName || 'Choyxona POS',
    address: settings.address || '',
    phone: settings.phone || '',
    receiptHeader: settings.receiptHeader || (lang === 'cyrl' ? 'Хуш келибсиз!' : 'Xush kelibsiz!'),
    receiptFooter: settings.receiptFooter || (lang === 'cyrl' ? 'Ташрифингиз учун раҳмат!' : 'Tashrifingiz uchun rahmat!'),
  });

  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success(lang === 'cyrl' ? 'Созламалар муваффақиятли сақланди!' : 'Sozlamalar muvaffaqiyatli saqlandi!');
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    setPinError('');

    if (!/^\d{4}$/.test(newPin.trim())) {
      setPinError(lang === 'cyrl' ? 'PIN-код аниқ 4 та рақам бўлиши керак (масалан: 1234)' : 'PIN-kod aniq 4 ta raqam bo‘lishi kerak (masalan: 1234)');
      return;
    }

    const res = changePin(newPin.trim());
    if (res.success) {
      toast.success(
        lang === 'cyrl'
          ? `Янги PIN-код (${newPin}) муваффақиятли ўрнатилди!`
          : `Yangi PIN-kod (${newPin}) muvaffaqiyatli o‘rnatildi!`
      );
      setNewPin('');
    } else {
      setPinError(res.message);
    }
  };

  const handleReset = () => {
    const confirmMsg =
      lang === 'cyrl'
        ? 'Диққат! Барча демо маълумотлар (хоналар, буюртмалар, тўловлар, PIN-код 1234) дастлабки ҳолатга қайтарилади. Давом этасизми?'
        : 'Diqqat! Barcha demo ma’lumotlar (xonalar, buyurtmalar, to‘lovlar, PIN-kod 1234) dastlabki holatga qaytariladi. Davom etasizmi?';

    if (window.confirm(confirmMsg)) {
      resetAllDemoData();
      toast.success(lang === 'cyrl' ? 'Демо маълумотлар муваффақиятли қайта тикланди!' : 'Demo ma’lumotlar muvaffaqiyatli qayta tiklandi!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('settings')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'cyrl'
              ? 'Чойхона маълумотлари, кўриниш, тил ва кириш PIN-кодини созлаш'
              : 'Choyxona ma’lumotlari, ko‘rinish, til va kirish PIN-kodini sozlash'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Form (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Appearance & Language Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
              {lang === 'cyrl' ? 'Интерфейс ва тил созламалари' : 'Interfeys va til sozlamalari'}
            </h3>

            {/* Theme switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {lang === 'cyrl' ? 'Тизим мавзуси (Режим)' : 'Tizim mavzusi (Rejim)'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    theme === 'light'
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{t('lightMode')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'cyrl' ? 'Кундузги ёруғ интерфейс' : 'Kunduzgi yorug‘ interfeys'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    theme === 'dark'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-900/60 text-indigo-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{t('darkMode')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'cyrl' ? 'Кўзни чарчатмайдиган қоронғи' : 'Ko‘zni charchatmaydigan qorong‘i'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Language switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                {lang === 'cyrl' ? 'Тизим ёзув алифбоси' : 'Tizim yozuv alifbosi'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLang('latn')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    lang === 'latn'
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className={`p-2 rounded-lg font-bold text-xs ${lang === 'latn' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    UZ
                  </div>
                  <div>
                    <p className="text-xs font-bold">{t('latin')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Lotin yozuvida</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLang('cyrl')}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    lang === 'cyrl'
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className={`p-2 rounded-lg font-bold text-xs ${lang === 'cyrl' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    ЎЗ
                  </div>
                  <div>
                    <p className="text-xs font-bold">{t('cyrillic')}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Кирилл ёзувида</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main info form */}
          <form
            onSubmit={handleSaveSettings}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors"
          >
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
              {lang === 'cyrl' ? 'Чойхона маълумотлари' : 'Choyxona rekvizitlari'}
            </h3>

            <Input
              label={lang === 'cyrl' ? 'Чойхона номи' : 'Choyxona nomi'}
              name="choyxonaName"
              value={formData.choyxonaName}
              onChange={handleChange}
              icon={Building}
              placeholder={lang === 'cyrl' ? 'Масалан: Чойхона Ош Маркази' : 'Masalan: Choyxona Osh Markazi'}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={lang === 'cyrl' ? 'Манзил' : 'Manzil'}
                name="address"
                value={formData.address}
                onChange={handleChange}
                icon={Building}
                placeholder={lang === 'cyrl' ? 'Тошкент шаҳри, Чилонзор' : 'Toshkent shahri, Chilonzor'}
              />

              <Input
                label={lang === 'cyrl' ? 'Телефон рақам' : 'Telefon raqam'}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                placeholder="+998 71 200 00 00"
              />
            </div>

            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-800 pb-2 pt-2">
              {lang === 'cyrl' ? 'Чек параметрлари' : 'Chek parametrlari'}
            </h3>

            <Input
              label={lang === 'cyrl' ? 'Чек сарлавҳаси (Header матни)' : 'Chek sarlavhasi (Header matni)'}
              name="receiptHeader"
              value={formData.receiptHeader}
              onChange={handleChange}
              icon={FileText}
              placeholder={lang === 'cyrl' ? 'Хуш келибсиз!' : 'Xush kelibsiz!'}
            />

            <Input
              label={lang === 'cyrl' ? 'Чек ости ёзуви (Footer матни)' : 'Chek osti yozuvi (Footer matni)'}
              name="receiptFooter"
              value={formData.receiptFooter}
              onChange={handleChange}
              icon={FileText}
              placeholder={lang === 'cyrl' ? 'Ташрифингиз учун раҳмат!' : 'Tashrifingiz uchun rahmat!'}
            />

            <div className="pt-3 flex justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                {t('save')}
              </Button>
            </div>
          </form>

          {/* Change PIN Card */}
          <form
            onSubmit={handleChangePin}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{lang === 'cyrl' ? 'Кириш PIN-кодини ўзгартириш' : 'Kirish PIN-kodini o‘zgartirish'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {lang === 'cyrl' ? 'Ҳозирги фаол PIN-код: ' : 'Hozirgi faol PIN-kod: '}
                  <strong className="text-emerald-700 dark:text-emerald-400">{currentPin || '1234'}</strong>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-full sm:w-60">
                <Input
                  placeholder={lang === 'cyrl' ? 'Янги 4 хонали PIN' : 'Yangi 4 xonali PIN'}
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                    setNewPin(val);
                    if (pinError) setPinError('');
                  }}
                  error={pinError}
                />
              </div>
              <Button type="submit" variant="secondary" icon={Save}>
                {lang === 'cyrl' ? 'PIN-кодни сақлаш' : 'PIN-kodni saqlash'}
              </Button>
            </div>
          </form>

          {/* Reset Demo Data Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-rose-800 dark:text-rose-400 text-sm">
                  {lang === 'cyrl' ? 'Демо маълумотларни қайта тиклаш' : 'Demo ma’lumotlarni qayta tiklash'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'cyrl'
                    ? 'Агар тест жараёнида хоналар ёки буюртмаларни ўчирган ёки тозалаган бўлсангиз, тизимни дастлабки ҳолатга қайтаришингиз мумкин.'
                    : 'Agar test jarayonida xonalar yoki buyurtmalarni o‘chirgan yoki tozalagan bo‘lsangiz, tizimni dastlabki holatga qaytarishingiz mumkin.'}
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
                {lang === 'cyrl' ? 'Дастлабки демо маълумотларга қайтариш' : 'Dastlabki demo ma’lumotlarga qaytarish'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Info Cards (1 col) */}
        <div className="space-y-4">
          {/* PWA App Install Promo Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 rounded-2xl text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-5 h-5 text-amber-300" />
              <h4 className="font-bold text-sm tracking-tight">
                {lang === 'cyrl' ? 'Иловани экранга ўрнатиш' : 'Ilovani ekranga o‘rnatish'}
              </h4>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              {lang === 'cyrl'
                ? 'Тизимни Android, iPhone ёки Windows Моноблок экранига худди Play Market/App Store дастуридек алоҳида белги билан ўрнатиб олинг.'
                : 'Tizimni Android, iPhone yoki Windows Monoblok ekraniga xuddi Play Market/App Store dasturidek alohida belgi bilan o‘rnatib oling.'}
            </p>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              className="w-full justify-center bg-white text-emerald-900 hover:bg-emerald-50 border-transparent shadow-xs"
              onClick={() => setIsInstallModalOpen(true)}
            >
              {t('pwa.install_btn')}
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
            <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                {lang === 'cyrl' ? 'Тизим ҳақида' : 'Tizim haqida'}
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Choyxona POS</strong> — {lang === 'cyrl'
                ? 'чойхона ва миллий таомлар ошхоналари учун ихтисослаштирилган тезкор буюртма ва ҳисоб-китоб тизими.'
                : 'choyxona va milliy taomlar oshxonalari uchun ixtisoslashtirilgan tezkor buyurtma va hisob-kitob tizimi.'}
            </p>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between">
                <span>{lang === 'cyrl' ? 'Кириш тури:' : 'Kirish turi:'}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {lang === 'cyrl' ? '4 хонали PIN-код' : '4 xonali PIN-kod'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'cyrl' ? 'Мавзу:' : 'Mavzu:'}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {theme === 'dark' ? t('darkMode') : t('lightMode')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'cyrl' ? 'Тил:' : 'Til:'}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'cyrl' ? t('cyrillic') : t('latin')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'cyrl' ? 'Версия:' : 'Versiya:'}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">1.2.0 (Dual-Theme & Lang)</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'cyrl' ? 'Архитектура:' : 'Arxitektura:'}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">React + Vite + Zustand</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'cyrl' ? 'Хотира:' : 'Xotira:'}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">localStorage</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/70 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 space-y-2 transition-colors">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>{lang === 'cyrl' ? 'Backend интеграцияси' : 'Backend integratsiyasi'}</span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
              {lang === 'cyrl'
                ? 'Тизим барча бизнес логикаси ва маълумотлар оқимини модулли service ва store қатламида сақлайди. Келгусида Node.js ва PostgreSQL бекендига улаш учун фақатгина storageService.js файлини API сўровлари билан алмаштириш кифоя.'
                : 'Tizim barcha biznes logikasi va ma’lumotlar oqimini modulli service va store qatlamida saqlaydi. Kelgusida Node.js va PostgreSQL backendiga ulash uchun faqatgina storageService.js faylini API so‘rovlari bilan almashtirish kifoya.'}
            </p>
          </div>
        </div>
      </div>

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
