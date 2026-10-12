# Race Finder proof of concept

A small working slice of an endurance race discovery platform, built to show the
parts of the brief that carry the most risk: one codebase for web and mobile, a
clustered map that stays in sync with the race list, a swappable theme, and
pacing maths that never drifts.

All race data is fictional sample data.

## What it shows

| Brief requirement | Where to look |
|---|---|
| One codebase for web, iOS and Android | React Native with Expo; the same screens render on all three |
| Search by race name, city or state | Search bar on the Discover tab |
| Filter drawer: discipline, distance, fast-course and scenic flags | "Filters" button |
| Map with clustered pins | Zoom the map; clusters split into single races |
| Pins and cards stay in sync | Tap a pin to highlight its card; tap a card to fly the map to it |
| List and map toggle on small screens | "Map" / "List" button below 900 px wide |
| Central design tokens, no hardcoded values | `src/theme.ts`; change `color.primary` and every screen updates |
| Races seeded from CSV, safe to re-import | `src/lib/races.ts`; rows are keyed on `id`, so a re-import updates instead of duplicating |
| Outbound registration links carry UTM parameters | "Register" on a selected card; the logged click appears at the bottom of the screen |
| Pace calculator with split strategies and a wristband table | Pace tab |

## What it leaves out

Sign-in, the Season and Perks tabs, the admin screens and the Supabase backend
are not in this slice. The filter logic here is the same predicate that becomes a
Postgres query, and the registration log becomes a redirect function that
records the click before sending the athlete on.

The web build is a single-page app. Pre-rendering the Discover pages as HTML for
search engines is part of the full build and is not done here.

## Run it

```bash
npm install
npm run web        # browser
npm run ios        # iOS simulator
npm run android    # Android emulator
```

## Check it

```bash
npm test           # 17 unit tests: pace maths, CSV import, filters, clustering
npm run typecheck
npm run build:web  # static site in dist/
```

The pace tests assert that every distance and split strategy finishes exactly on
the target time, that elapsed times never go backwards, and that an even split
reaches halfway at exactly half the target.

## Layout

```
App.tsx                      header and tab switch
src/theme.ts                 every colour, spacing and font size
src/data/racesCsv.ts         sample race CSV
src/lib/races.ts             CSV import, filters, UTM links
src/lib/cluster.ts           clustering shared by web and native maps
src/lib/pace.ts              pace plan and wristband checkpoints
src/components/RaceMap.web.tsx   web map (Leaflet)
src/components/RaceMap.tsx       iOS and Android map (react-native-maps)
src/screens/                 Discover and Pace screens
```
