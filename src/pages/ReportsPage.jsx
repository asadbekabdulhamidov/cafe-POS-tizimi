import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Receipt,
  Banknote,
  CreditCard,
  Eye,
  Search,
  BarChart2,
  UserCheck,
  Printer,
  Plus,
  LogOut,
  Clock,
  CheckCircle2,
  AlertTriangle,
  History,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { ReceiptModal } from '../features/orders/ReceiptModal';
import { OpenShiftModal } from '../features/shifts/OpenShiftModal';
import { CloseShiftModal } from '../features/shifts/CloseShiftModal';
import { ZReportModal } from '../features/shifts/ZReportModal';
import { formatCurrency, formatDateTime, formatQuantity } from '../utils/formatters';

export function ReportsPage() {
  const { closedOrders, rooms, currentShift, shifts, getCurrentShiftStats } = usePOSStore();
  const { t, localize, lang } = useAppConfigStore();

  const isCyrl = lang === 'cyrl';
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'shifts'
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedZReportShift, setSelectedZReportShift] = useState(null);
  const [isOpenShiftModalOpen, setIsOpenShiftModalOpen] = useState(false);
  const [isCloseShiftModalOpen, setIsCloseShiftModalOpen] = useState(false);

  // Filters for analytics
  const [shiftFilter, setShiftFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Live active shift stats
  const activeShiftStats = useMemo(() => {
    return getCurrentShiftStats();
  }, [getCurrentShiftStats, currentShift, closedOrders]);

  // Filter orders by shift
  const shiftFilteredOrders = useMemo(() => {
    if (shiftFilter === 'all') return closedOrders;
    if (shiftFilter === 'current') {
      if (!currentShift) return [];
      return closedOrders.filter(
        (o) => o.shiftId === currentShift.id || (!o.shiftId && o.closedAt >= currentShift.openedAt)
      );
    }
    return closedOrders.filter((o) => o.shiftId === shiftFilter);
  }, [closedOrders, shiftFilter, currentShift]);

  // 1. Stats based on shiftFilteredOrders
  const totalRevenue = useMemo(() => {
    return shiftFilteredOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  }, [shiftFilteredOrders]);

  const totalBillsCount = shiftFilteredOrders.length;

  const cashRevenue = useMemo(() => {
    return shiftFilteredOrders
      .filter((o) => o.paymentMethod === 'naqd')
      .reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  }, [shiftFilteredOrders]);

  const cardRevenue = useMemo(() => {
    return shiftFilteredOrders
      .filter((o) => o.paymentMethod === 'karta')
      .reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  }, [shiftFilteredOrders]);

  // 2. Top selling items calculation
  const topDishes = useMemo(() => {
    const counts = {};
    shiftFilteredOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (!counts[item.name]) {
          counts[item.name] = {
            name: item.name,
            unit: item.unit || 'dona',
            quantity: 0,
            revenue: 0,
          };
        }
        counts[item.name].quantity =
          Math.round((counts[item.name].quantity + Number(item.quantity)) * 100) / 100;
        counts[item.name].revenue += item.quantity * item.price;
      });
    });

    return Object.values(counts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [shiftFilteredOrders]);

  // 3. Filtered history
  const filteredOrders = useMemo(() => {
    return shiftFilteredOrders.filter((order) => {
      if (roomFilter !== 'all' && order.roomId !== roomFilter) return false;
      if (paymentFilter !== 'all' && order.paymentMethod !== paymentFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesRoom = (order.roomName || '').toLowerCase().includes(query);
        const matchesCashier = (order.cashierName || '').toLowerCase().includes(query);
        const matchesItems = (order.items || []).some((i) =>
          i.name.toLowerCase().includes(query)
        );
        return matchesRoom || matchesCashier || matchesItems;
      }

      return true;
    });
  }, [shiftFilteredOrders, roomFilter, paymentFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Main Tabs: Umumiy Tahlil vs Smenalar Tarixi */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isCyrl ? 'Умумий таҳлил ва чеклар' : 'Umumiy tahlil va cheklar'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('shifts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'shifts'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>
              {t('shift.history')} ({shifts.length + (currentShift ? 1 : 0)})
            </span>
          </button>
        </div>

        {/* Action Button for Shifts */}
        {currentShift ? (
          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={() => setIsCloseShiftModalOpen(true)}
            className="shadow-xs text-xs font-bold"
          >
            {t('shift.close')} (#{currentShift.shiftNumber})
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsOpenShiftModalOpen(true)}
            className="shadow-xs text-xs font-bold"
          >
            {t('shift.open')}
          </Button>
        )}
      </div>

      {/* ===================== TAB 1: ANALYTICS & CHEKLAR ===================== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Shift Filter Banner if filtered by specific shift */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {isCyrl ? 'Смена бўйича ҳисобот:' : 'Smena bo‘yicha hisobot:'}
              </span>
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-1.5 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">
                  {isCyrl ? 'Барча сменалар (Умумий)' : 'Barcha smenalar (Umumiy)'}
                </option>
                {currentShift && (
                  <option value="current">
                    🟢 {isCyrl ? 'Жорий фаол смена' : 'Joriy faol smena'} #{currentShift.shiftNumber} (
                    {currentShift.cashierName})
                  </option>
                )}
                {shifts.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.shiftNumber} — {s.cashierName} ({formatDateTime(s.openedAt, lang).slice(0, 10)})
                  </option>
                ))}
              </select>
            </div>

            {shiftFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setShiftFilter('all')}
                className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
              >
                {isCyrl ? 'Филтрни тозалаш' : 'Filtrni tozalash'}
              </button>
            )}
          </div>

          {/* Top Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title={t('reports.total_rev')}
              value={formatCurrency(totalRevenue, true, lang)}
              subvalue={`${totalBillsCount} ${isCyrl ? 'та чек бўйича' : 'ta chek bo‘yicha'}`}
              icon={Wallet}
              color="emerald"
            />
            <StatCard
              title={t('reports.closed_bills')}
              value={`${totalBillsCount} ${t('unit.items')}`}
              subvalue={
                shiftFilter === 'current'
                  ? isCyrl ? 'Жорий сменада' : 'Joriy smenada'
                  : isCyrl ? 'Танланган смена бўйича' : 'Tanlangan smena bo‘yicha'
              }
              icon={Receipt}
              color="blue"
            />
            <StatCard
              title={t('reports.cash_payments')}
              value={formatCurrency(cashRevenue, true, lang)}
              subvalue={
                totalRevenue > 0
                  ? `${Math.round((cashRevenue / totalRevenue) * 100)}% ${
                      isCyrl ? 'умумий тушумдан' : 'umumiy tushumdan'
                    }`
                  : '0%'
              }
              icon={Banknote}
              color="emerald"
            />
            <StatCard
              title={t('reports.card_payments')}
              value={formatCurrency(cardRevenue, true, lang)}
              subvalue={
                totalRevenue > 0
                  ? `${Math.round((cardRevenue / totalRevenue) * 100)}% ${
                      isCyrl ? 'умумий тушумдан' : 'umumiy tushumdan'
                    }`
                  : '0%'
              }
              icon={CreditCard}
              color="purple"
            />
          </div>

          {/* Grid: Top Dishes & Payment breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top 5 Dishes */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 transition-colors duration-150">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    {t('reports.top_dishes')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('reports.top_dishes_sub')}
                  </p>
                </div>
                <BarChart2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>

              {topDishes.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">
                  {isCyrl ? 'Маълумотлар мавжуд эмас' : 'Ma’lumotlar mavjud emas'}
                </p>
              ) : (
                <div className="space-y-3.5">
                  {topDishes.map((dish, idx) => {
                    const maxQty = topDishes[0]?.quantity || 1;
                    const percent = Math.round((dish.quantity / maxQty) * 100);

                    return (
                      <div key={dish.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300 font-extrabold">
                              #{idx + 1}
                            </span>
                            {localize(dish.name)}
                          </span>
                          <div className="text-right">
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                              {formatQuantity(dish.quantity, dish.unit, lang)}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-2">
                              ({formatCurrency(dish.revenue, true, lang)})
                            </span>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Payment Breakdown Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between transition-colors duration-150">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                  {t('reports.payment_split')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  {isCyrl
                    ? 'Нақд ва пластик карта бўйича улушлар'
                    : 'Naqd va plastik karta bo‘yicha ulushlar'}
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />{' '}
                        {t('payment.cash')}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {totalRevenue > 0
                          ? `${Math.round((cashRevenue / totalRevenue) * 100)}%`
                          : '0%'}
                      </span>
                    </div>
                    <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400">
                      {formatCurrency(cashRevenue, true, lang)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />{' '}
                        {t('payment.card')}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {totalRevenue > 0
                          ? `${Math.round((cardRevenue / totalRevenue) * 100)}%`
                          : '0%'}
                      </span>
                    </div>
                    <p className="text-base font-extrabold text-purple-700 dark:text-purple-400">
                      {formatCurrency(cardRevenue, true, lang)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex justify-between">
                <span>{isCyrl ? 'Жами ҳисоблар:' : 'Jami hisoblar:'}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {totalBillsCount} {t('unit.items')}
                </span>
              </div>
            </div>
          </div>

          {/* History Table with Filters */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-5 transition-colors duration-150">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {t('reports.history_title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('reports.history_sub')}
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-full sm:w-56">
                  <Input
                    placeholder={t('reports.search_history')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={Search}
                  />
                </div>

                <select
                  value={roomFilter}
                  onChange={(e) => setRoomFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">{t('reports.all_rooms')}</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {localize(r.name)}
                    </option>
                  ))}
                </select>

                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="all">{t('reports.all_payments')}</option>
                  <option value="naqd">{t('payment.cash')}</option>
                  <option value="karta">{t('payment.card')}</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title={isCyrl ? 'Ҳисоблар топилмади' : 'Hisoblar topilmadi'}
                description={
                  isCyrl
                    ? 'Филтр бўйича ҳеч қандай тўланган ҳисоб мавжуд эмас.'
                    : 'Filtr bo‘yicha hech qanday to‘langan hisob mavjud emas.'
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">{t('reports.col_date')}</th>
                      <th className="py-3 px-4">{t('reports.col_room')}</th>
                      <th className="py-3 px-4">{t('shift.cashier')}</th>
                      <th className="py-3 px-4">{t('reports.col_items')}</th>
                      <th className="py-3 px-4">{t('reports.col_pay_type')}</th>
                      <th className="py-3 px-4">{t('reports.col_final')}</th>
                      <th className="py-3 px-4 text-right">{t('reports.col_receipt')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedReceipt(order)}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatDateTime(order.closedAt || order.createdAt, lang)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {localize(order.roomName)}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-400 font-semibold">
                          {order.cashierName || order.closedBy || 'Kassir'}
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate">
                          {(order.items || [])
                            .map((i) => `${localize(i.name)} (${i.quantity})`)
                            .join(', ')}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge
                            variant={order.paymentMethod === 'karta' ? 'info' : 'success'}
                            size="sm"
                          >
                            {order.paymentMethod === 'karta' ? t('payment.card') : t('payment.cash')}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
                          {formatCurrency(order.finalTotal, true, lang)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReceipt(order);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t('reports.view')}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: SMENALAR TARIXI (Z-HISOBOTLAR) ===================== */}
      {activeTab === 'shifts' && (
        <div className="space-y-6">
          {/* Active Shift Hero Card if open */}
          {currentShift && activeShiftStats && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border-2 border-emerald-300 dark:border-emerald-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                  <h3 className="font-black text-lg text-emerald-950 dark:text-emerald-100">
                    🟢 {isCyrl ? 'Фаол смена' : 'Faol smena'} #{currentShift.shiftNumber} —{' '}
                    {currentShift.cashierName}
                  </h3>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  icon={LogOut}
                  onClick={() => setIsCloseShiftModalOpen(true)}
                  className="shadow-sm font-bold text-xs"
                >
                  {t('shift.close')}
                </Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-emerald-800/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                    {t('shift.opened_at')}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {formatDateTime(currentShift.openedAt, lang)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-emerald-800/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                    {t('shift.opening_cash')}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {formatCurrency(currentShift.openingCash, true, lang)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-emerald-800/60">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 block font-medium">
                    {t('shift.cash_in_drawer')}
                  </span>
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-200">
                    {formatCurrency(activeShiftStats.expectedCashInDrawer, true, lang)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-emerald-200/80 dark:border-emerald-800/60">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                    {t('reports.total_rev')} ({activeShiftStats.ordersCount} {isCyrl ? 'чек' : 'chek'})
                  </span>
                  <span className="font-black text-slate-900 dark:text-slate-100">
                    {formatCurrency(activeShiftStats.totalRevenue, true, lang)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {!currentShift && (
            <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h4 className="font-bold text-sm text-rose-900 dark:text-rose-200">
                  🔴 {isCyrl ? 'Ҳозирда касса сменаси очилмаган' : 'Hozirda kassa smenasi ochilmagan'}
                </h4>
                <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                  {isCyrl
                    ? 'Янги кассир иш бошлаганда касса сменасини очиш тавсия этилади.'
                    : 'Yangi kassir ish boshlaganda kassa smenasini ochish tavsiya etiladi.'}
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setIsOpenShiftModalOpen(true)}
              >
                {t('shift.open')}
              </Button>
            </div>
          )}

          {/* Past Closed Shifts Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {t('shift.history')} (Z-Hisobotlar)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isCyrl
                  ? 'Барча ёпилган иш сменалари ва расмий касса ҳисоботлари архиви'
                  : 'Barcha yopilgan ish smenalari va rasmiy kassa hisobotlari arxivi'}
              </p>
            </div>

            {shifts.length === 0 ? (
              <EmptyState
                icon={History}
                title={isCyrl ? 'Ёпилган сменалар йўқ' : 'Yopilgan smenalar yo‘q'}
                description={
                  isCyrl
                    ? 'Ҳозирча бирорта ҳам смена ёпилмаган.'
                    : 'Hozircha birorta ham smena yopilmagan.'
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4">Смена / Кассир</th>
                      <th className="py-3 px-4">{t('shift.duration')}</th>
                      <th className="py-3 px-4">{t('shift.opening_cash')}</th>
                      <th className="py-3 px-4">{t('reports.cash_payments')}</th>
                      <th className="py-3 px-4">{t('reports.card_payments')}</th>
                      <th className="py-3 px-4">{t('reports.total_rev')}</th>
                      <th className="py-3 px-4">{t('shift.difference')}</th>
                      <th className="py-3 px-4 text-right">Z-Ҳисобот</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {shifts.map((s) => {
                      const diff = Number(s.cashDifference) || 0;
                      return (
                        <tr
                          key={s.id}
                          onClick={() => setSelectedZReportShift(s)}
                          className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-black">
                                #{s.shiftNumber}
                              </span>
                              <span>{s.cashierName}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                            <div>{formatDateTime(s.openedAt, lang)}</div>
                            <div className="text-[10px] text-slate-400">
                              {isCyrl ? 'Ёпилган:' : 'Yopilgan:'} {formatDateTime(s.closedAt, lang)}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-400">
                            {formatCurrency(s.openingCash, true, lang)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold text-emerald-700 dark:text-emerald-400">
                            {formatCurrency(s.cashTotal, true, lang)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold text-purple-700 dark:text-purple-400">
                            {formatCurrency(s.cardTotal, true, lang)}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-black text-slate-900 dark:text-slate-100">
                            {formatCurrency(s.totalRevenue, true, lang)}
                            <span className="text-[10px] font-normal text-slate-400 ml-1">
                              ({s.totalOrdersCount || 0} {isCyrl ? 'та' : 'ta'})
                            </span>
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap font-bold">
                            {diff === 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                0 {t('currency.som')}
                              </span>
                            ) : diff < 0 ? (
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                -{formatCurrency(Math.abs(diff), true, lang)}
                              </span>
                            ) : (
                              <span className="text-blue-600 dark:text-blue-400">
                                +{formatCurrency(diff, true, lang)}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedZReportShift(s);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Z-Hisobot</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Regular Bill Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        order={selectedReceipt}
      />

      {/* Z-Report Modal for a specific Shift */}
      <ZReportModal
        isOpen={!!selectedZReportShift}
        onClose={() => setSelectedZReportShift(null)}
        shift={selectedZReportShift}
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
    </div>
  );
}
