import Link from "next/link";
import type { Category } from "@/lib/types";
import { CategoryVisual } from "@/components/CategoryVisual";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
    >
      <CategoryVisual
        categoryId={category.id}
        className="aspect-[16/9] w-full"
        label={category.name}
      />
      <div className="p-4 sm:p-5">
        <h3 className="font-display text-lg font-semibold text-ink group-hover:text-accent-hover">
          {category.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {category.description}
        </p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Shop category →
        </p>
      </div>
    </Link>
  );
}
