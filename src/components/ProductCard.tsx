"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatCAD } from "@/lib/format";
import { getCategoryName } from "@/lib/repositories/categoryRepository";
import { ProductMedia } from "@/components/ProductMedia";
import { useProStatus } from "@/components/ProProvider";

export function ProductCard({ product }: { product: Product }) {
  const { isPro } = useProStatus();
  const displayCents = isPro
    ? Math.round(product.priceCents * 0.9)
    : product.priceCents;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-navy/20 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-border">
        <ProductMedia
          categoryId={product.categoryId}
          productId={product.id}
          imageUrl={product.imageUrl}
          alt={product.name}
          className="h-full w-full transition duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <span
          className={`badge-stock absolute right-2 top-2 sm:right-3 sm:top-3 ${
            product.inStock ? "badge-stock-in" : "badge-stock-out"
          }`}
        >
          {product.inStock ? "In stock" : "Out of stock"}
        </span>
        {isPro ? (
          <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-fg sm:left-3 sm:top-3">
            Pro −10%
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:gap-2 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint sm:text-[11px]">
            {getCategoryName(product.categoryId)}
          </p>
          <p className="shrink-0 font-mono text-[10px] text-ink-faint sm:text-[11px]">
            {product.sku}
          </p>
        </div>
        <h3 className="font-display text-sm font-semibold leading-snug text-ink group-hover:text-navy sm:text-base">
          {product.name}
        </h3>
        <p className="line-clamp-2 hidden text-sm leading-relaxed text-ink-muted sm:block">
          {product.description}
        </p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2 sm:gap-3 sm:pt-3">
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-ink sm:text-xl">
              {formatCAD(displayCents)}
            </p>
            <p className="text-[11px] text-ink-faint sm:text-xs">
              per {product.unit}
              {isPro ? (
                <span className="ml-1.5 line-through">
                  {formatCAD(product.priceCents)}
                </span>
              ) : product.compareAtCents ? (
                <span className="ml-1.5 line-through sm:ml-2">
                  {formatCAD(product.compareAtCents)}
                </span>
              ) : null}
            </p>
          </div>
          <span className="hidden rounded-md bg-navy px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100 sm:inline">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
