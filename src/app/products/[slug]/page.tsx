import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CategoryVisual } from "@/components/CategoryVisual";
import { ProductCard } from "@/components/ProductCard";
import { formatCAD } from "@/lib/format";
import { getCategoryName } from "@/lib/repositories/categoryRepository";
import { categoryRepository } from "@/lib/repositories/categoryRepository";
import { productRepository } from "@/lib/repositories/productRepository";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return productRepository.list().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = productRepository.getBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = productRepository.getBySlug(slug);
  if (!product) notFound();

  const category = categoryRepository.list().find((c) => c.id === product.categoryId);
  const related = productRepository.getRelated(product, 4);

  return (
    <div className="container-site py-8 sm:py-10">
      <nav className="mb-8 text-sm text-ink-faint">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span className="mx-2 text-border-strong">/</span>
        {category ? (
          <Link href={`/categories/${category.slug}`} className="hover:text-ink">
            {category.name}
          </Link>
        ) : (
          <span>{getCategoryName(product.categoryId)}</span>
        )}
        <span className="mx-2 text-border-strong">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <CategoryVisual
            categoryId={product.categoryId}
            className="aspect-[4/3] w-full sm:aspect-[5/4] lg:min-h-[28rem]"
            label={product.name}
          />
        </div>

        <div className="lg:pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
            {product.brand}
            <span className="mx-2 text-border-strong">·</span>
            <span className="font-mono tracking-normal">SKU {product.sku}</span>
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            Sold by {product.sellerName ?? "Kings Valley Homes"}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <p className="font-display text-4xl font-bold tracking-tight text-ink">
              {formatCAD(product.priceCents)}
            </p>
            <span className="text-sm text-ink-muted">/ {product.unit}</span>
            {product.compareAtCents ? (
              <span className="text-sm text-ink-faint line-through">
                {formatCAD(product.compareAtCents)}
              </span>
            ) : null}
          </div>

          <p className="mt-3">
            <span
              className={`badge-stock ${
                product.inStock ? "badge-stock-in" : "badge-stock-out"
              }`}
            >
              {product.inStock
                ? `In stock · ${product.stockQty} available`
                : "Out of stock"}
            </span>
          </p>

          <p className="mt-6 text-base leading-relaxed text-ink-muted">
            {product.description}
          </p>

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              disabled={!product.inStock}
              sticky
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <div className="border-b border-border bg-surface-muted px-4 py-3">
              <h2 className="text-sm font-semibold text-ink">Specifications</h2>
            </div>
            <table className="w-full text-sm">
              <tbody>
                {product.specs.map((s, i) => (
                  <tr
                    key={s.label}
                    className={i % 2 === 0 ? "bg-surface" : "bg-surface-muted/50"}
                  >
                    <th className="w-[40%] px-4 py-3 text-left font-medium text-ink-muted">
                      {s.label}
                    </th>
                    <td className="px-4 py-3 text-ink">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-border pt-12 sm:mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              Related products
            </h2>
            {category ? (
              <Link
                href={`/categories/${category.slug}`}
                className="text-sm font-semibold text-accent hover:text-accent-hover"
              >
                More in {category.name} →
              </Link>
            ) : null}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
