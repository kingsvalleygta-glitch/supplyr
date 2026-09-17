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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Search catalog</h1>
      <p className="mt-2 text-slate-600">
        {q
          ? `Results for “${q}” · ${products.length} match${products.length === 1 ? "" : "es"}`
          : `Browse all ${products.length} products. Filter by price, stock, and sort.`}
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-100" />}>
          <ProductFilters showSearch initialQ={q} />
        </Suspense>
        <div>
          {products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No products found. Try a different SKU, name, or clear filters.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
