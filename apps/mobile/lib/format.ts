export function formatCAD(cents: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(new Date(iso));
}

export const HST_RATE = 0.13;

export function shippingCentsFor(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  if (subtotalCents >= 50000) return 0;
  return 4999;
}

export function taxCentsFor(subtotalCents: number, shippingCents: number): number {
  return Math.round((subtotalCents + shippingCents) * HST_RATE);
}

export const STATUS_LABELS: Record<string, string> = {
  placed: "Order placed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  nearby: "Nearby",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const TRACKING_STEPS = [
  "placed",
  "preparing",
  "out_for_delivery",
  "nearby",
  "delivered",
] as const;
