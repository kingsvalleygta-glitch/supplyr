import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  AREAS,
  FLOORING_OPTIONS,
  estimateCents,
  type AreaKey,
  type FlooringType,
} from "@/lib/calculatorRates";
import { formatCAD } from "@/lib/format";
import { colors, spacing } from "@/lib/theme";

export default function CalculatorScreen() {
  const [area, setArea] = useState<AreaKey>("first");
  const [flooring, setFlooring] = useState<FlooringType>("resilient");
  const [sqFt, setSqFt] = useState("200");
  const [removal, setRemoval] = useState(false);
  const [underlayment, setUnderlayment] = useState(false);

  const estimate = useMemo(() => {
    const n = Number(sqFt) || 0;
    return estimateCents(flooring, n, removal, underlayment);
  }, [flooring, sqFt, removal, underlayment]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }}
    >
      <Text style={styles.title}>Installation estimate</Text>
      <Text style={styles.disclaimer}>
        Rough labour estimate only — not a quote. Rates are transparent
        placeholders for GTA residential work.
      </Text>

      <Text style={styles.label}>Area</Text>
      <View style={styles.chips}>
        {AREAS.map((a) => (
          <Pressable
            key={a.key}
            onPress={() => setArea(a.key)}
            style={[styles.chip, area === a.key && styles.chipOn]}
          >
            <Text style={[styles.chipText, area === a.key && styles.chipTextOn]}>
              {a.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Flooring type</Text>
      <View style={styles.chips}>
        {FLOORING_OPTIONS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFlooring(f.key)}
            style={[styles.chip, flooring === f.key && styles.chipOn]}
          >
            <Text
              style={[styles.chipText, flooring === f.key && styles.chipTextOn]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Square footage</Text>
      <TextInput
        value={sqFt}
        onChangeText={setSqFt}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Existing floor removal</Text>
        <Switch
          value={removal}
          onValueChange={setRemoval}
          trackColor={{ true: colors.accent, false: colors.borderStrong }}
          thumbColor={colors.white}
        />
      </View>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Underlayment</Text>
        <Switch
          value={underlayment}
          onValueChange={setUnderlayment}
          trackColor={{ true: colors.accent, false: colors.borderStrong }}
          thumbColor={colors.white}
        />
      </View>

      <View style={styles.result}>
        <Text style={styles.resultKicker}>
          {AREAS.find((a) => a.key === area)?.label}
        </Text>
        <Text style={styles.resultTotal}>{formatCAD(estimate.totalCents)}</Text>
        <Text style={styles.resultLine}>
          Labour {formatCAD(estimate.labourCents)}
          {estimate.addonsCents
            ? ` · Add-ons ${formatCAD(estimate.addonsCents)}`
            : ""}
        </Text>
        <Text style={styles.resultNote}>
          Estimate only. Contact Supplyr for a site-specific quote.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: "800", color: colors.ink },
  disclaimer: {
    marginTop: 8,
    marginBottom: spacing.lg,
    color: colors.inkMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  label: {
    marginTop: spacing.lg,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "800",
    color: colors.inkMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: 13, fontWeight: "700", color: colors.ink },
  chipTextOn: { color: colors.accent },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: "700",
    backgroundColor: colors.surface,
    color: colors.ink,
  },
  switchRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchLabel: { fontWeight: "700", color: colors.ink, fontSize: 15 },
  result: {
    marginTop: spacing.xxl,
    backgroundColor: colors.navy,
    borderRadius: 16,
    padding: spacing.xl,
  },
  resultKicker: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  resultTotal: {
    marginTop: 8,
    color: colors.white,
    fontSize: 36,
    fontWeight: "900",
  },
  resultLine: { marginTop: 8, color: "rgba(255,255,255,0.7)", fontSize: 14 },
  resultNote: {
    marginTop: 14,
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    lineHeight: 17,
  },
});
