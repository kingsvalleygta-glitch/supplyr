import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { colors, spacing } from "@/lib/theme";
import type { Category, Product } from "@/lib/types";

export default function BrowseScreen() {
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    fetchCategories()
      .then((r) => setCategories(r.categories))
      .catch(() => {});
  }, []);

  const load = useCallback(
    async (pageNum: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      try {
        const res = await fetchProducts({
          page: pageNum,
          limit: 24,
          q: debounced || undefined,
          category,
          sort: "featured",
        });
        setProducts((prev) =>
          append ? [...prev, ...res.products] : res.products
        );
        setHasMore(res.hasMore);
        setTotal(res.total);
        setPage(pageNum);
      } catch {
        if (!append) setProducts([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debounced, category]
  );

  useEffect(() => {
    load(1, false);
  }, [load]);

  return (
    <View style={styles.screen}>
      <View style={styles.searchWrap}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search name, SKU, brand…"
          placeholderTextColor={colors.inkFaint}
          style={styles.search}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <Text style={styles.count}>
          {total.toLocaleString("en-CA")} products
        </Text>
      </View>

      <FlatList
        horizontal
        data={[{ slug: "", name: "All", id: "all" } as Category, ...categories]}
        keyExtractor={(c) => c.id}
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={{ paddingHorizontal: spacing.md }}
        renderItem={({ item }) => {
          const active =
            (item.slug === "" && !category) || item.slug === category;
          return (
            <Text
              onPress={() =>
                setCategory(item.slug === "" ? undefined : item.slug)
              }
              style={[styles.filter, active && styles.filterActive]}
            >
              {item.name}
            </Text>
          );
        }}
      />

      {loading ? (
        <ActivityIndicator
          style={{ marginTop: 40 }}
          color={colors.accent}
          size="large"
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          numColumns={2}
          contentContainerStyle={{ padding: spacing.sm, paddingBottom: 40 }}
          ListEmptyComponent={
            <EmptyState
              title="No products found"
              body="Try another search or category."
            />
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
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  searchWrap: { padding: spacing.md, backgroundColor: colors.surface },
  search: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  count: {
    marginTop: 8,
    fontSize: 12,
    color: colors.inkMuted,
    fontWeight: "600",
  },
  filters: { maxHeight: 48, marginVertical: spacing.sm },
  filter: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    fontSize: 13,
    fontWeight: "700",
    color: colors.inkMuted,
  },
  filterActive: {
    backgroundColor: colors.navy,
    borderColor: colors.navy,
    color: colors.accent,
  },
});
