import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-semibold text-white">
            Supply<span className="text-amber-500">r</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Construction supplies for Toronto and the GTA. Catalog owned and
            curated by Kings Valley Homes — with room to grow into a multi-supplier
            marketplace.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Shop
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/search" className="hover:text-white">
                All products
              </Link>
            </li>
            <li>
              <Link href="/categories/lumber-sheet-goods" className="hover:text-white">
                Lumber & sheet goods
              </Link>
            </li>
            <li>
              <Link href="/categories/tools-equipment" className="hover:text-white">
                Tools & equipment
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Delivery
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Placeholder GTA delivery: free on orders $500+ CAD before tax.
            Flat $49.99 under that. Exact windows confirmed after checkout.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Kings Valley Homes · Supplyr MVP · Prices in CAD
      </div>
    </footer>
  );
}
