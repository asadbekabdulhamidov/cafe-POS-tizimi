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
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { ReceiptModal } from '../features/orders/ReceiptModal';
import { formatCurrency, formatDateTime } from '../utils/formatters';

export function ReportsPage() {
  const { closedOrders, rooms } = usePOSStore();
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
            quantity: 0,
            revenue: 0,
          };
        }
        counts[item.name].quantity += item.quantity;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Jami tushum"
          value={formatCurrency(totalRevenue)}
          subvalue={`${totalBillsCount} ta chek bo‘yicha hisoblangan`}
          icon={Wallet}
          color="emerald"
        />
        <StatCard
          title="Yopilgan hisoblar"
          value={`${totalBillsCount} ta`}
          subvalue="Barcha vaqtlar davomida"
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title="Naqd to‘lovlar"
          value={formatCurrency(cashRevenue)}
          subvalue={
            totalRevenue > 0
              ? `${Math.round((cashRevenue / totalRevenue) * 100)}% umumiy tushumdan`
              : '0%'
          }
          icon={Banknote}
          color="emerald"
        />
        <StatCard
          title="Karta to‘lovlari"
          value={formatCurrency(cardRevenue)}
          subvalue={
            totalRevenue > 0
              ? `${Math.round((cardRevenue / totalRevenue) * 100)}% umumiy tushumdan`
              : '0%'
          }
          icon={CreditCard}
          color="purple"
        />
      </div>

      {/* Grid: Top Dishes & Payment breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 Dishesh */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Eng ko‘p sotilgan mahsulotlar
              </h3>
              <p className="text-xs text-slate-500">
                Buyurtmalar soni bo‘yicha TOP taomlar
              </p>
            </div>
            <BarChart2 className="w-5 h-5 text-emerald-600" />
          </div>

          {topDishes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Ma’lumotlar mavjud emas
            </p>
          ) : (
            <div className="space-y-3.5">
              {topDishes.map((dish, idx) => {
                const maxQty = topDishes[0]?.quantity || 1;
                const percent = Math.round((dish.quantity / maxQty) * 100);

                return (
                  <div key={dish.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-extrabold">
                          #{idx + 1}
                        </span>
                        {dish.name}
                      </span>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700">
                          {dish.quantity} dona
                        </span>
                        <span className="text-slate-400 text-[11px] ml-2">
                          ({formatCurrency(dish.revenue)})
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
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
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              To‘lov turlari taqsimoti
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Naqd va plastik karta bo‘yicha ulushlar
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-emerald-600" /> Naqd to‘lov
                  </span>
                  <span className="font-bold text-slate-900">
                    {totalRevenue > 0
                      ? `${Math.round((cashRevenue / totalRevenue) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <p className="text-base font-extrabold text-emerald-700">
                  {formatCurrency(cashRevenue)}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-purple-600" /> Karta / Terminal
                  </span>
                  <span className="font-bold text-slate-900">
                    {totalRevenue > 0
                      ? `${Math.round((cardRevenue / totalRevenue) * 100)}%`
                      : '0%'}
                  </span>
                </div>
                <p className="text-base font-extrabold text-purple-700">
                  {formatCurrency(cardRevenue)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
            <span>Jami hisoblar:</span>
            <span className="font-bold text-slate-800">{totalBillsCount} ta</span>
          </div>
        </div>
      </div>

      {/* History Table with Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Xonalar bo‘yicha to‘lovlar tarixi
            </h3>
            <p className="text-xs text-slate-500">
              Yopilgan barcha hisoblar va cheklar arxivi
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-full sm:w-56">
              <Input
                placeholder="Qidiruv (xona yoki taom)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>

            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Barcha xonalar</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Barcha to‘lovlar</option>
              <option value="naqd">Naqd pul</option>
              <option value="karta">Karta</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="Tarixda buyurtma topilmadi"
            description="Tanlangan filtrlarga mos keluvchi hisob mavjud emas."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Sana va vaqt</th>
                  <th className="py-3 px-4">Xona</th>
                  <th className="py-3 px-4">Buyurtma tarkibi</th>
                  <th className="py-3 px-4">To‘lov turi</th>
                  <th className="py-3 px-4">Yakuniy summa</th>
                  <th className="py-3 px-4 text-right">Chek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => setSelectedReceipt(order)}
                  >
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-xs">
                      {formatDateTime(order.closedAt || order.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {order.roomName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate text-xs">
                      {(order.items || []).map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge
                        variant={order.paymentMethod === 'karta' ? 'purple' : 'success'}
                        size="sm"
                      >
                        {order.paymentMethod === 'karta' ? 'Karta' : 'Naqd'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-800 whitespace-nowrap">
                      {formatCurrency(order.finalTotal)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReceipt(order);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ko‘rish</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
