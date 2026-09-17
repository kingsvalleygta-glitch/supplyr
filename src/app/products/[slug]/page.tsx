import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">
          Home
        </Link>
        {" / "}
        {category ? (
          <Link href={`/categories/${category.slug}`} className="hover:text-slate-800">
            {category.name}
          </Link>
        ) : (
          <span>{getCategoryName(product.categoryId)}</span>
        )}
        {" / "}
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex h-72 items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-200 text-8xl shadow-sm sm:h-96">
          <span aria-hidden>{product.imageEmoji}</span>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {product.brand} · SKU {product.sku}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{product.name}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sold by {product.sellerName ?? "Kings Valley Homes"}
            {product.supplierId !== "kvh" ? ` · Supplier ${product.supplierId}` : ""}
          </p>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-3xl font-bold text-slate-900">
              {formatCAD(product.priceCents)}
            </p>
            <span className="text-sm text-slate-500">/ {product.unit}</span>
            {product.compareAtCents ? (
              <span className="text-sm text-slate-400 line-through">
                {formatCAD(product.compareAtCents)}
              </span>
            ) : null}
          </div>
          <p className="mt-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                product.inStock
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-700"
              }`}
            >
              {product.inStock
                ? `In stock · ${product.stockQty} available`
                : "Out of stock"}
            </span>
          </p>
          <p className="mt-6 text-slate-700 leading-relaxed">{product.description}</p>
          <div className="mt-6">
            <AddToCartButton productId={product.id} disabled={!product.inStock} />
          </div>
          <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Spec</th>
                  <th className="px-4 py-2 font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {product.specs.map((s) => (
                  <tr key={s.label} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-slate-700">{s.label}</td>
                    <td className="px-4 py-2 text-slate-600">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Related products</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
