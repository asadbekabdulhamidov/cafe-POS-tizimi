import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DoorOpen, Clock, Utensils, ArrowRight, PlusCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

export function RoomCard({ room, activeOrder }) {
  const navigate = useNavigate();
  const isOccupied = room.status === 'band';

  const itemCount = isOccupied && activeOrder
    ? (activeOrder.items || []).reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const currentTotal = isOccupied && activeOrder ? activeOrder.finalTotal : 0;
  const lastOrderTime = isOccupied && activeOrder
    ? activeOrder.updatedAt || activeOrder.createdAt
    : null;

  const handleOpenRoom = (e) => {
    e.stopPropagation();
    navigate(`/rooms/${room.id}`);
  };

  return (
    <div
      onClick={handleOpenRoom}
      className={`rounded-2xl border transition-all duration-200 cursor-pointer p-5 flex flex-col justify-between group ${
        isOccupied
          ? 'bg-white border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400 ring-1 ring-amber-200/50'
          : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 hover:ring-1 hover:ring-emerald-200/60'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${
                isOccupied
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100'
              }`}
            >
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                {room.name}
              </h3>
              <p className="text-xs text-slate-500">{room.capacity || '4-8 kishi'}</p>
            </div>
          </div>

          <Badge variant={isOccupied ? 'band' : 'bosh'} size="md">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isOccupied ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            {isOccupied ? 'Band' : 'Bo‘sh'}
          </Badge>
        </div>

        {/* Content details */}
        <div className="mt-5 space-y-2.5">
          {isOccupied ? (
            <>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-slate-400" /> Buyurtmalar soni:
                </span>
                <span className="font-semibold text-slate-800">{itemCount} ta mahsulot</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Oxirgi buyurtma:
                </span>
                <span className="font-medium text-slate-700">
                  {formatRelativeTime(lastOrderTime)}
                </span>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Joriy hisob:
                </span>
                <span className="text-lg font-extrabold text-emerald-700">
                  {formatCurrency(currentTotal)}
                </span>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="text-xs text-slate-400">Xona hozirda bo‘sh</p>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Yangi hisob boshlash uchun kiring
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        {isOccupied ? (
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center group-hover:bg-emerald-700"
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleOpenRoom}
          >
            Buyurtmani ochish
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="md"
            className="w-full justify-center hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
            icon={PlusCircle}
            onClick={handleOpenRoom}
          >
            Buyurtma boshlash
          </Button>
        )}
      </div>
    </div>
  );
}
