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
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <p className="text-sm font-semibold text-slate-900">Filters</p>
      {showSearch ? (
        <label className="block text-xs font-medium text-slate-600">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            placeholder="Name, SKU, description"
          />
        </label>
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs font-medium text-slate-600">
          Min price ($)
          <input
            type="number"
            min={0}
            step="0.01"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-xs font-medium text-slate-600">
          Max price ($)
          <input
            type="number"
            min={0}
            step="0.01"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
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
        />
        In stock only
      </label>
      <label className="block text-xs font-medium text-slate-600">
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
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name-asc">Name: A–Z</option>
          <option value="name-desc">Name: Z–A</option>
        </select>
      </label>
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
      >
        Apply
      </button>
    </form>
  );
}
