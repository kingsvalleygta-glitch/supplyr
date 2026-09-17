import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCAD, formatDate } from "@/lib/format";
import { orderRepository } from "@/lib/repositories/orderRepository";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = await orderRepository.getByIdAsync(id);
  if (!order) notFound();

  return (
    <div className="container-site max-w-2xl py-10 sm:py-12">
      <div className="rounded-2xl border border-success/25 bg-success-soft p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-success">
          Order confirmed
        </p>
        <h1 className="font-display mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {order.id}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Placed {formatDate(order.createdAt)} · Status: {order.status}
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="font-display text-lg font-semibold text-ink">Items</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {order.lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-4 py-3.5">
              <div>
                <p className="font-medium text-ink">
                  {l.name} × {l.quantity}
                </p>
                <p className="mt-0.5 font-mono text-xs text-ink-faint">{l.sku}</p>
              </div>
              <p className="font-semibold text-ink">
                {formatCAD(l.unitPriceCents * l.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="font-medium">{formatCAD(order.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Delivery</dt>
            <dd className="font-medium">
              {order.shippingCents === 0
                ? "Free"
                : formatCAD(order.shippingCents)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">HST</dt>
            <dd className="font-medium">{formatCAD(order.taxCents)}</dd>
          </div>
          <div className="flex justify-between pt-1 text-base font-bold">
            <dt>Total</dt>
            <dd className="font-display">{formatCAD(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-border bg-surface p-6 text-sm shadow-sm">
        <h2 className="font-display text-lg font-semibold text-ink">Delivery</h2>
        <p className="mt-3 leading-relaxed text-ink-muted">
          <span className="font-medium text-ink">{order.shipping.company}</span>
          <br />
          {order.shipping.contactName} · {order.shipping.phone}
          <br />
          {order.shipping.email}
          <br />
          {order.shipping.address1}
          {order.shipping.address2 ? (
            <>
              <br />
              {order.shipping.address2}
            </>
          ) : null}
          <br />
          {order.shipping.city}, {order.shipping.province}{" "}
          {order.shipping.postalCode}
        </p>
        {order.deliveryNotes ? (
          <p className="mt-3 text-ink-muted">
            <span className="font-medium text-ink">Notes:</span>{" "}
            {order.deliveryNotes}
          </p>
        ) : null}
        <p className="mt-3 text-ink-faint">
          Payment method: {order.paymentMethod.replace("mock_", "Demo ")}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/search" className="btn-navy">
          Continue shopping
        </Link>
        <Link href="/" className="btn-secondary">
          Home
        </Link>
      </div>
    </div>
  );
}
