import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/lib/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen does not exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: { fontSize: 18, fontWeight: "800", color: colors.ink },
  link: { marginTop: spacing.lg },
  linkText: { fontSize: 15, fontWeight: "700", color: colors.navy },
});
