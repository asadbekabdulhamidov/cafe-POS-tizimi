import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Monitor,
  Download,
  Share2,
  PlusSquare,
  CheckCircle,
  ExternalLink,
  Laptop,
  QrCode,
} from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { useAppConfigStore } from '../../store/useAppConfigStore';
import { toast } from 'sonner';

export function PWAInstallModal({ isOpen, onClose }) {
  const { t, lang } = useAppConfigStore();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState('android'); // 'ios' | 'android' | 'windows'

  useEffect(() => {
    // Detect if already installed / standalone
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true);
    }

    // Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('windows');
    }

    // Capture PWA install event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        toast.success(
          lang === 'cyrl'
            ? 'Илова муваффақиятли ўрнатилди!'
            : 'Ilova muvaffaqiyatli o‘rnatildi!'
        );
        setIsInstalled(true);
        setDeferredPrompt(null);
        onClose();
      }
    } else {
      toast.info(
        lang === 'cyrl'
          ? 'Қуйидаги йўриқнома бўйича экранга белгини қўшинг.'
          : 'Quyidagi yo‘riqnoma bo‘yicha ekranga belgini qo‘shing.'
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pwa.title')}
      subtitle={t('pwa.sub')}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* App Preview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center gap-4 shadow-md">
          <img
            src="/icon.svg"
            alt="Choyxona POS"
            className="w-16 h-16 rounded-2xl shadow-lg border-2 border-white/20 bg-emerald-900 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-base tracking-tight truncate">
              Choyxona POS
            </h4>
            <p className="text-xs text-emerald-100 opacity-90 mt-0.5">
              {lang === 'cyrl'
                ? 'Электрон буюртма ва касса тизими'
                : 'Elektron buyurtma va kassa tizimi'}
            </p>
            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 uppercase tracking-wider">
              {isInstalled
                ? (lang === 'cyrl' ? 'Ўрнатилган' : 'O‘rnatilgan')
                : (lang === 'cyrl' ? 'Экранга ўрнатиш тайёр' : 'Ekranga o‘rnatish tayyor')}
            </span>
          </div>
        </div>

        {/* QR Code Section for phone camera scan */}
        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-3">
          <div className="p-1.5 bg-white rounded-lg border border-slate-200 shrink-0">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.origin : 'https://cafe-pos-tizimi.vercel.app'
              )}`}
              alt="QR Code"
              className="w-24 h-24"
            />
          </div>
          <div className="text-left space-y-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'cyrl' ? 'Телефон камерасида очиш (QR-код):' : 'Telefon kamerasida ochish (QR-kod):'}</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {lang === 'cyrl'
                ? 'Телефон камерасини ушбу QR-кодга қаратинг ва чиққан ҳаволани босинг. Узун манзилларни қўлда ёзишга ҳожат йўқ!'
                : 'Telefon kamerasini ushbu QR-kodga qarating va chiqqan havolani bosing. Uzun manzillarni qo‘lda yozishga hojat yo‘q!'}
            </p>
          </div>
        </div>

        {/* Direct Install Button if supported by browser */}
        {deferredPrompt && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-2">
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              {lang === 'cyrl'
                ? 'Браузерингиз иловани бир босишда экранга ўрнатишни қўллаб-қувватлайди:'
                : 'Brauzeringiz ilovani bir bosishda ekranga o‘rnatishni qo‘llab-quvvatlaydi:'}
            </p>
            <Button
              variant="primary"
              className="w-full justify-center shadow-md shadow-emerald-600/30"
              icon={Download}
              onClick={handleInstallClick}
            >
              {lang === 'cyrl' ? 'Экранга белгини ўрнатиш' : 'Ekranga belgini o‘rnatish'}
            </Button>
          </div>
        )}

        {/* Platform Selection Tabs */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setPlatform('android')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              platform === 'android'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              platform === 'ios'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone (iOS)</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('windows')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              platform === 'windows'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Monoblok / Windows</span>
          </button>
        </div>

        {/* Step-by-step instructions based on selected device */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
          {platform === 'android' && (
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  {lang === 'cyrl'
                    ? 'Android телефонингизда Google Chrome браузерида ушбу манзилни очинг.'
                    : 'Android telefoningizda Google Chrome brauzerida ushbu manzilni oching.'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  {lang === 'cyrl'
                    ? 'Браузернинг юқори ўнг бурчагидаги 3 та нуқта (⋮) тугмасини босинг.'
                    : 'Brauzerning yuqori o‘ng burchagidagi 3 ta nuqta (⋮) tugmasini bosing.'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p>
                  {lang === 'cyrl'
                    ? 'Чиққан менюдан «Иловани ўрнатиш» ёки «Бош экранга қўшиш» (Добавить на главный экран) бандини танланг.'
                    : 'Chiqqan menyudan «Ilovani o‘rnatish» yoki «Bosh ekranga qo‘shish» (Add to Home screen) bandini tanlang.'}
                </p>
              </div>
            </div>
          )}

          {platform === 'ios' && (
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  {lang === 'cyrl'
                    ? 'iPhone ёки iPad қурилмангизда Safari браузерида саҳифани очинг.'
                    : 'iPhone yoki iPad qurilmangizda Safari brauzerida sahifani oching.'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p className="flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'cyrl' ? 'Пастки панелдаги' : 'Pastki paneldagi'}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold">
                    <Share2 className="w-3 h-3 text-blue-500" />
                    <span>{lang === 'cyrl' ? 'Улашиш (Share)' : 'Ulashish (Share)'}</span>
                  </span>
                  <span>{lang === 'cyrl' ? 'тугмасини босинг.' : 'tugmasini bosing.'}</span>
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p className="flex items-center gap-1.5 flex-wrap">
                  <span>{lang === 'cyrl' ? 'Пастга тушиб' : 'Pastga tushib'}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-bold">
                    <PlusSquare className="w-3 h-3 text-emerald-600" />
                    <span>{lang === 'cyrl' ? '«Бош экранга қўшиш»' : '«Bosh ekranga qo‘shish»'}</span>
                  </span>
                  <span>{lang === 'cyrl' ? '(Add to Home Screen) бандини танланг.' : '(Add to Home Screen) bandini tanlang.'}</span>
                </p>
              </div>
            </div>
          )}

          {platform === 'windows' && (
            <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  {lang === 'cyrl'
                    ? 'Касса моноблокида Google Chrome ёки Microsoft Edge браузеридан фойдаланинг.'
                    : 'Kassa monoblokida Google Chrome yoki Microsoft Edge brauzeridan foydalaning.'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  {lang === 'cyrl'
                    ? 'Браузер манзил қаторининг ўнг четидаги «Иловани ўрнатиш» (📥 Install) белгисига босинг.'
                    : 'Brauzer manzil qatorining o‘ng chetidagi «Ilovani o‘rnatish» (📥 Install) belgisiga bosing.'}
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p>
                  {lang === 'cyrl'
                    ? '«Ўрнатиш» (Install)ни тасдиқланг. Windows Иш столида (Desktop) дастур белгиси пайдо бўлади ва браузерсиз, алоҳида ойнада тўлиқ экранда очилади!'
                    : '«O‘rnatish» (Install)ni tasdiqlang. Windows Ish stolida (Desktop) dastur belgisi paydo bo‘ladi va brauzersiz, alohida oynada to‘liq ekranda ochiladi!'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Benefits notice */}
        <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'cyrl' ? 'Афзаллиги:' : 'Afzalligi:'}</span>
          </p>
          <p className="leading-relaxed opacity-90">
            {lang === 'cyrl'
              ? 'Экрандаги белгини босганда дастур худди ҳақиқий Android ёки Windows программасидек очилади, манзил қатори кўринмайди ва ходимлар чалғимайди.'
              : 'Ekrandagi belgini bosganda dastur xuddi haqiqiy Android yoki Windows dasturidek ochiladi, manzil qatori ko‘rinmaydi va xodimlar chalg‘imaydi.'}
          </p>
        </div>

        {/* Close button */}
        <div className="pt-2">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            {lang === 'cyrl' ? 'Тушунарли / Ёпиш' : 'Tushunarli / Yopish'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
