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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Order confirmed
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{order.id}</h1>
        <p className="mt-2 text-sm text-slate-600">
          Placed {formatDate(order.createdAt)} · Status: {order.status}
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">Items</h2>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {order.lines.map((l) => (
            <li key={l.productId} className="flex justify-between gap-4 py-3">
              <div>
                <p className="font-medium text-slate-900">
                  {l.name} × {l.quantity}
                </p>
                <p className="text-slate-500">
                  {l.sku} · supplier {l.supplierId}
                </p>
              </div>
              <p className="font-medium">
                {formatCAD(l.unitPriceCents * l.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatCAD(order.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>
              {order.shippingCents === 0
                ? "Free"
                : formatCAD(order.shippingCents)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>HST</dt>
            <dd>{formatCAD(order.taxCents)}</dd>
          </div>
          <div className="flex justify-between text-base font-bold">
            <dt>Total</dt>
            <dd>{formatCAD(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-sm">
        <h2 className="font-semibold text-slate-900">Delivery</h2>
        <p className="mt-2 text-slate-700">
          {order.shipping.company}
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
          <p className="mt-3 text-slate-600">
            <span className="font-medium">Notes:</span> {order.deliveryNotes}
          </p>
        ) : null}
        <p className="mt-3 text-slate-500">
          Payment method: {order.paymentMethod.replace("mock_", "Mock ")}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/search"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Continue shopping
        </Link>
        <Link href="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium">
          Home
        </Link>
      </div>
    </div>
  );
}
