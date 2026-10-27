import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coffee,
  Delete,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Sun,
  Moon,
  Languages,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { toast } from 'sonner';

export function LoginPage() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

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
              ? 'PIN-код нотўғри! (Демо PIN: 1234)'
              : 'PIN-kod noto‘g‘ri! (Demo PIN: 1234)'
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white relative transition-colors duration-150">
      {/* Top right Theme & Language toggles */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 shadow-xs transition-colors cursor-pointer"
        >
          <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'latn' ? 'Lotin' : 'Кирилл'}</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-emerald-500 shadow-xs transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/25 mb-3.5">
          <Coffee className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {t('login.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('login.subtitle')}
        </p>
      </div>

      {/* Terminal Card */}
      <div
        className={`w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-200/60 dark:shadow-none transition-transform ${
          shake ? 'animate-shake' : ''
        }`}
      >
        {/* PIN Dots Display */}
        <div className="flex flex-col items-center justify-center mb-7">
          <div className="flex items-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => {
              const isFilled = pin.length > idx;
              return (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    error
                      ? 'bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-950 scale-110'
                      : isFilled
                      ? 'bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950 scale-110'
                      : 'bg-slate-200 dark:bg-slate-700 ring-2 ring-transparent'
                  }`}
                />
              );
            })}
          </div>

          {/* Status / Error Message */}
          <div className="h-6 mt-2 flex items-center justify-center">
            {loading ? (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {t('login.verifying')}
              </p>
            ) : error ? (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('login.enter_pin')}</p>
            )}
          </div>
        </div>

        {/* 3x4 Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 sm:gap-3.5 max-w-[280px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleAddDigit(String(num))}
              disabled={loading || pin.length >= 4}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-emerald-50 dark:active:bg-emerald-950/40 active:text-emerald-700 dark:active:text-emerald-400 active:scale-95 text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 transition-all border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center cursor-pointer select-none"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            onClick={handleClearPin}
            disabled={loading || pin.length === 0}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 active:scale-95 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 transition-all border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center cursor-pointer select-none disabled:opacity-40"
            title={t('login.clear')}
          >
            {t('login.clear')}
          </button>

          {/* 0 Button */}
          <button
            type="button"
            onClick={() => handleAddDigit('0')}
            disabled={loading || pin.length >= 4}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-emerald-50 dark:active:bg-emerald-950/40 active:text-emerald-700 dark:active:text-emerald-400 active:scale-95 text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 transition-all border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center cursor-pointer select-none"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            onClick={handleDeleteDigit}
            disabled={loading || pin.length === 0}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-300 transition-all border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-center cursor-pointer select-none disabled:opacity-40"
            title={t('login.delete')}
          >
            <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Demo Fast Access Hint */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer border border-emerald-200/60 dark:border-emerald-800/60"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {t('login.quick_demo')} <strong>1234</strong> {t('login.fill')}
            </span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 justify-center">
        <ShieldCheck className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <span>{t('login.secure')}</span>
      </div>
    </div>
  );
}
