'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Link, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { getSport } from '@/lib/sports';
import type { SportType } from '@/types/session';
import { useSessions } from '@/lib/SessionsContext';

const REVIEWS = [
  { user: 'Sarah M.', rating: 5, comment: 'Super organisateur, session parfaite !', sport: 'running' as SportType, date: 'Il y a 3 jours' },
  { user: 'Marco B.', rating: 5, comment: 'Ponctuel, sympa, bon niveau. Je recommande.', sport: 'basket' as SportType, date: 'Il y a 1 semaine' },
  { user: 'Lucie D.', rating: 4, comment: 'Bonne session, ambiance top.', sport: 'foot' as SportType, date: 'Il y a 2 semaines' },
  { user: 'Pierre V.', rating: 5, comment: 'Excellent équipier, très bon niveau.', sport: 'sailing' as SportType, date: 'Il y a 3 semaines' },
];

const MY_PHOTOS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80', sport: 'running' as SportType, caption: 'Bois de Vincennes', likes: 24, comments: [{ user: 'Sarah M.', text: 'Superbe session !', time: '07h20' }, { user: 'Marco B.', text: 'Top ambiance 💪', time: '08h10' }] },
  { id: '2', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', sport: 'basket' as SportType, caption: 'Pickup République', likes: 18, comments: [{ user: 'Ali K.', text: 'On remet ça !', time: 'Hier' }] },
  { id: '3', url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80', sport: 'tennis' as SportType, caption: 'Luxembourg', likes: 11, comments: [] },
  { id: '4', url: 'https://images.unsplash.com/photo-1500627965408-b5f2c8793f17?w=600&q=80', sport: 'sailing' as SportType, caption: 'Noirmoutier', likes: 33, comments: [{ user: 'Pierre V.', text: 'Belle navigation ⛵', time: 'Sam.' }] },
  { id: '5', url: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80', sport: 'foot' as SportType, caption: 'Saint-Cloud', likes: 9, comments: [] },
  { id: '6', url: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80', sport: 'running' as SportType, caption: 'Trail Montmartre', likes: 27, comments: [{ user: 'Lucie D.', text: 'Magnifique 🌄', time: 'Ven.' }] },
];

const FRIENDS = [
  { id: 'f1', name: 'Sarah M.', username: '@sarah_m', avatar: 'S', sport: 'tennis' as SportType, rating: 4.9, sessions: 41, mutual: 8 },
  { id: 'f2', name: 'Marco B.', username: '@marco_b', avatar: 'M', sport: 'basket' as SportType, rating: 4.6, sessions: 18, mutual: 5 },
  { id: 'f3', name: 'Lucie D.', username: '@lucie_d', avatar: 'L', sport: 'foot' as SportType, rating: 4.7, sessions: 32, mutual: 3 },
  { id: 'f4', name: 'Pierre V.', username: '@pierre_v', avatar: 'P', sport: 'sailing' as SportType, rating: 4.95, sessions: 67, mutual: 12 },
  { id: 'f5', name: 'Ali K.', username: '@ali_k', avatar: 'A', sport: 'basket' as SportType, rating: 4.5, sessions: 12, mutual: 2 },
  { id: 'f6', name: 'Julie R.', username: '@julie_r', avatar: 'J', sport: 'running' as SportType, rating: 4.8, sessions: 29, mutual: 6 },
];

const MY_SPORTS: SportType[] = ['running', 'basket', 'tennis'];

const GLOBAL_STATS = [
  { label: 'Sessions', value: '24' },
  { label: 'Km running', value: '186' },
  { label: 'Note moy.', value: '4.8 ⭐' },
  { label: 'Amis', value: '12' },
];

const SPORT_STATS = [
  { sport: 'running' as SportType, stats: [{ label: 'Sessions', value: '14' }, { label: 'Distance', value: '186 km' }, { label: 'Meilleure allure', value: "4'52\"/km" }, { label: 'D+ total', value: '2 840m' }] },
  { sport: 'basket' as SportType, stats: [{ label: 'Sessions', value: '7' }, { label: 'Points moy.', value: '14 pts' }, { label: 'Passes moy.', value: '4 ast' }, { label: 'Rebonds moy.', value: '6 reb' }] },
  { sport: 'tennis' as SportType, stats: [{ label: 'Sessions', value: '3' }, { label: 'Sets gagnés', value: '8' }, { label: 'Aces', value: '24' }, { label: 'Winners', value: '67' }] },
];

// ─── Modal photo ─────────────────────────────────────────────────────────────
function PhotoModal({ photo, onClose }: { photo: typeof MY_PHOTOS[0]; onClose: () => void }) {
  const sport = getSport(photo.sport);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(photo.likes);
  const [comments, setComments] = useState(photo.comments);
  const [input, setInput] = useState('');

  function sendComment() {
    if (!input.trim()) return;
    setComments(prev => [...prev, { user: 'Moi', text: input.trim(), time: "À l'instant" }]);
    setInput('');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', flexDirection: 'column' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 12, width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'white', margin: 0 }}>{photo.caption}</p>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: `${sport.colorHex}88`, color: 'white' }}>{sport.emoji} {sport.label}</span>
        </div>
      </div>

      {/* Photo */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <img src={photo.url} alt={photo.caption} style={{ width: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>

      {/* Actions + commentaires */}
      <div style={{ background: '#1A1A1A', borderRadius: '24px 24px 0 0', padding: '16px 20px 28px', flexShrink: 0, maxHeight: '45dvh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <motion.button whileTap={{ scale: 0.75 }} onClick={() => { setLiked(v => !v); setLikes(v => liked ? v - 1 : v + 1); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg viewBox="0 0 24 24" fill={liked ? '#EF4444' : 'none'} stroke={liked ? '#EF4444' : 'white'} width={22} height={22} strokeWidth={1.8}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{likes}</span>
          </motion.button>
          <button onClick={() => {}} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" width={22} height={22} strokeWidth={1.8}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{comments.length}</span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12 }}>
          {comments.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', padding: '8px 0' }}>Aucun commentaire</p>}
          {comments.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.user.charAt(0)}</div>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'white' }}>{c.user} </span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{c.text}</span>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{c.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendComment(); }}
            placeholder="Commenter..." style={{ flex: 1, padding: '9px 14px', borderRadius: 20, border: 'none', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
          <motion.button whileTap={{ scale: 0.9 }} onClick={sendComment}
            style={{ width: 36, height: 36, borderRadius: 18, background: input.trim() ? '#111' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            <Send size={15} color="white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Modal ami ───────────────────────────────────────────────────────────────
function FriendModal({ friend, onClose }: { friend: typeof FRIENDS[0]; onClose: () => void }) {
  const sport = getSport(friend.sport);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#FAFAFA', borderRadius: '28px 28px 0 0', width: '100%', padding: '12px 20px 36px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, fontWeight: 700, boxShadow: `0 4px 14px ${sport.colorHex}55` }}>
            {friend.avatar}
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 2px' }}>{friend.name}</h3>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 6px' }}>{friend.username}</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: `${sport.colorHex}15`, color: sport.colorHex }}>{sport.emoji} {sport.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: '#FEF3C7', color: '#92400E' }}>⭐ {friend.rating}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
          {[{ label: 'Sessions', value: friend.sessions }, { label: 'Note', value: friend.rating }, { label: 'Amis communs', value: friend.mutual }].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '12px 8px', textAlign: 'center', border: '0.5px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 2px' }}>{s.value}</p>
              <p style={{ fontSize: 10, color: '#9CA3AF', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            style={{ flex: 1, padding: '13px', borderRadius: 16, background: '#111', border: 'none', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            💬 Envoyer un message
          </motion.button>
          <button onClick={onClose} style={{ padding: '13px 16px', borderRadius: 16, background: '#F3F4F6', border: 'none', fontSize: 13, fontWeight: 600, color: '#6B7280', cursor: 'pointer' }}>
            Voir profil
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal amis ──────────────────────────────────────────────────────────────
function FriendsModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<typeof FRIENDS[0] | null>(null);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          style={{ background: '#FAFAFA', borderRadius: '28px 28px 0 0', width: '100%', maxHeight: '80dvh', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
            <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>Mes amis</h2>
              <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{FRIENDS.length} amis</p>
            </div>
            <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="#6B7280" />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
            {FRIENDS.map((friend, i) => {
              const sport = getSport(friend.sport);
              return (
                <motion.button key={friend.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(friend)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'white', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.06)', marginBottom: 8, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                    {friend.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{friend.name}</p>
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{friend.username} · {friend.mutual} amis communs</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: `${sport.colorHex}15`, color: sport.colorHex }}>{sport.emoji}</span>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {selected && <FriendModal friend={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

// ─── Modal avis ──────────────────────────────────────────────────────────────
function ReviewsModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#FAFAFA', borderRadius: '28px 28px 0 0', width: '100%', maxHeight: '80dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>Avis reçus</h2>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>{REVIEWS.length} avis · Moyenne 4.8 ⭐</p>
          </div>
          <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {REVIEWS.map((review, i) => {
            const sport = getSport(review.sport);
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                style={{ background: 'white', borderRadius: 18, border: '0.5px solid rgba(0,0,0,0.06)', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 11, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>{review.user.charAt(0)}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0 }}>{review.user}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{review.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span key={j} style={{ fontSize: 13, color: j < review.rating ? '#F59E0B' : '#E5E7EB' }}>★</span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: '#374151', margin: '0 0 8px', lineHeight: 1.5 }}>{review.comment}</p>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: `${sport.colorHex}15`, color: sport.colorHex }}>{sport.emoji} {sport.label}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal partage ────────────────────────────────────────────────────────────
function ShareProfileModal({ profile, onClose }: { profile: { name: string; username: string }; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = `https://ants.app/profile/${profile.username.replace('@', '')}`;

  function copy() {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#FAFAFA', borderRadius: '28px 28px 0 0', width: '100%', padding: '12px 20px 36px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Partager mon profil</h3>
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 16px' }}>{url}</p>

        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'WhatsApp', color: '#25D366', icon: '💬' },
            { label: 'Instagram', color: '#E1306C', icon: '📸' },
            { label: 'SMS', color: '#5856D6', icon: '✉️' },
          ].map(s => (
            <button key={s.label}
              style={{ flex: 1, padding: '14px 8px', borderRadius: 16, background: s.color, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{s.label}</span>
            </button>
          ))}
        </div>

        <motion.button whileTap={{ scale: 0.97 }} onClick={copy}
          style={{ width: '100%', padding: '13px', borderRadius: 16, background: copied ? '#10B981' : '#111', border: 'none', color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s', marginBottom: 10 }}>
          {copied ? <Check size={18} /> : <Link size={18} />}
          {copied ? 'Lien copié !' : 'Copier le lien'}
        </motion.button>

        <button onClick={onClose} style={{ width: '100%', padding: '13px', borderRadius: 16, background: '#F3F4F6', border: 'none', fontSize: 14, fontWeight: 600, color: '#6B7280', cursor: 'pointer' }}>
          Annuler
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal édition ────────────────────────────────────────────────────────────
function EditProfileModal({ profile, onSave, onClose }: { profile: { name: string; username: string; city: string; bio: string; isPublic: boolean; avatar: string }; onSave: (p: typeof profile) => void; onClose: () => void }) {
  const [form, setForm] = useState(profile);
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, avatar: URL.createObjectURL(file) }));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#FAFAFA', borderRadius: '28px 28px 0 0', width: '100%', maxHeight: '90dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: 0 }}>Modifier le profil</h2>
          <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative' }}>
              {form.avatar ? (
                <img src={form.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: 26, objectFit: 'cover', border: '3px solid white', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }} />
              ) : (
                <div style={{ width: 80, height: 80, borderRadius: 26, background: 'linear-gradient(135deg, #F97316, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: 'white', fontWeight: 700 }}>
                  {form.name.charAt(0)}
                </div>
              )}
              <button onClick={() => fileRef.current?.click()}
                style={{ position: 'absolute', bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, background: '#111', border: '2px solid white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" width={14} height={14} strokeWidth={2}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </button>
            </div>
            <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', fontSize: 13, fontWeight: 600, color: '#6B7280', cursor: 'pointer' }}>Changer la photo</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>

          {[
            { label: 'NOM AFFICHÉ', key: 'name', placeholder: 'Ton prénom et initiale' },
            { label: "NOM D'UTILISATEUR", key: 'username', placeholder: '@username' },
            { label: 'VILLE', key: 'city', placeholder: 'Paris, Lyon...' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', display: 'block', marginBottom: 6, letterSpacing: 1 }}>{field.label}</label>
              <input value={String((form as Record<string, unknown>)[field.key] ?? "")} onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                placeholder={field.placeholder} style={{ width: '100%', padding: '11px 14px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }} />
            </div>
          ))}

          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', display: 'block', marginBottom: 6, letterSpacing: 1 }}>BIO</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Décris-toi en quelques mots..." rows={3}
              style={{ width: '100%', padding: '11px 14px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', background: 'white' }} />
          </div>

          <div style={{ background: 'white', borderRadius: 18, border: '1.5px solid rgba(0,0,0,0.08)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{form.isPublic ? 'Profil public' : 'Profil privé'}</p>
                <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{form.isPublic ? 'Tout le monde peut te voir' : 'Seuls tes amis peuvent te voir'}</p>
              </div>
              <button onClick={() => setForm(f => ({ ...f, isPublic: !f.isPublic }))}
                style={{ width: 50, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer', background: form.isPublic ? '#111' : '#E5E7EB', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <motion.div animate={{ x: form.isPublic ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ width: 22, height: 22, borderRadius: 11, background: 'white', position: 'absolute', top: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 20px 28px' }}>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => { onSave(form); onClose(); }}
            style={{ width: '100%', padding: '14px', borderRadius: 16, border: 'none', background: '#111', fontSize: 14, fontWeight: 700, color: 'white', cursor: 'pointer' }}>
            Enregistrer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { sessions } = useSessions();
  const mySessions = sessions.filter(s => s.creator.id === 'me');

  const [profile, setProfile] = useState({ name: 'Thomas R.', username: '@thomas_r', city: 'Paris 🇫🇷', bio: 'Passionné de running et de basket. Toujours partant pour une nouvelle session !', isPublic: true, avatar: '' });
  const [showEdit, setShowEdit] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'stats'>('photos');
  const [selectedPhoto, setSelectedPhoto] = useState<typeof MY_PHOTOS[0] | null>(null);

  return (
    <div style={{ minHeight: '100%', background: '#F9F9F9', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '20px 20px 0', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {profile.avatar ? (
              <img src={profile.avatar} alt="avatar" style={{ width: 76, height: 76, borderRadius: 24, objectFit: 'cover', boxShadow: '0 4px 14px rgba(0,0,0,0.12)' }} />
            ) : (
              <div style={{ width: 76, height: 76, borderRadius: 24, background: 'linear-gradient(135deg, #F97316, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'white', fontWeight: 700, boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}>
                {profile.name.charAt(0)}
              </div>
            )}
            <div style={{ position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, background: profile.isPublic ? '#10B981' : '#6B7280', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {profile.isPublic
                ? <svg viewBox="0 0 24 24" fill="none" stroke="white" width={11} height={11} strokeWidth={2.5}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="white" width={11} height={11} strokeWidth={2.5}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              }
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 2px' }}>{profile.name}</h2>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '0 0 4px' }}>{profile.username} · {profile.city}</p>
            {profile.bio && <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px', lineHeight: 1.4 }}>{profile.bio}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {MY_SPORTS.map(s => { const sport = getSport(s); return (
                <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: `${sport.colorHex}15`, color: sport.colorHex }}>{sport.emoji} {sport.label}</span>
              );})}
            </div>
          </div>
        </div>

        {/* Stats — amis cliquables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
          {GLOBAL_STATS.map((stat, i) => (
            <motion.div key={stat.label} whileTap={{ scale: 0.95 }}
              onClick={stat.label === 'Amis' ? () => setShowFriends(true) : undefined}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: stat.label === 'Amis' ? '#F9FAFB' : '#F9FAFB', borderRadius: 14, padding: '10px 6px', textAlign: 'center', cursor: stat.label === 'Amis' ? 'pointer' : 'default', border: stat.label === 'Amis' ? '1.5px solid rgba(0,0,0,0.08)' : '1px solid transparent' }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 1px' }}>{stat.value}</p>
              <p style={{ fontSize: 10, color: stat.label === 'Amis' ? '#6B7280' : '#9CA3AF', margin: 0, fontWeight: stat.label === 'Amis' ? 600 : 400 }}>{stat.label} {stat.label === 'Amis' ? '›' : ''}</p>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowEdit(true)}
            style={{ flex: 1, padding: '10px', borderRadius: 14, background: '#111', border: 'none', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" width={14} height={14} strokeWidth={2}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Modifier
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowReviews(true)}
            style={{ padding: '10px 12px', borderRadius: 14, background: '#FEF3C7', border: 'none', fontSize: 13, fontWeight: 600, color: '#92400E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" width={14} height={14} strokeWidth={1}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {REVIEWS.length} avis
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowShare(true)}
            style={{ padding: '10px 12px', borderRadius: 14, background: '#F3F4F6', border: 'none', fontSize: 13, fontWeight: 600, color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link size={16} color="#6B7280" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          {(['photos', 'stats'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #111' : '2px solid transparent', fontSize: 13, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? '#111' : '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {tab === 'photos'
                ? <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width={14} height={14} strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Photos</>
                : <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width={14} height={14} strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> Stats</>
              }
            </button>
          ))}
        </div>
      </div>

      {/* Contenu tabs */}
      <AnimatePresence mode="wait">
        {activeTab === 'photos' && (
          <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {mySessions.length > 0 && (
              <div style={{ padding: '16px 16px 0' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Sessions publiées</p>
                {mySessions.map(s => {
                  const sport = getSport(s.sport);
                  return (
                    <div key={s.id} style={{ background: 'white', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.06)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 11, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{sport.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</p>
                        <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0' }}>{s.address} · {s.current_count}/{s.max_participants}</p>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: '#F0FDF4', color: '#16A34A', flexShrink: 0 }}>Live</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ padding: '16px' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Mes photos</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                {MY_PHOTOS.map((photo, i) => {
                  const sport = getSport(photo.sport);
                  return (
                    <motion.div key={photo.id} whileTap={{ scale: 0.96 }}
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}
                      onClick={() => setSelectedPhoto(photo)}
                      style={{ position: 'relative', aspectRatio: '1', borderRadius: i === 0 ? '14px 0 0 0' : i === 2 ? '0 14px 0 0' : 0, overflow: 'hidden', cursor: 'pointer' }}>
                      <img src={photo.url} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s' }} />
                      <div style={{ position: 'absolute', bottom: 4, left: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: '2px 5px', color: 'white', fontWeight: 600 }}>{sport.emoji}</span>
                        <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 8, padding: '2px 5px', color: 'white', fontWeight: 600 }}>♥ {photo.likes}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '16px' }}>
            {SPORT_STATS.map((s, i) => {
              const sport = getSport(s.sport);
              return (
                <motion.div key={s.sport} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ background: 'white', borderRadius: 22, border: '0.5px solid rgba(0,0,0,0.06)', marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ height: 4, background: sport.colorHex }} />
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{sport.emoji}</div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{sport.label}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {s.stats.map(stat => (
                        <div key={stat.label} style={{ background: '#F9FAFB', borderRadius: 12, padding: '10px 12px' }}>
                          <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 3px', textTransform: 'uppercase', letterSpacing: 0.3 }}>{stat.label}</p>
                          <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {selectedPhoto && <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
        {showEdit && <EditProfileModal profile={profile} onSave={setProfile} onClose={() => setShowEdit(false)} />}
        {showReviews && <ReviewsModal onClose={() => setShowReviews(false)} />}
        {showShare && <ShareProfileModal profile={profile} onClose={() => setShowShare(false)} />}
        {showFriends && <FriendsModal onClose={() => setShowFriends(false)} />}
      </AnimatePresence>
    </div>
  );
}
