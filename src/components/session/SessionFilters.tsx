'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footprints, Wind, Target, Zap, CircleDot, SlidersHorizontal, X, CalendarDays, Users2 } from 'lucide-react';
import type { SportType } from '@/types/session';
import { SPORT_LIST, getSport } from '@/lib/sports';

export interface FilterState {
  sports: SportType[];
  status: 'open' | 'full' | 'all';
  visibility: 'public' | 'private' | 'all';
  maxDistance: number;
  dateRange: 'today' | 'week' | 'month' | 'all';
  minSpots: number;
}

export const DEFAULT_FILTERS: FilterState = {
  sports: [], status: 'open', visibility: 'all',
  maxDistance: 20, dateRange: 'all', minSpots: 1,
};

function countActiveFilters(f: FilterState): number {
  let n = 0;
  if (f.sports.length > 0) n++;
  if (f.status !== 'open') n++;
  if (f.visibility !== 'all') n++;
  if (f.maxDistance !== 20) n++;
  if (f.dateRange !== 'all') n++;
  if (f.minSpots !== 1) n++;
  return n;
}

function SportIcon({ sport, size = 16 }: { sport: SportType; size?: number }) {
  const props = { width: size, height: size, strokeWidth: 2 };
  switch (sport) {
    case 'running': return <Footprints {...props} />;
    case 'sailing': return <Wind {...props} />;
    case 'basket':  return <Target {...props} />;
    case 'tennis':  return <CircleDot {...props} />;
    case 'foot':    return <Zap {...props} />;
  }
}

function SportChip({ sportId, isSelected, onToggle }: { sportId: SportType; isSelected: boolean; onToggle: (id: SportType) => void }) {
  const config = getSport(sportId);
  return (
    <motion.button
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
      onClick={() => onToggle(sportId)}
      className="relative flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[13px] font-semibold transition-all duration-200 select-none"
      style={isSelected
        ? { background: config.colorHex, color: '#fff', boxShadow: `0 4px 14px ${config.colorHex}55` }
        : { background: `${config.colorHex}12`, color: config.colorHex }}
    >
      <SportIcon sport={sportId} size={14} />
      <span>{config.label}</span>
    </motion.button>
  );
}

function ActiveTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 bg-gray-900 rounded-full">
      <span className="text-[11px] font-medium text-white">{label}</span>
      <button onClick={onRemove} className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
        <X className="w-2.5 h-2.5 text-white" />
      </button>
    </motion.div>
  );
}

interface SessionFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount?: number;
}

export default function SessionFilters({ filters, onChange, resultCount }: SessionFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeCount = countActiveFilters(filters);

  const toggleSport = (sport: SportType) => {
    const updated = filters.sports.includes(sport)
      ? filters.sports.filter(s => s !== sport)
      : [...filters.sports, sport];
    onChange({ ...filters, sports: updated });
  };

  const set = <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
    onChange({ ...filters, [key]: val });

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="flex items-center gap-2 pr-2" style={{ width: 'max-content' }}>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => onChange({ ...filters, sports: [] })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[13px] font-semibold transition-all duration-200 ${filters.sports.length === 0 ? 'bg-gray-900 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
              Tous
              {resultCount !== undefined && filters.sports.length === 0 && (
                <span className="text-[11px] opacity-70 ml-0.5">{resultCount}</span>
              )}
            </motion.button>
            {SPORT_LIST.map(sport => (
              <SportChip key={sport.id} sportId={sport.id} isSelected={filters.sports.includes(sport.id)} onToggle={toggleSport} />
            ))}
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdvanced(v => !v)}
          className={`relative flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200 ${showAdvanced || activeCount > 0 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
          <SlidersHorizontal className="w-4 h-4" />
          {activeCount > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-[9px] font-bold text-white">{activeCount}</span>
            </motion.div>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="flex flex-wrap gap-1.5 pt-2">
              {filters.status !== 'open' && <ActiveTag label={filters.status === 'all' ? 'Tous statuts' : 'Complet'} onRemove={() => set('status', 'open')} />}
              {filters.visibility !== 'all' && <ActiveTag label={filters.visibility === 'public' ? 'Public' : 'Amis'} onRemove={() => set('visibility', 'all')} />}
              {filters.dateRange !== 'all' && <ActiveTag label={{ today: "Aujourd'hui", week: 'Cette semaine', month: 'Ce mois' }[filters.dateRange] ?? ''} onRemove={() => set('dateRange', 'all')} />}
              {filters.maxDistance !== 20 && <ActiveTag label={`${filters.maxDistance} km`} onRemove={() => set('maxDistance', 20)} />}
              {filters.minSpots !== 1 && <ActiveTag label={`${filters.minSpots}+ places`} onRemove={() => set('minSpots', 1)} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-black/[0.06] rounded-3xl shadow-2xl p-5 z-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[14px] font-semibold text-gray-900">Filtres avancés</span>
              <button onClick={() => setShowAdvanced(false)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Statut</p>
                <div className="flex gap-2">
                  {(['open', 'all', 'full'] as const).map(v => (
                    <button key={v} onClick={() => set('status', v)}
                      className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all ${filters.status === v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {v === 'open' ? 'Places dispo' : v === 'full' ? 'Complet' : 'Tous'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CalendarDays className="w-3 h-3" />Période
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {([{ v: 'today', l: "Auj." }, { v: 'week', l: 'Semaine' }, { v: 'month', l: 'Mois' }, { v: 'all', l: 'Tout' }] as const).map(({ v, l }) => (
                    <button key={v} onClick={() => set('dateRange', v)}
                      className={`py-2 rounded-xl text-[11px] font-semibold transition-all ${filters.dateRange === v ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Distance max</p>
                  <span className="text-[13px] font-semibold text-gray-900">{filters.maxDistance} km</span>
                </div>
                <input type="range" min={1} max={50} step={1} value={filters.maxDistance}
                  onChange={e => set('maxDistance', Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-gray-200 accent-gray-900" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users2 className="w-3 h-3" />Places min.
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 5].map(n => (
                    <button key={n} onClick={() => set('minSpots', n)}
                      className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all ${filters.minSpots === n ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {n}+
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => onChange(DEFAULT_FILTERS)}
                className="w-full py-3 rounded-2xl border border-black/10 text-[13px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
                Réinitialiser
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
