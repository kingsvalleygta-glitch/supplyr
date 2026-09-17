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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3v18M7 8h7.5a2.5 2.5 0 010 5H7h8a2.5 2.5 0 010 5H7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Straightforward returns",
    body: "Unused stocked items returned within 30 days — no runaround.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M4 12a8 8 0 101.5-4.5M4 4v4h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Jobsite-ready stock",
    body: "Lumber, fasteners, concrete, electrical, plumbing, tools, and PPE.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,197,24,0.28),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.06),transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="container-site relative grid gap-12 py-20 sm:py-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16 lg:py-32">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent sm:text-xs">
              Kings Valley Homes · Toronto / GTA
            </p>
            <h1 className="font-display mt-6 text-[2.35rem] font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.75rem]">
              Construction supplies,{" "}
              <span className="text-accent">ready for the jobsite.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Order flooring, building materials, plumbing, electrical, hardware, tools,
              and more with clear CAD pricing and GTA delivery — catalog mirrored
              from FlooReno for Supplyr crews.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/search" className="btn-primary min-h-12 w-full px-7 py-3.5 text-base sm:w-auto">
                Browse catalog
              </Link>
              <Link
                href="/categories/floors"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-white/25 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur hover:bg-white/10 sm:w-auto"
              >
                Shop floors
              </Link>
              <Link
                href="/calculator"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-accent/40 bg-accent/10 px-7 py-3.5 text-base font-semibold text-accent backdrop-blur hover:bg-accent/20 sm:w-auto"
              >
                Install calculator
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:gap-4">
            {[
              ["Free*", "GTA delivery on $500+"],
              ["CAD", "Transparent list pricing"],
              ["15", "Trade categories"],
              ["30-day", "Returns on unused stock"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5"
              >
                <p className="font-display text-2xl font-bold text-accent sm:text-3xl">{k}</p>
                <p className="mt-2 text-sm leading-snug text-white/65">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="container-site grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:py-14">
          {TRUST.map((item) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-accent">
                {item.icon}
              </div>
              <div>
                <p className="text-base font-bold text-ink">{item.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-site py-16 sm:py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
              Categories
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Shop by category
            </h2>
            <p className="mt-3 max-w-lg text-ink-muted">
              Start with the trades your crews order every week.
            </p>
          </div>
          <Link
            href="/search"
            className="hidden text-sm font-bold text-navy hover:underline sm:inline"
          >
            View all <span className="text-accent">→</span>
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="container-site py-16 sm:py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
                Featured
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Featured products
              </h2>
              <p className="mt-3 max-w-lg text-ink-muted">
                High-velocity SKUs stocked for Toronto builds.
              </p>
            </div>
            <Link
              href="/search"
              className="hidden text-sm font-bold text-navy hover:underline sm:inline"
            >
              Browse catalog <span className="text-accent">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/search" className="btn-navy inline-flex min-h-11 px-6">
              Browse full catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
