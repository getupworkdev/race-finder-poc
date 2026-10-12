import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RACES_CSV } from './src/data/racesCsv';
import { parseRacesCsv } from './src/lib/races';
import { DiscoverScreen } from './src/screens/DiscoverScreen';
import { PaceScreen } from './src/screens/PaceScreen';
import { theme } from './src/theme';

type Tab = 'discover' | 'pace';
const TABS: { key: Tab; label: string }[] = [
  { key: 'discover', label: 'Discover' },
  { key: 'pace', label: 'Pace' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('discover');
  const races = useMemo(() => parseRacesCsv(RACES_CSV), []);
  const isWeb = Platform.OS === 'web';

  const tabs = (
    <View style={[styles.tabs, !isWeb && styles.tabsBottom]}>
      {TABS.map((t) => (
        <Pressable
          key={t.key}
          onPress={() => setTab(t.key)}
          accessibilityRole="tab"
          accessibilityState={{ selected: tab === t.key }}
          style={[styles.tab, tab === t.key && styles.tabActive]}
        >
          <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.brand}>Race Finder</Text>
        <Text style={styles.badge}>Proof of concept · sample data</Text>
        {isWeb && <View style={styles.headerTabs}>{tabs}</View>}
      </View>
      <View style={styles.body}>{tab === 'discover' ? <DiscoverScreen races={races} /> : <PaceScreen />}</View>
      {!isWeb && tabs}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: theme.color.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: theme.space.md,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.border,
  },
  brand: { color: theme.color.primary, fontSize: theme.font.lg, fontWeight: '700' },
  badge: { color: theme.color.textMuted, fontSize: theme.font.xs },
  headerTabs: { marginLeft: 'auto' },
  body: { flex: 1 },
  tabs: { flexDirection: 'row', gap: theme.space.sm },
  tabsBottom: {
    justifyContent: 'space-around',
    paddingVertical: theme.space.sm,
    borderTopWidth: 1,
    borderTopColor: theme.color.border,
    backgroundColor: theme.color.surface,
  },
  tab: { paddingHorizontal: theme.space.lg, paddingVertical: theme.space.sm, borderRadius: theme.radius.pill },
  tabActive: { backgroundColor: theme.color.surfaceRaised },
  tabText: { color: theme.color.textMuted, fontSize: theme.font.sm, fontWeight: '600' },
  tabTextActive: { color: theme.color.primary },
});
