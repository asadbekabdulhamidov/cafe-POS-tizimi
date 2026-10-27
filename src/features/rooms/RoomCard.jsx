import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DoorOpen,
  UtensilsCrossed,
  Layers,
  Clock,
  Utensils,
  ArrowRight,
  PlusCircle,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';

export function RoomCard({ room, activeOrder, onEdit, onDelete }) {
  const navigate = useNavigate();
  const isOccupied = room.status === 'band';

  const type =
    room.type ||
    (room.name?.toLowerCase().includes('stol')
      ? 'stol'
      : room.name?.toLowerCase().includes('sori') || room.name?.toLowerCase().includes('so‘ri')
      ? 'sori'
      : 'xona');

  const typeConfig = {
    xona: {
      label: 'Xona',
      icon: DoorOpen,
      iconBg: isOccupied ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    stol: {
      label: 'Stol',
      icon: UtensilsCrossed,
      iconBg: isOccupied ? 'bg-amber-100 text-amber-800' : 'bg-blue-50 text-blue-700',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    },
    sori: {
      label: 'So‘ri',
      icon: Layers,
      iconBg: isOccupied ? 'bg-amber-100 text-amber-800' : 'bg-amber-50 text-amber-700',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60',
    },
  };

  const currentConfig = typeConfig[type] || typeConfig.xona;
  const TypeIcon = currentConfig.icon;

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
      className={`rounded-2xl border transition-all duration-200 cursor-pointer p-4 sm:p-5 flex flex-col justify-between group relative ${
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
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base transition-colors ${currentConfig.iconBg}`}
            >
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {room.name}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${currentConfig.badgeColor}`}>
                  {currentConfig.label}
                </span>
                <span>•</span>
                <span>{room.capacity || '4 kishi'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge variant={isOccupied ? 'band' : 'bosh'} size="sm">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOccupied ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
              />
              {isOccupied ? 'Band' : 'Bo‘sh'}
            </Badge>

            {/* Edit / Delete quick controls */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(room);
                  }}
                  className="p-1 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                  title="Tahrirlash"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && !isOccupied && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(room);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="O‘chirish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content details */}
        <div className="mt-4 space-y-2">
          {isOccupied ? (
            <>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-slate-400" /> Mahsulotlar:
                </span>
                <span className="font-semibold text-slate-800">{itemCount} ta</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Vaqti:
                </span>
                <span className="font-medium text-slate-700">
                  {formatRelativeTime(lastOrderTime)}
                </span>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Joriy hisob:
                </span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-700">
                  {formatCurrency(currentTotal)}
                </span>
              </div>
            </>
          ) : (
            <div className="py-5 text-center">
              <p className="text-xs text-slate-400">Hozirda bo‘sh</p>
              <p className="text-xs font-medium text-slate-600 mt-0.5">
                Buyurtma kiritish uchun bosing
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
            size="sm"
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
            size="sm"
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
