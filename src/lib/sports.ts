import type { SportType } from '@/types/session';

export interface SportConfig {
  id: SportType;
  label: string;
  emoji: string;
  color: string;
  colorHex: string;
  textColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  icon: string;
  statsFields: string[];
}

export const SPORTS: Record<SportType, SportConfig> = {
  running: {
    id: 'running', label: 'Running', emoji: '👟',
    color: 'bg-orange-500', colorHex: '#F97316', textColor: 'text-orange-600',
    borderColor: 'border-orange-200', gradientFrom: 'from-orange-400', gradientTo: 'to-red-500',
    icon: 'Footprints', statsFields: ['distance_km', 'pace_target', 'elevation_m'],
  },
  tennis: {
    id: 'tennis', label: 'Tennis', emoji: '🎾',
    color: 'bg-lime-500', colorHex: '#84CC16', textColor: 'text-lime-600',
    borderColor: 'border-lime-200', gradientFrom: 'from-lime-400', gradientTo: 'to-green-500',
    icon: 'CircleDot', statsFields: ['sets', 'surface', 'format'],
  },
  basket: {
    id: 'basket', label: 'Basket', emoji: '🏀',
    color: 'bg-amber-500', colorHex: '#F59E0B', textColor: 'text-amber-600',
    borderColor: 'border-amber-200', gradientFrom: 'from-amber-400', gradientTo: 'to-orange-500',
    icon: 'Target', statsFields: ['format', 'half_duration_min', 'indoor'],
  },
  foot: {
    id: 'foot', label: 'Foot', emoji: '⚽',
    color: 'bg-emerald-500', colorHex: '#10B981', textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200', gradientFrom: 'from-emerald-400', gradientTo: 'to-teal-500',
    icon: 'CircleDot', statsFields: ['format', 'surface', 'pitch_size'],
  },
  sailing: {
    id: 'sailing', label: 'Voile', emoji: '⛵',
    color: 'bg-sky-500', colorHex: '#0EA5E9', textColor: 'text-sky-600',
    borderColor: 'border-sky-200', gradientFrom: 'from-sky-400', gradientTo: 'to-blue-600',
    icon: 'Wind', statsFields: ['boat_type', 'wind_min_knots', 'distance_nm'],
  },
};

export const SPORT_LIST = Object.values(SPORTS);

export function getSport(type: SportType): SportConfig {
  return SPORTS[type];
}

export function formatSportStats(sport: SportType, stats: Record<string, unknown>): string[] {
  const lines: string[] = [];
  switch (sport) {
    case 'running':
      if (stats.distance_km) lines.push(`${stats.distance_km} km`);
      if (stats.pace_target) lines.push(`Allure ${stats.pace_target} /km`);
      if (stats.elevation_m) lines.push(`+${stats.elevation_m}m D+`);
      break;
    case 'tennis':
      if (stats.sets) lines.push(`${stats.sets} sets`);
      if (stats.surface) lines.push(stats.surface as string);
      if (stats.format) lines.push(stats.format as string);
      break;
    case 'basket':
      if (stats.format) lines.push(stats.format as string);
      if (stats.half_duration_min) lines.push(`${stats.half_duration_min}min / mi-temps`);
      if (stats.indoor) lines.push('Indoor');
      break;
    case 'foot':
      if (stats.format) lines.push(stats.format as string);
      if (stats.surface) lines.push(stats.surface as string);
      break;
    case 'sailing':
      if (stats.boat_type) lines.push(stats.boat_type as string);
      if (stats.wind_min_knots) lines.push(`Vent > ${stats.wind_min_knots} nœuds`);
      if (stats.distance_nm) lines.push(`${stats.distance_nm} nm`);
      break;
  }
  return lines;
}
