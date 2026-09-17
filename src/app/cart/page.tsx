"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CategoryVisual } from "@/components/CategoryVisual";
import { useCart } from "@/components/CartProvider";
import { formatCAD, shippingCentsFor, taxCentsFor } from "@/lib/format";
import productsData from "@/data/products.json";
import type { Product } from "@/lib/types";

const products = productsData as Product[];

export default function CartPage() {
  const { items, setQuantity, removeItem } = useCart();

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { item, product, lineTotal: product.priceCents * item.quantity };
      })
      .filter(Boolean) as {
      item: (typeof items)[0];
      product: Product;
      lineTotal: number;
    }[];
  }, [items]);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const shipping = shippingCentsFor(subtotal);
  const tax = taxCentsFor(subtotal, shipping);
  const total = subtotal + shipping + tax;

  return (
    <div className="container-site py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Cart
      </h1>
      {lines.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-ink-faint">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 5h2l1.5 10h11L20 8H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="19" r="1.5" fill="currentColor" />
              <circle cx="17" cy="19" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-ink">
            Your cart is empty
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            Browse the catalog and add materials for your next GTA jobsite.
          </p>
          <Link href="/search" className="btn-primary mt-6 inline-flex">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="space-y-4">
            {lines.map(({ item, product, lineTotal }) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm sm:flex-nowrap"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border">
                  <CategoryVisual
                    categoryId={product.categoryId}
                    className="h-full w-full"
                    label={product.name}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-semibold text-ink hover:text-accent-hover"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 font-mono text-xs text-ink-faint">
                    {product.sku}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {formatCAD(product.priceCents)} / {product.unit}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-ink-muted">
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(product.id, Math.max(1, Number(e.target.value) || 1))
                    }
                    className="input-field w-16 py-2"
                  />
                </label>
                <p className="w-24 text-right font-display font-semibold text-ink">
                  {formatCAD(lineTotal)}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="text-sm font-medium text-danger hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="font-display text-lg font-semibold text-ink">
              Order summary
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">Subtotal</dt>
                <dd className="font-medium text-ink">{formatCAD(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">GTA delivery</dt>
                <dd className="font-medium text-ink">
                  {shipping === 0 ? "Free" : formatCAD(shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">HST (13%)</dt>
                <dd className="font-medium text-ink">{formatCAD(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <dt className="text-ink">Total</dt>
                <dd className="font-display text-ink">{formatCAD(total)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="btn-primary mt-6 w-full py-3">
              Proceed to checkout
            </Link>
            <Link
              href="/search"
              className="mt-3 block text-center text-sm font-medium text-ink-muted hover:text-ink"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
