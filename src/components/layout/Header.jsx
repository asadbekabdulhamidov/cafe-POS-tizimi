import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Plus, DoorOpen, RotateCcw } from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

export function Header({ onOpenSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { rooms, resetAllDemoData } = usePOSStore();
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const occupiedCount = rooms.filter((r) => r.status === 'band').length;
  const totalCount = rooms.length;

  const pageTitles = {
    '/dashboard': 'Asosiy Dashboard',
    '/rooms': 'Xonalar boshqaruvi',
    '/menu': 'Taomlar menyusi',
    '/reports': 'Hisobotlar va Tahlil',
    '/settings': 'Tizim sozlamalari',
  };

  const getTitle = () => {
    if (location.pathname.startsWith('/rooms/')) {
      return 'Xona buyurtmasi';
    }
    return pageTitles[location.pathname] || 'Choyxona POS';
  };

  const handleResetData = () => {
    if (window.confirm('Demo ma’lumotlarni dastlabki holatga qaytarishni xohlaysizmi?')) {
      resetAllDemoData();
      toast.success('Barcha demo ma’lumotlar qayta tiklandi!');
    }
  };

  const formattedTime = time.toLocaleTimeString('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = time.toLocaleDateString('uz-UZ', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Menyuni ochish"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
            {getTitle()}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 hidden sm:flex">
            <span className="capitalize">{formattedDate}</span>
            <span>•</span>
            <span className="font-medium text-slate-700">{formattedTime}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Occupied rooms indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <DoorOpen className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-600">Band:</span>
          <span className="font-bold text-emerald-700">
            {occupiedCount} / {totalCount} xona
          </span>
        </div>

        {/* Reset Demo Data button */}
        <button
          onClick={handleResetData}
          title="Demo ma’lumotlarni qayta tiklash"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
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
          <span className="hidden sm:inline">Yangi buyurtma</span>
          <span className="sm:hidden">Buyurtma</span>
        </Button>
      </div>
    </header>
  );
}
