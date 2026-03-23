'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessions } from '@/lib/SessionsContext';
import { getSport } from '@/lib/sports';
import ChatRoom from '@/components/chat/ChatRoom';

export default function SessionsPage() {
  const [activeTab, setActiveTab] = useState<'mes' | 'rejointes'>('mes');
  const [openChat, setOpenChat] = useState<string | null>(null);
  const { sessions } = useSessions();

  const mesSessions = sessions.filter(s => s.creator.id === 'me');
  const rejointes = sessions.filter(s => s.creator.id !== 'me').slice(0, 3);
  const displayed = activeTab === 'mes' ? mesSessions : rejointes;

  if (openChat) {
    const session = sessions.find(s => s.id === openChat);
    if (session) return <ChatRoom session={session} onBack={() => setOpenChat(null)} />;
  }

  return (
    <div style={{ minHeight: '100%', background: '#F9F9F9', paddingBottom: 32 }}>
      <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(0,0,0,0.06)', padding: '16px 20px 0', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 14px' }}>🐜 Mes Sessions</h1>
        <div style={{ display: 'flex', gap: 0 }}>
          {(['mes', 'rejointes'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #111' : '2px solid transparent', fontSize: 13, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? '#111' : '#9CA3AF', cursor: 'pointer', transition: 'all 0.2s' }}>
              {tab === 'mes' ? 'Créées par moi' : 'Rejointes'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {displayed.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🐜</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#111', margin: '0 0 6px' }}>
              {activeTab === 'mes' ? 'Aucune session créée' : 'Aucune session rejointe'}
            </p>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>
              {activeTab === 'mes' ? 'Appuie sur + pour publier une annonce' : 'Explore la carte pour rejoindre une session'}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {displayed.map((session, i) => {
              const sport = getSport(session.sport);
              const spotsLeft = session.max_participants - session.current_count;
              return (
                <motion.div key={session.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ delay: i * 0.06 }}
                  style={{ background: 'white', borderRadius: 22, border: '0.5px solid rgba(0,0,0,0.06)', marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: 4, background: sport.colorHex }} />
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 12, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                          {sport.emoji}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: 0 }}>{session.title}</p>
                          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '2px 0 0' }}>{session.venue_name ?? session.address}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: spotsLeft > 0 ? '#F0FDF4' : '#FEF2F2', color: spotsLeft > 0 ? '#16A34A' : '#EF4444' }}>
                        {spotsLeft > 0 ? `${spotsLeft} places` : 'Complet'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: '#6B7280', marginBottom: 12 }}>
                      <span>📅 {new Date(session.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                      <span>👥 {session.current_count}/{session.max_participants}</span>
                      <span>{session.visibility === 'private' ? '🔒 Privé' : '🌍 Public'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <motion.button whileTap={{ scale: 0.96 }} onClick={() => setOpenChat(session.id)}
                        style={{ flex: 1, padding: '10px', borderRadius: 12, background: '#111', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        💬 Chat du groupe
                      </motion.button>
                      {activeTab === 'mes' && (
                        <motion.button whileTap={{ scale: 0.96 }}
                          style={{ padding: '10px 14px', borderRadius: 12, background: '#F3F4F6', border: 'none', fontSize: 13, fontWeight: 600, color: '#6B7280', cursor: 'pointer' }}>
                          ✏️ Gérer
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
