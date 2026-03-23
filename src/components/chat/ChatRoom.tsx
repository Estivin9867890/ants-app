'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Users } from 'lucide-react';
import type { Session } from '@/types/session';
import { getSport } from '@/lib/sports';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
  isSystem?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', sender: 'Système', content: 'Bienvenue dans la fourmilière ! 🐜 Chat débloqué.', time: '06:50', isMe: false, isSystem: true },
  { id: '2', sender: 'Thomas R.', content: 'Salut tout le monde ! RDV à l\'entrée principale du parc 👋', time: '06:55', isMe: false },
  { id: '3', sender: 'Sarah M.', content: 'Top ! Je serai là à 7h pile 🏃‍♀️', time: '06:57', isMe: false },
  { id: '4', sender: 'Moi', content: 'Parfait, j\'apporte de l\'eau pour tout le monde', time: '06:58', isMe: true },
  { id: '5', sender: 'Marco B.', content: 'Super initiative ! On se retrouve au lac alors ?', time: '07:00', isMe: false },
  { id: '6', sender: 'Thomas R.', content: 'Oui exactement, près des pédalos 🚣', time: '07:01', isMe: false },
];

interface Props {
  session: Session;
  onBack: () => void;
}

export default function ChatRoom({ session, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const sport = getSport(session.sport);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      sender: 'Moi',
      content: input.trim(),
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  }

  const members = ['Thomas R.', 'Sarah M.', 'Marco B.', 'Ali K.', 'Moi'];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F9F9F9' }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: '0.5px solid rgba(0,0,0,0.06)', padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.button whileTap={{ scale: 0.92 }} onClick={onBack}
            style={{ width: 36, height: 36, borderRadius: 12, background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={18} color="#374151" />
          </motion.button>

          <div style={{ width: 40, height: 40, borderRadius: 14, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            {sport.emoji}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.title}</p>
            <p style={{ fontSize: 11, color: '#9CA3AF', margin: '1px 0 0' }}>{session.current_count} participants · {sport.label}</p>
          </div>

          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setShowMembers(v => !v)}
            style={{ width: 36, height: 36, borderRadius: 12, background: showMembers ? '#111' : '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={16} color={showMembers ? 'white' : '#374151'} />
          </motion.button>
        </div>

        {/* Membres */}
        <AnimatePresence>
          {showMembers && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden' }}>
              <div style={{ paddingTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {members.map(m => (
                  <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: '#F3F4F6', borderRadius: 20 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 10, background: sport.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', fontWeight: 700 }}>
                      {m.charAt(0)}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#374151' }}>{m}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isSystem ? 'center' : msg.isMe ? 'flex-end' : 'flex-start' }}>

              {msg.isSystem ? (
                <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: '6px 14px', fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
                  {msg.content}
                </div>
              ) : (
                <>
                  {!msg.isMe && (
                    <p style={{ fontSize: 11, color: '#9CA3AF', margin: '0 0 3px 12px', fontWeight: 500 }}>{msg.sender}</p>
                  )}
                  <div style={{
                    maxWidth: '75%',
                    padding: '10px 14px',
                    borderRadius: msg.isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.isMe ? '#111' : 'white',
                    color: msg.isMe ? 'white' : '#111',
                    fontSize: 14,
                    lineHeight: 1.4,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    border: msg.isMe ? 'none' : '0.5px solid rgba(0,0,0,0.06)',
                  }}>
                    {msg.content}
                  </div>
                  <p style={{ fontSize: 10, color: '#9CA3AF', margin: '3px 4px 0', alignSelf: msg.isMe ? 'flex-end' : 'flex-start' }}>
                    {msg.time}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '0.5px solid rgba(0,0,0,0.06)', padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Message..."
            style={{ flex: 1, padding: '11px 16px', borderRadius: 22, border: '1.5px solid rgba(0,0,0,0.08)', fontSize: 14, background: '#F9FAFB', outline: 'none', fontFamily: 'inherit', resize: 'none' }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.92 }}
            onClick={sendMessage}
            style={{ width: 44, height: 44, borderRadius: 22, background: input.trim() ? '#111' : '#E5E7EB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
            <Send size={18} color={input.trim() ? 'white' : '#9CA3AF'} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
