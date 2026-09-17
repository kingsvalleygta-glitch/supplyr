"use client";

import Link from "next/link";
import { useMemo } from "react";
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Cart</h1>
      {lines.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">Your cart is empty.</p>
          <Link
            href="/search"
            className="mt-4 inline-block rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {lines.map(({ item, product, lineTotal }) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-100 text-3xl">
                  {product.imageEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${product.slug}`}
                    className="font-semibold text-slate-900 hover:text-amber-700"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {product.sku} · {formatCAD(product.priceCents)} / {product.unit}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setQuantity(product.id, Math.max(1, Number(e.target.value) || 1))
                    }
                    className="w-16 rounded border border-slate-300 px-2 py-1"
                  />
                </label>
                <p className="w-24 text-right font-semibold">{formatCAD(lineTotal)}</p>
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  className="text-sm text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-slate-900">Order summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Subtotal</dt>
                <dd>{formatCAD(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">GTA delivery</dt>
                <dd>{shipping === 0 ? "Free" : formatCAD(shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">HST (13%)</dt>
                <dd>{formatCAD(tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold">
                <dt>Total</dt>
                <dd>{formatCAD(total)}</dd>
              </div>
            </dl>
            <Link
              href="/checkout"
              className="mt-5 block rounded-lg bg-amber-500 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-amber-400"
            >
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
