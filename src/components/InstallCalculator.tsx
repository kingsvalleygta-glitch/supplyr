"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatCAD } from "@/lib/format";
import {
  ADDONS,
  AREAS,
  AreaConfig,
  AreaKey,
  FLOORING_OPTIONS,
  ROOM_TYPES,
  emptyAreaConfig,
  estimateAreaCents,
} from "@/lib/calculatorRates";

type ConfigMap = Record<AreaKey, AreaConfig>;

function initialConfig(): ConfigMap {
  return {
    basement: emptyAreaConfig(),
    first: emptyAreaConfig(),
    second: emptyAreaConfig(),
    third: emptyAreaConfig(),
    condo: emptyAreaConfig(),
  };
}

export function InstallCalculator() {
  const [configs, setConfigs] = useState<ConfigMap>(initialConfig);
  const [active, setActive] = useState<AreaKey | null>(null);

  const estimates = useMemo(() => {
    const byArea = AREAS.map((a) => ({
      ...a,
      estimate: estimateAreaCents(configs[a.key]),
      config: configs[a.key],
    }));
    const totalCents = byArea.reduce((s, a) => s + a.estimate.totalCents, 0);
    const enabledCount = byArea.filter((a) => a.config.enabled).length;
    return { byArea, totalCents, enabledCount };
  }, [configs]);

  function update(key: AreaKey, patch: Partial<AreaConfig>) {
    setConfigs((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  }

  function toggleArea(key: AreaKey) {
    const next = !configs[key].enabled;
    update(key, { enabled: next });
    setActive(next ? key : active === key ? null : active);
  }

  const activeCfg = active ? configs[active] : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-faint">
          Step 1
        </p>
        <h2 className="font-display mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Where will it be installed?
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Select one or more areas, then configure flooring type and size. You
          get one combined estimate.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {AREAS.map((area) => {
            const on = configs[area.key].enabled;
            const est = estimateAreaCents(configs[area.key]);
            return (
              <button
                key={area.key}
                type="button"
                onClick={() => toggleArea(area.key)}
                className={`rounded-xl border p-4 text-left transition ${
                  on
                    ? "border-accent bg-accent-soft shadow-sm"
                    : "border-border bg-surface hover:border-border-strong"
                } ${active === area.key ? "ring-2 ring-accent" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-bold text-ink">
                      {area.label}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">{area.blurb}</p>
                  </div>
                  <span
                    className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                      on
                        ? "border-navy bg-navy text-accent"
                        : "border-border-strong text-ink-faint"
                    }`}
                  >
                    {on ? "✓" : ""}
                  </span>
                </div>
                {on ? (
                  <p className="mt-3 text-sm font-semibold text-navy">
                    {formatCAD(est.totalCents)}
                    <button
                      type="button"
                      className="ml-2 text-xs font-bold text-ink-muted underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActive(area.key);
                      }}
                    >
                      Configure →
                    </button>
                  </p>
                ) : (
                  <p className="mt-3 text-xs font-semibold text-ink-faint">
                    Tap to configure →
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {active && activeCfg?.enabled ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl font-bold text-ink">
                Configure · {AREAS.find((a) => a.key === active)?.label}
              </h3>
              <button
                type="button"
                className="text-sm font-semibold text-ink-muted hover:text-ink"
                onClick={() => setActive(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-ink">Room type</span>
                <select
                  className="input-field mt-1.5"
                  value={activeCfg.roomType}
                  onChange={(e) => update(active, { roomType: e.target.value })}
                >
                  {ROOM_TYPES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                <span className="font-semibold text-ink">Flooring type</span>
                <select
                  className="input-field mt-1.5"
                  value={activeCfg.flooring}
                  onChange={(e) =>
                    update(active, {
                      flooring: e.target.value as AreaConfig["flooring"],
                    })
                  }
                >
                  {FLOORING_OPTIONS.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>

              {activeCfg.flooring === "stairs" ? (
                <label className="block text-sm">
                  <span className="font-semibold text-ink">Stair runs</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className="input-field mt-1.5"
                    value={activeCfg.stairsCount || 1}
                    onChange={(e) =>
                      update(active, {
                        stairsCount: Number(e.target.value) || 1,
                      })
                    }
                  />
                </label>
              ) : (
                <label className="block text-sm">
                  <span className="font-semibold text-ink">
                    Approximate area (sq ft)
                  </span>
                  <input
                    type="number"
                    min={10}
                    max={10000}
                    step={10}
                    className="input-field mt-1.5"
                    value={activeCfg.sqFt}
                    onChange={(e) =>
                      update(active, { sqFt: Number(e.target.value) || 0 })
                    }
                  />
                </label>
              )}
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-ink">Add-ons</legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {(
                  [
                    ["removal", "removal", ADDONS[0].label],
                    ["underlayment", "underlayment", ADDONS[1].label],
                    ["transition", "transition", ADDONS[2].label],
                  ] as const
                ).map(([key, field, label]) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(activeCfg[field])}
                      onChange={(e) =>
                        update(active, { [field]: e.target.checked })
                      }
                      className="accent-[var(--accent)]"
                    />
                    <span className="font-medium text-ink">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <p className="mt-4 text-xs text-ink-faint">
              {
                FLOORING_OPTIONS.find((f) => f.key === activeCfg.flooring)?.note
              }{" "}
              · Rates are transparent placeholders for planning only.
            </p>
          </div>
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-2xl border border-border bg-navy p-6 text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">
            Combined estimate
          </p>
          <p className="font-display mt-3 text-4xl font-bold tracking-tight">
            {formatCAD(estimates.totalCents)}
          </p>
          <p className="mt-2 text-sm text-white/60">
            {estimates.enabledCount === 0
              ? "Select an area to begin"
              : `${estimates.enabledCount} area${
                  estimates.enabledCount === 1 ? "" : "s"
                } · CAD · estimate only`}
          </p>

          <ul className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
            {estimates.byArea
              .filter((a) => a.config.enabled)
              .map((a) => (
                <li key={a.key}>
                  <div className="flex justify-between gap-3 font-semibold">
                    <span>{a.label}</span>
                    <span className="text-accent">
                      {formatCAD(a.estimate.totalCents)}
                    </span>
                  </div>
                  <ul className="mt-1 space-y-0.5 text-xs text-white/50">
                    {a.estimate.breakdown.map((b) => (
                      <li key={b.label} className="flex justify-between gap-2">
                        <span>{b.label}</span>
                        <span>{formatCAD(b.cents)}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>

          <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 p-3 text-xs leading-relaxed text-accent">
            <strong className="font-bold">Estimate only — not a quote.</strong>{" "}
            Final pricing depends on site conditions, materials, and a walkthrough.
            HST not included.
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Link href="/pro" className="btn-primary w-full justify-center">
              Request a real quote
            </Link>
            <Link
              href="/categories/floors"
              className="inline-flex w-full items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Shop flooring products
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
