import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { colors, spacing } from "@/lib/theme";
import type { Product } from "@/lib/types";

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [title, setTitle] = useState(slug || "Category");
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchCategories()
      .then((r) => {
        const c = r.categories.find((x) => x.slug === slug);
        if (c) setTitle(c.name);
      })
      .catch(() => {});
  }, [slug]);

  const load = useCallback(
    async (pageNum: number, append: boolean) => {
      if (!slug) return;
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await fetchProducts({
          page: pageNum,
          limit: 24,
          category: slug,
        });
        setProducts((prev) =>
          append ? [...prev, ...res.products] : res.products
        );
        setHasMore(res.hasMore);
        setPage(pageNum);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    load(1, false);
  }, [load]);

  return (
    <>
      <Stack.Screen options={{ title }} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : (
        <FlatList
          style={styles.screen}
          data={products}
          keyExtractor={(p) => p.id}
          numColumns={2}
          contentContainerStyle={{ padding: spacing.sm, paddingBottom: 40 }}
          ListEmptyComponent={
            <EmptyState title="No products in this category" />
          }
          onEndReached={() => {
            if (hasMore && !loadingMore) load(page + 1, true);
          }}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.accent} style={{ margin: 16 }} />
            ) : null
          }
          ListHeaderComponent={
            <Text style={styles.header}>{title}</Text>
          }
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    padding: spacing.md,
  },
});
