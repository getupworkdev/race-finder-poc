import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { buildRaceIndex, expansionZoom, itemsInView, type Bounds, type RaceIndex } from '../lib/cluster';
import type { Race } from '../lib/races';
import { theme } from '../theme';
import { INITIAL_VIEW, type RaceMapProps } from './RaceMap.types';

function bubble(label: string, size: number, background: string, color: string, ring: string) {
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${background};color:${color};border:2px solid ${ring};display:flex;align-items:center;justify-content:center;font:600 ${theme.font.sm}px system-ui;box-sizing:border-box">${label}</div>`,
  });
}

function Pins({ races, index, selectedId, onSelect }: RaceMapProps & { index: RaceIndex }) {
  const map = useMap();
  const [view, setView] = useState<{ bounds: Bounds; zoom: number } | null>(null);

  const readView = () => {
    const b = map.getBounds();
    setView({
      bounds: { west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() },
      zoom: map.getZoom(),
    });
  };
  useMapEvents({ moveend: readView, zoomend: readView });
  useEffect(readView, [map]);

  // Selecting a card flies the map to that race.
  useEffect(() => {
    const race = races.find((r) => r.id === selectedId);
    if (race) map.flyTo([race.lat, race.lng], Math.max(map.getZoom(), 11), { duration: 0.6 });
  }, [selectedId, races, map]);

  const items = useMemo(
    () => (view ? itemsInView(index, races, view.bounds, view.zoom) : []),
    [index, races, view],
  );

  return (
    <>
      {items.map((item) =>
        item.kind === 'cluster' ? (
          <Marker
            key={`c${item.id}`}
            position={[item.lat, item.lng]}
            icon={bubble(String(item.count), 38, theme.color.surfaceRaised, theme.color.text, theme.color.primary)}
            eventHandlers={{ click: () => map.flyTo([item.lat, item.lng], expansionZoom(index, item.id), { duration: 0.5 }) }}
          />
        ) : (
          <Marker
            key={item.race.id}
            position={[item.race.lat, item.race.lng]}
            icon={
              item.race.id === selectedId
                ? bubble('', 22, theme.color.primary, theme.color.primaryText, theme.color.text)
                : bubble('', 16, theme.color.primary, theme.color.primaryText, theme.color.background)
            }
            eventHandlers={{ click: () => onSelect(item.race.id) }}
          />
        ),
      )}
    </>
  );
}

export function RaceMap(props: RaceMapProps) {
  const index = useMemo(() => buildRaceIndex(props.races), [props.races]);
  return (
    <MapContainer
      center={[INITIAL_VIEW.lat, INITIAL_VIEW.lng]}
      zoom={INITIAL_VIEW.zoom}
      style={{ width: '100%', height: '100%', background: theme.color.background }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Pins {...props} index={index} />
    </MapContainer>
  );
}

export type { Race };
