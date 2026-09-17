import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCAD } from "@/lib/format";
import { getCategoryName } from "@/lib/repositories/categoryRepository";
import { CategoryVisual } from "@/components/CategoryVisual";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border">
        <CategoryVisual
          categoryId={product.categoryId}
          className="h-full w-full transition duration-300 group-hover:scale-[1.03]"
          label={`${product.name} placeholder`}
        />
        <span
          className={`badge-stock absolute right-3 top-3 ${
            product.inStock ? "badge-stock-in" : "badge-stock-out"
          }`}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
            {getCategoryName(product.categoryId)}
          </p>
          <p className="font-mono text-[11px] text-ink-faint">{product.sku}</p>
        </div>
        <h3 className="font-display text-base font-semibold leading-snug text-ink group-hover:text-accent-hover">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {product.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-ink">
              {formatCAD(product.priceCents)}
            </p>
            <p className="text-xs text-ink-faint">
              per {product.unit}
              {product.compareAtCents ? (
                <span className="ml-2 line-through">
                  {formatCAD(product.compareAtCents)}
                </span>
              ) : null}
            </p>
          </div>
          <span className="rounded-md bg-navy px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
