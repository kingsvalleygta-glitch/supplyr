import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCAD } from "@/lib/format";
import { getCategoryName } from "@/lib/repositories/categoryRepository";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-amber-400 hover:shadow-md"
    >
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-5xl">
        <span aria-hidden>{product.imageEmoji}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {getCategoryName(product.categoryId)} · {product.sku}
        </p>
        <h3 className="text-base font-semibold text-slate-900 group-hover:text-amber-700">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-lg font-bold text-slate-900">
              {formatCAD(product.priceCents)}
              <span className="ml-1 text-xs font-normal text-slate-500">
                / {product.unit}
              </span>
            </p>
            {product.compareAtCents ? (
              <p className="text-xs text-slate-400 line-through">
                {formatCAD(product.compareAtCents)}
              </p>
            ) : null}
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              product.inStock
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {product.inStock ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}
