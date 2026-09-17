import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-navy text-white/75">
      <div className="container-site grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-display text-xl font-bold text-white">
            Supply<span className="text-accent">r</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Construction supplies for Toronto and the Greater Toronto Area.
            Catalog curated by Kings Valley Homes for trade and jobsite crews.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Shop
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/search" className="hover:text-white">
                All products
              </Link>
            </li>
            <li>
              <Link href="/categories/floors" className="hover:text-white">
                Floors
              </Link>
            </li>
            <li>
              <Link href="/categories/building-materials" className="hover:text-white">
                Building materials
              </Link>
            </li>
            <li>
              <Link href="/categories/tools" className="hover:text-white">
                Tools
              </Link>
            </li>
            <li>
              <Link href="/calculator" className="hover:text-white">
                Install calculator
              </Link>
            </li>
            <li>
              <Link href="/pro" className="hover:text-white">
                Supplyr Pro
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Delivery
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            GTA delivery: free on orders $500+ CAD before tax. Flat $49.99 under
            that. Exact windows confirmed after checkout.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
            Trade
          </p>
          <p className="mt-4 text-sm leading-relaxed">
            <Link href="/pro" className="font-semibold text-accent hover:underline">
              Supplyr Pro
            </Link>{" "}
            trade accounts welcome. Pricing in CAD with HST at checkout.
            Returns on unused stocked items within 30 days.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Kings Valley Homes · Supplyr · Prices in CAD
      </div>
    </footer>
  );
}
