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
import { submitProLead } from "@/lib/api";
import { colors, spacing } from "@/lib/theme";

export default function ProScreen() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [trade, setTrade] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit() {
    if (!name.trim() || !company.trim() || !email.trim()) {
      Alert.alert("Missing details", "Name, company, and email are required.");
      return;
    }
    setLoading(true);
    try {
      await submitProLead({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        trade: trade.trim(),
      });
      setDone(true);
    } catch (e) {
      Alert.alert(
        "Could not submit",
        e instanceof Error ? e.message : "Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 48 }}>
        <View style={styles.hero}>
          <Text style={styles.badge}>Supplyr Pro</Text>
          <Text style={styles.title}>Trade accounts for GTA contractors</Text>
          <Text style={styles.body}>
            Get a Pro badge, priority jobsite delivery coordination, and a 10%
            display discount indicator on catalog pricing.
          </Text>
        </View>

        <View style={styles.perks}>
          {[
            "Trade-ready CAD list pricing",
            "Jobsite drop-offs across the GTA",
            "Dedicated order coordination",
            "Catalog mirrored from FlooReno for Supplyr",
          ].map((p) => (
            <Text key={p} style={styles.perk}>
              ✓  {p}
            </Text>
          ))}
        </View>

        {done ? (
          <View style={styles.success}>
            <Text style={styles.successTitle}>Interest received</Text>
            <Text style={styles.successBody}>
              Thanks — a Supplyr teammate will follow up about your Pro account.
            </Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Request Pro access</Text>
            <Field label="Contact name *" value={name} onChange={setName} />
            <Field label="Company *" value={company} onChange={setCompany} />
            <Field
              label="Email *"
              value={email}
              onChange={setEmail}
              keyboard="email-address"
            />
            <Field
              label="Phone"
              value={phone}
              onChange={setPhone}
              keyboard="phone-pad"
            />
            <Field
              label="Trade / specialty"
              value={trade}
              onChange={setTrade}
              placeholder="e.g. flooring, general contractor"
            />
            <PrimaryButton
              label="Submit interest"
              onPress={onSubmit}
              loading={loading}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChange,
  keyboard,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: "email-address" | "phone-pad" | "default";
  placeholder?: string;
}) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard || "default"}
        autoCapitalize={keyboard === "email-address" ? "none" : "words"}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: {
    backgroundColor: colors.navy,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    color: colors.accentFg,
    fontWeight: "900",
    fontSize: 11,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    marginTop: spacing.lg,
    color: colors.white,
    fontSize: 26,
    fontWeight: "800",
    lineHeight: 32,
  },
  body: {
    marginTop: spacing.md,
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    lineHeight: 22,
  },
  perks: { padding: spacing.xl },
  perk: { fontSize: 15, fontWeight: "600", color: colors.ink, marginBottom: 10 },
  form: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  formTitle: { fontSize: 18, fontWeight: "800", color: colors.ink },
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
    color: colors.ink,
    backgroundColor: colors.surface,
  },
  success: {
    margin: spacing.lg,
    padding: spacing.xl,
    backgroundColor: colors.successSoft,
    borderRadius: 14,
  },
  successTitle: { fontSize: 18, fontWeight: "800", color: colors.success },
  successBody: { marginTop: 8, color: colors.ink, lineHeight: 20 },
});
