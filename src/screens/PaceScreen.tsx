import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Chip, Label } from '../components/ui';
import {
  PACE_DISTANCES,
  SPLIT_STRATEGIES,
  buildPacePlan,
  formatDuration,
  formatPace,
  parseTargetTime,
} from '../lib/pace';
import { theme } from '../theme';

export function PaceScreen() {
  const [distanceKey, setDistanceKey] = useState('marathon');
  const [strategyKey, setStrategyKey] = useState('even');
  const [target, setTarget] = useState('3:30:00');

  const distance = PACE_DISTANCES.find((d) => d.key === distanceKey) ?? PACE_DISTANCES[0];
  const strategy = SPLIT_STRATEGIES.find((s) => s.key === strategyKey) ?? SPLIT_STRATEGIES[1];
  const targetSeconds = parseTargetTime(target);
  const plan = useMemo(
    () => (targetSeconds ? buildPacePlan(distance, targetSeconds, strategy) : null),
    [distance, targetSeconds, strategy],
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.column}>
        <Label>Distance</Label>
        <View style={styles.chipRow}>
          {PACE_DISTANCES.map((d) => (
            <Chip key={d.key} label={d.label} active={d.key === distanceKey} onPress={() => setDistanceKey(d.key)} />
          ))}
        </View>

        <Label>Target finish time</Label>
        <TextInput
          value={target}
          onChangeText={setTarget}
          placeholder="h:mm:ss"
          placeholderTextColor={theme.color.textMuted}
          accessibilityLabel="Target finish time"
          style={[styles.input, !targetSeconds && styles.inputInvalid]}
        />
        {!targetSeconds && <Text style={styles.error}>Enter a time as h:mm:ss or mm:ss, for example 3:30:00.</Text>}

        <Label>Split strategy</Label>
        <View style={styles.chipRow}>
          {SPLIT_STRATEGIES.map((s) => (
            <Chip key={s.key} label={s.label} active={s.key === strategyKey} onPress={() => setStrategyKey(s.key)} />
          ))}
        </View>

        {plan && (
          <>
            <View style={styles.summary}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{formatPace(plan.averagePaceSecondsPerKm)}</Text>
                <Text style={styles.statLabel}>Average pace</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{plan.averageSpeedKmh.toFixed(1)} km/h</Text>
                <Text style={styles.statLabel}>Average speed</Text>
              </View>
            </View>

            <Label>Race wristband</Label>
            <View style={styles.table}>
              <View style={[styles.row, styles.headRow]}>
                <Text style={[styles.cell, styles.head]}>Checkpoint</Text>
                <Text style={[styles.cell, styles.head, styles.right]}>Elapsed</Text>
                <Text style={[styles.cell, styles.head, styles.right]}>Pace</Text>
                <Text style={[styles.cellWide, styles.head]}>Cue</Text>
              </View>
              {plan.checkpoints.map((checkpoint) => (
                <View key={checkpoint.label} style={styles.row}>
                  <Text style={styles.cell}>{checkpoint.label}</Text>
                  <Text style={[styles.cell, styles.right, styles.number]}>{formatDuration(checkpoint.elapsedSeconds)}</Text>
                  <Text style={[styles.cell, styles.right, styles.number]}>{formatDuration(checkpoint.segmentPaceSecondsPerKm)}</Text>
                  <Text style={[styles.cellWide, styles.cue]}>{checkpoint.cue}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.space.lg, alignItems: 'center' },
  column: { width: '100%', maxWidth: 640 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm, marginBottom: theme.space.lg },
  input: {
    backgroundColor: theme.color.surface,
    borderWidth: 1,
    borderColor: theme.color.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    color: theme.color.text,
    fontSize: theme.font.lg,
    marginBottom: theme.space.lg,
    fontVariant: ['tabular-nums'],
  },
  inputInvalid: { borderColor: theme.color.danger, marginBottom: theme.space.xs },
  error: { color: theme.color.danger, fontSize: theme.font.sm, marginBottom: theme.space.lg },
  summary: { flexDirection: 'row', gap: theme.space.md, marginBottom: theme.space.lg },
  stat: {
    flex: 1,
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.border,
    padding: theme.space.md,
  },
  statValue: { color: theme.color.primary, fontSize: theme.font.xl, fontWeight: '700', fontVariant: ['tabular-nums'] },
  statLabel: { color: theme.color.textMuted, fontSize: theme.font.sm, marginTop: theme.space.xs },
  table: { borderRadius: theme.radius.md, borderWidth: 1, borderColor: theme.color.border, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.md,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
    backgroundColor: theme.color.surface,
  },
  headRow: { borderTopWidth: 0, backgroundColor: theme.color.surfaceRaised },
  cell: { flex: 1, color: theme.color.text, fontSize: theme.font.sm },
  cellWide: { flex: 1.4, color: theme.color.text, fontSize: theme.font.sm, paddingLeft: theme.space.md },
  head: { color: theme.color.textMuted, fontWeight: '600' },
  right: { textAlign: 'right' },
  number: { fontVariant: ['tabular-nums'] },
  cue: { color: theme.color.textMuted },
});
