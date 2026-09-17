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

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative flex h-9 w-9 items-center justify-center rounded-md bg-navy shadow-sm ${className}`}
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 18V8l8-4 8 4v10H4z"
          stroke="#fff"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
        <path d="M4 18h16M10 18v-5h4v5" stroke="#fff" strokeWidth="1.75" strokeLinejoin="round" />
        <rect x="9" y="10" width="6" height="2.5" rx="0.5" fill="#f5c518" />
      </svg>
    </span>
  );
}

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
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
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
        <div className="container-site flex items-center justify-between gap-3 py-2 text-xs sm:text-sm">
          <p className="min-w-0 truncate text-white/80">
            <span className="font-semibold text-accent">GTA delivery</span>
            <span className="mx-2 text-white/25">·</span>
            Trade pricing
            <span className="mx-2 hidden text-white/25 sm:inline">·</span>
            <span className="hidden sm:inline">Kings Valley Homes</span>
          </p>
          <p className="shrink-0 text-white/50">CAD · en-CA</p>
        </div>
      </div>

      <div className="container-site flex items-center gap-2 py-3 sm:gap-4 sm:py-3.5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <LogoMark />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-ink sm:text-[1.35rem]">
              Supply<span className="text-accent">r</span>
            </span>
            <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint sm:block">
              by Kings Valley Homes
            </span>
          </span>
        </Link>

        <form
          onSubmit={onSearch}
          className="mx-1 hidden min-w-0 flex-1 gap-2 sm:mx-2 sm:flex lg:mx-6"
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
          <button type="submit" className="btn-navy hidden shrink-0 md:inline-flex">
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-ink hover:bg-surface-muted sm:hidden"
            aria-label="Search"
            onClick={() => {
              setMobileOpen(true);
              requestAnimationFrame(() => {
                document.getElementById("mobile-search-input")?.focus();
              });
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-ink hover:bg-surface-muted lg:hidden"
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
            className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-semibold text-ink shadow-sm transition hover:border-border-strong hover:bg-surface-muted"
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
          className="rounded-md px-3 py-1.5 text-sm font-bold text-navy hover:bg-accent-soft"
        >
          All products
        </Link>
      </nav>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full max-h-[min(80vh,560px)] overflow-y-auto border-t border-border bg-surface shadow-lg lg:hidden"
        >
          <form onSubmit={onSearch} className="container-site flex gap-2 border-b border-border py-3 sm:hidden">
            <input
              id="mobile-search-input"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="input-field flex-1 py-2.5"
              aria-label="Search products"
            />
            <button type="submit" className="btn-navy shrink-0 px-4">
              Go
            </button>
          </form>
          <nav className="container-site grid gap-0.5 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-ink hover:bg-surface-muted"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-3 text-base font-bold text-navy hover:bg-accent-soft"
            >
              All products
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
