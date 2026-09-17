import { OrderTrackingClient } from "@/components/OrderTrackingClient";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Track ${id}` };
}

export default async function OrderTrackPage({ params }: Props) {
  const { id } = await params;
  return <OrderTrackingClient orderId={id} />;
}
