export type SupplierId = "kvh" | string;

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageEmoji: string;
  imageUrl?: string;
  featured: boolean;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  priceCents: number;
  compareAtCents?: number;
  inStock: boolean;
  stockQty: number;
  unit: string;
  brand: string;
  specs: ProductSpec[];
  imageEmoji: string;
  imageUrl?: string;
  featured: boolean;
  supplierId: SupplierId;
  sellerName?: string;
  relatedIds: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  name?: string;
  priceCents?: number;
  imageUrl?: string;
  imageEmoji?: string;
  slug?: string;
  unit?: string;
}

export interface OrderLine {
  productId: string;
  sku: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  supplierId: SupplierId;
}

export type TrackingStatus =
  | "placed"
  | "preparing"
  | "out_for_delivery"
  | "nearby"
  | "delivered"
  | "cancelled";

export interface StatusHistoryEntry {
  status: TrackingStatus;
  at: string;
  label?: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Destination extends GeoPoint {
  address: string;
}

export interface DriverLocation extends GeoPoint {
  heading?: number;
  name?: string;
}

export interface ShippingAddress {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: TrackingStatus;
  statusHistory: StatusHistoryEntry[];
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shipping: ShippingAddress;
  deliveryNotes?: string;
  paymentMethod: string;
  destination: Destination;
  driver?: DriverLocation;
  etaMinutes?: number;
  simulationStartedAt?: string;
}

export interface TrackingPayload {
  id: string;
  status: TrackingStatus;
  statusHistory: StatusHistoryEntry[];
  destination: Destination;
  driver?: DriverLocation;
  etaMinutes: number | null;
  simulationStartedAt: string;
  courierLabel: string;
  route: [number, number][];
  depot: GeoPoint;
  lines: OrderLine[];
  totalCents: number;
  shipping: ShippingAddress;
  createdAt: string;
  live: boolean;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}
