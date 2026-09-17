/** Unsplash CDN photo URLs for categories and SKUs (free, hotlink-friendly). */

const u = (id: string, w = 960) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Category fallback / hero photos */
export const CATEGORY_IMAGES: Record<string, string> = {
  "cat-lumber": u("photo-1416879595882-3373a0480b5b"),
  "cat-fasteners": u("photo-1530124566582-a618bc2615dc"),
  "cat-concrete": u("photo-1541888946425-d81bb19240f5"),
  "cat-electrical": u("photo-1621905251189-08b45d6a269e"),
  "cat-plumbing": u("photo-1581578731548-c64695cc6952"),
  "cat-tools": u("photo-1572981779307-38b8cabb2407"),
  "cat-insulation": u("photo-1484154218962-a197022b5858"),
  "cat-safety": u("photo-1565008447742-97f6f38c985c"),
  "cat-appliances": u("photo-1556911220-bff31c812dba"),
  "cat-bath": u("photo-1584622650111-993a426fbf0a"),
  "cat-building-materials": u("photo-1504307651254-35680f356dfd"),
  "cat-cleaning": u("photo-1581578731548-c64695cc6952"),
  "cat-doors-windows": u("photo-1600607687939-ce8a6c25118c"),
  "cat-floors": u("photo-1615874959474-d609969a20ed"),
  "cat-hardware": u("photo-1530124566582-a618bc2615dc"),
  "cat-heating-and-cooling-hvac": u("photo-1621905251189-08b45d6a269e"),
  "cat-hvac": u("photo-1621905251189-08b45d6a269e"),
  "cat-kitchen": u("photo-1556911220-bff31c812dba"),
  "cat-lighting-ceiling-fans": u("photo-1513506003901-1e6a229e2d15"),
  "cat-moulding-and-millwork": u("photo-1600585154340-be6161a56a0c"),
  "cat-paint": u("photo-1562259949-e8e7689d7828"),
};

/** Per-SKU photos; category image used when missing */
export const PRODUCT_IMAGES: Record<string, string> = {
  "p-001": u("photo-1416879595882-3373a0480b5b"),
  "p-002": u("photo-1503387762-592deb58ef4e"),
  "p-003": u("photo-1600585154340-be6161a56a0c"),
  "p-004": u("photo-1600607687939-ce8a6c25118c"),
  "p-005": u("photo-1530124566582-a618bc2615dc"),
  "p-006": u("photo-1504148455328-c376907d081c"),
  "p-007": u("photo-1581092918056-0c4c3acd3789"),
  "p-008": u("photo-1530124566582-a618bc2615dc"),
  "p-009": u("photo-1541888946425-d81bb19240f5"),
  "p-010": u("photo-1504307651254-35680f356dfd"),
  "p-011": u("photo-1581092918056-0c4c3acd3789"),
  "p-012": u("photo-1541888946425-d81bb19240f5"),
  "p-013": u("photo-1621905251189-08b45d6a269e"),
  "p-014": u("photo-1558618666-fcd25c85cd64"),
  "p-015": u("photo-1621905251918-48416bd8575a"),
  "p-016": u("photo-1558618666-fcd25c85cd64"),
  "p-017": u("photo-1581578731548-c64695cc6952"),
  "p-018": u("photo-1607472586893-edb57bdc0e39"),
  "p-019": u("photo-1607472586893-edb57bdc0e39"),
  "p-020": u("photo-1581578731548-c64695cc6952"),
  "p-021": u("photo-1572981779307-38b8cabb2407"),
  "p-022": u("photo-1504148455328-c376907d081c"),
  "p-023": u("photo-1581092918056-0c4c3acd3789"),
  "p-024": u("photo-1484154218962-a197022b5858"),
  "p-025": u("photo-1600585154526-990dced4db0d"),
  "p-026": u("photo-1600585154340-be6161a56a0c"),
  "p-027": u("photo-1565008447742-97f6f38c985c"),
  "p-028": u("photo-1581094271901-8022df4466f9"),
  "p-029": u("photo-1504307651254-35680f356dfd"),
  "p-030": u("photo-1565008447742-97f6f38c985c"),
};

export function categoryImageUrl(categoryId: string): string {
  return CATEGORY_IMAGES[categoryId] ?? CATEGORY_IMAGES["cat-lumber"];
}

export function productImageUrl(productId: string, categoryId: string): string {
  return PRODUCT_IMAGES[productId] ?? categoryImageUrl(categoryId);
}
