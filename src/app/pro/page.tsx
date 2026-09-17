import type { Metadata } from "next";
import Link from "next/link";
import { ProSignupForm } from "@/components/ProSignupForm";

export const metadata: Metadata = {
  title: "Supplyr Pro",
  description:
    "Trade accounts for contractors across the GTA and Ottawa — bulk discounts, priority support, and Pro pricing on Supplyr.",
};

const BENEFITS = [
  {
    title: "Wholesale-style pricing",
    body: "Unlock Pro list prices on high-velocity construction SKUs — built for crews who buy every week.",
  },
  {
    title: "Bulk & jobsite orders",
    body: "Larger quantities, consolidated drops, and CAD invoicing that matches how GTA crews actually work.",
  },
  {
    title: "Priority support",
    body: "Faster answers on stock, substitutions, and delivery windows when the schedule is tight.",
  },
  {
    title: "GTA + Ottawa delivery framing",
    body: "Jobsite-friendly logistics across Toronto / GTA and Ottawa corridors — confirm windows at checkout.",
  },
];

export default function ProPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,197,24,0.22),transparent_45%)]" />
        <div className="container-site relative grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              Supplyr Pro+
            </p>
            <h1 className="font-display mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Built for trades who{" "}
              <span className="text-accent">buy like pros.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Supplyr Pro is the contractor program for Kings Valley Homes crews
              and partner trades — bulk-friendly pricing, priority support, and
              catalog access tuned for renovations and new builds.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#apply" className="btn-primary min-h-12 px-7 py-3.5 text-base">
                Apply for Pro pricing
              </a>
              <Link
                href="/calculator"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/25 bg-white/5 px-7 py-3.5 text-base font-semibold text-white hover:bg-white/10"
              >
                Install calculator
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
            <p className="font-display text-2xl font-bold text-accent">10%</p>
            <p className="mt-1 text-sm font-semibold text-white">
              Indicative Pro savings badge
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              After you register interest, a Pro cookie unlocks a catalog badge
              and a 10% display discount indicator on product cards. Final trade
              terms are confirmed when your account is activated.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-white/75">
              <li>· No public coupon codes</li>
              <li>· CAD pricing · en-CA</li>
              <li>· Demo signup — no live email send</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container-site py-14 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
          Why Pro
        </p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink">
          Benefits for contractors
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-xl border border-border bg-surface p-5 shadow-sm sm:p-6"
            >
              <h3 className="font-display text-lg font-bold text-ink">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="apply"
        className="border-t border-border bg-surface-muted/50 py-14 sm:py-20"
      >
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
              Registration
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-ink">
              Request Pro access
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              Tell us who you are and how you buy. We&apos;ll store your interest
              and flip on the Pro badge in this browser so you can preview the
              experience.
            </p>
            <p className="mt-4 text-sm text-ink-muted">
              Already shopping?{" "}
              <Link href="/search" className="font-bold text-navy hover:underline">
                Browse the catalog →
              </Link>
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-8">
            <ProSignupForm />
          </div>
        </div>
      </section>
    </div>
  );
}
