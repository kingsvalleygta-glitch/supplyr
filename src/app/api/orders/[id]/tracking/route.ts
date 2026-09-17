import { NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orderRepository";
import {
  advanceTrackingSimulation,
  trackingPublicPayload,
} from "@/lib/tracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const existing = await orderRepository.getByIdAsync(id);
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Backfill tracking for any pre-tracking orders
  let order = existing;
  if (!order.destination) {
    const { initialTrackingFields } = await import("@/lib/tracking");
    order = {
      ...order,
      ...initialTrackingFields(order.shipping),
      statusHistory: order.statusHistory?.length
        ? order.statusHistory
        : initialTrackingFields(order.shipping).statusHistory,
    };
  }

  const advanced = advanceTrackingSimulation(order);
  if (
    advanced.status !== existing.status ||
    advanced.etaMinutes !== existing.etaMinutes ||
    advanced.driver?.lat !== existing.driver?.lat ||
    advanced.driver?.lng !== existing.driver?.lng ||
    (advanced.statusHistory?.length || 0) !==
      (existing.statusHistory?.length || 0)
  ) {
    await orderRepository.updateAsync(advanced);
  }

  return NextResponse.json(trackingPublicPayload(advanced));
}
