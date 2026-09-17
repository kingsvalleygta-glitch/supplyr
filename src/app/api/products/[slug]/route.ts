import { corsJson, corsOptions } from "@/lib/cors";
import { getCategoryName } from "@/lib/repositories/categoryRepository";
import { productRepository } from "@/lib/repositories/productRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export function OPTIONS() {
  return corsOptions();
}

export async function GET(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const product = productRepository.getBySlug(slug);
  if (!product) {
    return corsJson({ error: "Product not found" }, { status: 404 });
  }
  const related = productRepository.getRelated(product, 6);
  return corsJson({
    product,
    related,
    categoryName: getCategoryName(product.categoryId),
  });
}
