/** Core domain types for Supplyr (KVH-owned catalog with marketplace seams). */

export type SupplierId = "kvh" | string;

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageEmoji: string;
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
  featured: boolean;
  /** Seam for future multi-supplier marketplace */
  supplierId: SupplierId;
  sellerName?: string;
  relatedIds: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderLine {
  productId: string;
  sku: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  supplierId: SupplierId;
}

export type OrderStatus = "confirmed" | "processing" | "shipped" | "cancelled";

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
  status: OrderStatus;
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  shipping: ShippingAddress;
  deliveryNotes?: string;
  paymentMethod: string;
}

export interface ProductFilters {
  categorySlug?: string;
  q?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  inStockOnly?: boolean;
  sort?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "featured";
}

export interface ProductRepository {
  list(filters?: ProductFilters): Product[];
  getBySlug(slug: string): Product | undefined;
  getById(id: string): Product | undefined;
  getFeatured(limit?: number): Product[];
  getRelated(product: Product, limit?: number): Product[];
}

export interface CategoryRepository {
  list(): Category[];
  getBySlug(slug: string): Category | undefined;
  getFeatured(): Category[];
}

export interface OrderRepository {
  create(order: Omit<Order, "id" | "createdAt" | "status">): Order;
  getById(id: string): Order | undefined;
  list(): Order[];
}
