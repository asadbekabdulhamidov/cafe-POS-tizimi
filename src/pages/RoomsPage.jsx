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
import { RoomCard } from '../features/rooms/RoomCard';
import { PlaceModal } from '../features/rooms/PlaceModal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { toast } from 'sonner';

export function RoomsPage() {
  const { rooms, activeOrders, addPlace, updatePlace, deletePlace } = usePOSStore();
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
      toast.success(`"${placeData.name}" muvaffaqiyatli yangilandi!`);
    } else {
      addPlace(placeData);
      toast.success(`Yangi ${placeData.name} oshxonaga qo‘shildi!`);
    }
  };

  // Delete place
  const handleDeletePlace = (place) => {
    if (place.status === 'band') {
      toast.error(`"${place.name}" hozirda band! Avval uning hisobini yoping.`);
      return;
    }

    if (window.confirm(`Haqiqatan ham "${place.name}"ni ro‘yxatdan o‘chirmoqchimisiz?`)) {
      const res = deletePlace(place.id);
      if (res.success) {
        toast.success(`"${place.name}" o‘chirildi.`);
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Xonalar, Stollar va So‘rilar</h2>
          <p className="text-xs text-slate-500">
            Jami: {counts.total} ta joy ({counts.xonalar} ta xona, {counts.stollar} ta stol, {counts.sorilar} ta so‘ri)
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={handleOpenAdd}
          className="shadow-sm shadow-emerald-600/20"
        >
          Yangi joy qo‘shish
        </Button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="w-full md:w-72">
            <Input
              placeholder="Qidirish (stol, so‘ri, xona)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Place Type Filters (Tabs) */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                typeFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Barchasi</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/70">
                {counts.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTypeFilter('xona')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                typeFilter === 'xona'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>Xonalar</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  typeFilter === 'xona' ? 'bg-emerald-700 text-white' : 'bg-slate-200/70'
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
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Stollar</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  typeFilter === 'stol' ? 'bg-blue-700 text-white' : 'bg-slate-200/70'
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
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>So‘rilar</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded ${
                  typeFilter === 'sori' ? 'bg-amber-700 text-white' : 'bg-slate-200/70'
                }`}
              >
                {counts.sorilar}
              </span>
            </button>
          </div>
        </div>

        {/* Status Filter Sub-bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Holat:</span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              statusFilter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Barchasi ({counts.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('band')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              statusFilter === 'band'
                ? 'bg-amber-500 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Band ({counts.band})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('bosh')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
              statusFilter === 'bosh'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Bo‘sh ({counts.bosh})
          </button>
        </div>
      </div>

      {/* Grid of Places */}
      {filteredRooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="Hech qanday joy topilmadi"
          description={
            searchQuery
              ? `"${searchQuery}" so‘rovi bo‘yicha hech qanday xona, stol yoki so‘ri mos kelmadi.`
              : 'Tanlangan filtrlar bo‘yicha joylar mavjud emas.'
          }
          actionText="Yangi joy qo‘shish"
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
