import React, { useState, useMemo } from 'react';
import { Search, DoorOpen } from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { RoomCard } from '../features/rooms/RoomCard';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';

export function RoomsPage() {
  const { rooms, activeOrders } = usePOSStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'bosh' | 'band'

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

  const counts = useMemo(() => {
    const total = rooms.length;
    const band = rooms.filter((r) => r.status === 'band').length;
    const bosh = total - band;
    return { total, band, bosh };
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
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
  }, [rooms, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Controls: Search and Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full md:w-80">
          <Input
            placeholder="Xona raqami yoki nomini qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Barchasi</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                statusFilter === 'all' ? 'bg-slate-100 text-slate-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('band')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'band'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Band xonalar</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                statusFilter === 'band' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.band}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('bosh')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              statusFilter === 'bosh'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Bo‘sh xonalar</span>
            <span
              className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                statusFilter === 'bosh' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {counts.bosh}
            </span>
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title="Xona topilmadi"
          description={
            searchQuery
              ? `"${searchQuery}" bo‘yicha hech qanday xona mos kelmadi.`
              : 'Tanlangan filtr bo‘yicha xonalar mavjud emas.'
          }
          actionText="Qidiruvni tozalash"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              activeOrder={activeOrdersByRoom[room.id] || null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
