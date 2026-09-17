import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CategoryChip } from "@/components/CategoryChip";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { API_BASE_URL, fetchCategories, fetchProducts } from "@/lib/api";
import { colors, spacing } from "@/lib/theme";
import type { Category, Product } from "@/lib/types";

export default function HomeScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [cats, prods] = await Promise.all([
        fetchCategories(true),
        fetchProducts({ featured: true, limit: 8 }),
      ]);
      setCategories(cats.categories);
      setFeatured(prods.products);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      refreshControl={
        <RefreshControl
          refreshing={false}
          onRefresh={load}
          tintColor={colors.accent}
        />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.kicker}>Kings Valley Homes · Toronto / GTA</Text>
        <Text style={styles.heroTitle}>
          Construction supplies,{" "}
          <Text style={styles.heroAccent}>ready for the jobsite.</Text>
        </Text>
        <Text style={styles.heroBody}>
          Order flooring, building materials, plumbing, electrical, hardware,
          and tools with clear CAD pricing and GTA delivery.
        </Text>
        <PrimaryButton
          label="Browse catalog"
          onPress={() => router.push("/browse")}
          style={{ marginTop: spacing.lg }}
        />
        <Pressable onPress={() => router.push("/pro")} style={styles.proLink}>
          <Text style={styles.proLinkText}>Supplyr Pro for contractors →</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.apiHint}>API: {API_BASE_URL}</Text>
          <PrimaryButton
            label="Retry"
            onPress={load}
            style={{ marginTop: 12 }}
          />
        </View>
      ) : null}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((c) => (
            <CategoryChip key={c.id} category={c} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>
            Featured
          </Text>
          <Pressable onPress={() => router.push("/browse")}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        <FlatList
          data={featured}
          keyExtractor={(p) => p.id}
          numColumns={2}
          scrollEnabled={false}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hero: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  kicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  heroTitle: {
    marginTop: spacing.md,
    color: colors.white,
    fontSize: 28,
    fontWeight: "800",
    lineHeight: 34,
  },
  heroAccent: { color: colors.accent },
  heroBody: {
    marginTop: spacing.md,
    color: "rgba(255,255,255,0.72)",
    fontSize: 15,
    lineHeight: 22,
  },
  proLink: { marginTop: spacing.md },
  proLinkText: { color: colors.accent, fontWeight: "700", fontSize: 14 },
  section: { paddingHorizontal: spacing.md, marginTop: spacing.xl },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  seeAll: { color: colors.inkMuted, fontWeight: "700", fontSize: 13 },
  errorBox: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
  },
  errorText: { color: colors.danger, fontWeight: "700" },
  apiHint: { marginTop: 6, fontSize: 11, color: colors.inkMuted },
});
