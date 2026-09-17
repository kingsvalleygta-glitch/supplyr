import Link from "next/link";
import type { Category } from "@/lib/types";
import { ProductMedia } from "@/components/ProductMedia";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-navy/20 hover:shadow-md"
    >
      <ProductMedia
        categoryId={category.id}
        alt={category.name}
        className="aspect-[16/10] w-full sm:aspect-[16/9]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="p-4 sm:p-6">
        <h3 className="font-display text-lg font-bold text-ink group-hover:text-navy sm:text-xl">
          {category.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {category.description}
        </p>
        <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-navy">
          Shop category
          <span className="ml-1 text-accent">→</span>
        </p>
      </div>
    </Link>
  );
}
