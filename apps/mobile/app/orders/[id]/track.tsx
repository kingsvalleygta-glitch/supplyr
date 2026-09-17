import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { WebView } from "react-native-webview";
import { fetchTracking, webTrackUrl } from "@/lib/api";
import { formatCAD, STATUS_LABELS, TRACKING_STEPS } from "@/lib/format";
import { colors, spacing } from "@/lib/theme";
import type { TrackingPayload } from "@/lib/types";

export default function TrackOrderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<TrackingPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mapFailed, setMapFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const payload = await fetchTracking(id);
      setData(payload);
      setError(null);
      if (!payload.live && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Tracking unavailable");
    }
  }, [id]);

  useEffect(() => {
    load();
    timer.current = setInterval(load, 2500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [load]);

  if (!data && !error) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Locating courier…</Text>
      </View>
    );
  }

  if (error && !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!data) return null;

  const statusIdx = TRACKING_STEPS.indexOf(
    data.status as (typeof TRACKING_STEPS)[number]
  );
  const showWebFallback = mapFailed;

  return (
    <>
      <Stack.Screen options={{ title: "Live tracking" }} />
      <View style={styles.screen}>
        <View style={styles.mapWrap}>
          {showWebFallback ? (
            <WebView
              source={{ uri: webTrackUrl(data.id) }}
              style={{ flex: 1 }}
              startInLoadingState
            />
          ) : (
            <MapView
              style={{ flex: 1 }}
              provider={PROVIDER_DEFAULT}
              initialRegion={{
                latitude: data.destination.lat,
                longitude: data.destination.lng,
                latitudeDelta: 0.12,
                longitudeDelta: 0.12,
              }}
            >
              {data.route?.length > 1 ? (
                <Polyline
                  coordinates={data.route.map(([lat, lng]) => ({
                    latitude: lat,
                    longitude: lng,
                  }))}
                  strokeColor={colors.accent}
                  strokeWidth={4}
                />
              ) : null}
              <Marker
                coordinate={{
                  latitude: data.destination.lat,
                  longitude: data.destination.lng,
                }}
                title="Delivery"
                description={data.destination.address}
                pinColor="#111113"
              />
              {data.driver ? (
                <Marker
                  coordinate={{
                    latitude: data.driver.lat,
                    longitude: data.driver.lng,
                  }}
                  title={data.courierLabel || "Supplyr Delivery"}
                  description={
                    data.etaMinutes != null
                      ? `ETA ~${data.etaMinutes} min`
                      : undefined
                  }
                  pinColor="#f5c518"
                />
              ) : null}
            </MapView>
          )}
        </View>

        <ScrollView
          style={styles.sheet}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
        >
          <Text style={styles.eta}>
            {data.status === "delivered"
              ? "Delivered"
              : data.etaMinutes != null
                ? `ETA ~${data.etaMinutes} min`
                : STATUS_LABELS[data.status]}
          </Text>
          <Text style={styles.status}>
            {STATUS_LABELS[data.status] || data.status}
          </Text>
          <Text style={styles.meta}>
            {data.courierLabel} · {formatCAD(data.totalCents)} · {data.id}
          </Text>
          <Text style={styles.addr}>{data.destination.address}</Text>

          <Text style={styles.timelineTitle}>Status timeline</Text>
          {TRACKING_STEPS.map((step, i) => {
            const done = statusIdx >= i;
            const current = statusIdx === i;
            const hist = data.statusHistory.find((h) => h.status === step);
            return (
              <View key={step} style={styles.step}>
                <View
                  style={[
                    styles.dot,
                    done && styles.dotDone,
                    current && styles.dotCurrent,
                  ]}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.stepLabel,
                      done && styles.stepLabelDone,
                      current && styles.stepLabelCurrent,
                    ]}
                  >
                    {STATUS_LABELS[step]}
                  </Text>
                  {hist?.at ? (
                    <Text style={styles.stepTime}>
                      {new Date(hist.at).toLocaleString("en-CA", {
                        timeZone: "America/Toronto",
                      })}
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}

          <Text style={styles.platformNote}>
            Map:{" "}
            {showWebFallback
              ? "WebView fallback"
              : `react-native-maps (${Platform.OS})`}
            {" · "}
            <Text
              style={{ color: colors.accent }}
              onPress={() => setMapFailed(true)}
            >
              Open web track
            </Text>
          </Text>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { marginTop: 12, color: colors.inkMuted, fontWeight: "600" },
  error: { color: colors.danger, fontWeight: "700", padding: 24 },
  mapWrap: { height: 280, backgroundColor: colors.navySoft },
  sheet: { flex: 1 },
  eta: { fontSize: 28, fontWeight: "900", color: colors.ink },
  status: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "800",
    color: colors.navy,
  },
  meta: { marginTop: 8, color: colors.inkMuted, fontSize: 13 },
  addr: { marginTop: 6, color: colors.inkMuted, fontSize: 14, lineHeight: 20 },
  timelineTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
  },
  step: { flexDirection: "row", gap: 12, marginBottom: 16 },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 3,
    backgroundColor: colors.borderStrong,
  },
  dotDone: { backgroundColor: colors.navy },
  dotCurrent: { backgroundColor: colors.accent },
  stepLabel: { fontWeight: "600", color: colors.inkFaint },
  stepLabelDone: { color: colors.ink },
  stepLabelCurrent: { color: colors.ink, fontWeight: "800" },
  stepTime: { marginTop: 2, fontSize: 12, color: colors.inkMuted },
  platformNote: {
    marginTop: spacing.lg,
    fontSize: 11,
    color: colors.inkFaint,
  },
});
