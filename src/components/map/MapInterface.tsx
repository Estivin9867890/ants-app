'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Map, Locate, RefreshCw, Plus } from 'lucide-react';
import type { Session } from '@/types/session';
import { useSessions } from "@/lib/SessionsContext";
import SessionCard from '@/components/session/SessionCard';
import SessionFilters, { FilterState, DEFAULT_FILTERS } from '@/components/session/SessionFilters';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
      <Map className="w-8 h-8 text-gray-300" />
    </div>
  ),
});

export interface MapBounds { north: number; south: number; east: number; west: number; }
export interface MapCenter { lat: number; lng: number; zoom: number; }

const DEFAULT_CENTER: MapCenter = { lat: 48.8566, lng: 2.3522, zoom: 12 };

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function filterSessions(sessions: Session[], filters: FilterState, bounds: MapBounds | null, center: MapCenter): Session[] {
  return sessions.filter(s => {
    if (filters.sports.length > 0 && !filters.sports.includes(s.sport)) return false;
    if (filters.visibility === 'public' && s.visibility !== 'public') return false;
    if (filters.visibility === 'private' && s.visibility !== 'private') return false;
    if (filters.status === 'open' && s.status !== 'open') return false;
    if (filters.status === 'full' && s.status !== 'full') return false;
    const spotsLeft = s.max_participants - s.current_count;
    if (spotsLeft < filters.minSpots) return false;
    if (bounds) {
      if (s.location.lat < bounds.south || s.location.lat > bounds.north || s.location.lng < bounds.west || s.location.lng > bounds.east) return false;
    } else {
      const dist = haversineDistance(center.lat, center.lng, s.location.lat, s.location.lng);
      if (dist > filters.maxDistance) return false;
    }
    return true;
  });
}

type ViewMode = 'split' | 'map' | 'list';

export default function MapInterface({ onNewSession }: { onNewSession?: () => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [mapCenter, setMapCenter] = useState<MapCenter>(DEFAULT_CENTER);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const { sessions } = useSessions();
  const filteredSessions = useMemo(
    () => filterSessions(sessions, filters, mapBounds, mapCenter),
    [filters, mapBounds, mapCenter, sessions]
  );

  useEffect(() => {
    if (!selectedId || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-session-id="${selectedId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedId]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setMapCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude, zoom: 13 }); setIsLocating(false); },
      () => setIsLocating(false),
      { timeout: 6000 }
    );
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const handleMapMove = useCallback((center: MapCenter, bounds: MapBounds) => {
    setMapCenter(center);
    setMapBounds(bounds);
  }, []);

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedId(id);
    setHoveredId(id);
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#F9F9F9]">
      <div className="flex-shrink-0 px-4 pt-4 pb-3 space-y-3 bg-white/80 backdrop-blur-md border-b border-black/[0.04]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">🐜 Explorer</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">{filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} · {filters.maxDistance} km</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
              {(['split', 'list', 'map'] as const).map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-150 ${viewMode === mode ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>
                  {mode === 'split' ? 'Split' : mode === 'list' ? 'Liste' : 'Carte'}
                </button>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onNewSession}
              className="w-9 h-9 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-md">
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
        <SessionFilters filters={filters} onChange={setFilters} resultCount={filteredSessions.length} />
      </div>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <AnimatePresence initial={false}>
          {viewMode !== 'list' && (
            <motion.div key="map-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className={`relative flex-shrink-0 ${viewMode === 'map' ? 'w-full' : 'w-[55%]'} h-full`}>
              <MapView sessions={filteredSessions} center={mapCenter} hoveredId={hoveredId} selectedId={selectedId} onMove={handleMapMove} onMarkerClick={handleMarkerClick} onMarkerHover={setHoveredId} />
              <div className="absolute bottom-6 right-4 flex flex-col gap-2">
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={handleLocate}
                  className="w-11 h-11 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl flex items-center justify-center border border-black/[0.06]">
                  <Locate className={`w-5 h-5 ${isLocating ? 'text-blue-500 animate-pulse' : 'text-gray-700'}`} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={handleRefresh}
                  className="w-11 h-11 bg-white/95 backdrop-blur-md shadow-lg rounded-2xl flex items-center justify-center border border-black/[0.06]">
                  <RefreshCw className={`w-5 h-5 text-gray-700 ${isRefreshing ? 'animate-spin' : ''}`} />
                </motion.button>
              </div>
              <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-black/[0.06] text-[12px] font-semibold text-gray-700 whitespace-nowrap">
                  {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''} dans cette zone
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {viewMode === 'split' && <div className="w-px bg-black/[0.05] flex-shrink-0" />}

        <AnimatePresence initial={false}>
          {viewMode !== 'map' && (
            <motion.div key="list-pane" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              ref={listRef} className="flex-1 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'none' }}>
              {filteredSessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[300px] px-8 text-center">
                  <div className="text-5xl mb-4">🐜</div>
                  <h3 className="text-[16px] font-semibold text-gray-800 mb-1">Aucune session trouvée</h3>
                  <p className="text-[13px] text-gray-400 mb-6">Déplace la carte ou modifie les filtres.</p>
                  <button onClick={() => setFilters(DEFAULT_FILTERS)} className="px-4 py-2.5 bg-gray-900 text-white text-[13px] font-semibold rounded-2xl">Réinitialiser</button>
                </div>
              ) : (
                <div className="p-3 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filteredSessions.map((session, i) => (
                      <div key={session.id} data-session-id={session.id}>
                        <SessionCard session={session} index={i}
                          isHighlighted={hoveredId === session.id || selectedId === session.id}
                          compact={viewMode === 'split'}
                          onClick={s => { setSelectedId(s.id); setHoveredId(s.id); }} />
                      </div>
                    ))}
                  </AnimatePresence>
                  <div className="h-8" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
