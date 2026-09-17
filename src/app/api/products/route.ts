import { corsJson, corsOptions } from "@/lib/cors";
import { productRepository } from "@/lib/repositories/productRepository";
import type { ProductFilters } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || "1") || 1);
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get("limit") || "24") || 24)
  );
  const featuredOnly = searchParams.get("featured") === "1";

  const filters: ProductFilters = {
    categorySlug: searchParams.get("category") || undefined,
    q: searchParams.get("q") || undefined,
    inStockOnly: searchParams.get("inStock") === "1",
    sort: (searchParams.get("sort") as ProductFilters["sort"]) || "featured",
  };

  const min = searchParams.get("minPrice");
  const max = searchParams.get("maxPrice");
  if (min) filters.minPriceCents = Math.round(Number(min) * 100);
  if (max) filters.maxPriceCents = Math.round(Number(max) * 100);

  let list = featuredOnly
    ? productRepository.getFeatured(Number(searchParams.get("limit") || "12") || 12)
    : productRepository.list(filters);

  const total = list.length;
  const start = (page - 1) * limit;
  const products = featuredOnly ? list : list.slice(start, start + limit);

  return corsJson({
    products,
    page: featuredOnly ? 1 : page,
    limit: featuredOnly ? products.length : limit,
    total: featuredOnly ? products.length : total,
    totalPages: featuredOnly ? 1 : Math.max(1, Math.ceil(total / limit)),
    hasMore: featuredOnly ? false : start + limit < total,
  });
}
