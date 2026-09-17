import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") || "");
  const expected = process.env.ADMIN_PASSWORD;

  const url = new URL(request.url);
  if (!expected || password !== expected) {
    return NextResponse.redirect(new URL("/admin?error=1", url.origin), 303);
  }

  const res = NextResponse.redirect(new URL("/admin", url.origin), 303);
  res.cookies.set("supplyr_admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}
