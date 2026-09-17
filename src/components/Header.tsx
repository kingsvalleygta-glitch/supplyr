"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

const NAV = [
  { href: "/categories/lumber-sheet-goods", label: "Lumber" },
  { href: "/categories/fasteners-hardware", label: "Fasteners" },
  { href: "/categories/concrete-masonry", label: "Concrete" },
  { href: "/categories/electrical", label: "Electrical" },
  { href: "/categories/plumbing", label: "Plumbing" },
  { href: "/categories/tools-equipment", label: "Tools" },
  { href: "/categories/insulation-drywall", label: "Insulation" },
  { href: "/categories/safety-ppe", label: "Safety" },
];

export function Header() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    setMobileOpen(false);
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="border-b border-white/10 bg-navy text-white">
        <div className="container-site flex items-center justify-between gap-4 py-2 text-xs sm:text-sm">
          <p className="text-white/80">
            <span className="font-medium text-accent">GTA delivery</span>
            <span className="mx-2 text-white/30">·</span>
            Trade pricing
            <span className="mx-2 hidden text-white/30 sm:inline">·</span>
            <span className="hidden sm:inline">Owned by Kings Valley Homes</span>
          </p>
          <p className="shrink-0 text-white/55">CAD · en-CA</p>
        </div>
      </div>

      <div className="container-site flex flex-wrap items-center gap-3 py-3.5 sm:gap-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-md bg-navy text-sm font-bold tracking-tight text-white shadow-sm"
            aria-hidden
          >
            S
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              Supply<span className="text-accent">r</span>
            </span>
            <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:block">
              by Kings Valley Homes
            </span>
          </span>
        </Link>

        <form
          onSubmit={onSearch}
          className="order-3 flex w-full flex-1 gap-2 sm:order-none sm:mx-2 sm:w-auto lg:mx-6"
        >
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-faint">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, SKU, or description…"
              className="input-field w-full py-2.5 pl-9 pr-3"
              aria-label="Search products"
            />
          </div>
          <button type="submit" className="btn-navy hidden shrink-0 sm:inline-flex">
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-ink hover:bg-surface-muted lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <Link
            href="/cart"
            className="inline-flex items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2 text-sm font-semibold text-ink shadow-sm transition hover:border-border-strong hover:bg-surface-muted"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M3 5h2l1.5 10h11L20 8H7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="19" r="1.5" fill="currentColor" />
              <circle cx="17" cy="19" r="1.5" fill="currentColor" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-xs font-bold text-accent-fg">
              {itemCount}
            </span>
          </Link>
        </div>
      </div>

      <nav className="container-site hidden gap-0.5 overflow-x-auto pb-3 lg:flex">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-muted transition hover:bg-surface-muted hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/search"
          className="rounded-md px-3 py-1.5 text-sm font-semibold text-accent hover:bg-accent-soft"
        >
          All products
        </Link>
      </nav>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-border bg-surface lg:hidden"
        >
          <nav className="container-site grid gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-semibold text-accent hover:bg-accent-soft"
            >
              All products
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
