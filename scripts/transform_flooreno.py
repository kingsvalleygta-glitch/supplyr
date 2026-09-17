#!/usr/bin/env python3
"""Transform Flooreno WooCommerce Store API dumps into Supplyr products/categories JSON."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "import" / "raw"
OUT_PRODUCTS = ROOT / "src" / "data" / "products.json"
OUT_CATEGORIES = ROOT / "src" / "data" / "categories.json"
META_OUT = ROOT / "data" / "import" / "import-meta.json"

# Top-level Flooreno category slug → Supplyr category
TOP_LEVEL = [
    ("appliances", "Appliances", "🧊", "Kitchen and laundry appliances for residential projects.", True),
    ("bath", "Bath", "🛁", "Bathtubs, vanities, faucets, and bathroom finishing.", True),
    ("building-materials", "Building Materials", "🧱", "Lumber, drywall, insulation, concrete, and decking.", True),
    ("cleaning", "Cleaning", "🧹", "Jobsite and household cleaning supplies.", False),
    ("doors-windows", "Doors & Windows", "🚪", "Doors, windows, and door hardware.", True),
    ("electrical", "Electrical", "⚡", "Wire, breakers, boxes, devices, and fittings.", True),
    ("floors", "Floors", "🪵", "Hardwood, resilient, tile, carpet, and flooring tools.", True),
    ("hardware", "Hardware", "🔩", "Fasteners, hinges, and furniture hardware.", True),
    ("heating-and-cooling-hvac", "HVAC", "❄️", "Heating, cooling, and air quality supplies.", True),
    ("kitchen", "Kitchen", "🍽️", "Kitchen sinks, faucets, and cabinet hardware.", True),
    ("lighting-ceiling-fans", "Lighting", "💡", "Ceiling lights, fans, and commercial lighting.", False),
    ("moulding-and-millwork", "Moulding & Millwork", "📐", "Baseboard, crown, and trim millwork.", False),
    ("paint", "Paint", "🎨", "Paint, adhesives, sealants, and finishes.", False),
    ("plumbing", "Plumbing", "🚿", "Pipe, fittings, valves, and plumbing accessories.", True),
    ("tools", "Tools", "🔧", "Hand tools, power tools, and safety gear.", True),
]

SLUG_TO_ID = {slug: f"cat-{slug}" for slug, *_ in TOP_LEVEL}
# aliases for path segments that differ
ALIASES = {
    "heating-and-cooling-hvac": "heating-and-cooling-hvac",
    "hvac": "heating-and-cooling-hvac",
    "moulding-and-millwork": "moulding-and-millwork",
    "lighting-ceiling-fans": "lighting-ceiling-fans",
    "doors-windows": "doors-windows",
    "building-materials": "building-materials",
}


def strip_html(s: str) -> str:
    s = html.unescape(s or "")
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def top_slug_from_product(p: dict) -> str:
    cats = p.get("categories") or []
    for c in cats:
        link = c.get("link") or ""
        m = re.search(r"/product-category/([^/]+)/", link)
        if m:
            seg = m.group(1)
            return ALIASES.get(seg, seg)
    hint = p.get("categoryHint")
    if hint:
        return ALIASES.get(hint, hint)
    return "building-materials"


def slugify_unique(base: str, used: set[str]) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (base or "").lower()).strip("-") or "product"
    s = s[:80]
    if s not in used:
        used.add(s)
        return s
    i = 2
    while f"{s}-{i}" in used:
        i += 1
    used.add(f"{s}-{i}")
    return f"{s}-{i}"


def load_raw_products() -> list[dict]:
    items = []
    seen = set()
    for path in sorted(RAW_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text())
        except Exception as e:
            print("skip", path, e)
            continue
        if isinstance(data, dict) and "products" in data:
            data = data["products"]
        if not isinstance(data, list):
            continue
        for p in data:
            pid = p.get("id")
            if pid is None or pid in seen:
                continue
            seen.add(pid)
            items.append(p)
    return items


def build_categories() -> list[dict]:
    cats = []
    for slug, name, emoji, desc, featured in TOP_LEVEL:
        cats.append(
            {
                "id": f"cat-{slug}",
                "slug": slug,
                "name": name,
                "description": desc,
                "imageEmoji": emoji,
                "featured": featured,
            }
        )
    return cats


def transform(products_raw: list[dict]) -> list[dict]:
    used_slugs: set[str] = set()
    out = []
    for i, p in enumerate(products_raw):
        top = top_slug_from_product(p)
        if top not in SLUG_TO_ID:
            # try parent path segments already handled; fallback
            top = "building-materials"
        cat_id = SLUG_TO_ID[top]
        prices = p.get("prices") or {}
        minor = int(prices.get("currency_minor_unit") or 2)
        raw_price = prices.get("price") or prices.get("regular_price") or "0"
        try:
            price_cents = int(raw_price)
            if minor != 2:
                # normalize to cents
                price_cents = int(round(int(raw_price) * (10 ** (2 - minor))))
        except Exception:
            price_cents = 0
        reg = prices.get("regular_price")
        compare = None
        try:
            if reg and int(reg) > price_cents:
                compare = int(reg)
        except Exception:
            pass

        images = p.get("images") or []
        image_url = None
        if images:
            image_url = images[0].get("src") or images[0].get("thumbnail")

        name = strip_html(p.get("name") or "Untitled")
        desc = strip_html(p.get("description") or p.get("short_description") or "")
        if not desc:
            desc = f"{name}. Sourced from the FlooReno building supplies catalog for Supplyr."

        sku = str(p.get("sku") or p.get("id") or f"FR-{i}")
        slug = slugify_unique(p.get("slug") or name, used_slugs)
        in_stock = bool(p.get("is_in_stock"))
        stock_qty = 25 if in_stock else 0

        specs = []
        for a in (p.get("attributes") or [])[:6]:
            aname = strip_html(a.get("name") or "")
            terms = a.get("terms") or []
            vals = [strip_html(t.get("name") if isinstance(t, dict) else str(t)) for t in terms]
            vals = [v for v in vals if v and v != "0"]
            if aname and vals:
                specs.append({"label": aname, "value": ", ".join(vals[:4])})
        if not specs:
            specs = [{"label": "Supplier", "value": "FlooReno"}]

        brand = "FlooReno"
        for a in p.get("attributes") or []:
            if (a.get("name") or "").lower() == "manufacturer":
                terms = a.get("terms") or []
                if terms:
                    t0 = terms[0]
                    b = strip_html(t0.get("name") if isinstance(t0, dict) else str(t0))
                    if b and b != "0":
                        brand = b
                        break

        out.append(
            {
                "id": f"fr-{p.get('id')}",
                "sku": sku,
                "slug": slug,
                "name": name[:180],
                "description": desc[:800],
                "categoryId": cat_id,
                "priceCents": max(price_cents, 1),
                **({"compareAtCents": compare} if compare else {}),
                "inStock": in_stock,
                "stockQty": stock_qty,
                "unit": "each",
                "brand": brand[:60],
                "specs": specs,
                "imageEmoji": "📦",
                **({"imageUrl": image_url} if image_url else {}),
                "featured": i < 24 and in_stock,
                "supplierId": "flooreno",
                "sellerName": "FlooReno",
                "relatedIds": [],
            }
        )

    # related ids: same category neighbours
    by_cat: dict[str, list[str]] = {}
    for p in out:
        by_cat.setdefault(p["categoryId"], []).append(p["id"])
    for p in out:
        peers = [x for x in by_cat.get(p["categoryId"], []) if x != p["id"]]
        p["relatedIds"] = peers[:4]

    # ensure some featured across categories
    featured_ids = set()
    for cat_id, ids in by_cat.items():
        for pid in ids[:2]:
            featured_ids.add(pid)
    for p in out:
        if p["id"] in featured_ids:
            p["featured"] = True

    return out


def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    raw = load_raw_products()
    print(f"Raw unique products: {len(raw)}")
    cats = build_categories()
    products = transform(raw)
    OUT_CATEGORIES.write_text(json.dumps(cats, indent=2, ensure_ascii=False) + "\n")
    OUT_PRODUCTS.write_text(json.dumps(products, indent=2, ensure_ascii=False) + "\n")
    meta = {
        "imported": len(products),
        "categories": len(cats),
        "source": "https://flooreno.ca WooCommerce Store API via Apify web-fetch",
        "catalogTotalReported": 17236,
        "note": "Partial sync. Re-run scripts/fetch_flooreno_pages.md / Apify web-fetch with orderby=popularity pages to expand.",
    }
    META_OUT.write_text(json.dumps(meta, indent=2) + "\n")
    from collections import Counter
    c = Counter(p["categoryId"] for p in products)
    print("By category:", dict(c))
    print(f"Wrote {len(products)} products, {len(cats)} categories")


if __name__ == "__main__":
    main()
