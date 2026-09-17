import type { ProductFilters } from "@/lib/types";

export function filtersFromSearchParams(
  sp: URLSearchParams | Record<string, string | string[] | undefined>,
  categorySlug?: string
): ProductFilters {
  const get = (key: string): string | undefined => {
    if (sp instanceof URLSearchParams) {
      return sp.get(key) ?? undefined;
    }
    const v = sp[key];
    return Array.isArray(v) ? v[0] : v;
  };

  const min = get("min");
  const max = get("max");
  const sort = get("sort") as ProductFilters["sort"] | undefined;

  return {
    categorySlug,
    q: get("q"),
    minPriceCents: min ? Math.round(parseFloat(min) * 100) : undefined,
    maxPriceCents: max ? Math.round(parseFloat(max) * 100) : undefined,
    inStockOnly: get("inStock") === "1",
    sort: sort || "featured",
  };
}
