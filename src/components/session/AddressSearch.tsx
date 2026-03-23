'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Loader } from 'lucide-react';

export interface PlaceResult {
  display_name: string;
  short_name: string;
  lat: number;
  lng: number;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (place: PlaceResult) => void;
}

export default function AddressSearch({ value, onChange, onSelect }: Props) {
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&addressdetails=1`,
          { headers: { 'Accept-Language': 'fr' } }
        );
        const data = await res.json();
        const places: PlaceResult[] = data.map((item: Record<string, unknown>) => {
          const addr = item.address as Record<string, string> | undefined;
          const short = [
            addr?.amenity ?? addr?.building ?? addr?.road,
            addr?.city ?? addr?.town ?? addr?.village,
          ].filter(Boolean).join(', ') || (item.display_name as string).split(',').slice(0, 2).join(',');
          return {
            display_name: item.display_name as string,
            short_name: short,
            lat: parseFloat(item.lat as string),
            lng: parseFloat(item.lon as string),
          };
        });
        setResults(places);
        setShowDropdown(places.length > 0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [value]);

  function handleSelect(place: PlaceResult) {
    onChange(place.short_name);
    onSelect(place);
    setShowDropdown(false);
    setResults([]);
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <MapPin size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder="Recherche une adresse, un lieu..."
          style={{ width: '100%', padding: '12px 40px 12px 36px', borderRadius: 14, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit', background: 'white' }}
        />
        {loading && (
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <Loader size={16} color="#9CA3AF" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        )}
        {!loading && value.length > 0 && (
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />
        )}
      </div>

      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', borderRadius: 16, border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.10)', zIndex: 200, overflow: 'hidden' }}
          >
            {results.map((place, i) => (
              <motion.button
                key={i}
                whileHover={{ background: '#F9FAFB' }}
                onClick={() => handleSelect(place)}
                style={{ width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 10, background: 'none', border: 'none', cursor: 'pointer', borderBottom: i < results.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none', textAlign: 'left' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <MapPin size={14} color="#6B7280" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {place.short_name}
                  </p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {place.display_name}
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: translateY(-50%) rotate(0deg); } to { transform: translateY(-50%) rotate(360deg); } }`}</style>
    </div>
  );
}
