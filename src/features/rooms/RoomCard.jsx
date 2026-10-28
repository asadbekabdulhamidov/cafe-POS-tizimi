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
import { useAppConfigStore } from '../../store/useAppConfigStore';

export function RoomCard({ room, activeOrder, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { t, localize, lang } = useAppConfigStore();
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
      label: t('place_modal.type_xona'),
      icon: DoorOpen,
      iconBg: isOccupied
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
    },
    stol: {
      label: t('place_modal.type_stol'),
      icon: UtensilsCrossed,
      iconBg: isOccupied
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
    },
    sori: {
      label: t('place_modal.type_sori'),
      icon: Layers,
      iconBg: isOccupied
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
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
      className={`rounded-2xl border transition-all duration-200 cursor-pointer p-4 sm:p-5 flex flex-col justify-between group relative active:scale-[0.99] select-none ${
        isOccupied
          ? 'bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-800/70 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-600 ring-1 ring-amber-200/50 dark:ring-amber-900/40'
          : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-600/70 hover:ring-1 hover:ring-emerald-200/60 dark:hover:ring-emerald-900/40'
      }`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base transition-colors ${currentConfig.iconBg}`}
            >
              <TypeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {localize(room.name)}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${currentConfig.badgeColor}`}>
                  {currentConfig.label}
                </span>
                <span>•</span>
                <span>{localize(room.capacity) || (lang === 'cyrl' ? '4 киши' : '4 kishi')}</span>
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
              {isOccupied ? t('places.band') : t('places.bosh')}
            </Badge>

            {/* Edit / Delete quick controls (visible on mobile, hover on desktop) */}
            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(room);
                  }}
                  className="p-1 text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title={t('btn.edit')}
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
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title={t('btn.delete')}
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
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> {t('places.items_count')}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{itemCount} {t('unit.items')}</span>
              </div>

              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" /> {t('places.time')}
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {formatRelativeTime(lastOrderTime, lang)}
                </span>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('places.current_bill')}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(currentTotal, true, lang)}
                </span>
              </div>
            </>
          ) : (
            <div className="py-5 text-center">
              <p className="text-xs text-slate-400 dark:text-slate-500">{t('places.empty_text')}</p>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
                {t('places.empty_hint')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {isOccupied ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full justify-center group-hover:bg-emerald-700"
            icon={ArrowRight}
            iconPosition="right"
            onClick={handleOpenRoom}
          >
            {t('places.open_order')}
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            className="w-full justify-center hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-300 dark:hover:border-emerald-700"
            icon={PlusCircle}
            onClick={handleOpenRoom}
          >
            {t('places.start_order')}
          </Button>
        )}
      </div>
    </div>
  );
}
