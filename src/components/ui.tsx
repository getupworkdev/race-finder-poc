import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../theme';

type ChipProps = { label: string; active?: boolean; onPress?: () => void; tone?: 'default' | 'success' | 'warning' | 'danger' };

// Pill used for filters, distance chips and status badges.
export function Chip({ label, active = false, onPress, tone = 'default' }: ChipProps) {
  const toneColor = tone === 'default' ? theme.color.textMuted : theme.color[tone];
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={onPress ? { selected: active } : undefined}
      style={[styles.chip, active && styles.chipActive, !active && tone !== 'default' && { borderColor: toneColor }]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive, !active && tone !== 'default' && { color: toneColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function Button({ label, onPress, variant = 'primary' }: { label: string; onPress: () => void; variant?: 'primary' | 'ghost' }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={[styles.button, variant === 'ghost' && styles.buttonGhost]}>
      <Text style={[styles.buttonText, variant === 'ghost' && styles.buttonGhostText]}>{label}</Text>
    </Pressable>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs + 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.color.border,
    backgroundColor: theme.color.surface,
  },
  chipActive: { backgroundColor: theme.color.primary, borderColor: theme.color.primary },
  chipText: { color: theme.color.textMuted, fontSize: theme.font.sm },
  chipTextActive: { color: theme.color.primaryText, fontWeight: '600' },
  button: {
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.color.primary,
    alignItems: 'center',
  },
  buttonGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.color.border },
  buttonText: { color: theme.color.primaryText, fontSize: theme.font.sm, fontWeight: '600' },
  buttonGhostText: { color: theme.color.text },
  label: {
    color: theme.color.textMuted,
    fontSize: theme.font.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: theme.space.xs,
  },
});
