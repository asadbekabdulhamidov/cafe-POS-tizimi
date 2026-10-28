import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  DoorOpen,
  UtensilsCrossed,
  BarChart3,
  Settings,
} from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function IOSBottomNav() {
  const { rooms } = usePOSStore();
  const { t } = useAppConfigStore();

  const occupiedCount = rooms.filter((r) => r.status === 'band').length;

  const navItems = [
    {
      to: '/dashboard',
      label: t('nav.dashboard'),
      icon: LayoutDashboard,
    },
    {
      to: '/rooms',
      label: t('nav.places'),
      icon: DoorOpen,
      badge: occupiedCount > 0 ? occupiedCount : null,
    },
    {
      to: '/menu',
      label: t('nav.menu'),
      icon: UtensilsCrossed,
    },
    {
      to: '/reports',
      label: t('nav.reports'),
      icon: BarChart3,
    },
    {
      to: '/settings',
      label: t('nav.settings'),
      icon: Settings,
    },
  ];

  return (
    <nav
      aria-label="Pastki navigatsiya paneli"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/70 dark:border-slate-800/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5 px-2 flex items-center justify-around lg:hidden transition-colors select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 active:scale-90 min-w-[56px] ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 font-medium hover:text-slate-700 dark:hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-6 h-6 transition-transform duration-150 ${
                      isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                    }`}
                  />
                  {/* Badge for occupied rooms */}
                  {item.badge !== null && (
                    <span className="absolute -top-1 -right-2.5 min-w-[17px] h-[17px] px-1 bg-amber-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10.5px] mt-0.5 tracking-tight leading-none ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
                {/* Active Apple pill indicator */}
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
