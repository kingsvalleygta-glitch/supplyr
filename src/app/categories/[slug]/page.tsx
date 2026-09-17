import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductMedia } from "@/components/ProductMedia";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { categoryRepository } from "@/lib/repositories/categoryRepository";
import { productRepository } from "@/lib/repositories/productRepository";
import { filtersFromSearchParams } from "@/lib/query";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateStaticParams() {
  return categoryRepository.list().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cat = categoryRepository.getBySlug(slug);
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = categoryRepository.getBySlug(slug);
  if (!category) notFound();

  const filters = filtersFromSearchParams(sp, slug);
  const products = productRepository.list(filters);

  return (
    <div>
      <div className="border-b border-border bg-surface">
        <div className="container-site grid gap-6 py-8 sm:grid-cols-[180px_1fr] sm:items-center sm:py-10">
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <ProductMedia
              categoryId={category.id}
              alt={category.name}
              className="aspect-[4/3] w-full"
              sizes="(max-width: 640px) 100vw, 180px"
              priority
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Categories
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-2xl text-ink-muted">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="container-site py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-surface-muted" />}>
            <ProductFilters />
          </Suspense>
          <div>
            <p className="mb-5 text-sm text-ink-muted">
              {products.length} product{products.length === 1 ? "" : "s"}
            </p>
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center shadow-sm">
                <p className="font-display text-lg font-semibold text-ink">
                  No products match these filters
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  Adjust price, stock, or sort and try again.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
