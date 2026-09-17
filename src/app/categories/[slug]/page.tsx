import { notFound } from "next/navigation";
import { Suspense } from "react";
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <p className="text-sm text-slate-500">Categories</p>
        <h1 className="mt-1 flex items-center gap-3 text-3xl font-bold text-slate-900">
          <span aria-hidden>{category.imageEmoji}</span>
          {category.name}
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">{category.description}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-slate-100" />}>
          <ProductFilters />
        </Suspense>
        <div>
          <p className="mb-4 text-sm text-slate-600">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
          {products.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No products match these filters.
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
