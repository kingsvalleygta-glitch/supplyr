import { promises as fs } from "fs";
import path from "path";
import type { Order, OrderRepository } from "@/lib/types";

const ORDERS_PATH = path.join(process.cwd(), "data", "orders.json");

async function ensureStore(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf8");
    return JSON.parse(raw) as Order[];
  } catch {
    await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
    await fs.writeFile(ORDERS_PATH, "[]", "utf8");
    return [];
  }
}

async function writeStore(orders: Order[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf8");
}

function makeId(): string {
  const n = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ORD-${n}-${r}`;
}

export const orderRepository: OrderRepository & {
  createAsync: (
    order: Omit<Order, "id" | "createdAt" | "status">
  ) => Promise<Order>;
  getByIdAsync: (id: string) => Promise<Order | undefined>;
  listAsync: () => Promise<Order[]>;
} = {
  create(order) {
    throw new Error("Use createAsync on the server");
  },
  getById() {
    return undefined;
  },
  list() {
    return [];
  },
  async createAsync(input) {
    const orders = await ensureStore();
    const order: Order = {
      ...input,
      id: makeId(),
      createdAt: new Date().toISOString(),
      status: "confirmed",
    };
    orders.unshift(order);
    await writeStore(orders);
    return order;
  },
  async getByIdAsync(id) {
    const orders = await ensureStore();
    return orders.find((o) => o.id === id);
  },
  async listAsync() {
    return ensureStore();
  },
};
