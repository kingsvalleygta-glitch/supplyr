import Constants from "expo-constants";
import type {
  Category,
  Order,
  Product,
  ProductsResponse,
  ShippingAddress,
  TrackingPayload,
} from "./types";

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;

export const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_API_BASE_URL) ||
  extra?.apiBaseUrl ||
  "https://supplyr-two.vercel.app";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || `Request failed (${res.status})`
    );
  }
  return data as T;
}

export type ProductQuery = {
  page?: number;
  limit?: number;
  q?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
  inStock?: boolean;
};

export function fetchProducts(query: ProductQuery = {}) {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.sort) params.set("sort", query.sort);
  if (query.featured) params.set("featured", "1");
  if (query.inStock) params.set("inStock", "1");
  const qs = params.toString();
  return apiFetch<ProductsResponse>(`/api/products${qs ? `?${qs}` : ""}`);
}

export function fetchProduct(slug: string) {
  return apiFetch<{
    product: Product;
    related: Product[];
    categoryName: string;
  }>(`/api/products/${encodeURIComponent(slug)}`);
}

export function fetchCategories(featuredOnly = false) {
  const qs = featuredOnly ? "?featured=1" : "";
  return apiFetch<{ categories: Category[] }>(`/api/categories${qs}`);
}

export function placeOrder(body: {
  items: { productId: string; quantity: number }[];
  shipping: ShippingAddress;
  deliveryNotes?: string;
  paymentMethod: string;
}) {
  return apiFetch<{ order: Order }>("/api/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function fetchOrder(id: string) {
  return apiFetch<{ order: Order }>(`/api/orders/${encodeURIComponent(id)}`);
}

export function fetchTracking(id: string) {
  return apiFetch<TrackingPayload>(
    `/api/orders/${encodeURIComponent(id)}/tracking`
  );
}

export function submitProLead(body: {
  name: string;
  company: string;
  email: string;
  phone: string;
  trade: string;
}) {
  return apiFetch<{ ok: boolean; id: string }>("/api/pro-leads", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function webTrackUrl(orderId: string) {
  return `${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/track`;
}
