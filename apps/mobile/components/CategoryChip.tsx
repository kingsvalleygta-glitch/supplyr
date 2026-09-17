import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing } from "@/lib/theme";
import type { Category } from "@/lib/types";

export function CategoryChip({ category }: { category: Category }) {
  return (
    <Link href={`/category/${category.slug}`} asChild>
      <Pressable style={styles.chip}>
        <Text style={styles.emoji}>{category.imageEmoji}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {category.name}
        </Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  chip: {
    width: 108,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    marginRight: spacing.sm,
  },
  emoji: { fontSize: 28, marginBottom: 6 },
  name: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center",
  },
});
