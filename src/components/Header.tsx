"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/CartProvider";

const NAV = [
  { href: "/categories/lumber-sheet-goods", label: "Lumber" },
  { href: "/categories/fasteners-hardware", label: "Fasteners" },
  { href: "/categories/concrete-masonry", label: "Concrete" },
  { href: "/categories/electrical", label: "Electrical" },
  { href: "/categories/plumbing", label: "Plumbing" },
  { href: "/categories/tools-equipment", label: "Tools" },
];

export function Header() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="border-b border-amber-500/30 bg-slate-900 text-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-xs sm:text-sm">
          <p>Toronto / GTA delivery · Trade accounts welcome · Owned by Kings Valley Homes</p>
          <Link href="/admin" className="hidden text-amber-400 hover:underline sm:inline">
            Admin
          </Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Supply<span className="text-amber-600">r</span>
          </span>
          <span className="hidden text-xs font-medium uppercase tracking-wide text-slate-500 sm:inline">
            by Kings Valley Homes
          </span>
        </Link>
        <form onSubmit={onSearch} className="order-3 flex w-full flex-1 gap-2 sm:order-none sm:w-auto">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, SKU, or description…"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-amber-500 focus:ring-2"
            aria-label="Search products"
          />
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Search
          </button>
        </form>
        <Link
          href="/cart"
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cart
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-slate-900">
            {itemCount}
          </span>
        </Link>
      </div>
      <nav className="mx-auto hidden max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:flex">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/search"
          className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          All products
        </Link>
      </nav>
    </header>
  );
}
