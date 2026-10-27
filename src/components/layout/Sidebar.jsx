import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  DoorOpen,
  UtensilsCrossed,
  BarChart3,
  Settings,
  LogOut,
  Coffee,
  X,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { usePOSStore } from '../../store/usePOSStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { rooms, settings } = usePOSStore();
  const { t, localize } = useAppConfigStore();

  const occupiedRoomsCount = rooms.filter((r) => r.status === 'band').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
      badge: occupiedRoomsCount > 0 ? `${occupiedRoomsCount} ${t('nav.active_band')}` : null,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
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
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-tight">
                {localize(settings.choyxonaName) || t('app.name')}
              </h1>
              <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {t('app.tagline')}
              </p>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User & Logout section */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 mb-2">
            <div className="min-w-0 flex-1 mr-2">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {localize(user?.name) || 'Kassir'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">@{user?.username || 'admin'}</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
