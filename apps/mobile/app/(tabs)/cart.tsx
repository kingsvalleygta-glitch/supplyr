import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { formatCAD, shippingCentsFor, taxCentsFor } from "@/lib/format";
import { colors, spacing } from "@/lib/theme";

export default function CartScreen() {
  const { items, setQty, remove, subtotalCents, count } = useCart();
  const router = useRouter();
  const shipping = shippingCentsFor(subtotalCents);
  const tax = taxCentsFor(subtotalCents, shipping);
  const total = subtotalCents + shipping + tax;

  if (count === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState
          title="Your cart is empty"
          body="Browse the catalog and add materials for your jobsite."
        />
        <PrimaryButton
          label="Browse products"
          onPress={() => router.push("/browse")}
          style={{ marginHorizontal: spacing.xl }}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {items.map((item) => (
          <View key={item.productId} style={styles.row}>
            <View style={styles.thumb}>
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{ width: 56, height: 56 }}
                  contentFit="contain"
                />
              ) : (
                <Text style={{ fontSize: 28 }}>{item.imageEmoji || "📦"}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.price}>
                {formatCAD(item.priceCents || 0)}
              </Text>
              <View style={styles.qtyRow}>
                <Pressable
                  onPress={() => setQty(item.productId, item.quantity - 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </Pressable>
                <Text style={styles.qty}>{item.quantity}</Text>
                <Pressable
                  onPress={() => setQty(item.productId, item.quantity + 1)}
                  style={styles.qtyBtn}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
                <Pressable onPress={() => remove(item.productId)}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.totals}>
          <Row label="Subtotal" value={formatCAD(subtotalCents)} />
          <Row label="GTA delivery" value={formatCAD(shipping)} />
          <Row label="HST (13%)" value={formatCAD(tax)} />
          <Row label="Total" value={formatCAD(total)} bold />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Checkout"
          onPress={() => router.push("/checkout")}
        />
      </View>
    </View>
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
    <View style={styles.totalRow}>
      <Text style={[styles.totalLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.totalValue, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  row: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontWeight: "700", color: colors.ink, fontSize: 14 },
  price: { marginTop: 4, fontWeight: "800", color: colors.ink },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { color: colors.accent, fontSize: 18, fontWeight: "800" },
  qty: { fontWeight: "800", minWidth: 20, textAlign: "center" },
  remove: { color: colors.danger, fontWeight: "700", fontSize: 13 },
  totals: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: { color: colors.inkMuted },
  totalValue: { color: colors.ink, fontWeight: "600" },
  bold: { fontWeight: "800", color: colors.ink, fontSize: 16 },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
