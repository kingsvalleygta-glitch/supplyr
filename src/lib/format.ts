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

/** Ontario HST placeholder — 13% */
export const HST_RATE = 0.13;

/** Flat GTA delivery placeholder under $500 subtotal; free above */
export function shippingCentsFor(subtotalCents: number): number {
  if (subtotalCents <= 0) return 0;
  if (subtotalCents >= 50000) return 0;
  return 4999;
}

export function taxCentsFor(subtotalCents: number, shippingCents: number): number {
  return Math.round((subtotalCents + shippingCents) * HST_RATE);
}
