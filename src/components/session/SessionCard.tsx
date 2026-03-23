'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Star, Lock, ChevronRight, Footprints, Wind, Target, Zap, CircleDot } from 'lucide-react';
import type { Session, SportType } from '@/types/session';
import { getSport, formatSportStats } from '@/lib/sports';

function SportIcon({ sport, className }: { sport: SportType; className?: string }) {
  const props = { className: className ?? 'w-4 h-4', strokeWidth: 2 };
  switch (sport) {
    case 'running': return <Footprints {...props} />;
    case 'sailing': return <Wind {...props} />;
    case 'basket':  return <Target {...props} />;
    case 'tennis':  return <CircleDot {...props} />;
    case 'foot':    return <Zap {...props} />;
  }
}

function OccupancyBar({ current, max, colorHex }: { current: number; max: number; colorHex: string }) {
  const pct = Math.min(100, (current / max) * 100);
  const isFull = current >= max;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-black/6 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: isFull ? '#EF4444' : colorHex }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
      <span className="text-[11px] font-medium tabular-nums" style={{ color: isFull ? '#EF4444' : '#6B7280' }}>
        {current}/{max}
      </span>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

interface SessionCardProps {
  session: Session;
  index?: number;
  isHighlighted?: boolean;
  onClick?: (session: Session) => void;
  compact?: boolean;
}

export default function SessionCard({ session, index = 0, isHighlighted = false, onClick, compact = false }: SessionCardProps) {
  const sport = getSport(session.sport);
  const statLines = formatSportStats(session.sport, session.stats);
  const isFull = session.current_count >= session.max_participants;
  const spotsLeft = session.max_participants - session.current_count;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(session)}
      className={`relative overflow-hidden cursor-pointer bg-white/90 backdrop-blur-md border rounded-3xl transition-all duration-300 ${isHighlighted ? 'border-transparent shadow-xl shadow-black/10' : 'border-black/[0.06] shadow-sm hover:shadow-lg'} ${compact ? 'p-4' : 'p-5'}`}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl" style={{ background: sport.colorHex, opacity: isHighlighted ? 1 : 0.6 }} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white text-sm font-semibold shadow-sm flex-shrink-0" style={{ background: sport.colorHex }}>
            {session.creator.display_name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-gray-500 truncate">{session.creator.display_name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
              <span className="text-[11px] text-gray-400">{session.creator.avg_rating.toFixed(1)} · {session.creator.review_count} avis</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {session.visibility === 'private' && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full">
              <Lock className="w-2.5 h-2.5 text-gray-400" />
              <span className="text-[10px] font-medium text-gray-400">Privé</span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-white" style={{ background: sport.colorHex }}>
            <SportIcon sport={session.sport} className="w-3 h-3" />
            <span className="text-[11px] font-semibold">{sport.label}</span>
          </div>
        </div>
      </div>

      <h3 className={`font-semibold text-gray-900 leading-snug mb-2 ${compact ? 'text-[14px]' : 'text-[15px]'}`}>{session.title}</h3>

      {!compact && session.description && (
        <p className="text-[13px] text-gray-500 leading-relaxed mb-3 line-clamp-2">{session.description}</p>
      )}

      {statLines.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {statLines.map((line, i) => (
            <span key={i} className="px-2 py-0.5 rounded-lg text-[11px] font-medium" style={{ backgroundColor: `${sport.colorHex}15`, color: sport.colorHex }}>
              {line}
            </span>
          ))}
        </div>
      )}

      <div className="h-px bg-black/[0.05] mb-3" />

      <div className="space-y-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Clock className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-[12px] text-gray-500 truncate">
            {formatDate(session.scheduled_at)} · {formatTime(session.scheduled_at)}
            {session.duration_min && <span className="text-gray-400"> · {session.duration_min}min</span>}
          </span>
        </div>
        <div className="flex items-center gap-1.5 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-[12px] text-gray-500 truncate">{session.venue_name ?? session.address}</span>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Users className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <OccupancyBar current={session.current_count} max={session.max_participants} colorHex={sport.colorHex} />
            </div>
          </div>
          <motion.div whileHover={{ x: 2 }} className="flex items-center gap-1 flex-shrink-0">
            {isFull ? (
              <span className="text-[11px] font-semibold text-red-400 px-2 py-1 bg-red-50 rounded-xl">Complet</span>
            ) : (
              <span className="text-[11px] font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 text-white" style={{ background: sport.colorHex }}>
                {spotsLeft === 1 ? '1 place !' : 'Rejoindre'}
                <ChevronRight className="w-3 h-3" />
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
