import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  Plus,
  DoorOpen,
  RotateCcw,
  Sun,
  Moon,
  Languages,
  Download,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';
import { Button } from '../ui/Button';
import { PWAInstallModal } from '../ui/PWAInstallModal';
import { OpenShiftModal } from '../../features/shifts/OpenShiftModal';
import { CloseShiftModal } from '../../features/shifts/CloseShiftModal';
import { ZReportModal } from '../../features/shifts/ZReportModal';
import { toast } from 'sonner';

export function Header({ onOpenSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, resetAllDemoData, currentShift } = usePOSStore();
  const { theme, toggleTheme, lang, toggleLang, t } = useAppConfigStore();
  const [time, setTime] = useState(() => new Date());
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isOpenShiftModalOpen, setIsOpenShiftModalOpen] = useState(false);
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);
  const [selectedZReportShift, setSelectedZReportShift] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const occupiedCount = rooms.filter((r) => r.status === 'band').length;
  const totalCount = rooms.length;

  const getTitle = () => {
    if (location.pathname === '/dashboard') return t('nav.dashboard');
    if (location.pathname === '/rooms') return t('places.title');
    if (location.pathname.startsWith('/rooms/')) return t('order.current_order');
    if (location.pathname === '/menu') return t('menu.title');
    if (location.pathname === '/reports') return t('reports.title');
    if (location.pathname === '/settings') return t('settings.title');
    return t('app.name');
  };

  const handleResetData = () => {
    const confirmMsg =
      lang === 'cyrl'
        ? 'Демо маълумотларни дастлабки ҳолатга қайтаришни хоҳлайсизми?'
        : 'Demo ma’lumotlarni dastlabki holatga qaytarishni xohlaysizmi?';

    if (window.confirm(confirmMsg)) {
      resetAllDemoData();
      toast.success(
        lang === 'cyrl'
          ? 'Барча демо маълумотлар қайта тикланди!'
          : 'Barcha demo ma’lumotlar qayta tiklandi!'
      );
    }
  };

  const formattedTime = time.toLocaleTimeString(lang === 'cyrl' ? 'ru-RU' : 'uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = time.toLocaleDateString(lang === 'cyrl' ? 'ru-RU' : 'uz-UZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 min-h-[58px] sm:h-18 pt-[env(safe-area-inset-top)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/70 dark:border-slate-800/80 px-3 sm:px-6 flex items-center justify-between transition-colors duration-150">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-1 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all lg:hidden cursor-pointer"
          aria-label="Menyuni ochish"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
            {getTitle()}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hidden sm:flex">
            <span className="capitalize">{formattedDate}</span>
            <span>•</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Language Switcher Button (Lotin <-> Кирилл) */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 dark:hover:border-emerald-500 active:scale-95 transition-all cursor-pointer"
          title={lang === 'cyrl' ? 'Лотин ёзувига ўтиш' : 'Kirill yozuviga o‘tish'}
        >
          <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] sm:text-xs">{lang === 'latn' ? 'Lotin' : 'Кирилл'}</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 active:scale-95 transition-all cursor-pointer"
          title={theme === 'dark' ? 'Kunduzgi rejim (Light)' : 'Tungi rejim (Dark)'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Occupied places indicator (Tablet / Desktop) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs">
          <DoorOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-slate-600 dark:text-slate-400">
            {lang === 'cyrl' ? 'Банд:' : 'Band:'}
          </span>
          <span className="font-bold text-emerald-700 dark:text-emerald-400">
            {occupiedCount} / {totalCount} {t('header.band_count')}
          </span>
        </div>

        {/* PWA / App Install Button */}
        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-emerald-300/80 dark:border-emerald-700/80 bg-emerald-50/80 dark:bg-emerald-950/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 transition-all cursor-pointer"
          title={t('pwa.install_btn')}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('pwa.install_btn')}</span>
        </button>

        {/* Reset Demo Data button (hidden on extra small screens to save space) */}
        <button
          onClick={handleResetData}
          title={t('header.reset_tooltip')}
          className="hidden sm:flex p-2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Cashier Shift Indicator & Modal Trigger */}
        {currentShift ? (
          <button
            onClick={() => setIsCloseShiftModalOpen(true)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 transition-all cursor-pointer"
            title={lang === 'cyrl' ? 'Сменани ёпиш ва Z-Ҳисобот' : 'Smenani yopish va Z-Hisobot'}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate max-w-[85px] sm:max-w-none">
              {currentShift.cashierName.replace(' (Kassir)', '')} (#{currentShift.shiftNumber})
            </span>
          </button>
        ) : (
          <button
            onClick={() => setIsOpenShiftModalOpen(true)}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 active:scale-95 transition-all cursor-pointer"
            title={lang === 'cyrl' ? 'Янги смена очиш' : 'Yangi smena ochish'}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{lang === 'cyrl' ? 'Смена ёпиқ' : 'Smena yopiq'}</span>
          </button>
        )}

        {/* Fast Action */}
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/rooms')}
          className="shadow-sm active:scale-95 transition-all text-xs sm:text-sm px-2.5 sm:px-3"
        >
          <span className="hidden sm:inline">{t('header.quick_order')}</span>
          <span className="sm:hidden">{lang === 'cyrl' ? 'Буюртма' : 'Buyurtma'}</span>
        </Button>
      </div>

      {/* PWA Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Open Shift Modal */}
      <OpenShiftModal
        isOpen={isOpenShiftModalOpen}
        onClose={() => setIsOpenShiftModalOpen(false)}
      />

      {/* Close Shift Modal */}
      <CloseShiftModal
        isOpen={isCloseShiftModalOpen}
        onClose={() => setIsCloseShiftModalOpen(false)}
        onShiftClosed={(closedShift) => setSelectedZReportShift(closedShift)}
      />

      {/* Z-Report Modal */}
      <ZReportModal
        isOpen={!!selectedZReportShift}
        onClose={() => setSelectedZReportShift(null)}
        shift={selectedZReportShift}
      />
    </header>
  );
}
