'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import type { SportType } from '@/types/session';
import { SPORT_LIST } from '@/lib/sports';
import { useSessions } from '@/lib/SessionsContext';
import AddressSearch, { PlaceResult } from './AddressSearch';

interface Props { onClose: () => void; }

export default function NewSessionModal({ onClose }: Props) {
  const { addSession } = useSessions();
  const [step, setStep] = useState(1);
  const [sport, setSport] = useState<SportType | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [places, setPlaces] = useState(8);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [address, setAddress] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canNext1 = sport !== null;
  const canNext2 = title.length > 3 && selectedPlace !== null;
  const canSubmit = date && time;

  function handleSubmit() {
    if (!sport || !date || !time || !selectedPlace) return;
    addSession({
      sport, title, description,
      address: selectedPlace.short_name,
      lat: selectedPlace.lat,
      lng: selectedPlace.lng,
      visibility, date, time, places,
    });
    setSubmitted(true);
    setTimeout(onClose, 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ background: '#FAFAFA', borderRadius: '28px 28px 0 0', width: '100%', maxWidth: 600, maxHeight: '90dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: 36, height: 4, background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 8px' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: 0 }}>Publier une annonce</h2>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>Étape {step} sur 3</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 16, background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#6B7280" />
          </button>
        </div>

        <div style={{ height: 3, background: '#F3F4F6', margin: '0 20px 16px' }}>
          <motion.div animate={{ width: `${(step / 3) * 100}%` }} style={{ height: '100%', background: '#111', borderRadius: 2 }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {submitted ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🐜</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Annonce publiée !</h3>
              <p style={{ fontSize: 14, color: '#6B7280' }}>Ta session est visible sur la carte et dans tes sessions.</p>
            </motion.div>
          ) : (
            <>
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Choisis un sport</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {SPORT_LIST.map(s => (
                      <motion.button key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setSport(s.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 18, border: sport === s.id ? `2px solid ${s.colorHex}` : '1.5px solid rgba(0,0,0,0.08)', background: sport === s.id ? `${s.colorHex}10` : 'white', cursor: 'pointer' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: s.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                          {s.emoji}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: 0 }}>{s.label}</p>
                          <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0' }}>
                            {s.id === 'running' ? 'Course à pied, trail, marche' : s.id === 'tennis' ? 'Simple, double, padel' : s.id === 'basket' ? '3v3, 5v5, streetball' : s.id === 'foot' ? '5v5, 7v7, futsal' : 'Dériveur, croisière, régate'}
                          </p>
                        </div>
                        {sport === s.id && (
                          <div style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: 11, background: s.colorHex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ color: 'white', fontSize: 12 }}>✓</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>TITRE</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Footing matinal Bois de Vincennes"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Décris ta session, le niveau requis..." rows={3}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', background: 'white' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>LIEU</label>
                    <AddressSearch
                      value={address}
                      onChange={val => { setAddress(val); if (selectedPlace && val !== selectedPlace.short_name) setSelectedPlace(null); }}
                      onSelect={place => { setAddress(place.short_name); setSelectedPlace(place); }}
                    />
                    {selectedPlace && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: 8, padding: '8px 12px', background: '#F0FDF4', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14 }}>📍</span>
                        <p style={{ fontSize: 12, color: '#16A34A', fontWeight: 500, margin: 0 }}>Lieu confirmé : {selectedPlace.short_name}</p>
                      </motion.div>
                    )}
                    {!selectedPlace && address.length > 2 && (
                      <p style={{ fontSize: 11, color: '#F59E0B', margin: '6px 0 0 4px' }}>⚠️ Sélectionne un lieu dans la liste</p>
                    )}
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>VISIBILITÉ</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {(['public', 'private'] as const).map(v => (
                        <button key={v} onClick={() => setVisibility(v)}
                          style={{ flex: 1, padding: '10px', borderRadius: 12, border: visibility === v ? '2px solid #111' : '1.5px solid rgba(0,0,0,0.1)', background: visibility === v ? '#111' : 'white', color: visibility === v ? 'white' : '#6B7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                          {v === 'public' ? '🌍 Public' : '🔒 Amis'}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>DATE</label>
                      <input type="date" value={date} onChange={e => setDate(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>HEURE</label>
                      <input type="time" value={time} onChange={e => setTime(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>PLACES</label>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{places} participants</span>
                    </div>
                    <input type="range" min={2} max={30} value={places} onChange={e => setPlaces(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#111' }} />
                  </div>
                  <div style={{ background: 'white', borderRadius: 18, border: '1.5px solid rgba(0,0,0,0.08)', padding: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 1 }}>Récapitulatif</p>
                    {sport && <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span>{SPORT_LIST.find(s => s.id === sport)?.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{SPORT_LIST.find(s => s.id === sport)?.label}</span>
                    </div>}
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>{title}</p>
                    {selectedPlace && <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 2px' }}>📍 {selectedPlace.short_name}</p>}
                    <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>📅 {date} à {time} · {places} places</p>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>

        {!submitted && (
          <div style={{ padding: '16px 20px 24px', display: 'flex', gap: 10 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                style={{ padding: '14px 20px', borderRadius: 16, border: '1.5px solid rgba(0,0,0,0.1)', background: 'white', fontSize: 14, fontWeight: 600, color: '#6B7280', cursor: 'pointer' }}>
                Retour
              </button>
            )}
            {step < 3 ? (
              <motion.button whileTap={{ scale: 0.98 }}
                onClick={() => setStep(s => s + 1)}
                disabled={step === 1 ? !canNext1 : !canNext2}
                style={{ flex: 1, padding: '14px', borderRadius: 16, border: 'none', background: (step === 1 ? canNext1 : canNext2) ? '#111' : '#E5E7EB', fontSize: 14, fontWeight: 700, color: (step === 1 ? canNext1 : canNext2) ? 'white' : '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                Continuer <ChevronRight size={16} />
              </motion.button>
            ) : (
              <motion.button whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{ flex: 1, padding: '14px', borderRadius: 16, border: 'none', background: canSubmit ? '#111' : '#E5E7EB', fontSize: 14, fontWeight: 700, color: canSubmit ? 'white' : '#9CA3AF', cursor: 'pointer' }}>
                🐜 Publier l'annonce
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
