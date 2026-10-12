import { RACES_CSV } from '../data/racesCsv';
import { buildRaceIndex, itemsInView } from './cluster';
import { emptyFilters, filterRaces, parseRacesCsv, withUtm } from './races';

const races = parseRacesCsv(RACES_CSV);
const AUSTRALIA = { west: 110, south: -45, east: 156, north: -9 };

describe('parseRacesCsv', () => {
  it('loads every sample race with usable coordinates', () => {
    expect(races).toHaveLength(53);
    for (const race of races) {
      expect(race.lat).toBeLessThan(-9);
      expect(race.lng).toBeGreaterThan(110);
    }
  });

  it('replaces a race when the same id is imported twice', () => {
    const header = RACES_CSV.split('\n')[0];
    const row = 'r001,First,Run,10,2027-01-01,Sydney,NSW,-33.8,151.2,20,1,0,Open,https://example.com/a';
    const updated = row.replace('First', 'Updated');
    const parsed = parseRacesCsv([header, row, updated].join('\n'));
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('Updated');
  });

  it('names the columns a file is missing', () => {
    expect(() => parseRacesCsv('id,title\nr1,Test')).toThrow(/missing columns: discipline/);
  });
});

describe('filterRaces', () => {
  it('returns everything with no filters', () => {
    expect(filterRaces(races, emptyFilters)).toHaveLength(races.length);
  });

  it('searches by city and state without caring about case', () => {
    const adelaide = filterRaces(races, { ...emptyFilters, query: 'adelaide' });
    expect(adelaide.length).toBeGreaterThan(0);
    expect(adelaide.every((r) => r.city === 'Adelaide')).toBe(true);
    expect(filterRaces(races, { ...emptyFilters, query: 'TAS' }).every((r) => r.state === 'TAS')).toBe(true);
  });

  it('combines discipline, distance and course flags', () => {
    const result = filterRaces(races, { ...emptyFilters, disciplines: ['Run'], distance: 'short', pbOnly: true });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => r.discipline === 'Run' && r.distanceKm <= 10 && r.isPbCourse)).toBe(true);
  });
});

describe('clustering', () => {
  it('groups pins when zoomed out and separates them when zoomed in', () => {
    const index = buildRaceIndex(races);
    const far = itemsInView(index, races, AUSTRALIA, 3);
    const near = itemsInView(index, races, AUSTRALIA, 16);
    expect(far.length).toBeLessThan(races.length);
    expect(far.some((item) => item.kind === 'cluster')).toBe(true);
    expect(near.filter((item) => item.kind === 'race')).toHaveLength(races.length);
  });

  it('accounts for every race at any zoom', () => {
    const index = buildRaceIndex(races);
    const total = itemsInView(index, races, AUSTRALIA, 4).reduce(
      (sum, item) => sum + (item.kind === 'cluster' ? item.count : 1),
      0,
    );
    expect(total).toBe(races.length);
  });
});

describe('withUtm', () => {
  it('adds attribution without breaking an existing query string', () => {
    expect(withUtm('https://example.com/r', 'web')).toBe('https://example.com/r?utm_source=racefinder&utm_medium=web');
    expect(withUtm('https://example.com/r?x=1', 'app')).toBe('https://example.com/r?x=1&utm_source=racefinder&utm_medium=app');
  });
});
