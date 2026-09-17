import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

type ProLead = {
  id: string;
  createdAt: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  trade: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "pro-leads.json");

async function readLeads(): Promise<ProLead[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const company = String(body.company ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const trade = String(body.trade ?? "").trim();

  if (!name || !email || !company) {
    return NextResponse.json(
      { error: "Name, company, and email are required." },
      { status: 400 }
    );
  }

  const lead: ProLead = {
    id: `pro-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    name,
    company,
    email,
    phone,
    trade,
  };

  const leads = await readLeads();
  leads.unshift(lead);
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(leads, null, 2), "utf8");

  const res = NextResponse.json({ ok: true, id: lead.id });
  res.cookies.set("supplyr_pro", "1", {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return res;
}
