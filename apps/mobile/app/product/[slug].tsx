import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { fetchProduct } from "@/lib/api";
import { formatCAD } from "@/lib/format";
import { colors, spacing } from "@/lib/theme";
import type { Product } from "@/lib/types";

export default function ProductScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { add } = useCart();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProduct(slug)
      .then((r) => {
        setProduct(r.product);
        setRelated(r.related);
        setCategoryName(r.categoryName);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Product not found")
      )
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Not found"}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: product.name.slice(0, 28) }} />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.media}>
          {product.imageUrl ? (
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: "100%", height: 280 }}
              contentFit="contain"
            />
          ) : (
            <Text style={{ fontSize: 72 }}>{product.imageEmoji || "📦"}</Text>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.meta}>
            {product.brand}
            {categoryName ? ` · ${categoryName}` : ""}
          </Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.sku}>SKU {product.sku}</Text>
          <Text style={styles.price}>
            {formatCAD(product.priceCents)}
            <Text style={styles.unit}> / {product.unit || "ea"}</Text>
          </Text>
          <Text
            style={[styles.stock, !product.inStock && { color: colors.danger }]}
          >
            {product.inStock
              ? `In stock (${product.stockQty})`
              : "Out of stock"}
          </Text>

          <PrimaryButton
            label="Add to cart"
            disabled={!product.inStock}
            onPress={() => {
              add(product, 1);
              Alert.alert("Added to cart", product.name, [
                { text: "Keep browsing" },
                { text: "View cart", onPress: () => router.push("/cart") },
              ]);
            }}
            style={{ marginTop: spacing.lg }}
          />

          {product.sellerName ? (
            <Text style={styles.seller}>Sold by {product.sellerName}</Text>
          ) : null}

          <Text style={styles.section}>Description</Text>
          <Text style={styles.desc}>
            {product.description || "No description available."}
          </Text>

          {product.specs?.length ? (
            <>
              <Text style={styles.section}>Specs</Text>
              {product.specs.map((s) => (
                <View key={s.label} style={styles.specRow}>
                  <Text style={styles.specLabel}>{s.label}</Text>
                  <Text style={styles.specValue}>{s.value}</Text>
                </View>
              ))}
            </>
          ) : null}

          {related.length ? (
            <>
              <Text style={styles.section}>Related</Text>
              <View style={styles.related}>
                {related.slice(0, 4).map((p) => (
                  <View key={p.id} style={{ width: "50%" }}>
                    <ProductCard product={p} />
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: colors.danger, fontWeight: "700" },
  media: {
    height: 300,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: spacing.lg },
  meta: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.inkFaint,
    textTransform: "uppercase",
  },
  name: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    lineHeight: 28,
  },
  sku: { marginTop: 6, color: colors.inkMuted, fontSize: 13 },
  price: {
    marginTop: 14,
    fontSize: 28,
    fontWeight: "900",
    color: colors.ink,
  },
  unit: { fontSize: 14, fontWeight: "600", color: colors.inkMuted },
  stock: {
    marginTop: 8,
    fontWeight: "700",
    color: colors.success,
    fontSize: 14,
  },
  seller: { marginTop: 12, color: colors.inkMuted, fontSize: 13 },
  section: {
    marginTop: spacing.xxl,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  desc: { color: colors.inkMuted, lineHeight: 22, fontSize: 15 },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  specLabel: { color: colors.inkMuted, fontWeight: "600", flex: 1 },
  specValue: {
    color: colors.ink,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
  related: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -4 },
});
