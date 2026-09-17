import { NextResponse } from "next/server";

/** Allow Expo Go / mobile clients to call JSON APIs from any origin. */
export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

export function corsJson(data: unknown, init?: { status?: number }) {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: CORS_HEADERS,
  });
}

export function corsOptions() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
