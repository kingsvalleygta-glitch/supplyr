# Supplyr

**Construction supplies storefront** for [Kings Valley Homes](https://kingsvalleyhomes.ca) (Toronto / GTA). Wayfair-style catalog UX with a catalog mirrored from [FlooReno](https://flooreno.ca) for Supplyr, plus deliberate seams for a future multi-supplier marketplace.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS v4
- Typed JSON catalog + repository interfaces (swap to Prisma/SQLite later)
- Cart in `localStorage`
- Orders persisted to `data/orders.json` via API routes
- Pro leads persisted to `data/pro-leads.json`
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
| Live order tracking (map + timeline) | `/orders/[id]/track` |
| Installation calculator | `/calculator` |
| Supplyr Pro (trade accounts) | `/pro` |
| Admin (password gate) | `/admin` |

## Catalog (FlooReno mirror)

Product data is imported from the public WooCommerce Store API on **flooreno.ca** (via Apify `web-fetch` / unblocker — plain curl is Cloudflare-blocked). Attribution: catalog mirrored from Flooreno.ca for Supplyr.

- Seed files: `src/data/categories.json`, `src/data/products.json`
- Import scripts: `scripts/transform_flooreno.py`, `scripts/save_apify_markdown_products.py`
- Raw dumps: `data/import/raw/`
- Meta: `data/import/import-meta.json` (imported count vs full catalog ~17k)

Each product includes `supplierId: "flooreno"` / `sellerName: "FlooReno"` and optional `imageUrl` from the Flooreno CDN (`flooreno.ca/wp-content/uploads/...`).

### Re-run / expand sync

1. Fetch pages with Apify web-fetch (or any Cloudflare-capable client):
   `https://flooreno.ca/wp-json/wc/store/v1/products?per_page=100&page=N&orderby=popularity`
2. Save each JSON array into `data/import/raw/*.json`
3. Run `python3 scripts/transform_flooreno.py`
4. `npm run build`

Prefer `orderby=popularity` — those results include images and categories. Dedicated WooCommerce Apify scrapers often return 0 on this store due to bot protection.

## Installation calculator

`/calculator` — multi-area (Basement, 1st–3rd Floor, Condo) rough labour estimates with transparent placeholder rates. Clearly marked **estimate only, not a quote**.

## Supplyr Pro

`/pro` — contractor landing + interest form. Submissions append to `data/pro-leads.json` and set a `supplyr_pro` cookie that shows a Pro badge and a 10% display discount indicator on product cards.

## Admin

Set `ADMIN_PASSWORD` in `.env.local`. Visit `/admin` and sign in. Shows product counts and recent orders.


## Live order tracking (demo)

After checkout, open **Track order** on the confirmation page (`/orders/[id]/track`).

- Amazon-style status timeline: Order placed → Preparing → Out for delivery → Nearby → Delivered
- Uber-style live map (Leaflet + OpenStreetMap / CARTO dark tiles) with yellow courier marker
- Client polls `GET /api/orders/[id]/tracking` every ~2.5s; the server advances a deterministic depot→destination polyline simulation

**Replace the simulation with real telematics later:** keep the same order fields (`status`, `statusHistory`, `destination`, `driver`, `etaMinutes`) and have your courier GPS / webhook write those fields (or push to the tracking route). Remove or gate `advanceTrackingSimulation` in `src/lib/tracking.ts` / the tracking API once live positions arrive from your fleet provider.

## Architecture notes

See [ARCHITECTURE.md](./ARCHITECTURE.md) for hybrid → marketplace extension points.

## License

Private / proprietary to Kings Valley Homes unless otherwise stated.

## Mobile app (Expo)

Expo Router app for **iOS and Android** (Expo Go):

```bash
cd apps/mobile
npm install
npx expo start
```

See [apps/mobile/README.md](./apps/mobile/README.md) for Expo Go install (iPhone + Android), QR scanning, and `EXPO_PUBLIC_API_BASE_URL`.

JSON APIs used by mobile: `GET /api/products`, `GET /api/products/[slug]`, `GET /api/categories`, `POST /api/orders`, `GET /api/orders/[id]`, `GET /api/orders/[id]/tracking`, `POST /api/pro-leads`.

