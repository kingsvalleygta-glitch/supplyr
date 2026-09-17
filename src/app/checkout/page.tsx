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
      <div className="container-site max-w-xl py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">
          Nothing to check out
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Add materials to your cart before placing an order.
        </p>
        <Link href="/search" className="btn-primary mt-6 inline-flex">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-site py-8 sm:py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Demo checkout — no real charges. Delivery estimates for the Greater
        Toronto Area.
      </p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8 rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 font-display text-base font-semibold text-ink sm:col-span-2">
              Jobsite / billing contact
            </legend>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted sm:col-span-2">
              Company
              <input name="company" required className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Contact name
              <input name="contactName" required className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Phone
              <input name="phone" type="tel" required className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted sm:col-span-2">
              Email
              <input name="email" type="email" required className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
          </fieldset>
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 font-display text-base font-semibold text-ink sm:col-span-2">
              Delivery address (GTA)
            </legend>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted sm:col-span-2">
              Address line 1
              <input name="address1" required className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted sm:col-span-2">
              Address line 2
              <input name="address2" className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              City
              <input name="city" required defaultValue="Toronto" className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Province
              <input name="province" required defaultValue="ON" className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Postal code
              <input name="postalCode" required placeholder="M5V 2T6" className="input-field mt-1.5 normal-case tracking-normal" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-muted sm:col-span-2">
              Delivery notes
              <textarea
                name="deliveryNotes"
                rows={2}
                className="input-field mt-1.5 normal-case tracking-normal"
                placeholder="Gate code, crane window, site contact…"
              />
            </label>
          </fieldset>
          <fieldset>
            <legend className="mb-3 font-display text-base font-semibold text-ink">
              Payment (demo)
            </legend>
            <select
              name="paymentMethod"
              className="input-field"
              defaultValue="mock_card"
            >
              <option value="mock_card">Mock credit card</option>
              <option value="mock_net30">Mock Net 30 trade account</option>
              <option value="mock_etransfer">Mock Interac e-Transfer</option>
            </select>
          </fieldset>
          {error ? <p className="text-sm font-medium text-danger">{error}</p> : null}
        </div>
        <aside className="h-fit rounded-xl border border-border bg-surface p-6 shadow-sm lg:sticky lg:top-28">
          <h2 className="font-display text-lg font-semibold text-ink">Summary</h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            {lines.map(({ item, product }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <span className="min-w-0">
                  <span className="line-clamp-1 text-ink">{product.name}</span>
                  <span className="text-ink-faint"> × {item.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-ink">
                  {formatCAD(product.priceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd className="font-medium">{formatCAD(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="font-medium">
                {shipping === 0 ? "Free" : formatCAD(shipping)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">HST</dt>
              <dd className="font-medium">{formatCAD(tax)}</dd>
            </div>
            <div className="flex justify-between pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd className="font-display">{formatCAD(total)}</dd>
            </div>
          </dl>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary mt-6 w-full py-3 disabled:opacity-60"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
