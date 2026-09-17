"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function ProductFilters({
  showSearch = false,
  initialQ = "",
}: {
  showSearch?: boolean;
  initialQ?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(initialQ || searchParams.get("q") || "");
  const [min, setMin] = useState(searchParams.get("min") || "");
  const [max, setMax] = useState(searchParams.get("max") || "");
  const inStock = searchParams.get("inStock") === "1";
  const sort = searchParams.get("sort") || "featured";

  function push(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v == null || v === "") params.delete(k);
      else params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    push({
      q: showSearch ? q.trim() || undefined : searchParams.get("q") || undefined,
      min: min || undefined,
      max: max || undefined,
      inStock: inStock ? "1" : undefined,
      sort,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-28"
    >
      <p className="font-display text-base font-semibold text-ink">Filters</p>
      {showSearch ? (
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="input-field mt-1.5 normal-case tracking-normal"
            placeholder="Name, SKU, description"
          />
        </label>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Min ($)
          <input
            type="number"
            min={0}
            step="0.01"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="input-field mt-1.5 normal-case tracking-normal"
          />
        </label>
        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Max ($)
          <input
            type="number"
            min={0}
            step="0.01"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="input-field mt-1.5 normal-case tracking-normal"
          />
        </label>
      </div>
      <label className="flex items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          checked={inStock}
          onChange={(e) =>
            push({
              inStock: e.target.checked ? "1" : undefined,
              q: searchParams.get("q") || undefined,
              min: searchParams.get("min") || undefined,
              max: searchParams.get("max") || undefined,
              sort,
            })
          }
          className="h-4 w-4 rounded border-border-strong text-accent accent-accent"
        />
        In stock only
      </label>
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted">
        Sort
        <select
          value={sort}
          onChange={(e) =>
            push({
              sort: e.target.value,
              q: searchParams.get("q") || undefined,
              min: searchParams.get("min") || undefined,
              max: searchParams.get("max") || undefined,
              inStock: inStock ? "1" : undefined,
            })
          }
          className="input-field mt-1.5 normal-case tracking-normal"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name-asc">Name: A–Z</option>
          <option value="name-desc">Name: Z–A</option>
        </select>
      </label>
      <button type="submit" className="btn-navy w-full">
        Apply filters
      </button>
    </form>
  );
}
