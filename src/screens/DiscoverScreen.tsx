import { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { RaceCard, openRegistration } from '../components/RaceCard';
import { RaceMap } from '../components/RaceMap';
import { Button, Chip, Label } from '../components/ui';
import { emptyFilters, filterRaces, type Discipline, type DistanceBand, type Race, type RaceFilters } from '../lib/races';
import { theme } from '../theme';

const DISCIPLINES: Discipline[] = ['Run', 'Trail', 'Triathlon', 'Cycling'];
const DISTANCE_BANDS: { key: DistanceBand; label: string }[] = [
  { key: 'any', label: 'Any distance' },
  { key: 'short', label: 'Up to 10 km' },
  { key: 'middle', label: '10 km to marathon' },
  { key: 'long', label: 'Beyond marathon' },
];

export function DiscoverScreen({ races }: { races: Race[] }) {
  const { width } = useWindowDimensions();
  const sideBySide = width >= theme.layout.sideBySideMinWidth;
  const [filters, setFilters] = useState<RaceFilters>(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const listRef = useRef<FlatList<Race>>(null);

  const visible = useMemo(() => filterRaces(races, filters), [races, filters]);
  const activeFilterCount =
    filters.disciplines.length + (filters.distance === 'any' ? 0 : 1) + (filters.pbOnly ? 1 : 0) + (filters.scenicOnly ? 1 : 0);

  // A pin tap scrolls the list to the matching card.
  useEffect(() => {
    const index = visible.findIndex((race) => race.id === selectedId);
    if (index >= 0) listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.1 });
  }, [selectedId, visible]);

  const toggleDiscipline = (discipline: Discipline) =>
    setFilters((f) => ({
      ...f,
      disciplines: f.disciplines.includes(discipline)
        ? f.disciplines.filter((d) => d !== discipline)
        : [...f.disciplines, discipline],
    }));

  const selectFromMap = (raceId: string) => {
    setSelectedId(raceId);
    if (!sideBySide) setView('list');
  };

  const list = (
    <FlatList
      ref={listRef}
      data={visible}
      keyExtractor={(race) => race.id}
      contentContainerStyle={styles.listContent}
      onScrollToIndexFailed={({ index }) => listRef.current?.scrollToOffset({ offset: index * 150, animated: true })}
      ListEmptyComponent={<Text style={styles.empty}>No races match these filters.</Text>}
      renderItem={({ item }) => (
        <RaceCard
          race={item}
          selected={item.id === selectedId}
          onSelect={() => setSelectedId(item.id === selectedId ? null : item.id)}
          onRegister={(race) => openRegistration(race, setLastEvent)}
        />
      )}
    />
  );

  const map = <RaceMap races={visible} selectedId={selectedId} onSelect={selectFromMap} />;

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <TextInput
          value={filters.query}
          onChangeText={(query) => setFilters((f) => ({ ...f, query }))}
          placeholder="Search by race, city or state"
          placeholderTextColor={theme.color.textMuted}
          accessibilityLabel="Search races"
          style={styles.search}
        />
        <Button
          label={activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
          variant="ghost"
          onPress={() => setFiltersOpen((open) => !open)}
        />
        {!sideBySide && (
          <Button label={view === 'list' ? 'Map' : 'List'} variant="ghost" onPress={() => setView(view === 'list' ? 'map' : 'list')} />
        )}
      </View>

      {filtersOpen && (
        <View style={styles.drawer}>
          <Label>Discipline</Label>
          <View style={styles.chipRow}>
            {DISCIPLINES.map((d) => (
              <Chip key={d} label={d} active={filters.disciplines.includes(d)} onPress={() => toggleDiscipline(d)} />
            ))}
          </View>
          <Label>Distance</Label>
          <View style={styles.chipRow}>
            {DISTANCE_BANDS.map((band) => (
              <Chip
                key={band.key}
                label={band.label}
                active={filters.distance === band.key}
                onPress={() => setFilters((f) => ({ ...f, distance: band.key }))}
              />
            ))}
          </View>
          <Label>Course</Label>
          <View style={styles.chipRow}>
            <Chip label="Fast & flat" active={filters.pbOnly} onPress={() => setFilters((f) => ({ ...f, pbOnly: !f.pbOnly }))} />
            <Chip label="Scenic" active={filters.scenicOnly} onPress={() => setFilters((f) => ({ ...f, scenicOnly: !f.scenicOnly }))} />
            {activeFilterCount > 0 && (
              <Chip label="Clear all" onPress={() => setFilters((f) => ({ ...emptyFilters, query: f.query }))} />
            )}
          </View>
        </View>
      )}

      <Text style={styles.count}>
        {visible.length} of {races.length} races
      </Text>

      {sideBySide ? (
        <View style={styles.split}>
          <View style={styles.splitList}>{list}</View>
          <View style={styles.splitMap}>{map}</View>
        </View>
      ) : (
        <View style={styles.single}>{view === 'list' ? list : map}</View>
      )}

      {lastEvent && (
        <Text style={styles.event} numberOfLines={1}>
          Logged: {lastEvent}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: { flexDirection: 'row', gap: theme.space.sm, paddingHorizontal: theme.space.lg, paddingTop: theme.space.md },
  search: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    color: theme.color.text,
    fontSize: theme.font.md,
  },
  drawer: {
    marginHorizontal: theme.space.lg,
    marginTop: theme.space.md,
    padding: theme.space.md,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm, marginBottom: theme.space.md },
  count: { color: theme.color.textMuted, fontSize: theme.font.sm, paddingHorizontal: theme.space.lg, paddingVertical: theme.space.sm },
  split: { flex: 1, flexDirection: 'row' },
  splitList: { width: theme.layout.listWidth },
  splitMap: { flex: 1 },
  single: { flex: 1 },
  listContent: { paddingHorizontal: theme.space.lg, paddingBottom: theme.space.xl },
  empty: { color: theme.color.textMuted, fontSize: theme.font.md, padding: theme.space.xl, textAlign: 'center' },
  event: {
    color: theme.color.textMuted,
    fontSize: theme.font.xs,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.xs,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
  },
});
