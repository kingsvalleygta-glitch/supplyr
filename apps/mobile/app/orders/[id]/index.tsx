import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { fetchOrder } from "@/lib/api";
import { formatCAD, formatDate, STATUS_LABELS } from "@/lib/format";
import { colors, spacing } from "@/lib/theme";
import type { Order } from "@/lib/types";

export default function OrderConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchOrder(id)
      .then((r) => setOrder(r.order))
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Order not found")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Order not found"}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Order confirmed" }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }}
      >
        <View style={styles.banner}>
          <Text style={styles.bannerKicker}>Thank you</Text>
          <Text style={styles.bannerTitle}>Order placed</Text>
          <Text style={styles.bannerId}>{order.id}</Text>
          <Text style={styles.bannerMeta}>
            {formatDate(order.createdAt)} ·{" "}
            {STATUS_LABELS[order.status] || order.status}
          </Text>
        </View>

        <Text style={styles.section}>Items</Text>
        {order.lines.map((line) => (
          <View key={`${line.productId}-${line.sku}`} style={styles.line}>
            <View style={{ flex: 1 }}>
              <Text style={styles.lineName}>{line.name}</Text>
              <Text style={styles.lineMeta}>
                Qty {line.quantity} · {formatCAD(line.unitPriceCents)} ea
              </Text>
            </View>
            <Text style={styles.lineTotal}>
              {formatCAD(line.unitPriceCents * line.quantity)}
            </Text>
          </View>
        ))}

        <View style={styles.totals}>
          <Row label="Subtotal" value={formatCAD(order.subtotalCents)} />
          <Row label="Delivery" value={formatCAD(order.shippingCents)} />
          <Row label="HST" value={formatCAD(order.taxCents)} />
          <Row label="Total" value={formatCAD(order.totalCents)} bold />
        </View>

        <Text style={styles.section}>Deliver to</Text>
        <Text style={styles.addr}>
          {order.shipping.contactName}
          {order.shipping.company ? `\n${order.shipping.company}` : ""}
          {"\n"}
          {order.shipping.address1}
          {order.shipping.address2 ? `\n${order.shipping.address2}` : ""}
          {"\n"}
          {order.shipping.city}, {order.shipping.province}{" "}
          {order.shipping.postalCode}
        </Text>

        <PrimaryButton
          label="Track order live"
          onPress={() => router.push(`/orders/${order.id}/track`)}
          style={{ marginTop: spacing.xl }}
        />
        <PrimaryButton
          label="Continue shopping"
          variant="ghost"
          onPress={() => router.push("/browse")}
          style={{ marginTop: spacing.md }}
        />
      </ScrollView>
    </>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: colors.danger, fontWeight: "700" },
  banner: {
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: spacing.xl,
  },
  bannerKicker: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  bannerTitle: {
    marginTop: 8,
    color: colors.white,
    fontSize: 28,
    fontWeight: "900",
  },
  bannerId: {
    marginTop: 8,
    color: colors.accent,
    fontWeight: "800",
    fontSize: 14,
  },
  bannerMeta: { marginTop: 6, color: "rgba(255,255,255,0.65)", fontSize: 13 },
  section: {
    marginTop: spacing.xl,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  line: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  lineName: { fontWeight: "700", color: colors.ink, fontSize: 14 },
  lineMeta: { marginTop: 4, color: colors.inkMuted, fontSize: 12 },
  lineTotal: { fontWeight: "800", color: colors.ink },
  totals: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLabel: { color: colors.inkMuted },
  rowValue: { fontWeight: "600", color: colors.ink },
  bold: { fontWeight: "800", fontSize: 16, color: colors.ink },
  addr: { color: colors.inkMuted, lineHeight: 22, fontSize: 15 },
});
