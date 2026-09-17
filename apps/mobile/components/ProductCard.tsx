import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCAD } from "@/lib/format";
import { colors, spacing } from "@/lib/theme";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.imageWrap}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.image}
              contentFit="contain"
            />
          ) : (
            <Text style={styles.emoji}>{product.imageEmoji || "📦"}</Text>
          )}
        </View>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand || product.sellerName || "Supplyr"}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>{formatCAD(product.priceCents)}</Text>
        {!product.inStock ? (
          <Text style={styles.oos}>Out of stock</Text>
        ) : (
          <Text style={styles.unit}>/{product.unit || "ea"}</Text>
        )}
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    margin: spacing.xs,
  },
  imageWrap: {
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  image: { width: "100%", height: "100%" },
  emoji: { fontSize: 40 },
  brand: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.inkFaint,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  name: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    minHeight: 36,
  },
  price: { marginTop: 8, fontSize: 16, fontWeight: "800", color: colors.ink },
  unit: { fontSize: 11, color: colors.inkMuted },
  oos: { fontSize: 11, color: colors.danger, fontWeight: "600" },
});
