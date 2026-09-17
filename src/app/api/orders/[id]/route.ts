import { corsJson, corsOptions } from "@/lib/cors";
import { orderRepository } from "@/lib/repositories/orderRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export function OPTIONS() {
  return corsOptions();
}

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const order = await orderRepository.getByIdAsync(id);
  if (!order) {
    return corsJson({ error: "Order not found" }, { status: 404 });
  }
  return corsJson({ order });
}
