import categoriesData from "@/data/categories.json";
import type { Category, CategoryRepository } from "@/lib/types";

const categories = categoriesData as Category[];

export const categoryRepository: CategoryRepository = {
  list() {
    return [...categories];
  },
  getBySlug(slug: string) {
    return categories.find((c) => c.slug === slug);
  },
  getFeatured() {
    return categories.filter((c) => c.featured);
  },
};

export function getCategoryName(categoryId: string): string {
  return categories.find((c) => c.id === categoryId)?.name ?? "Uncategorized";
}
