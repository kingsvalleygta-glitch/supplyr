import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { categoryRepository } from "@/lib/repositories/categoryRepository";
import { productRepository } from "@/lib/repositories/productRepository";

const TRUST = [
  {
    title: "GTA delivery",
    body: "Jobsite drop-offs across Toronto and the Greater Toronto Area.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 7h11v10H3V7zM14 10h4l3 3v4h-7v-7z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="1.5" fill="currentColor" />
        <circle cx="17" cy="18" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Trade pricing",
    body: "CAD list pricing built for contractors, renovators, and site managers.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3v18M7 8h7.5a2.5 2.5 0 010 5H7h8a2.5 2.5 0 010 5H7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Straightforward returns",
    body: "Unused stocked items returned within 30 days — no runaround.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 12a8 8 0 101.5-4.5M4 4v4h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Jobsite-ready stock",
    body: "Lumber, fasteners, concrete, electrical, plumbing, tools, and PPE.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 20V9l8-5 8 5v11M4 20h16M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const categories = categoryRepository.getFeatured();
  const featured = productRepository.getFeatured(8);

  return (
    <div>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,120,42,0.22),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div className="container-site relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Kings Valley Homes · Toronto / GTA
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Construction supplies, ready for the jobsite.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
              Order lumber, fasteners, concrete, electrical, plumbing, tools, and
              safety gear with clear CAD pricing and GTA delivery — curated for
              crews who build every day.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/search" className="btn-primary px-6 py-3">
                Browse catalog
              </Link>
              <Link
                href="/categories/lumber-sheet-goods"
                className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
              >
                Shop lumber
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Free*", "GTA delivery on $500+"],
              ["CAD", "Transparent list pricing"],
              ["8", "Core trade categories"],
              ["30-day", "Returns on unused stock"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
              >
                <p className="font-display text-2xl font-bold text-accent">{k}</p>
                <p className="mt-1.5 text-white/65">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="container-site grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-10">
          {TRUST.map((item) => (
            <div key={item.title} className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent-soft text-accent">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-site py-14 sm:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Shop by category
            </h2>
            <p className="mt-2 text-ink-muted">
              Start with the trades your crews order every week.
            </p>
          </div>
          <Link
            href="/search"
            className="hidden text-sm font-semibold text-accent hover:text-accent-hover sm:inline"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="container-site py-14 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Featured products
              </h2>
              <p className="mt-2 text-ink-muted">
                High-velocity SKUs stocked for Toronto builds.
              </p>
            </div>
            <Link
              href="/search"
              className="hidden text-sm font-semibold text-accent hover:text-accent-hover sm:inline"
            >
              Browse catalog →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
