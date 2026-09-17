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
      <div className="container-site max-w-md py-16">
        <h1 className="font-display text-2xl font-bold text-ink">Admin</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Password-gated overview of catalog and recent orders. Set{" "}
          <code className="rounded bg-surface-muted px-1">ADMIN_PASSWORD</code> in{" "}
          <code className="rounded bg-surface-muted px-1">.env.local</code>.
        </p>
        {!expected ? (
          <p className="mt-4 rounded-lg border border-accent/30 bg-accent-soft p-3 text-sm text-accent-fg">
            ADMIN_PASSWORD is not set. Add it to enable login (default for local
            demos: use any password after setting the env var).
          </p>
        ) : null}
        {sp.error ? (
          <p className="mt-4 text-sm text-danger">Invalid password.</p>
        ) : null}
        <AdminLoginForm />
      </div>
    );
  }

  const orders = await orderRepository.listAsync();
  const products = productRepository.list();
  const inStock = products.filter((p) => p.inStock).length;

  return (
    <div className="container-site py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Admin overview</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Internal ops overview for catalog and recent orders.
          </p>
        </div>
        <AdminLogoutButton />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm text-ink-muted">Products</p>
          <p className="mt-1 text-3xl font-bold">{products.length}</p>
          <p className="text-xs text-ink-faint">{inStock} in stock</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm text-ink-muted">Orders</p>
          <p className="mt-1 text-3xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm text-ink-muted">GMV (confirmed)</p>
          <p className="mt-1 text-3xl font-bold">
            {formatCAD(orders.reduce((s, o) => s + o.totalCents, 0))}
          </p>
        </div>
      </div>
      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Recent orders</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-ink-muted">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted text-ink-muted">
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
                  <tr key={o.id} className="border-t border-border">
                    <td className="px-4 py-2 font-medium">
                      <a href={`/orders/${o.id}`} className="text-accent hover:underline">
                        {o.id}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-ink-muted">
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
