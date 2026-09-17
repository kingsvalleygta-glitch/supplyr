import { corsJson, corsOptions } from "@/lib/cors";
import { categoryRepository } from "@/lib/repositories/categoryRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS() {
  return corsOptions();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featuredOnly = searchParams.get("featured") === "1";
  const categories = featuredOnly
    ? categoryRepository.getFeatured()
    : categoryRepository.list();
  return corsJson({ categories });
}
