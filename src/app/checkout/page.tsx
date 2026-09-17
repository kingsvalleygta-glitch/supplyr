"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatCAD, shippingCentsFor, taxCentsFor } from "@/lib/format";
import productsData from "@/data/products.json";
import type { Product, ShippingAddress } from "@/lib/types";

const products = productsData as Product[];

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lines = useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return { item, product };
      })
      .filter(Boolean) as { item: (typeof items)[0]; product: Product }[];
  }, [items]);

  const subtotal = lines.reduce(
    (s, l) => s + l.product.priceCents * l.item.quantity,
    0
  );
  const shipping = shippingCentsFor(subtotal);
  const tax = taxCentsFor(subtotal, shipping);
  const total = subtotal + shipping + tax;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const shippingAddr: ShippingAddress = {
      company: String(fd.get("company") || ""),
      contactName: String(fd.get("contactName") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      address1: String(fd.get("address1") || ""),
      address2: String(fd.get("address2") || "") || undefined,
      city: String(fd.get("city") || ""),
      province: String(fd.get("province") || "ON"),
      postalCode: String(fd.get("postalCode") || ""),
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            productId: l.product.id,
            quantity: l.item.quantity,
          })),
          shipping: shippingAddr,
          deliveryNotes: String(fd.get("deliveryNotes") || "") || undefined,
          paymentMethod: String(fd.get("paymentMethod") || "mock_card"),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      clear();
      router.push(`/orders/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <Link href="/search" className="mt-4 inline-block text-amber-700 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
      <p className="mt-2 text-sm text-slate-600">
        Mock payment only — no real charges. Delivery placeholders for Greater Toronto Area.
      </p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 text-sm font-semibold text-slate-900 sm:col-span-2">
              Jobsite / billing contact
            </legend>
            <label className="text-xs font-medium text-slate-600 sm:col-span-2">
              Company
              <input name="company" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Contact name
              <input name="contactName" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Phone
              <input name="phone" type="tel" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-600 sm:col-span-2">
              Email
              <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 text-sm font-semibold text-slate-900 sm:col-span-2">
              Delivery address (GTA)
            </legend>
            <label className="text-xs font-medium text-slate-600 sm:col-span-2">
              Address line 1
              <input name="address1" required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-600 sm:col-span-2">
              Address line 2
              <input name="address2" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-600">
              City
              <input name="city" required defaultValue="Toronto" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Province
              <input name="province" required defaultValue="ON" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-600">
              Postal code
              <input name="postalCode" required placeholder="M5V 2T6" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </label>
            <label className="text-xs font-medium text-slate-600 sm:col-span-2">
              Delivery notes
              <textarea name="deliveryNotes" rows={2} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Gate code, crane window, site contact…" />
            </label>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-900">
              Payment (mock)
            </legend>
            <select
              name="paymentMethod"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              defaultValue="mock_card"
            >
              <option value="mock_card">Mock credit card</option>
              <option value="mock_net30">Mock Net 30 trade account</option>
              <option value="mock_etransfer">Mock Interac e-Transfer</option>
            </select>
          </fieldset>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Summary</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {lines.map(({ item, product }) => (
              <li key={product.id} className="flex justify-between gap-2">
                <span>
                  {product.name} × {item.quantity}
                </span>
                <span>{formatCAD(product.priceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCAD(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{shipping === 0 ? "Free" : formatCAD(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>HST</dt>
              <dd>{formatCAD(tax)}</dd>
            </div>
            <div className="flex justify-between text-base font-bold">
              <dt>Total</dt>
              <dd>{formatCAD(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-lg bg-amber-500 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-400 disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
