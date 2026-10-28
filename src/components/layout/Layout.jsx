import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { IOSBottomNav } from './IOSBottomNav';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { theme } = useAppConfigStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-150">
      {/* Toast provider */}
      <Toaster position="top-right" richColors closeButton theme={theme} />

      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content wrapper */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        <Header onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* iOS Native Bottom Navigation Bar for Mobile */}
      <IOSBottomNav />
    </div>
  );
}
