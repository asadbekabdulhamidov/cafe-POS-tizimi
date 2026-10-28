import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DoorOpen,
  Receipt,
  Wallet,
  Clock,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Banknote,
  UtensilsCrossed,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatTime, formatRelativeTime } from '../utils/formatters';

export function DashboardPage() {
  const navigate = useNavigate();
  const { rooms, activeOrders, closedOrders } = usePOSStore();
  const { t, localize, lang } = useAppConfigStore();

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.status === 'band');
  const emptyRoomsCount = totalRooms - occupiedRooms.length;

  // Active orders total
  const activeOrdersTotal = activeOrders.reduce((sum, order) => sum + (order.finalTotal || 0), 0);

  // Today's closed orders & revenue
  const today = new Date().toDateString();
  const todayClosedOrders = closedOrders.filter(
    (order) => new Date(order.closedAt || order.createdAt).toDateString() === today
  );

  const todayRevenue = todayClosedOrders.reduce((sum, order) => sum + (order.finalTotal || 0), 0);

  const cashRevenue = todayClosedOrders
    .filter((o) => o.paymentMethod === 'naqd')
    .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

  const cardRevenue = todayClosedOrders
    .filter((o) => o.paymentMethod === 'karta')
    .reduce((sum, o) => sum + (o.finalTotal || 0), 0);

  const averageCheck =
    todayClosedOrders.length > 0 ? Math.round(todayRevenue / todayClosedOrders.length) : 0;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 rounded-3xl text-white shadow-lg shadow-emerald-950/10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-700/60 text-emerald-100 mb-2 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {t('dashboard.active_status')}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-sm text-emerald-100/80 mt-1">
            {t('dashboard.desc')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/rooms')}
            icon={DoorOpen}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm dark:bg-white/10"
          >
            {t('dashboard.view_places')}
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/menu')}
            icon={UtensilsCrossed}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold shadow-md"
          >
            {t('dashboard.manage_menu')}
          </Button>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title={t('dashboard.stat_total')}
          value={`${totalRooms} ${t('unit.items')}`}
          subvalue={`${emptyRoomsCount} ${t('unit.items')} ${lang === 'cyrl' ? 'бўш жой мавжуд' : 'bo‘sh joy mavjud'}`}
          icon={DoorOpen}
          color="slate"
        />
        <StatCard
          title={t('dashboard.stat_occupied')}
          value={`${occupiedRooms.length} ${t('unit.items')}`}
          subvalue={`${lang === 'cyrl' ? 'Бандлик:' : 'Bandlik:'} ${Math.round((occupiedRooms.length / (totalRooms || 1)) * 100)}%`}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title={t('dashboard.stat_active_bills')}
          value={formatCurrency(activeOrdersTotal, true, lang)}
          subvalue={`${activeOrders.length} ${t('unit.items')} ${lang === 'cyrl' ? 'фаол ҳисоб' : 'faol hisob'}`}
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title={t('dashboard.stat_revenue')}
          value={formatCurrency(todayRevenue, true, lang)}
          subvalue={`${todayClosedOrders.length} ${t('unit.items')} ${lang === 'cyrl' ? 'ёпилган ҳисоб' : 'yopilgan hisob'}`}
          icon={Wallet}
          color="emerald"
        />
      </div>

      {/* Main Grid: Occupied Rooms & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Currently Occupied Rooms */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                  {t('dashboard.occupied_title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('dashboard.occupied_desc')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/rooms')}
                icon={ArrowRight}
                iconPosition="right"
              >
                {t('dashboard.all')}
              </Button>
            </CardHeader>
            <CardBody className="p-4 sm:p-5">
              {occupiedRooms.length === 0 ? (
                <EmptyState
                  icon={DoorOpen}
                  title={t('dashboard.empty_occupied')}
                  description={t('dashboard.empty_occupied_desc')}
                  actionText={t('dashboard.view_places')}
                  onAction={() => navigate('/rooms')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {occupiedRooms.map((room) => {
                    const order = activeOrders.find(
                      (o) => o.roomId === room.id && o.status === 'active'
                    );
                    const itemCount = (order?.items || []).reduce(
                      (sum, i) => sum + i.quantity,
                      0
                    );

                    return (
                      <div
                        key={room.id}
                        onClick={() => navigate(`/rooms/${room.id}`)}
                        className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/90 dark:hover:bg-amber-950/40 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                              {localize(room.capacity)}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                              {localize(room.name)}
                            </h4>
                          </div>
                          <Badge variant="band">{t('places.band')}</Badge>
                        </div>

                        <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-amber-900/40 flex items-center justify-between">
                          <div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {itemCount} {t('unit.items')} • {formatRelativeTime(order?.updatedAt || order?.createdAt, lang)}
                            </p>
                            <p className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                              {formatCurrency(order?.finalTotal || 0, true, lang)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/rooms/${room.id}`);
                            }}
                          >
                            {lang === 'cyrl' ? 'Очиш' : 'Ochish'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Today's Financial Summary */}
          <Card>
            <CardHeader>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                  {t('dashboard.summary_title')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('dashboard.summary_desc')}
                </p>
              </div>
            </CardHeader>
            <CardBody className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                    <Banknote className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('dashboard.cash_revenue')}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(cashRevenue, true, lang)}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {todayRevenue > 0
                      ? `${Math.round((cashRevenue / todayRevenue) * 100)}% ${lang === 'cyrl' ? 'улуш' : 'ulush'}`
                      : '0%'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                    <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{t('dashboard.card_revenue')}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(cardRevenue, true, lang)}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {todayRevenue > 0
                      ? `${Math.round((cardRevenue / todayRevenue) * 100)}% ${lang === 'cyrl' ? 'улуш' : 'ulush'}`
                      : '0%'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{t('dashboard.avg_check')}</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(averageCheck, true, lang)}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {lang === 'cyrl' ? 'Ҳар бир ёпилган ҳисобга' : 'Har bir yopilgan hisobga'}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right 1 Col: Recent Closed Orders */}
        <div className="space-y-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                  {t('dashboard.recent_orders')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('dashboard.recent_desc')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/reports')}
                icon={ArrowRight}
                iconPosition="right"
              >
                {t('dashboard.history')}
              </Button>
            </CardHeader>
            <CardBody className="p-4 flex-1">
              {todayClosedOrders.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title={lang === 'cyrl' ? 'Ёпилган ҳисоблар йўқ' : 'Yopilgan hisoblar yo‘q'}
                  description={lang === 'cyrl' ? 'Бугун ҳали ҳисоб ёпилмади.' : 'Bugun hali hisob yopilmadi.'}
                />
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
                  {todayClosedOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="pt-3 first:pt-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {localize(order.roomName)}
                        </span>
                        <Badge
                          variant={order.paymentMethod === 'karta' ? 'purple' : 'success'}
                          size="sm"
                        >
                          {order.paymentMethod === 'karta'
                            ? (lang === 'cyrl' ? 'Карта' : 'Karta')
                            : (lang === 'cyrl' ? 'Нақд' : 'Naqd')}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {(order.items || [])
                          .map((i) => `${localize(i.name)} (${i.quantity})`)
                          .join(', ')}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {formatTime(order.closedAt)}
                        </span>
                        <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(order.finalTotal, true, lang)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
