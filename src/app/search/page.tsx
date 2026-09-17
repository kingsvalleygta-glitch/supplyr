import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { filtersFromSearchParams } from "@/lib/query";
import { productRepository } from "@/lib/repositories/productRepository";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters = filtersFromSearchParams(sp);
  const products = productRepository.list(filters);
  const q = typeof sp.q === "string" ? sp.q : "";

  return (
    <div className="container-site py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Search catalog
      </h1>
      <p className="mt-2 text-ink-muted">
        {q
          ? `Results for “${q}” · ${products.length} match${products.length === 1 ? "" : "es"}`
          : `Browse all ${products.length} products. Filter by price, stock, and sort.`}
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-surface-muted" />}>
          <ProductFilters showSearch initialQ={q} />
        </Suspense>
        <div>
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center shadow-sm">
              <p className="font-display text-lg font-semibold text-ink">
                No products found
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                Try a different SKU, name, or clear your filters.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
