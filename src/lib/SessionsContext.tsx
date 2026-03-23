'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Session, SportType } from '@/types/session';
import { MOCK_SESSIONS } from '@/data/mock/sessions';

interface NewSessionInput {
  sport: SportType;
  title: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  visibility: 'public' | 'private';
  date: string;
  time: string;
  places: number;
}

interface SessionsContextType {
  sessions: Session[];
  addSession: (input: NewSessionInput) => void;
}

const SessionsContext = createContext<SessionsContextType>({
  sessions: MOCK_SESSIONS,
  addSession: () => {},
});

export function SessionsProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);

  function addSession(input: NewSessionInput) {
    const newSession: Session = {
      id: `user-${Date.now()}`,
      creator: {
        id: 'me',
        username: 'moi',
        display_name: 'Moi',
        avg_rating: 5.0,
        review_count: 0,
        sports: [input.sport],
      },
      title: input.title,
      description: input.description,
      sport: input.sport,
      location: { lat: input.lat, lng: input.lng },
      address: input.address,
      venue_name: input.address,
      scheduled_at: `${input.date}T${input.time}:00Z`,
      duration_min: 60,
      max_participants: input.places,
      current_count: 1,
      visibility: input.visibility,
      status: 'open',
      stats: {},
      created_at: new Date().toISOString(),
    };
    setSessions(prev => [newSession, ...prev]);
  }

  return (
    <SessionsContext.Provider value={{ sessions, addSession }}>
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  return useContext(SessionsContext);
}
