"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatCAD, formatDate } from "@/lib/format";
import { STATUS_LABELS, TRACKING_STEPS } from "@/lib/tracking";
import type { TrackingStatus } from "@/lib/types";

const OrderTrackingMap = dynamic(
  () =>
    import("@/components/OrderTrackingMap").then((m) => m.OrderTrackingMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl bg-navy text-sm text-white/60">
        Loading map…
      </div>
    ),
  }
);

interface TrackingPayload {
  id: string;
  status: TrackingStatus;
  statusHistory: { status: TrackingStatus; at: string; label?: string }[];
  destination: { lat: number; lng: number; address: string };
  driver?: { lat: number; lng: number; heading?: number; name?: string } | null;
  etaMinutes: number | null;
  courierLabel: string;
  route: [number, number][];
  lines: {
    productId: string;
    name: string;
    quantity: number;
    unitPriceCents: number;
    sku: string;
  }[];
  totalCents: number;
  shipping: {
    company: string;
    contactName: string;
    city: string;
    province: string;
  };
  createdAt: string;
  live: boolean;
}

const ACTIVE: TrackingStatus[] = [
  "placed",
  "preparing",
  "out_for_delivery",
  "nearby",
  "delivered",
];

function stepIndex(status: TrackingStatus): number {
  const i = ACTIVE.indexOf(status);
  return i < 0 ? 0 : i;
}

function historyAt(
  history: TrackingPayload["statusHistory"],
  status: TrackingStatus
): string | undefined {
  return history.find((h) => h.status === status)?.at;
}

export function OrderTrackingClient({ orderId }: { orderId: string }) {
  const [data, setData] = useState<TrackingPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const liveRef = useRef(false);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/orders/${encodeURIComponent(orderId)}/tracking`,
        { cache: "no-store" }
      );
      if (res.status === 404) {
        setError("not_found");
        setData(null);
        liveRef.current = false;
        return null;
      }
      if (!res.ok) throw new Error("Failed to load tracking");
      const json = (await res.json()) as TrackingPayload;
      setData(json);
      setError(null);
      liveRef.current = json.live;
      return json;
    } catch {
      setError("error");
      return null;
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    async function tick() {
      const result = await poll();
      if (cancelled) return;
      if (!result?.live && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    }

    void tick().then(() => {
      if (cancelled) return;
      if (liveRef.current) {
        timer = setInterval(() => {
          void tick();
        }, 2500);
      }
    });

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [poll]);

  if (loading && !data) {
    return (
      <div className="container-site py-16 text-center text-sm text-ink-muted">
        Loading live tracking…
      </div>
    );
  }

  if (error === "not_found" || (!data && error)) {
    return (
      <div className="container-site max-w-lg py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">
          Order not found
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          We couldn’t find tracking for this order. Check the confirmation email
          or place a new order to try the demo.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/search" className="btn-primary">
            Browse products
          </Link>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const currentIdx = stepIndex(data.status);
  const showMap = Boolean(data.destination);

  return (
    <div className="pb-10">
      <div className="border-b border-border bg-navy text-white">
        <div className="container-site flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Track delivery
            </p>
            <h1 className="font-display mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              {data.id}
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/70">
            <span className="relative flex h-1.5 w-1.5">
              {data.live ? (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </>
              ) : (
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              )}
            </span>
            Live tracking (demo)
          </span>
        </div>
      </div>

      <div className="container-site mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[1fr_340px] lg:gap-6">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Status
                </p>
                <p className="font-display mt-1 text-xl font-bold text-ink">
                  {STATUS_LABELS[data.status]}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {data.courierLabel}
                  {data.destination?.address ? (
                    <> · {data.destination.address}</>
                  ) : null}
                </p>
              </div>
              <div className="text-right">
                {data.status === "delivered" ? (
                  <p className="font-display text-2xl font-bold text-success">
                    Arrived
                  </p>
                ) : data.etaMinutes != null ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      ETA
                    </p>
                    <p className="font-display text-2xl font-bold text-ink">
                      ~{data.etaMinutes} min
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {showMap ? (
            <div className="relative h-[min(52vh,420px)] min-h-[280px] overflow-hidden rounded-xl border border-border shadow-md sm:h-[440px]">
              <OrderTrackingMap
                destination={data.destination}
                driver={data.driver}
                route={data.route}
                live={data.live}
              />
              {data.live &&
              (data.status === "out_for_delivery" ||
                data.status === "nearby") ? (
                <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-navy/90 px-2.5 py-1 text-[11px] font-semibold text-accent shadow">
                  Courier en route
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-surface-muted px-6 text-center">
              <p className="font-display text-lg font-semibold text-ink">
                Preparing your delivery
              </p>
              <p className="mt-2 max-w-sm text-sm text-ink-muted">
                The live map appears when your courier leaves the Supplyr depot
                (North York / Norfinch area). This demo advances in about
                20&nbsp;seconds.
              </p>
            </div>
          )}

          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Delivery progress
            </h2>
            <ol className="mt-5 space-y-0">
              {TRACKING_STEPS.map((step, idx) => {
                const done = idx <= currentIdx;
                const current = idx === currentIdx;
                const at = historyAt(data.statusHistory, step.status);
                return (
                  <li key={step.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          done
                            ? "bg-accent text-accent-fg"
                            : "bg-surface-muted text-ink-faint"
                        } ${current && data.live ? "ring-2 ring-accent ring-offset-2" : ""}`}
                      >
                        {done ? "✓" : idx + 1}
                      </span>
                      {idx < TRACKING_STEPS.length - 1 ? (
                        <span
                          className={`my-1 min-h-6 w-0.5 flex-1 ${
                            idx < currentIdx ? "bg-accent" : "bg-border"
                          }`}
                        />
                      ) : null}
                    </div>
                    <div
                      className={
                        idx === TRACKING_STEPS.length - 1 ? "pb-0" : "pb-5"
                      }
                    >
                      <p
                        className={`text-sm font-semibold ${
                          done ? "text-ink" : "text-ink-faint"
                        }`}
                      >
                        {step.label}
                      </p>
                      {at && done ? (
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {formatDate(at)}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs text-ink-faint">Pending</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-28">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
            <h2 className="font-display text-base font-semibold text-ink">
              Order summary
            </h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {data.lines.map((l) => (
                <li
                  key={l.productId}
                  className="flex justify-between gap-3 py-2.5"
                >
                  <span className="min-w-0">
                    <span className="line-clamp-2 font-medium text-ink">
                      {l.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-faint">
                      × {l.quantity} · {l.sku}
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold text-ink">
                    {formatCAD(l.unitPriceCents * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-bold">
              <span>Total</span>
              <span className="font-display">{formatCAD(data.totalCents)}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 text-sm shadow-sm">
            <h2 className="font-display text-base font-semibold text-ink">
              Deliver to
            </h2>
            <p className="mt-2 leading-relaxed text-ink-muted">
              <span className="font-medium text-ink">
                {data.shipping.company}
              </span>
              <br />
              {data.shipping.contactName}
              <br />
              {data.destination.address}
            </p>
            <p className="mt-3 text-xs text-ink-faint">
              Placed {formatDate(data.createdAt)}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={`/orders/${data.id}`}
              className="btn-secondary w-full justify-center"
            >
              Order confirmation
            </Link>
            <Link href="/search" className="btn-navy w-full justify-center">
              Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
