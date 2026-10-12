import Supercluster from 'supercluster';
import type { Race } from './races';

export type Bounds = { west: number; south: number; east: number; north: number };

export type MapItem =
  | { kind: 'cluster'; id: number; lat: number; lng: number; count: number }
  | { kind: 'race'; race: Race };

export type RaceIndex = Supercluster<{ raceId: string }>;

// One clustering index shared by the web map and the native map, so both
// platforms group pins identically.
export function buildRaceIndex(races: Race[]): RaceIndex {
  const index = new Supercluster<{ raceId: string }>({ radius: 60, maxZoom: 14 });
  index.load(
    races.map((race) => ({
      type: 'Feature' as const,
      properties: { raceId: race.id },
      geometry: { type: 'Point' as const, coordinates: [race.lng, race.lat] },
    })),
  );
  return index;
}

export function itemsInView(index: RaceIndex, races: Race[], bounds: Bounds, zoom: number): MapItem[] {
  const byId = new Map(races.map((race) => [race.id, race]));
  const features = index.getClusters(
    [bounds.west, bounds.south, bounds.east, bounds.north],
    Math.max(0, Math.round(zoom)),
  );
  const items: MapItem[] = [];
  for (const feature of features) {
    const [lng, lat] = feature.geometry.coordinates;
    const props = feature.properties as { cluster?: boolean; cluster_id?: number; point_count?: number; raceId?: string };
    if (props.cluster && props.cluster_id !== undefined) {
      items.push({ kind: 'cluster', id: props.cluster_id, lat, lng, count: props.point_count ?? 0 });
    } else if (props.raceId) {
      const race = byId.get(props.raceId);
      if (race) items.push({ kind: 'race', race });
    }
  }
  return items;
}

// Zoom level at which a cluster breaks apart, used when a cluster is tapped.
export function expansionZoom(index: RaceIndex, clusterId: number): number {
  return Math.min(index.getClusterExpansionZoom(clusterId), 16);
}
