import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { buildRaceIndex, expansionZoom, itemsInView } from '../lib/cluster';
import { theme } from '../theme';
import { INITIAL_VIEW, type RaceMapProps } from './RaceMap.types';

const zoomToDelta = (zoom: number) => 360 / 2 ** zoom;
const deltaToZoom = (delta: number) => Math.log2(360 / delta);

const INITIAL_REGION: Region = {
  latitude: INITIAL_VIEW.lat,
  longitude: INITIAL_VIEW.lng,
  latitudeDelta: zoomToDelta(INITIAL_VIEW.zoom),
  longitudeDelta: zoomToDelta(INITIAL_VIEW.zoom),
};

// Native (iOS and Android) map. It uses the same clustering index as the web
// map, so pins group identically on every platform.
export function RaceMap({ races, selectedId, onSelect }: RaceMapProps) {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const index = useMemo(() => buildRaceIndex(races), [races]);

  useEffect(() => {
    const race = races.find((r) => r.id === selectedId);
    if (race) {
      mapRef.current?.animateToRegion(
        { latitude: race.lat, longitude: race.lng, latitudeDelta: zoomToDelta(11), longitudeDelta: zoomToDelta(11) },
        500,
      );
    }
  }, [selectedId, races]);

  const items = useMemo(
    () =>
      itemsInView(
        index,
        races,
        {
          west: region.longitude - region.longitudeDelta / 2,
          east: region.longitude + region.longitudeDelta / 2,
          south: region.latitude - region.latitudeDelta / 2,
          north: region.latitude + region.latitudeDelta / 2,
        },
        deltaToZoom(region.longitudeDelta),
      ),
    [index, races, region],
  );

  return (
    <MapView ref={mapRef} style={styles.map} initialRegion={INITIAL_REGION} onRegionChangeComplete={setRegion}>
      {items.map((item) =>
        item.kind === 'cluster' ? (
          <Marker
            key={`c${item.id}`}
            coordinate={{ latitude: item.lat, longitude: item.lng }}
            onPress={() => {
              const delta = zoomToDelta(expansionZoom(index, item.id));
              mapRef.current?.animateToRegion(
                { latitude: item.lat, longitude: item.lng, latitudeDelta: delta, longitudeDelta: delta },
                400,
              );
            }}
          >
            <View style={styles.cluster}>
              <Text style={styles.clusterText}>{item.count}</Text>
            </View>
          </Marker>
        ) : (
          <Marker
            key={item.race.id}
            coordinate={{ latitude: item.race.lat, longitude: item.race.lng }}
            onPress={() => onSelect(item.race.id)}
          >
            <View style={[styles.pin, item.race.id === selectedId && styles.pinSelected]} />
          </Marker>
        ),
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  cluster: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.surfaceRaised,
    borderWidth: 2,
    borderColor: theme.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: { color: theme.color.text, fontSize: theme.font.sm, fontWeight: '600' },
  pin: {
    width: 16,
    height: 16,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.color.primary,
    borderWidth: 2,
    borderColor: theme.color.background,
  },
  pinSelected: { width: 22, height: 22, borderColor: theme.color.text },
});
