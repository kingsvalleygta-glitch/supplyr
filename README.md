# Supplyr

**Construction supplies storefront** for [Kings Valley Homes](https://kingsvalleyhomes.ca) (Toronto / GTA). Wayfair-style catalog UX with a KVH-owned product catalog today, and deliberate seams for a future multi-supplier marketplace.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- Typed JSON seed data + repository interfaces (swap to Prisma/SQLite later)
- Cart in `localStorage`
- Orders persisted to `data/orders.json` via API routes
- en-CA copy and CAD formatting; Ontario HST (13%) and GTA delivery placeholders

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: set ADMIN_PASSWORD
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

## MVP flows

| Flow | Route |
|------|--------|
| Home (hero, categories, featured) | `/` |
| Category browse + filters/sort | `/categories/[slug]` |
| Search (name / SKU / description) | `/search` |
| Product detail + related | `/products/[slug]` |
| Cart | `/cart` |
| Checkout (mock payment) | `/checkout` |
| Order confirmation | `/orders/[id]` |
| Admin (password gate) | `/admin` |

## Seed catalog

30 construction SKUs across 8 categories (lumber, fasteners, concrete, electrical, plumbing, tools, insulation/drywall, safety). Data lives in:

- `src/data/categories.json`
- `src/data/products.json`

Each product includes optional `supplierId` / `sellerName` for future marketplace expansion.

## Admin

Set `ADMIN_PASSWORD` in `.env.local`. Visit `/admin` and sign in. Shows product counts and recent orders.

## Architecture notes

See [ARCHITECTURE.md](./ARCHITECTURE.md) for hybrid → marketplace extension points.

## License

Private / proprietary to Kings Valley Homes unless otherwise stated.
