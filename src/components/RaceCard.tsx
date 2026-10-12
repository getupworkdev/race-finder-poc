import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { withUtm, type Race } from '../lib/races';
import { theme } from '../theme';
import { Button, Chip } from './ui';

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger'> = {
  Open: 'success',
  'Ballot Open': 'warning',
  'Early Bird': 'warning',
  'Sold Out': 'danger',
};

const formatDistance = (km: number) => `${Number.isInteger(km) ? km : km.toFixed(1)} km`;

type Props = { race: Race; selected: boolean; onSelect: () => void; onRegister: (race: Race) => void };

export function RaceCard({ race, selected, onSelect, onRegister }: Props) {
  return (
    <Pressable
      onPress={onSelect}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.card, selected && styles.cardSelected]}
    >
      <View style={[styles.edge, selected && styles.edgeSelected]} />
      <View style={styles.body}>
        <Text style={styles.title}>{race.title}</Text>
        <Text style={styles.meta}>
          {race.date} · {race.city}, {race.state}
        </Text>
        <View style={styles.chips}>
          <Chip label={race.discipline} />
          <Chip label={formatDistance(race.distanceKm)} />
          <Chip label={`${race.elevationM} m climb`} />
          {race.isPbCourse && <Chip label="Fast & flat" tone="success" />}
          <Chip label={race.ticketStatus} tone={STATUS_TONE[race.ticketStatus] ?? 'warning'} />
        </View>
        {selected && (
          <View style={styles.actions}>
            <Button label="Register" onPress={() => onRegister(race)} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

// In production this goes through a redirect function that logs the click
// before sending the athlete on. Here it logs locally, then opens the link.
export function openRegistration(race: Race, log: (entry: string) => void) {
  const medium = Platform.OS === 'web' ? 'web' : 'app';
  const url = withUtm(race.registrationUrl, medium);
  log(`register_click ${race.id} → ${url}`);
  Linking.openURL(url).catch(() => undefined);
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    overflow: 'hidden',
    marginBottom: theme.space.md,
  },
  cardSelected: { borderColor: theme.color.primary, backgroundColor: theme.color.surfaceRaised },
  edge: { width: 6, backgroundColor: theme.color.border },
  edgeSelected: { backgroundColor: theme.color.primary },
  body: { flex: 1, padding: theme.space.md, gap: theme.space.sm },
  title: { color: theme.color.text, fontSize: theme.font.md, fontWeight: '600' },
  meta: { color: theme.color.textMuted, fontSize: theme.font.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.xs + 2 },
  actions: { flexDirection: 'row', marginTop: theme.space.xs },
});
