export type SportType = 'running' | 'tennis' | 'basket' | 'foot' | 'sailing';
export type SessionVisibility = 'public' | 'private';
export type SessionStatus = 'open' | 'full' | 'ongoing' | 'completed' | 'cancelled';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  avg_rating: number;
  review_count: number;
  sports: SportType[];
}

export interface Session {
  id: string;
  creator: UserProfile;
  title: string;
  description?: string;
  sport: SportType;
  location: Coordinates;
  address: string;
  venue_name?: string;
  scheduled_at: string;
  duration_min?: number;
  max_participants: number;
  current_count: number;
  visibility: SessionVisibility;
  status: SessionStatus;
  stats: Record<string, unknown>;
  results?: Record<string, unknown>;
  created_at: string;
}
