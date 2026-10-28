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
} from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';
import { Button } from '../ui/Button';
import { PWAInstallModal } from '../ui/PWAInstallModal';
import { toast } from 'sonner';

export function Header({ onOpenSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, resetAllDemoData } = usePOSStore();
  const { theme, toggleTheme, lang, toggleLang, t } = useAppConfigStore();
  const [time, setTime] = useState(() => new Date());
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

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
    <header className="sticky top-0 z-30 h-18 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors duration-150">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Menyuni ochish"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
            {getTitle()}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hidden sm:flex">
            <span className="capitalize">{formattedDate}</span>
            <span>•</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Language Switcher Button (Lotin <-> Кирилл) */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer"
          title={lang === 'cyrl' ? 'Лотин ёзувига ўтиш' : 'Kirill yozuviga o‘tish'}
        >
          <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'latn' ? 'Lotin' : 'Кирилл'}</span>
        </button>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Kunduzgi rejim (Light)' : 'Tungi rejim (Dark)'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Occupied places indicator */}
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700/80 bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
          title={t('pwa.install_btn')}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t('pwa.install_btn')}</span>
        </button>

        {/* Reset Demo Data button */}
        <button
          onClick={handleResetData}
          title={t('header.reset_tooltip')}
          className="p-2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Fast Action */}
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/rooms')}
          className="shadow-sm"
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
    </header>
  );
}
