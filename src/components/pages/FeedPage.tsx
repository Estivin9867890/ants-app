'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send, X, ChevronDown } from 'lucide-react';
import { getSport } from '@/lib/sports';
import type { SportType } from '@/types/session';

const FEED_ITEMS = [
  { id: '1', user: 'Thomas R.', avatar: 'T', sport: 'running' as SportType, title: 'Footing matinal — Bois de Vincennes', caption: 'Magnifique lever de soleil ce matin sur le lac 🌅 10km dans les jambes, café mérité !', date: "Aujourd'hui · 07h12", photo: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80', likes: 24, stats: { 'Distance': '10.2 km', 'Allure': "5'28\"/km", 'Vitesse': '11.0 km/h', 'Durée': '55 min' }, comments: [{ user: 'Sarah M.', text: 'Trop bien ! Je veux venir la prochaine fois 🏃‍♀️', time: '07h20' }, { user: 'Marco B.', text: 'Respect pour le lever tôt 💪', time: '08h10' }] },
  { id: '2', user: 'Pierre V.', avatar: 'P', sport: 'sailing' as SportType, title: 'Régate côtière — Noirmoutier', caption: "Conditions parfaites aujourd'hui, vent soutenu à 15 nœuds. Belle navigation en équipe ⛵", date: 'Hier · 14h30', photo: 'https://images.unsplash.com/photo-1500627965408-b5f2c8793f17?w=600&q=80', likes: 41, stats: { 'Distance': '28 nm', 'Moy.': '12.3 nœuds', 'Max': '18.1 nœuds', 'Durée': '4h20' }, comments: [{ user: 'Lucie D.', text: 'Superbe photo ! ⛵', time: '15h00' }] },
  { id: '3', user: 'Marco B.', avatar: 'M', sport: 'basket' as SportType, title: 'Pickup 3v3 — République', caption: "Game serré jusqu'à la dernière seconde. On revient la semaine prochaine 🏀🔥", date: 'Lun. · 18h00', photo: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&q=80', likes: 18, stats: { 'Points': '18 pts', 'Passes': '5 ast', 'Rebonds': '7 reb', 'Durée': '1h' }, comments: [] },
  { id: '4', user: 'Lucie D.', avatar: 'L', sport: 'foot' as SportType, title: 'Match 5v5 — Porte de Saint-Cloud', caption: 'Victoire 4-2 ! Une belle équipe soudée, rendez-vous samedi prochain ⚽', date: 'Ven. · 14h00', photo: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&q=80', likes: 33, stats: { 'Buts': '2 buts', 'Passes': '1 passe D', 'Distance': '7.4 km', 'Durée': '1h30' }, comments: [{ user: 'Ali K.', text: 'Belle victoire 🔥', time: 'Ven. 15h' }] },
  { id: '5', user: 'Sarah M.', avatar: 'S', sport: 'tennis' as SportType, title: 'Double mixte — Luxembourg', caption: 'Victoire en 2 sets ! On remet ça la semaine prochaine 🎾', date: 'Jeu. · 10h30', photo: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=600&q=80', likes: 15, stats: { 'Sets': '6-4 / 7-5', 'Aces': '8 aces', 'Winners': '24', 'Durée': '1h30' }, comments: [] },
];

const COMMUNITY_STATS = [
  { label: 'Sessions ce mois', value: '247', icon: 'target' },
  { label: 'Km parcourus', value: '1 842', icon: 'activity' },
  { label: 'Membres actifs', value: '134', icon: 'users' },
  { label: 'Avis positifs', value: '98%', icon: 'star' },
];

function StatIcon({ type }: { type: string }) {
  const style = { width: 18, height: 18, strokeWidth: 1.8 };
  switch (type) {
    case 'target': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...style}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case 'activity': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...style}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
    case 'users': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...style}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'star': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...style}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    default: return null;
  }
}

function CommentModal({ item, onClose }: { item: typeof FEED_ITEMS[0]; onClose: () => void }) {
  const sport = getSport(item.sport);
  const [comments, setComments] = useState(item.comments);
  const [input, setInput] = useState('');

  function sendComment() {
    if (!input.trim()) return;
    setComments(prev => [...prev, { user: 'Moi', text: input.trim(), time: 'À l\'instant' }]);
    setInput('');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", zIndex: 300, display: "flex", alignItems: "flex-end" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#FAFAFA', borderRadius: '28px 28px 0 0', width: '100%', maxHeight: '85dvh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px 12px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Commentaires</h3>
          <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: 20, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          {/* Post résumé */}
          <div style={{ background: 'white', borderRadius: 16, padding: '12px', marginBottom: 14, border: '0.5px solid rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700 }}>{item.avatar}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0 }}>{item.user}</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{item.caption}</p>
              </div>
            </div>
          </div>

          {/* Commentaires */}
          {comments.length === 0 && (
            <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: 14, padding: '20px 0' }}>Aucun commentaire. Sois le premier ! 💬</p>
          )}
          <AnimatePresence>
            {comments.map((c, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: c.user === 'Moi' ? '#111' : sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                  {c.user.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ background: 'white', borderRadius: '14px 14px 14px 4px', padding: '10px 12px', border: '0.5px solid rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#111', margin: '0 0 3px' }}>{c.user}</p>
                    <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.4 }}>{c.text}</p>
                  </div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: '4px 0 0 4px' }}>{c.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px 36px', display: 'flex', gap: 10, borderTop: '0.5px solid rgba(0,0,0,0.06)', background: 'white' }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>M</div>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendComment(); }}
            placeholder="Ajouter un commentaire..."
            style={{ flex: 1, padding: '9px 14px', borderRadius: 20, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#F9FAFB' }}
          />
          <motion.button whileTap={{ scale: 0.9 }} onClick={sendComment}
            style={{ width: 36, height: 36, borderRadius: 18, background: input.trim() ? '#111' : '#E5E7EB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
            <Send size={16} color={input.trim() ? 'white' : '#9CA3AF'} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ShareModal({ item, onClose }: { item: typeof FEED_ITEMS[0]; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = `https://ants.app/feed/${item.id}`;

  function copy() {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 300, display: "flex", alignItems: "flex-end" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#FAFAFA', borderRadius: '28px 28px 0 0', width: '100%', padding: '12px 20px 36px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Partager</h3>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'WhatsApp', color: '#25D366', icon: '💬' },
            { label: 'Instagram', color: '#E1306C', icon: '📸' },
            { label: 'Copier', color: '#111', icon: copied ? '✓' : '🔗' },
          ].map(s => (
            <button key={s.label} onClick={s.label === 'Copier' ? copy : undefined}
              style={{ flex: 1, padding: '14px 8px', borderRadius: 16, background: s.color, border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{s.label === 'Copier' && copied ? 'Copié !' : s.label}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: '13px', borderRadius: 16, background: '#F3F4F6', border: 'none', fontSize: 14, fontWeight: 600, color: '#6B7280', cursor: 'pointer' }}>
          Annuler
        </button>
      </motion.div>
    </motion.div>
  );
}

function FeedCard({ item, index }: { item: typeof FEED_ITEMS[0]; index: number }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes);
  const [showStats, setShowStats] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const sport = getSport(item.sport);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
        style={{ background: 'white', borderRadius: 24, overflow: 'hidden', marginBottom: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '0.5px solid rgba(0,0,0,0.06)' }}
      >
        {/* Header */}
        <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 14, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
            {item.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{item.user}</p>
              <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: `${sport.colorHex}15`, color: sport.colorHex }}>{sport.label}</span>
            </div>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0' }}>{item.date}</p>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <ChevronDown size={18} color="#9CA3AF" />
          </button>
        </div>

        {/* Photo */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
          <img src={item.photo} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setShowStats(v => !v)}
            style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: 'none', borderRadius: 12, padding: '6px 12px', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" width={14} height={14} strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Stats
          </motion.button>

          <AnimatePresence>
            {showStats && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
                onClick={() => setShowStats(false)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
                  {Object.entries(item.stats).map(([key, value]) => (
                    <div key={key} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px', textAlign: 'center' }}>
                      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5 }}>{key}</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: 'white', margin: 0 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div style={{ padding: '10px 16px 4px', display: 'flex', alignItems: 'center', gap: 4 }}>
          <motion.button whileTap={{ scale: 0.75 }} onClick={() => { setLiked(v => !v); setLikes(v => liked ? v - 1 : v + 1); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px 6px 0' }}>
            <Heart size={22} fill={liked ? '#EF4444' : 'none'} color={liked ? '#EF4444' : '#374151'} strokeWidth={1.8} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{likes}</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowComments(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px' }}>
            <MessageCircle size={22} color="#374151" strokeWidth={1.8} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{item.comments.length}</span>
          </motion.button>

          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowShare(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', marginLeft: 'auto' }}>
            <Share2 size={22} color="#374151" strokeWidth={1.8} />
          </motion.button>
        </div>

        {/* Caption */}
        <div style={{ padding: '2px 16px 14px' }}>
          <p style={{ fontSize: 13, color: '#374151', margin: '0 0 4px', lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700 }}>{item.user} </span>{item.caption}
          </p>
          <button onClick={() => setShowComments(true)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: '#9CA3AF', cursor: 'pointer' }}>
            {item.comments.length > 0 ? `Voir les ${item.comments.length} commentaires` : 'Ajouter un commentaire...'}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showComments && <CommentModal item={item} onClose={() => setShowComments(false)} />}
        {showShare && <ShareModal item={item} onClose={() => setShowShare(false)} />}
      </AnimatePresence>
    </>
  );
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'communaute' | 'amis'>('communaute');

  return (
    <div style={{ minHeight: '100%', background: '#F9F9F9', paddingBottom: 32 }}>
      <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(0,0,0,0.06)', padding: '16px 20px 0', position: 'sticky', top: 0, zIndex: 10 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 12px' }}>Feed</h1>
        <div style={{ display: 'flex', gap: 0 }}>
          {(['communaute', 'amis'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', borderBottom: activeTab === tab ? '2px solid #111' : '2px solid transparent', fontSize: 13, fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? '#111' : '#9CA3AF', cursor: 'pointer', transition: 'all 0.2s' }}>
              {tab === 'communaute' ? 'Communauté' : 'Amis'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Stats communauté */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {COMMUNITY_STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: 'white', borderRadius: 16, padding: '10px 6px', textAlign: 'center', border: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ color: '#6B7280' }}><StatIcon type={stat.icon} /></div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0 }}>{stat.value}</p>
              <p style={{ fontSize: 9, color: '#9CA3AF', margin: 0, lineHeight: 1.2, textAlign: 'center' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {FEED_ITEMS.map((item, i) => <FeedCard key={item.id} item={item} index={i} />)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
