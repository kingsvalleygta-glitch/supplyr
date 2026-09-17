import productsData from "@/data/products.json";
import { categoryRepository } from "@/lib/repositories/categoryRepository";
import type { Product, ProductFilters, ProductRepository } from "@/lib/types";

const products = productsData as Product[];

function applyFilters(list: Product[], filters?: ProductFilters): Product[] {
  if (!filters) return [...list];

  let result = [...list];

  if (filters.categorySlug) {
    const cat = categoryRepository.getBySlug(filters.categorySlug);
    if (cat) {
      result = result.filter((p) => p.categoryId === cat.id);
    } else {
      result = [];
    }
  }

  if (filters.q?.trim()) {
    const q = filters.q.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (filters.minPriceCents != null) {
    result = result.filter((p) => p.priceCents >= filters.minPriceCents!);
  }
  if (filters.maxPriceCents != null) {
    result = result.filter((p) => p.priceCents <= filters.maxPriceCents!);
  }
  if (filters.inStockOnly) {
    result = result.filter((p) => p.inStock && p.stockQty > 0);
  }

  const sort = filters.sort ?? "featured";
  result.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.priceCents - b.priceCents;
      case "price-desc":
        return b.priceCents - a.priceCents;
      case "name-asc":
        return a.name.localeCompare(b.name, "en-CA");
      case "name-desc":
        return b.name.localeCompare(a.name, "en-CA");
      case "featured":
      default:
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return a.name.localeCompare(b.name, "en-CA");
    }
  });

  return result;
}

export const productRepository: ProductRepository = {
  list(filters) {
    return applyFilters(products, filters);
  },
  getBySlug(slug) {
    return products.find((p) => p.slug === slug);
  },
  getById(id) {
    return products.find((p) => p.id === id);
  },
  getFeatured(limit = 8) {
    return products.filter((p) => p.featured).slice(0, limit);
  },
  getRelated(product, limit = 4) {
    const related = product.relatedIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
    if (related.length >= limit) return related.slice(0, limit);
    const extras = products.filter(
      (p) =>
        p.categoryId === product.categoryId &&
        p.id !== product.id &&
        !related.some((r) => r.id === p.id)
    );
    return [...related, ...extras].slice(0, limit);
  },
};
