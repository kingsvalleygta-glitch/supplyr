# Supplyr architecture — hybrid today, marketplace tomorrow

## Current model (MVP)

- **Single catalog owner:** Kings Valley Homes curates and sells all SKUs.
- **No seller onboarding, payouts, or multi-vendor checkout.**
- **Cart** is client-side (`localStorage` via `CartProvider`).
- **Orders** are created through `POST /api/orders` and stored in `data/orders.json`.
- **Catalog** is loaded from typed JSON through repository interfaces so storage can change without rewriting pages.

```
UI (App Router pages)
  → productRepository / categoryRepository  (sync, seed JSON)
  → orderRepository                         (async, local JSON file)
  → CartProvider                            (browser localStorage)
```

## Marketplace seams already present

| Seam | Where | Purpose |
|------|--------|---------|
| `supplierId` | `Product`, `OrderLine` | Attribute inventory and order lines to a seller |
| `sellerName` | `Product` | Display “Sold by …” without multi-vendor checkout yet |
| `ProductRepository` | `src/lib/repositories/` | Swap JSON for Prisma / external supplier feeds |
| `OrderRepository` | same | Swap file store for Postgres; add payout status later |
| Order lines carry `supplierId` | checkout API | Enables future split shipments / seller reports |

## Suggested evolution path

1. **Persistence:** Replace JSON with Prisma + SQLite/Postgres; keep repository method signatures.
2. **Suppliers:** Add `Supplier` entity; filter admin by `supplierId`; still single checkout entity (KVH as merchant of record).
3. **Inventory sync:** Background jobs update `stockQty` / `inStock` per supplier feed.
4. **Multi-vendor checkout (later):** Split cart by `supplierId`, per-seller shipping quotes, escrow/payouts — **out of scope for this MVP**.
5. **Auth:** Replace cookie admin gate with proper auth (Clerk/Auth.js) and role-based access (`kvh_admin`, `supplier`).

## Deliberately not built

- Seller onboarding / KYC
- Payout rails / commission engines
- Real payment processors (mock methods only)
- Live freight quoting beyond flat GTA placeholder rules

## Key paths

- Types: `src/lib/types.ts`
- Seed: `src/data/*.json`
- Repositories: `src/lib/repositories/`
- Checkout API: `src/app/api/orders/route.ts`
