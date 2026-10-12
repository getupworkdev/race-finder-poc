import type { Race } from '../lib/races';

export type RaceMapProps = {
  races: Race[];
  selectedId: string | null;
  onSelect: (raceId: string) => void;
};

// Opening view: mainland Australia and Tasmania.
export const INITIAL_VIEW = { lat: -28.5, lng: 134.5, zoom: 4 };
