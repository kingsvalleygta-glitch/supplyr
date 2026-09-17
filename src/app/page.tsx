import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { categoryRepository } from "@/lib/repositories/categoryRepository";
import { productRepository } from "@/lib/repositories/productRepository";

export default function HomePage() {
  const categories = categoryRepository.getFeatured();
  const featured = productRepository.getFeatured(8);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Kings Valley Homes · Toronto / GTA
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Construction supplies, built for the jobsite.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Supplyr is a Wayfair-style storefront for lumber, fasteners,
              concrete, electrical, plumbing, tools, and safety gear — curated
              by KVH today, ready for multi-supplier expansion tomorrow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/search"
                className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-400"
              >
                Browse catalog
              </Link>
              <Link
                href="/categories/lumber-sheet-goods"
                className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Shop lumber
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["30+", "Seed SKUs across 8 categories"],
              ["CAD", "en-CA pricing & HST placeholders"],
              ["GTA", "Delivery windows for Greater Toronto"],
              ["Hybrid", "KVH-owned catalog · marketplace seams"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl border border-slate-700 bg-slate-800/60 p-4"
              >
                <p className="text-2xl font-bold text-amber-400">{k}</p>
                <p className="mt-1 text-slate-300">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Featured categories
            </h2>
            <p className="mt-1 text-slate-600">
              Start with the trades your crews order every week.
            </p>
          </div>
          <Link href="/search" className="text-sm font-medium text-amber-700 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Featured products
            </h2>
            <p className="mt-1 text-slate-600">
              High-velocity SKUs stocked for Toronto builds.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
