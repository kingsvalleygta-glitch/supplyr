import { NextResponse } from "next/server";
import { shippingCentsFor, taxCentsFor } from "@/lib/format";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { productRepository } from "@/lib/repositories/productRepository";
import type { OrderLine, ShippingAddress } from "@/lib/types";

export const runtime = "nodejs";

interface Body {
  items: { productId: string; quantity: number }[];
  shipping: ShippingAddress;
  deliveryNotes?: string;
  paymentMethod: string;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!body.shipping?.email || !body.shipping?.address1) {
    return NextResponse.json({ error: "Shipping details required" }, { status: 400 });
  }

  const lines: OrderLine[] = [];
  for (const item of body.items) {
    const product = productRepository.getById(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product ${item.productId}` },
        { status: 400 }
      );
    }
    if (!product.inStock || product.stockQty < item.quantity) {
      return NextResponse.json(
        { error: `${product.name} is out of stock or insufficient quantity` },
        { status: 400 }
      );
    }
    if (item.quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
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

  return NextResponse.json({ order }, { status: 201 });
}

export async function GET() {
  const orders = await orderRepository.listAsync();
  return NextResponse.json({ orders });
}
