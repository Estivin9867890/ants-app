'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, BarChart2, Plus, Layers, User } from 'lucide-react';
import MapInterface from '@/components/map/MapInterface';
import SessionsPage from '@/components/pages/SessionsPage';
import FeedPage from '@/components/pages/FeedPage';
import ProfilePage from '@/components/pages/ProfilePage';
import NewSessionModal from '@/components/session/NewSessionModal';

type Tab = 'explore' | 'feed' | 'sessions' | 'profile';

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>('explore');
  const [showNewSession, setShowNewSession] = useState(false);

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: '#F9F9F9' }}>
      <div style={{ flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden', isolation: 'isolate' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'explore' && (
            <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: '100%' }}>
              <MapInterface onNewSession={() => setShowNewSession(true)} />
            </motion.div>
          )}
          {activeTab === 'feed' && (
            <motion.div key="feed" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ height: '100%', overflowY: 'auto' }}>
              <FeedPage />
            </motion.div>
          )}
          {activeTab === 'sessions' && (
            <motion.div key="sessions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ height: '100%', overflowY: 'auto' }}>
              <SessionsPage />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ height: '100%', overflowY: 'auto' }}>
              <ProfilePage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar avec Lucide icons */}
      <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', paddingBottom: 'env(safe-area-inset-bottom)', flexShrink: 0, zIndex: 50 }}>
        <TabButton icon={<Map size={22} strokeWidth={activeTab === 'explore' ? 2.5 : 1.8} />} label="Explorer" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
        <TabButton icon={<BarChart2 size={22} strokeWidth={activeTab === 'feed' ? 2.5 : 1.8} />} label="Feed" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />

        {/* Bouton + central */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '6px 0' }}>
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => setShowNewSession(true)}
            style={{ width: 52, height: 52, background: '#111', borderRadius: 18, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', marginTop: -20 }}
          >
            <Plus size={26} color="white" strokeWidth={2} />
          </motion.button>
        </div>

        <TabButton icon={<Layers size={22} strokeWidth={activeTab === 'sessions' ? 2.5 : 1.8} />} label="Sessions" active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} />
        <TabButton icon={<User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />} label="Profil" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </div>

      <AnimatePresence>
        {showNewSession && <NewSessionModal onClose={() => setShowNewSession(false)} />}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 0 6px', background: 'none', border: 'none', cursor: 'pointer', color: active ? '#111' : '#9CA3AF', transition: 'color 0.2s' }}>
      <motion.div animate={{ scale: active ? 1.1 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
        {icon}
      </motion.div>
      <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{label}</span>
      {active && <motion.div layoutId="tab-dot" style={{ width: 4, height: 4, borderRadius: 2, background: '#111' }} />}
    </button>
  );
}
