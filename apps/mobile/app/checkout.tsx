import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/lib/api";
import {
  formatCAD,
  shippingCentsFor,
  taxCentsFor,
} from "@/lib/format";
import { colors, spacing } from "@/lib/theme";
import type { ShippingAddress } from "@/lib/types";

export default function CheckoutScreen() {
  const { items, clear, subtotalCents, count } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ShippingAddress>({
    company: "",
    contactName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "Toronto",
    province: "ON",
    postalCode: "",
  });
  const [notes, setNotes] = useState("");

  const shipping = shippingCentsFor(subtotalCents);
  const tax = taxCentsFor(subtotalCents, shipping);
  const total = subtotalCents + shipping + tax;

  function setField<K extends keyof ShippingAddress>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onPlace() {
    if (!form.email || !form.address1 || !form.contactName) {
      Alert.alert(
        "Missing details",
        "Contact name, email, and address are required."
      );
      return;
    }
    setLoading(true);
    try {
      const { order } = await placeOrder({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        shipping: {
          ...form,
          address2: form.address2 || undefined,
        },
        deliveryNotes: notes || undefined,
        paymentMethod: "mock_card",
      });
      clear();
      router.replace(`/orders/${order.id}`);
    } catch (e) {
      Alert.alert(
        "Checkout failed",
        e instanceof Error ? e.message : "Please try again."
      );
      setLoading(false);
    }
  }

  if (count === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Nothing to check out</Text>
        <PrimaryButton label="Browse" onPress={() => router.push("/browse")} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }}
      >
        <Text style={styles.title}>Jobsite delivery</Text>
        <Text style={styles.hint}>
          Mock payment — no card is charged. Ontario HST and GTA delivery
          placeholders apply.
        </Text>

        <Field
          label="Company"
          value={form.company}
          onChange={(v) => setField("company", v)}
        />
        <Field
          label="Contact name *"
          value={form.contactName}
          onChange={(v) => setField("contactName", v)}
        />
        <Field
          label="Email *"
          value={form.email}
          onChange={(v) => setField("email", v)}
          keyboard="email-address"
        />
        <Field
          label="Phone"
          value={form.phone}
          onChange={(v) => setField("phone", v)}
          keyboard="phone-pad"
        />
        <Field
          label="Address *"
          value={form.address1}
          onChange={(v) => setField("address1", v)}
        />
        <Field
          label="Unit / suite"
          value={form.address2 || ""}
          onChange={(v) => setField("address2", v)}
        />
        <Field
          label="City"
          value={form.city}
          onChange={(v) => setField("city", v)}
        />
        <Field
          label="Province"
          value={form.province}
          onChange={(v) => setField("province", v)}
        />
        <Field
          label="Postal code"
          value={form.postalCode}
          onChange={(v) => setField("postalCode", v)}
        />
        <Field label="Delivery notes" value={notes} onChange={setNotes} />

        <View style={styles.totals}>
          <Row label="Subtotal" value={formatCAD(subtotalCents)} />
          <Row label="Delivery" value={formatCAD(shipping)} />
          <Row label="HST" value={formatCAD(tax)} />
          <Row label="Total" value={formatCAD(total)} bold />
        </View>

        <PrimaryButton
          label={`Place order · ${formatCAD(total)}`}
          onPress={onPlace}
          loading={loading}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChange,
  keyboard,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: "email-address" | "phone-pad" | "default";
}) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard || "default"}
        autoCapitalize={keyboard === "email-address" ? "none" : "words"}
        style={styles.input}
      />
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
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800" },
  title: { fontSize: 22, fontWeight: "800", color: colors.ink },
  hint: {
    marginTop: 8,
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.inkMuted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.ink,
  },
  totals: {
    marginTop: spacing.xl,
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
});
