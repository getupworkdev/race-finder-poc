export type Discipline = 'Run' | 'Trail' | 'Triathlon' | 'Cycling';

export type Race = {
  id: string;
  title: string;
  discipline: Discipline;
  distanceKm: number;
  date: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  elevationM: number;
  isPbCourse: boolean;
  isScenic: boolean;
  ticketStatus: string;
  registrationUrl: string;
};

const REQUIRED_COLUMNS = [
  'id', 'title', 'discipline', 'distance_km', 'date', 'city', 'state', 'lat', 'lng',
  'elevation_m', 'is_pb_course', 'is_scenic', 'ticket_status', 'registration_url',
] as const;

// Parses the race CSV the client maintains. Rows are keyed on `id`, so
// re-importing an updated file replaces a race instead of duplicating it.
export function parseRacesCsv(csv: string): Race[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];
  const header = lines[0].split(',').map((h) => h.trim());
  const missing = REQUIRED_COLUMNS.filter((c) => !header.includes(c));
  if (missing.length > 0) throw new Error(`CSV is missing columns: ${missing.join(', ')}`);

  const byId = new Map<string, Race>();
  for (const line of lines.slice(1)) {
    const cells = line.split(',').map((c) => c.trim());
    const get = (name: string) => cells[header.indexOf(name)] ?? '';
    const lat = Number(get('lat'));
    const lng = Number(get('lng'));
    if (!get('id') || Number.isNaN(lat) || Number.isNaN(lng)) continue;
    byId.set(get('id'), {
      id: get('id'),
      title: get('title'),
      discipline: get('discipline') as Discipline,
      distanceKm: Number(get('distance_km')),
      date: get('date'),
      city: get('city'),
      state: get('state'),
      lat,
      lng,
      elevationM: Number(get('elevation_m')),
      isPbCourse: get('is_pb_course') === '1',
      isScenic: get('is_scenic') === '1',
      ticketStatus: get('ticket_status'),
      registrationUrl: get('registration_url'),
    });
  }
  return [...byId.values()];
}

export type DistanceBand = 'any' | 'short' | 'middle' | 'long';

export type RaceFilters = {
  query: string;
  disciplines: Discipline[];
  distance: DistanceBand;
  pbOnly: boolean;
  scenicOnly: boolean;
};

export const emptyFilters: RaceFilters = {
  query: '',
  disciplines: [],
  distance: 'any',
  pbOnly: false,
  scenicOnly: false,
};

function inBand(distanceKm: number, band: DistanceBand): boolean {
  if (band === 'short') return distanceKm <= 10;
  if (band === 'middle') return distanceKm > 10 && distanceKm <= 42.195;
  if (band === 'long') return distanceKm > 42.195;
  return true;
}

// In production this is a Postgres query; the same predicate runs here so the
// demo behaves identically without a backend.
export function filterRaces(races: Race[], filters: RaceFilters): Race[] {
  const query = filters.query.trim().toLowerCase();
  return races.filter((race) => {
    if (query) {
      const haystack = `${race.title} ${race.city} ${race.state}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.disciplines.length > 0 && !filters.disciplines.includes(race.discipline)) return false;
    if (!inBand(race.distanceKm, filters.distance)) return false;
    if (filters.pbOnly && !race.isPbCourse) return false;
    if (filters.scenicOnly && !race.isScenic) return false;
    return true;
  });
}

// Outbound registration links carry attribution, as the brief requires.
export function withUtm(url: string, medium: 'app' | 'web'): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}utm_source=racefinder&utm_medium=${medium}`;
}
