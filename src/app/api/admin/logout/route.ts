import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const res = NextResponse.redirect(new URL("/admin", url.origin), 303);
  res.cookies.set("supplyr_admin", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
