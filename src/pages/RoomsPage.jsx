import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  DoorOpen,
  UtensilsCrossed,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { useAppConfigStore } from '../store/useAppConfigStore';
import { RoomCard } from '../features/rooms/RoomCard';
import { PlaceModal } from '../features/rooms/PlaceModal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from 'sonner';

export function RoomsPage() {
  const { rooms, activeOrders, addPlace, updatePlace, deletePlace } = usePOSStore();
  const { t, lang } = useAppConfigStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'bosh' | 'band'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'xona' | 'stol' | 'sori'

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);

  // Map active orders by room id for O(1) lookup
  const activeOrdersByRoom = useMemo(() => {
    const map = {};
    activeOrders.forEach((order) => {
      if (order.status === 'active') {
        map[order.roomId] = order;
      }
    });
    return map;
  }, [activeOrders]);

  // Counts by status
  const counts = useMemo(() => {
    const total = rooms.length;
    const band = rooms.filter((r) => r.status === 'band').length;
    const bosh = total - band;

    const xonalar = rooms.filter((r) => (r.type || 'xona') === 'xona').length;
    const stollar = rooms.filter((r) => r.type === 'stol').length;
    const sorilar = rooms.filter((r) => r.type === 'sori').length;

    return { total, band, bosh, xonalar, stollar, sorilar };
  }, [rooms]);

  // Filtered list
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const roomType =
        room.type ||
        (room.name?.toLowerCase().includes('stol')
          ? 'stol'
          : room.name?.toLowerCase().includes('sori') || room.name?.toLowerCase().includes('so‘ri')
          ? 'sori'
          : 'xona');

      // Filter by type
      if (typeFilter !== 'all' && roomType !== typeFilter) return false;

      // Filter by status
      if (statusFilter === 'band' && room.status !== 'band') return false;
      if (statusFilter === 'bosh' && room.status !== 'bosh') return false;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = room.name.toLowerCase().includes(query);
        const matchesCapacity = (room.capacity || '').toLowerCase().includes(query);
        return matchesName || matchesCapacity;
      }

      return true;
    });
  }, [rooms, statusFilter, typeFilter, searchQuery]);

  // Handle open add modal
  const handleOpenAdd = () => {
    setEditingPlace(null);
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (place) => {
    setEditingPlace(place);
    setIsModalOpen(true);
  };

  // Save place (add or update)
  const handleSavePlace = (placeData) => {
    if (editingPlace) {
      updatePlace(editingPlace.id, placeData);
      toast.success(
        lang === 'cyrl'
          ? `"${placeData.name}" муваффақиятли янгиланди!`
          : `"${placeData.name}" muvaffaqiyatli yangilandi!`
      );
    } else {
      addPlace(placeData);
      toast.success(
        lang === 'cyrl'
          ? `Янги ${placeData.name} ошхонага қўшилди!`
          : `Yangi ${placeData.name} oshxonaga qo‘shildi!`
      );
    }
  };

  // Delete place
  const handleDeletePlace = (place) => {
    if (place.status === 'band') {
      toast.error(
        lang === 'cyrl'
          ? `"${place.name}" ҳозирда банд! Аввал унинг ҳисобини ёпинг.`
          : `"${place.name}" hozirda band! Avval uning hisobini yoping.`
      );
      return;
    }

    const confirmMsg =
      lang === 'cyrl'
        ? `Ҳақиқатан ҳам "${place.name}"ни рўйхатдан ўчирмоқчимисиз?`
        : `Haqiqatan ham "${place.name}"ni ro‘yxatdan o‘chirmoqchimisiz?`;

    if (window.confirm(confirmMsg)) {
      const res = deletePlace(place.id);
      if (res.success) {
        toast.success(
          lang === 'cyrl' ? `"${place.name}" ўчирилди.` : `"${place.name}" o‘chirildi.`
        );
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-150">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('places.title')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === 'cyrl' ? 'Жами:' : 'Jami:'} {counts.total} {t('unit.items')} ({counts.xonalar} {t('places.rooms').toLowerCase()}, {counts.stollar} {t('places.tables').toLowerCase()}, {counts.sorilar} {t('places.soris').toLowerCase()})
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenAdd}
          className="shadow-sm shadow-emerald-600/20"
        >
          {t('places.add_new')}
        </Button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5 transition-colors duration-150">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="w-full md:w-72">
            <Input
              placeholder={t('places.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Place Type Filters (Tabs) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                typeFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t('places.all')}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/70 dark:bg-slate-600">
                {counts.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTypeFilter('xona')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                typeFilter === 'xona'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>{t('places.rooms')}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  typeFilter === 'xona' ? 'bg-emerald-700 text-white' : 'bg-slate-200/70 dark:bg-slate-600'
                }`}
              >
                {counts.xonalar}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTypeFilter('stol')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                typeFilter === 'stol'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>{t('places.tables')}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  typeFilter === 'stol' ? 'bg-blue-700 text-white' : 'bg-slate-200/70 dark:bg-slate-600'
                }`}
              >
                {counts.stollar}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTypeFilter('sori')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                typeFilter === 'sori'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('places.soris')}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  typeFilter === 'sori' ? 'bg-amber-700 text-white' : 'bg-slate-200/70 dark:bg-slate-600'
                }`}
              >
                {counts.sorilar}
              </span>
            </button>
          </div>
        </div>

        {/* Status Filter Sub-bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium">{t('places.status')}</span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              statusFilter === 'all'
                ? 'bg-slate-800 dark:bg-slate-700 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t('places.all')} ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('band')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              statusFilter === 'band'
                ? 'bg-amber-500 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t('places.band')} ({counts.band})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('bosh')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              statusFilter === 'bosh'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t('places.bosh')} ({counts.bosh})
          </button>
        </div>
      </div>

      {/* Grid of Places */}
      {filteredRooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title={t('places.not_found')}
          description={
            searchQuery
              ? `"${searchQuery}" бўйича ҳеч қандай жой топилмади.`
              : 'Танланган филтрлар бўйича жойлар мавжуд эмас.'
          }
          actionText={t('places.add_new')}
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              activeOrder={activeOrdersByRoom[room.id] || null}
              onEdit={handleOpenEdit}
              onDelete={handleDeletePlace}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Place Modal */}
      <PlaceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlace(null);
        }}
        onSave={handleSavePlace}
        place={editingPlace}
        existingPlaces={rooms}
      />
    </div>
  );
}
