import type { Metadata } from "next";
import Link from "next/link";
import { InstallCalculator } from "@/components/InstallCalculator";

export const metadata: Metadata = {
  title: "Installation calculator",
  description:
    "Get an instant rough estimate for flooring and stair installation across the GTA. Transparent placeholder rates — estimate only, not a quote.",
};

export default function CalculatorPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,197,24,0.25),transparent_50%)]" />
        <div className="container-site relative py-14 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Supplyr · Install planning
          </p>
          <h1 className="font-display mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
            Installation <span className="text-accent">calculator.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Instant rough labour estimates for flooring and stair projects.
            Transparent placeholder rates. No commitment — this is planning math,
            not a formal quote.
          </p>
          <p className="mt-4 text-sm text-white/45">
            Need materials too?{" "}
            <Link href="/search?q=flooring" className="font-semibold text-accent hover:underline">
              Browse the catalog →
            </Link>
          </p>
        </div>
      </section>

      <section className="container-site py-10 sm:py-14">
        <InstallCalculator />
      </section>
    </div>
  );
}
