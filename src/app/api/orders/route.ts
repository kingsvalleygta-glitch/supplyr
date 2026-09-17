import { corsJson, corsOptions, CORS_HEADERS } from "@/lib/cors";
import { shippingCentsFor, taxCentsFor } from "@/lib/format";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { productRepository } from "@/lib/repositories/productRepository";
import type { OrderLine, ShippingAddress } from "@/lib/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface Body {
  items: { productId: string; quantity: number }[];
  shipping: ShippingAddress;
  deliveryNotes?: string;
  paymentMethod: string;
}

export function OPTIONS() {
  return corsOptions();
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return corsJson({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.items?.length) {
    return corsJson({ error: "Cart is empty" }, { status: 400 });
  }
  if (!body.shipping?.email || !body.shipping?.address1) {
    return corsJson({ error: "Shipping details required" }, { status: 400 });
  }

  const lines: OrderLine[] = [];
  for (const item of body.items) {
    const product = productRepository.getById(item.productId);
    if (!product) {
      return corsJson(
        { error: `Unknown product ${item.productId}` },
        { status: 400 }
      );
    }
    if (!product.inStock || product.stockQty < item.quantity) {
      return corsJson(
        { error: `${product.name} is out of stock or insufficient quantity` },
        { status: 400 }
      );
    }
    if (item.quantity < 1) {
      return corsJson({ error: "Invalid quantity" }, { status: 400 });
    }
    lines.push({
      productId: product.id,
      sku: product.sku,
      name: product.name,
      unitPriceCents: product.priceCents,
      quantity: item.quantity,
      supplierId: product.supplierId,
    });
  }

  const subtotalCents = lines.reduce(
    (s, l) => s + l.unitPriceCents * l.quantity,
    0
  );
  const shippingCents = shippingCentsFor(subtotalCents);
  const taxCents = taxCentsFor(subtotalCents, shippingCents);
  const totalCents = subtotalCents + shippingCents + taxCents;

  const order = await orderRepository.createAsync({
    lines,
    subtotalCents,
    shippingCents,
    taxCents,
    totalCents,
    shipping: body.shipping,
    deliveryNotes: body.deliveryNotes,
    paymentMethod: body.paymentMethod || "mock_card",
  });

  return NextResponse.json(
    { order },
    { status: 201, headers: CORS_HEADERS }
  );
}

export async function GET() {
  const orders = await orderRepository.listAsync();
  return corsJson({ orders });
}
