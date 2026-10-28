import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Receipt,
  Banknote,
  CreditCard,
  Eye,
  Search,
  BarChart2,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { ReceiptModal } from '../features/orders/ReceiptModal';
import { formatCurrency, formatDateTime, formatQuantity } from '../utils/formatters';

export function ReportsPage() {
  const { closedOrders, rooms } = usePOSStore();
  const { t, localize, lang } = useAppConfigStore();
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [roomFilter, setRoomFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Overall stats
  const totalRevenue = useMemo(() => {
    return closedOrders.reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  }, [closedOrders]);

  const totalBillsCount = closedOrders.length;

  const cashRevenue = useMemo(() => {
    return closedOrders
      .filter((o) => o.paymentMethod === 'naqd')
      .reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  }, [closedOrders]);

  const cardRevenue = useMemo(() => {
    return closedOrders
      .filter((o) => o.paymentMethod === 'karta')
      .reduce((sum, o) => sum + (o.finalTotal || 0), 0);
  }, [closedOrders]);

  // 2. Top selling items calculation
  const topDishes = useMemo(() => {
    const counts = {};
    closedOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (!counts[item.name]) {
          counts[item.name] = {
            name: item.name,
            unit: item.unit || 'dona',
            quantity: 0,
            revenue: 0,
          };
        }
        counts[item.name].quantity = Math.round((counts[item.name].quantity + Number(item.quantity)) * 100) / 100;
        counts[item.name].revenue += item.quantity * item.price;
      });
    });

    return Object.values(counts)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [closedOrders]);

  // 3. Filtered history
  const filteredOrders = useMemo(() => {
    return closedOrders.filter((order) => {
      if (roomFilter !== 'all' && order.roomId !== roomFilter) return false;
      if (paymentFilter !== 'all' && order.paymentMethod !== paymentFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesRoom = (order.roomName || '').toLowerCase().includes(query);
        const matchesItems = (order.items || []).some((i) =>
          i.name.toLowerCase().includes(query)
        );
        return matchesRoom || matchesItems;
      }

      return true;
    });
  }, [closedOrders, roomFilter, paymentFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t('reports.total_rev')}
          value={formatCurrency(totalRevenue, true, lang)}
          subvalue={`${totalBillsCount} ${lang === 'cyrl' ? 'та чек бўйича' : 'ta chek bo‘yicha'}`}
          icon={Wallet}
          color="emerald"
        />
        <StatCard
          title={t('reports.closed_bills')}
          value={`${totalBillsCount} ${t('unit.items')}`}
          subvalue={lang === 'cyrl' ? 'Барча вақтлар давомида' : 'Barcha vaqtlar davomida'}
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title={t('reports.cash_payments')}
          value={formatCurrency(cashRevenue, true, lang)}
          subvalue={
            totalRevenue > 0
              ? `${Math.round((cashRevenue / totalRevenue) * 100)}% ${lang === 'cyrl' ? 'умумий тушумдан' : 'umumiy tushumdan'}`
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
              ? `${Math.round((cardRevenue / totalRevenue) * 100)}% ${lang === 'cyrl' ? 'умумий тушумдан' : 'umumiy tushumdan'}`
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
              {lang === 'cyrl' ? 'Маълумотлар мавжуд эмас' : 'Ma’lumotlar mavjud emas'}
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
              {lang === 'cyrl' ? 'Нақд ва пластик карта бўйича улушлар' : 'Naqd va plastik karta bo‘yicha ulushlar'}
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {t('payment.cash')}
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
                    <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" /> {t('payment.card')}
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
            <span>{lang === 'cyrl' ? 'Жами ҳисоблар:' : 'Jami hisoblar:'}</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{totalBillsCount} {t('unit.items')}</span>
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

        {/* Orders List / Table */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={lang === 'cyrl' ? 'Тарихда буюртма топилмади' : 'Tarixda buyurtma topilmadi'}
            description={lang === 'cyrl' ? 'Танланган филтрларга мос келувчи ҳисоб мавжуд эмас.' : 'Tanlangan filtrlarga mos keluvchi hisob mavjud emas.'}
          />
        ) : (
          <>
            {/* Mobile Cards View (iOS style) */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedReceipt(order)}
                  className="py-3.5 flex items-center justify-between gap-3 active:bg-slate-50 dark:active:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {localize(order.roomName)}
                      </h4>
                      <Badge
                        variant={order.paymentMethod === 'karta' ? 'purple' : 'success'}
                        size="sm"
                      >
                        {order.paymentMethod === 'karta' ? t('payment.card') : t('payment.cash')}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {formatDateTime(order.closedAt || order.createdAt)}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                      {(order.items || []).map((i) => localize(i.name)).join(', ')}
                    </p>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="font-black text-sm text-emerald-800 dark:text-emerald-400">
                      {formatCurrency(order.finalTotal, true, lang)}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReceipt(order);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-95 transition-all"
                      title={t('reports.view')}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">{t('reports.col_date')}</th>
                    <th className="py-3 px-4">{t('reports.col_room')}</th>
                    <th className="py-3 px-4">{t('reports.col_items')}</th>
                    <th className="py-3 px-4">{t('reports.col_pay_type')}</th>
                    <th className="py-3 px-4">{t('reports.col_final')}</th>
                    <th className="py-3 px-4 text-right">{t('reports.col_receipt')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedReceipt(order)}
                    >
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap text-xs">
                        {formatDateTime(order.closedAt || order.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {localize(order.roomName)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate text-xs">
                        {(order.items || [])
                          .map((i) => `${localize(i.name)} (${formatQuantity(i.quantity, i.unit, lang)})`)
                          .join(', ')}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          variant={order.paymentMethod === 'karta' ? 'purple' : 'success'}
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
          </>
        )}
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        order={selectedReceipt}
      />
    </div>
  );
}
