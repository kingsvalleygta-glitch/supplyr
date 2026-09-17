import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { formatCAD, formatDate } from "@/lib/format";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { productRepository } from "@/lib/repositories/productRepository";
import { AdminLoginForm } from "@/app/admin/AdminLoginForm";
import { AdminLogoutButton } from "@/app/admin/AdminLogoutButton";

const COOKIE = "supplyr_admin";

export const metadata = { title: "Admin" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const jar = await cookies();
  const authed = jar.get(COOKIE)?.value === "1";
  const expected = process.env.ADMIN_PASSWORD;

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
        <p className="mt-2 text-sm text-slate-600">
          Password-gated overview of catalog and recent orders. Set{" "}
          <code className="rounded bg-slate-100 px-1">ADMIN_PASSWORD</code> in{" "}
          <code className="rounded bg-slate-100 px-1">.env.local</code>.
        </p>
        {!expected ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            ADMIN_PASSWORD is not set. Add it to enable login (default for local
            demos: use any password after setting the env var).
          </p>
        ) : null}
        {sp.error ? (
          <p className="mt-4 text-sm text-rose-600">Invalid password.</p>
        ) : null}
        <AdminLoginForm />
      </div>
    );
  }

  const orders = await orderRepository.listAsync();
  const products = productRepository.list();
  const inStock = products.filter((p) => p.inStock).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin overview</h1>
          <p className="mt-1 text-sm text-slate-600">
            Light ops view — no seller onboarding or payouts in this MVP.
          </p>
        </div>
        <AdminLogoutButton />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-1 text-3xl font-bold">{products.length}</p>
          <p className="text-xs text-slate-500">{inStock} in stock</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-1 text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">GMV (confirmed)</p>
          <p className="mt-1 text-3xl font-bold">
            {formatCAD(orders.reduce((s, o) => s + o.totalCents, 0))}
          </p>
        </div>
      </div>
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Order</th>
                  <th className="px-4 py-2 font-medium">When</th>
                  <th className="px-4 py-2 font-medium">Company</th>
                  <th className="px-4 py-2 font-medium">Total</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 50).map((o) => (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium">
                      <a href={`/orders/${o.id}`} className="text-amber-700 hover:underline">
                        {o.id}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-slate-600">
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-2">{o.shipping.company}</td>
                    <td className="px-4 py-2">{formatCAD(o.totalCents)}</td>
                    <td className="px-4 py-2">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
