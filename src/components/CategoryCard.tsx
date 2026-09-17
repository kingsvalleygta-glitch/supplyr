import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-amber-400 hover:shadow-md"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-2xl">
        {category.imageEmoji}
      </span>
      <div>
        <h3 className="font-semibold text-slate-900">{category.name}</h3>
        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
          {category.description}
        </p>
      </div>
    </Link>
  );
}
