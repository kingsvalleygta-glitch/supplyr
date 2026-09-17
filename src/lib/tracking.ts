/** Live order-tracking helpers (demo simulation + GTA geocode stub). */

import type {
  Destination,
  DriverLocation,
  GeoPoint,
  Order,
  StatusHistoryEntry,
  TrackingStatus,
} from "@/lib/types";

/** Supplyr depot near Norfinch Dr / North York (GTA). */
export const DEPOT: GeoPoint = { lat: 43.7618, lng: -79.5214 };

export const TRACKING_STEPS: {
  status: TrackingStatus;
  label: string;
}[] = [
  { status: "placed", label: "Order placed" },
  { status: "preparing", label: "Preparing" },
  { status: "out_for_delivery", label: "Out for delivery" },
  { status: "nearby", label: "Nearby" },
  { status: "delivered", label: "Delivered" },
];

export const STATUS_LABELS: Record<TrackingStatus, string> = {
  placed: "Order placed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  nearby: "Nearby",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

/** Rough city centroids for GTA demos (no paid geocoder). */
const CITY_COORDS: Record<string, GeoPoint> = {
  toronto: { lat: 43.6532, lng: -79.3832 },
  northyork: { lat: 43.7615, lng: -79.4111 },
  "north york": { lat: 43.7615, lng: -79.4111 },
  scarborough: { lat: 43.7764, lng: -79.2318 },
  etobicoke: { lat: 43.6205, lng: -79.5132 },
  mississauga: { lat: 43.589, lng: -79.6441 },
  brampton: { lat: 43.7315, lng: -79.7624 },
  markham: { lat: 43.8561, lng: -79.337 },
  vaughan: { lat: 43.8361, lng: -79.4983 },
  richmondhill: { lat: 43.8828, lng: -79.4403 },
  "richmond hill": { lat: 43.8828, lng: -79.4403 },
  oakville: { lat: 43.4675, lng: -79.6877 },
  burlington: { lat: 43.3255, lng: -79.799 },
  ajax: { lat: 43.8509, lng: -79.0204 },
  pickering: { lat: 43.8384, lng: -79.0868 },
  whitby: { lat: 43.8975, lng: -78.9429 },
  oshawa: { lat: 43.8971, lng: -78.8658 },
  newmarket: { lat: 44.0592, lng: -79.4613 },
  aurora: { lat: 44.0065, lng: -79.4504 },
};

/** Demo phase lengths (seconds from simulation start). */
const PHASE = {
  preparingAt: 8,
  outForDeliveryAt: 18,
  tripSeconds: 55,
  nearbyProgress: 0.88,
} as const;

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic jitter so street-level addresses look distinct. */
function jitterFromAddress(address: string, city: string): GeoPoint {
  const h = hashString(`${address}|${city}`);
  const dLat = ((h % 200) - 100) / 12000;
  const dLng = (((h / 200) | 0) % 200 - 100) / 12000;
  return { lat: dLat, lng: dLng };
}

export function geocodeStub(input: {
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
}): Destination {
  const cityKey = input.city.trim().toLowerCase();
  const base = CITY_COORDS[cityKey] ?? CITY_COORDS.toronto;
  const j = jitterFromAddress(input.address1, input.city);
  const address = [
    input.address1,
    input.address2,
    `${input.city}, ${input.province} ${input.postalCode}`,
  ]
    .filter(Boolean)
    .join(", ");
  return {
    lat: base.lat + j.lat,
    lng: base.lng + j.lng,
    address,
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function bearing(a: GeoPoint, b: GeoPoint): number {
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Simple 4-point polyline depot → destination with a slight arc. */
export function buildRoutePolyline(dest: GeoPoint): GeoPoint[] {
  const start = DEPOT;
  const mid1: GeoPoint = {
    lat: lerp(start.lat, dest.lat, 0.33) + 0.012,
    lng: lerp(start.lng, dest.lng, 0.33) - 0.008,
  };
  const mid2: GeoPoint = {
    lat: lerp(start.lat, dest.lat, 0.66) - 0.006,
    lng: lerp(start.lng, dest.lng, 0.66) + 0.01,
  };
  return [start, mid1, mid2, dest];
}

function pointAlongPolyline(points: GeoPoint[], t: number): {
  point: GeoPoint;
  heading: number;
} {
  const clamped = Math.max(0, Math.min(1, t));
  if (points.length < 2) {
    return { point: points[0] ?? DEPOT, heading: 0 };
  }
  const segs: { a: GeoPoint; b: GeoPoint; len: number }[] = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const len = Math.max(haversineKm(points[i], points[i + 1]), 0.001);
    segs.push({ a: points[i], b: points[i + 1], len });
    total += len;
  }
  let remain = clamped * total;
  for (const seg of segs) {
    if (remain <= seg.len) {
      const localT = remain / seg.len;
      return {
        point: {
          lat: lerp(seg.a.lat, seg.b.lat, localT),
          lng: lerp(seg.a.lng, seg.b.lng, localT),
        },
        heading: bearing(seg.a, seg.b),
      };
    }
    remain -= seg.len;
  }
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  return { point: last, heading: bearing(prev, last) };
}

function pushHistory(
  history: StatusHistoryEntry[],
  status: TrackingStatus,
  at: string
): StatusHistoryEntry[] {
  if (history.some((h) => h.status === status)) return history;
  return [...history, { status, at, label: STATUS_LABELS[status] }];
}

export function initialTrackingFields(shipping: {
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
}): Pick<
  Order,
  | "status"
  | "statusHistory"
  | "destination"
  | "driver"
  | "etaMinutes"
  | "simulationStartedAt"
> {
  const now = new Date().toISOString();
  const destination = geocodeStub(shipping);
  return {
    status: "placed",
    statusHistory: [
      { status: "placed", at: now, label: STATUS_LABELS.placed },
    ],
    destination,
    driver: {
      ...DEPOT,
      heading: bearing(DEPOT, destination),
      name: "Supplyr Delivery",
    },
    etaMinutes: 45,
    simulationStartedAt: now,
  };
}

/**
 * Advance demo tracking from wall-clock elapsed time.
 * Idempotent: safe to call on every poll.
 */
export function advanceTrackingSimulation(order: Order, now = new Date()): Order {
  if (order.status === "delivered" || order.status === "cancelled") {
    return order;
  }

  const startIso = order.simulationStartedAt || order.createdAt;
  const startMs = new Date(startIso).getTime();
  const elapsedSec = Math.max(0, (now.getTime() - startMs) / 1000);
  const dest = order.destination;
  const route = buildRoutePolyline(dest);
  let status: TrackingStatus = "placed";
  let history = [...(order.statusHistory || [])];
  let progress = 0;
  let etaMinutes = 45;

  if (elapsedSec >= PHASE.outForDeliveryAt) {
    const tripElapsed = elapsedSec - PHASE.outForDeliveryAt;
    progress = Math.min(1, tripElapsed / PHASE.tripSeconds);
    if (progress >= 1) {
      status = "delivered";
      progress = 1;
      etaMinutes = 0;
    } else if (progress >= PHASE.nearbyProgress) {
      status = "nearby";
      etaMinutes = Math.max(1, Math.ceil((1 - progress) * PHASE.tripSeconds / 60));
    } else {
      status = "out_for_delivery";
      etaMinutes = Math.max(
        2,
        Math.ceil((1 - progress) * PHASE.tripSeconds / 60) + 2
      );
    }
  } else if (elapsedSec >= PHASE.preparingAt) {
    status = "preparing";
    etaMinutes = 40;
    progress = 0;
  } else {
    status = "placed";
    etaMinutes = 45;
    progress = 0;
  }

  const at = now.toISOString();
  const orderOf: TrackingStatus[] = [
    "placed",
    "preparing",
    "out_for_delivery",
    "nearby",
    "delivered",
  ];
  const targetIdx = orderOf.indexOf(status);
  for (let i = 0; i <= targetIdx; i++) {
    history = pushHistory(history, orderOf[i], at);
  }

  const { point, heading } = pointAlongPolyline(route, progress);
  const driver: DriverLocation = {
    lat: point.lat,
    lng: point.lng,
    heading,
    name: order.driver?.name || "Supplyr Delivery",
  };

  if (status === "delivered") {
    driver.lat = dest.lat;
    driver.lng = dest.lng;
  }

  return {
    ...order,
    status,
    statusHistory: history,
    driver,
    etaMinutes,
    simulationStartedAt: startIso,
  };
}

export function trackingPublicPayload(order: Order) {
  const route = buildRoutePolyline(order.destination);
  return {
    id: order.id,
    status: order.status,
    statusHistory: order.statusHistory || [],
    destination: order.destination,
    driver: order.driver,
    etaMinutes: order.etaMinutes ?? null,
    simulationStartedAt: order.simulationStartedAt || order.createdAt,
    courierLabel: order.driver?.name || "Supplyr Delivery",
    route: route.map((p) => [p.lat, p.lng] as [number, number]),
    depot: DEPOT,
    lines: order.lines,
    totalCents: order.totalCents,
    shipping: order.shipping,
    createdAt: order.createdAt,
    live: order.status !== "delivered" && order.status !== "cancelled",
  };
}
