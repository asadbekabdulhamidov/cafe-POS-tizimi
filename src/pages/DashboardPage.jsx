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
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCurrency, formatTime, formatRelativeTime } from '../utils/formatters';

export function DashboardPage() {
  const navigate = useNavigate();
  const { rooms, activeOrders, closedOrders } = usePOSStore();

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
            Tizim faol ishlamoqda
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Xush kelibsiz, Kassir!
          </h1>
          <p className="text-sm text-emerald-100/80 mt-1">
            Choyxona buyurtmalarini boshqarish va to‘lovlarni qabul qilish paneli.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/rooms')}
            icon={DoorOpen}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
          >
            Joylar ro‘yxati
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/menu')}
            icon={UtensilsCrossed}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold shadow-md"
          >
            Menyuni boshqarish
          </Button>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Jami joylar"
          value={`${totalRooms} ta`}
          subvalue={`${emptyRoomsCount} ta bo‘sh joy mavjud`}
          icon={DoorOpen}
          color="slate"
        />
        <StatCard
          title="Band joylar"
          value={`${occupiedRooms.length} ta`}
          subvalue={`Bandlik darajasi: ${Math.round((occupiedRooms.length / (totalRooms || 1)) * 100)}%`}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Ochiq hisoblar"
          value={formatCurrency(activeOrdersTotal)}
          subvalue={`${activeOrders.length} ta faol hisob`}
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title="Bugungi tushum"
          value={formatCurrency(todayRevenue)}
          subvalue={`${todayClosedOrders.length} ta yopilgan hisob`}
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
                <h3 className="font-bold text-slate-800 text-base">Hozir band bo‘lgan joylar</h3>
                <p className="text-xs text-slate-500">Mijozlar ovqatlanayotgan xonalar, stollar va so‘rilar</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/rooms')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Barchasi
              </Button>
            </CardHeader>
            <CardBody className="p-4 sm:p-5">
              {occupiedRooms.length === 0 ? (
                <EmptyState
                  icon={DoorOpen}
                  title="Hozirda band xona yo‘q"
                  description="Barcha xonalar bo‘sh. Yangi buyurtma boshlash uchun xona tanlang."
                  actionText="Xonalarni ochish"
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
                        className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-50/90 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-semibold text-slate-500">
                              {room.capacity}
                            </span>
                            <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {room.name}
                            </h4>
                          </div>
                          <Badge variant="band">Band</Badge>
                        </div>

                        <div className="mt-4 pt-3 border-t border-amber-200/50 flex items-center justify-between">
                          <div>
                            <p className="text-[11px] text-slate-500">
                              {itemCount} ta mahsulot • {formatRelativeTime(order?.updatedAt || order?.createdAt)}
                            </p>
                            <p className="text-base font-extrabold text-slate-900">
                              {formatCurrency(order?.finalTotal || 0)}
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
                            Ochish
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
                <h3 className="font-bold text-slate-800 text-base">Bugungi faoliyat qisqacha</h3>
                <p className="text-xs text-slate-500">To‘lov turlari va asosiy ko‘rsatkichlar</p>
              </div>
            </CardHeader>
            <CardBody className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Naqd tushum</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(cashRevenue)}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {todayRevenue > 0
                      ? `${Math.round((cashRevenue / todayRevenue) * 100)}% ulush`
                      : '0%'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    <span>Karta / Terminal</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(cardRevenue)}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {todayRevenue > 0
                      ? `${Math.round((cardRevenue / todayRevenue) * 100)}% ulush`
                      : '0%'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>O‘rtacha chek</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(averageCheck)}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Har bir yopilgan hisobga</p>
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
                <h3 className="font-bold text-slate-800 text-base">Oxirgi buyurtmalar</h3>
                <p className="text-xs text-slate-500">Muvaffaqiyatli yopilgan hisoblar</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/reports')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Tarix
              </Button>
            </CardHeader>
            <CardBody className="p-4 flex-1">
              {todayClosedOrders.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="Yopilgan hisoblar yo‘q"
                  description="Bugun hali hisob yopilmadi."
                />
              ) : (
                <div className="divide-y divide-slate-100 space-y-3">
                  {todayClosedOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="pt-3 first:pt-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{order.roomName}</span>
                        <Badge
                          variant={order.paymentMethod === 'karta' ? 'purple' : 'success'}
                          size="sm"
                        >
                          {order.paymentMethod === 'karta' ? 'Karta' : 'Naqd'}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {(order.items || []).map((i) => `${i.name} (${i.quantity})`).join(', ')}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span className="text-[11px] text-slate-400">
                          {formatTime(order.closedAt)}
                        </span>
                        <span className="font-bold text-sm text-emerald-700">
                          {formatCurrency(order.finalTotal)}
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
