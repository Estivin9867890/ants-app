'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Session } from '@/types/session';
import type { MapCenter, MapBounds } from './MapInterface';
import { getSport } from '@/lib/sports';

delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createSportIcon(colorHex: string, emoji: string, isSelected: boolean): L.DivIcon {
  const size = isSelected ? 44 : 36;
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    html: `
      <div style="position:relative;width:${size}px;height:${size}px;">
        ${isSelected ? `<div style="position:absolute;inset:-6px;border-radius:50%;background:${colorHex}33;animation:pulse 1.5s ease-in-out infinite;"></div>` : ''}
        <div style="position:absolute;inset:0;background:${colorHex};border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px ${colorHex}66;border:2.5px solid white;"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:${isSelected ? 16 : 14}px;">${emoji}</div>
      </div>
      <style>@keyframes pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:0.2;transform:scale(1.3)}}</style>
    `,
  });
}

function MapSync({ center, onMove }: { center: MapCenter; onMove: (c: MapCenter, b: MapBounds) => void }) {
  const map = useMap();
  const prevCenter = useRef(center);
  const onMoveRef = useRef(onMove);
  const isMovingRef = useRef(false);
  onMoveRef.current = onMove;

  useEffect(() => {
    const prev = prevCenter.current;
    if (
      Math.abs(prev.lat - center.lat) > 0.0001 ||
      Math.abs(prev.lng - center.lng) > 0.0001 ||
      prev.zoom !== center.zoom
    ) {
      isMovingRef.current = true;
      map.flyTo([center.lat, center.lng], center.zoom, { duration: 0.8 });
      prevCenter.current = center;
      setTimeout(() => { isMovingRef.current = false; }, 1000);
    }
  }, [center, map]);

  useMapEvents({
    moveend: () => {
      if (isMovingRef.current) return;
      const c = map.getCenter();
      const b = map.getBounds();
      const prev = prevCenter.current;
      if (
        Math.abs(prev.lat - c.lat) > 0.0001 ||
        Math.abs(prev.lng - c.lng) > 0.0001 ||
        prev.zoom !== map.getZoom()
      ) {
        prevCenter.current = { lat: c.lat, lng: c.lng, zoom: map.getZoom() };
        onMoveRef.current(
          { lat: c.lat, lng: c.lng, zoom: map.getZoom() },
          { north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() }
        );
      }
    },
    zoomend: () => {
      if (isMovingRef.current) return;
      const c = map.getCenter();
      const b = map.getBounds();
      prevCenter.current = { lat: c.lat, lng: c.lng, zoom: map.getZoom() };
      onMoveRef.current(
        { lat: c.lat, lng: c.lng, zoom: map.getZoom() },
        { north: b.getNorth(), south: b.getSouth(), east: b.getEast(), west: b.getWest() }
      );
    },
  });

  return null;
}

interface MapViewProps {
  sessions: Session[];
  center: MapCenter;
  hoveredId: string | null;
  selectedId: string | null;
  onMove: (c: MapCenter, b: MapBounds) => void;
  onMarkerClick: (id: string) => void;
  onMarkerHover: (id: string | null) => void;
}

export default function MapView({ sessions, center, hoveredId, selectedId, onMove, onMarkerClick, onMarkerHover }: MapViewProps) {
  return (
    <MapContainer center={[center.lat, center.lng]} zoom={center.zoom} className="w-full h-full" zoomControl={false} style={{ background: '#F4F4F5' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OSM &copy; CARTO'
        maxZoom={19}
      />
      <MapSync center={center} onMove={onMove} />
      {sessions.map(session => {
        const sport = getSport(session.sport);
        const isHighlighted = session.id === hoveredId || session.id === selectedId;
        const icon = createSportIcon(sport.colorHex, sport.emoji, isHighlighted);
        return (
          <Marker
            key={session.id}
            position={[session.location.lat, session.location.lng]}
            icon={icon}
            zIndexOffset={isHighlighted ? 1000 : 0}
            eventHandlers={{
              click: () => onMarkerClick(session.id),
              mouseover: () => onMarkerHover(session.id),
              mouseout: () => onMarkerHover(null),
            }}
          >
            <Popup closeButton={false} maxWidth={220}>
              <div style={{ padding: '4px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: sport.colorHex, color: 'white', padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 600, marginBottom: 4 }}>
                  {sport.emoji} {sport.label}
                </div>
                <p style={{ fontSize: 12, fontWeight: 600, margin: '0 0 2px' }}>{session.title}</p>
                <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{session.current_count}/{session.max_participants} · {session.venue_name}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
