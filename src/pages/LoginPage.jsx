import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Delete,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sun,
  Moon,
  Languages,
  Download,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { PWAInstallModal } from '../components/ui/PWAInstallModal';
import { toast } from 'sonner';

export function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const { loginWithPin } = useAuthStore();
  const { theme, toggleTheme, lang, toggleLang, t } = useAppConfigStore();
  const navigate = useNavigate();

  const handleVerifyPin = useCallback(
    (pinToTest) => {
      setLoading(true);
      setError('');

      setTimeout(() => {
        const result = loginWithPin(pinToTest);
        setLoading(false);

        if (result.success) {
          toast.success(
            lang === 'cyrl'
              ? 'Хуш келибсиз! Тизимга муваффақиятли кирдингиз.'
              : 'Xush kelibsiz! Tizimga muvaffaqiyatli kirdingiz.'
          );
          navigate('/dashboard');
        } else {
          setError(
            lang === 'cyrl'
              ? 'PIN-код нотўғри!'
              : 'PIN-kod noto‘g‘ri!'
          );
          setShake(true);
          setTimeout(() => setShake(false), 500);
          setPin('');
        }
      }, 250);
    },
    [loginWithPin, navigate, lang]
  );

  const handleAddDigit = useCallback(
    (digit) => {
      if (loading || pin.length >= 4) return;
      setError('');
      const newPin = pin + digit;
      setPin(newPin);

      // Auto-submit on 4th digit
      if (newPin.length === 4) {
        handleVerifyPin(newPin);
      }
    },
    [pin, loading, handleVerifyPin]
  );

  const handleDeleteDigit = useCallback(() => {
    if (loading) return;
    setError('');
    setPin((prev) => prev.slice(0, -1));
  }, [loading]);

  const handleClearPin = useCallback(() => {
    if (loading) return;
    setError('');
    setPin('');
  }, [loading]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleAddDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDeleteDigit();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClearPin();
      } else if (e.key === 'Enter' && pin.length === 4) {
        handleVerifyPin(pin);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAddDigit, handleDeleteDigit, handleClearPin, handleVerifyPin, pin]);

  const handleQuickDemo = () => {
    setPin('1234');
    handleVerifyPin('1234');
  };

  // iOS dialer keypad mapping
  const keypadData = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-slate-900 text-slate-100 flex flex-col justify-between items-center px-4 py-4 sm:py-6 selection:bg-emerald-500 selection:text-white relative overflow-hidden font-sans">
      {/* Background Soft Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Language & Theme Switchers */}
      <div className="w-full max-w-sm flex items-center justify-between z-10 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/10">
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'latn' ? 'Lotin' : 'Ўзбек'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/90 hover:text-white transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-300" />
          )}
        </button>
      </div>

      {/* Main Lockscreen Container */}
      <div className="w-full max-w-xs flex flex-col items-center my-auto z-10">
        {/* Brand App Icon & Title */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22%] bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-2xl shadow-emerald-500/30 ring-1 ring-white/20 mb-3 flex items-center justify-center">
            <img
              src="/icon.svg"
              alt="Choyxona POS"
              className="w-full h-full rounded-[20%] object-cover"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {t('login.title')}
          </h1>
          <p className="text-xs text-white/60 mt-0.5">
            {lang === 'cyrl' ? '4 хонали PIN-кодни теринг' : '4 xonali PIN-kodni tering'}
          </p>
        </div>

        {/* 4 Apple Passcode Dots */}
        <div
          className={`flex flex-col items-center mb-8 ${
            shake ? 'animate-shake' : ''
          }`}
        >
          <div className="flex items-center gap-5 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                    error
                      ? 'bg-rose-500 border border-rose-400 scale-110 shadow-sm shadow-rose-500'
                      : isFilled
                      ? 'bg-emerald-400 border border-emerald-300 scale-125 shadow-md shadow-emerald-500/50'
                      : 'border-2 border-white/40 bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          {/* Status / Error Text */}
          <div className="h-5 mt-1 flex items-center justify-center">
            {loading ? (
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {t('login.verifying')}
              </p>
            ) : error ? (
              <p className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </p>
            ) : null}
          </div>
        </div>

        {/* iOS Circular Numeric Keypad (3x3 + 1 row) */}
        <div className="grid grid-cols-3 justify-items-center items-center gap-y-3.5 gap-x-5 w-full max-w-[280px] mx-auto select-none">
          {keypadData.map(({ num, letters }) => (
            <button
              key={num}
              type="button"
              onClick={() => handleAddDigit(num)}
              disabled={loading || pin.length >= 4}
              className="w-[72px] h-[72px] min-w-[72px] min-h-[72px] sm:w-[76px] sm:h-[76px] sm:min-w-[76px] sm:min-h-[76px] aspect-square rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/30 active:scale-95 text-white backdrop-blur-lg border border-white/10 flex flex-col items-center justify-center transition-all duration-75 cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <span className="text-2xl sm:text-3xl font-medium leading-none">
                {num}
              </span>
              {letters && (
                <span className="text-[9px] font-bold tracking-widest text-white/40 mt-1 leading-none">
                  {letters}
                </span>
              )}
            </button>
          ))}

          {/* Bottom Row: Clear | 0 | Backspace */}
          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClearPin}
            disabled={loading || pin.length === 0}
            className="w-[72px] h-[72px] min-w-[72px] min-h-[72px] sm:w-[76px] sm:h-[76px] sm:min-w-[76px] sm:min-h-[76px] aspect-square rounded-full flex items-center justify-center text-xs font-bold text-white/70 hover:text-white active:scale-95 transition-all duration-75 cursor-pointer disabled:opacity-0"
          >
            {lang === 'cyrl' ? 'Тозалаш' : 'Tozalash'}
          </button>

          {/* 0 Button */}
          <button
            type="button"
            onClick={() => handleAddDigit('0')}
            disabled={loading || pin.length >= 4}
            className="w-[72px] h-[72px] min-w-[72px] min-h-[72px] sm:w-[76px] sm:h-[76px] sm:min-w-[76px] sm:min-h-[76px] aspect-square rounded-full bg-white/[0.08] hover:bg-white/[0.16] active:bg-white/30 active:scale-95 text-white backdrop-blur-lg border border-white/10 flex flex-col items-center justify-center transition-all duration-75 cursor-pointer outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <span className="text-2xl sm:text-3xl font-medium leading-none">
              0
            </span>
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDeleteDigit}
            disabled={loading || pin.length === 0}
            className="w-[72px] h-[72px] min-w-[72px] min-h-[72px] sm:w-[76px] sm:h-[76px] sm:min-w-[76px] sm:min-h-[76px] aspect-square rounded-full flex items-center justify-center text-white/70 hover:text-white active:scale-90 transition-all duration-75 cursor-pointer disabled:opacity-0"
            title={t('login.delete')}
          >
            <Delete className="w-6 h-6 stroke-[1.8]" />
          </button>
        </div>
      </div>

      {/* Bottom Actions & PWA Install */}
      <div className="w-full max-w-xs flex flex-col items-center gap-2 z-10 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2 w-full justify-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md border border-emerald-500/30 transition-all active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {t('login.quick_demo')} <strong>1234</strong>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsInstallModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-xs font-semibold backdrop-blur-md border border-white/10 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('pwa.install_btn')}</span>
          </button>
        </div>

        <p className="text-[11px] text-white/40 flex items-center gap-1 mt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-white/40" />
          <span>{t('login.secure')}</span>
        </p>
      </div>

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
