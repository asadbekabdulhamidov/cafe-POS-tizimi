import React, { useState, useMemo } from 'react';
import {
  ArrowRightLeft,
  DoorOpen,
  Utensils,
  Layers,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { usePOSStore } from '../../store/usePOSStore';
import { useAppConfigStore } from '../../store/useAppConfigStore';
import { formatCurrency } from '../../utils/formatters';

export function TransferModal({
  isOpen,
  onClose,
  currentRoom,
  order,
  onConfirmTransfer,
}) {
  const { rooms } = usePOSStore();
  const { t, localize, lang } = useAppConfigStore();

  const [selectedTargetId, setSelectedTargetId] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'xona' | 'stol' | 'sori'

  // Available destination places (must be empty 'bosh' and not current room)
  const availablePlaces = useMemo(() => {
    return rooms.filter(
      (r) => r.id !== currentRoom?.id && r.status === 'bosh'
    );
  }, [rooms, currentRoom?.id]);

  const filteredPlaces = useMemo(() => {
    if (activeTab === 'all') return availablePlaces;
    return availablePlaces.filter((r) => r.type === activeTab);
  }, [availablePlaces, activeTab]);

  const selectedTargetRoom = rooms.find((r) => r.id === selectedTargetId);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'stol':
        return <Utensils className="w-4 h-4" />;
      case 'sori':
        return <Layers className="w-4 h-4" />;
      default:
        return <DoorOpen className="w-4 h-4" />;
    }
  };

  const getTypeName = (type) => {
    switch (type) {
      case 'stol':
        return t('places.tables');
      case 'sori':
        return t('places.soris');
      default:
        return t('places.rooms');
    }
  };

  const handleTransfer = () => {
    if (!selectedTargetId) return;
    onConfirmTransfer(currentRoom.id, selectedTargetId);
  };

  if (!currentRoom) return null;

  const itemsCount = (order?.items || []).reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = order?.finalTotal ?? order?.subtotal ?? 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('transfer.title')}
      subtitle={t('transfer.sub')}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Source & Target Flow Visualization */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
          {/* Current Place */}
          <div className="flex-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {t('transfer.current')}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="p-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                {getTypeIcon(currentRoom.type)}
              </span>
              <p className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                {localize(currentRoom.name)}
              </p>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              {itemsCount} {t('unit.items')} • {formatCurrency(totalAmount, true, lang)}
            </p>
          </div>

          {/* Direction Arrow */}
          <div className="shrink-0 p-2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <ArrowRightLeft className="w-5 h-5" />
          </div>

          {/* Destination Place */}
          <div className={`flex-1 p-2.5 rounded-xl border transition-all ${
            selectedTargetRoom
              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700'
              : 'bg-white dark:bg-slate-800 border-dashed border-slate-300 dark:border-slate-700'
          }`}>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              {lang === 'cyrl' ? 'Янги жой' : 'Yangi joy'}
            </span>
            {selectedTargetRoom ? (
              <>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="p-1 rounded-md bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                    {getTypeIcon(selectedTargetRoom.type)}
                  </span>
                  <p className="font-bold text-sm text-emerald-900 dark:text-emerald-200 truncate">
                    {localize(selectedTargetRoom.name)}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                  {selectedTargetRoom.capacity}
                </p>
              </>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-2">
                {lang === 'cyrl' ? 'Жойни танланг...' : 'Joyni tanlang...'}
              </p>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700">
          {[
            { id: 'all', label: t('places.all') },
            { id: 'xona', label: t('places.rooms') },
            { id: 'stol', label: t('places.tables') },
            { id: 'sori', label: t('places.soris') },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Available Empty Places Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            {t('transfer.target')} ({filteredPlaces.length} {lang === 'cyrl' ? 'та бўш' : 'ta bo‘sh'}):
          </label>

          {filteredPlaces.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 space-y-2">
              <AlertCircle className="w-7 h-7 mx-auto text-amber-500" />
              <p className="text-xs font-medium">{t('transfer.no_empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
              {filteredPlaces.map((p) => {
                const isSelected = selectedTargetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedTargetId(p.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/30'
                        : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-600 dark:fill-emerald-400 text-white" />
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                      {getTypeIcon(p.type)}
                      <span className="text-[10px] uppercase font-semibold">
                        {getTypeName(p.type)}
                      </span>
                    </div>
                    <p className={`font-bold text-sm mt-1.5 truncate ${
                      isSelected
                        ? 'text-emerald-950 dark:text-emerald-100'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}>
                      {localize(p.name)}
                    </p>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      {p.capacity}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            {t('btn.cancel')}
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            icon={ArrowRightLeft}
            disabled={!selectedTargetId}
            onClick={handleTransfer}
          >
            {t('transfer.confirm')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
