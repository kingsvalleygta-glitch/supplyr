import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/lib/theme";

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: spacing.xxl, alignItems: "center" },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    textAlign: "center",
  },
  body: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
