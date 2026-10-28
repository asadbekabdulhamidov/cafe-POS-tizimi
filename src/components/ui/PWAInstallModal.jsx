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

        {/* Direct Install Button if supported by browser (Android & Windows Chrome/Edge) */}
        {deferredPrompt && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-2">
            <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              {lang === 'cyrl'
                ? 'Браузерингиз иловани бир босишда экранга ўрнатишни қўллаб-қувватлайди:'
                : 'Brauzeringiz ilovani bir bosishda ekranga o‘rnatishni qo‘llab-quvvatlaydi:'}
            </p>
            <Button
              variant="primary"
              className="w-full justify-center shadow-md shadow-emerald-600/30 font-bold"
              icon={Download}
              onClick={handleInstallClick}
            >
              {lang === 'cyrl' ? 'Экранга белгини ўрнатиш' : 'Ekranga belgini o‘rnatish'}
            </Button>
          </div>
        )}

        {/* Special iPhone / iOS Notice & Direct Guide if on iOS device */}
        {platform === 'ios' && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/90 border-2 border-blue-400 dark:border-blue-600 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                
              </span>
              <div>
                <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  {lang === 'cyrl'
                    ? 'iPhone (Apple iOS) да ўрнатиш қоидаси:'
                    : 'iPhone (Apple iOS) da o‘rnatish qoidasi:'}
                </h5>
                <p className="text-[11px] text-blue-800 dark:text-blue-300">
                  {lang === 'cyrl'
                    ? 'Apple хавфсизлик сиёсати туфайли iPhone-да тўғридан-тўғри тугма билан эмас, Safari орқали ўрнатилади:'
                    : 'Apple xavfsizlik cheklovi tufayli iPhone-da to‘g‘ridan-to‘g‘ri tugma bilan emas, Safari orqali o‘rnatiladi:'}
                </p>
              </div>
            </div>

            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex items-start gap-2.5 bg-white/80 dark:bg-slate-700/60 p-2.5 rounded-xl border border-blue-100 dark:border-slate-600">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'cyrl' ? 'Safari браузерида очинг' : 'Safari brauzerida oching'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'cyrl'
                      ? 'Агар Telegram ёки бошқа дастур ичида бўлсангиз, пастки ўнг бурчакдаги Safari белгисига босинг.'
                      : 'Agar Telegram yoki boshqa dastur ichida bo‘lsangiz, pastki o‘ng burchakdagi Safari belgisini bosing.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/80 dark:bg-slate-700/60 p-2.5 rounded-xl border border-blue-100 dark:border-slate-600">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                    <span>{lang === 'cyrl' ? 'Пастки панелдаги' : 'Pastki paneldagi'}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-extrabold text-[11px]">
                      <Share2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{lang === 'cyrl' ? 'Улашиш (Share)' : 'Ulashish (Share)'}</span>
                    </span>
                    <span>{lang === 'cyrl' ? 'тугмасини босинг' : 'tugmasini bosing'}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'cyrl'
                      ? 'Safari экранининг энг пастки ўртасидаги квадрат ва тепага стрелка белгиси.'
                      : 'Safari ekranining eng pastki o‘rtasidagi kvadrat va tepaga strelka belgisi.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white/80 dark:bg-slate-700/60 p-2.5 rounded-xl border border-blue-100 dark:border-slate-600">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 flex-wrap">
                    <span>{lang === 'cyrl' ? 'Менюдан' : 'Menyudan'}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                      <PlusSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{lang === 'cyrl' ? '«Бош экранга қўшиш»' : '«Bosh ekranga qo‘shish»'}</span>
                    </span>
                    <span>{lang === 'cyrl' ? 'ни танланг' : 'ni tanlang'}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {lang === 'cyrl'
                      ? '«На экран «Домой» (Add to Home Screen) бандини босинг ва юқори ўнгдаги «Қўшиш» (Add) ни тасдиқланг.'
                      : '«На экран «Домой» (Add to Home Screen) bandini bosing va yuqori o‘ngdagi «Qo‘shish» (Add) ni tasdiqlang.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-blue-100/70 dark:bg-blue-950/40 rounded-xl text-[11px] text-blue-900 dark:text-blue-200 text-center font-medium">
              {lang === 'cyrl'
                ? '✅ Шундан сўнг iPhone иш столида Choyxona POS белгиси пайдо бўлади ва худди App Store дастуридек тўлиқ экранда очилади!'
                : '✅ Shundan so‘ng iPhone ish stolida Choyxona POS belgisi paydo bo‘ladi va xuddi App Store ilovasidek to‘liq ekranda ochiladi!'}
            </div>

            <Button
              variant="primary"
              className="w-full justify-center shadow-md shadow-blue-600/30 font-bold bg-blue-600 hover:bg-blue-700"
              icon={Share2}
              onClick={onClose}
            >
              {lang === 'cyrl' ? 'Тушунарли, Safari орқали қўшаман' : 'Tushunarli, Safari orqali qo‘shaman'}
            </Button>
          </div>
        )}

        {/* Platform Selection Tabs (For Android / Windows or if user wants to see other devices) */}
        {platform !== 'ios' && (
          <>
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
          </>
        )}

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
