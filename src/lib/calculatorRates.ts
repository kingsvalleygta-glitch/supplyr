/** Transparent placeholder installation rates (CAD / sq ft). Estimate only — not a quote. */

export type AreaKey = "basement" | "first" | "second" | "third" | "condo";

export type FlooringType =
  | "hardwood"
  | "engineered"
  | "resilient"
  | "laminate"
  | "tile"
  | "carpet"
  | "stairs";

export const AREAS: { key: AreaKey; label: string; blurb: string }[] = [
  { key: "basement", label: "Basement", blurb: "Below grade installs" },
  { key: "first", label: "1st Floor", blurb: "Main living areas" },
  { key: "second", label: "2nd Floor", blurb: "Upper storey rooms" },
  { key: "third", label: "3rd Floor", blurb: "Top floor / loft" },
  { key: "condo", label: "Condo", blurb: "Suite / condo unit" },
];

export const FLOORING_OPTIONS: {
  key: FlooringType;
  label: string;
  ratePerSqFtCents: number;
  note: string;
}[] = [
  {
    key: "hardwood",
    label: "Hardwood",
    ratePerSqFtCents: 850,
    note: "Solid hardwood install labour",
  },
  {
    key: "engineered",
    label: "Engineered hardwood",
    ratePerSqFtCents: 750,
    note: "Floating or glue-down",
  },
  {
    key: "resilient",
    label: "Resilient / vinyl (LVP)",
    ratePerSqFtCents: 450,
    note: "Click or glue LVP/LVT",
  },
  {
    key: "laminate",
    label: "Laminate",
    ratePerSqFtCents: 400,
    note: "Floating laminate",
  },
  {
    key: "tile",
    label: "Tile / stone",
    ratePerSqFtCents: 950,
    note: "Ceramic, porcelain, or stone",
  },
  {
    key: "carpet",
    label: "Carpet",
    ratePerSqFtCents: 350,
    note: "Stretch-in or glue-down",
  },
  {
    key: "stairs",
    label: "Stairs (per tread set)",
    ratePerSqFtCents: 12500,
    note: "Flat rate per stair run (not sq ft)",
  },
];

export const ROOM_TYPES = [
  "Living room",
  "Dining room",
  "Kitchen",
  "Bedroom",
  "Hallway",
  "Bathroom",
  "Office",
  "Open concept",
  "Other",
] as const;

/** Optional add-ons (CAD cents, flat or per sq ft as noted) */
export const ADDONS = [
  {
    key: "removal",
    label: "Existing floor removal",
    perSqFtCents: 150,
    flatCents: 0,
  },
  {
    key: "underlayment",
    label: "Underlayment",
    perSqFtCents: 75,
    flatCents: 0,
  },
  {
    key: "transition",
    label: "Transitions / reducers",
    perSqFtCents: 0,
    flatCents: 12500,
  },
] as const;

export type AreaConfig = {
  enabled: boolean;
  roomType: string;
  flooring: FlooringType;
  sqFt: number;
  stairsCount: number;
  removal: boolean;
  underlayment: boolean;
  transition: boolean;
};

export function emptyAreaConfig(): AreaConfig {
  return {
    enabled: false,
    roomType: "Living room",
    flooring: "resilient",
    sqFt: 200,
    stairsCount: 0,
    removal: false,
    underlayment: false,
    transition: false,
  };
}

export function estimateAreaCents(cfg: AreaConfig): {
  labourCents: number;
  addonsCents: number;
  totalCents: number;
  breakdown: { label: string; cents: number }[];
} {
  if (!cfg.enabled) {
    return { labourCents: 0, addonsCents: 0, totalCents: 0, breakdown: [] };
  }

  const flooring = FLOORING_OPTIONS.find((f) => f.key === cfg.flooring)!;
  const breakdown: { label: string; cents: number }[] = [];
  let labourCents = 0;

  if (cfg.flooring === "stairs") {
    const runs = Math.max(0, cfg.stairsCount || 1);
    labourCents = flooring.ratePerSqFtCents * runs;
    breakdown.push({
      label: `Stairs × ${runs}`,
      cents: labourCents,
    });
  } else {
    const sq = Math.max(0, cfg.sqFt);
    labourCents = Math.round(flooring.ratePerSqFtCents * sq);
    breakdown.push({
      label: `${flooring.label} · ${sq} sq ft`,
      cents: labourCents,
    });
  }

  let addonsCents = 0;
  const sq = Math.max(0, cfg.sqFt);
  if (cfg.removal && cfg.flooring !== "stairs") {
    const c = ADDONS[0].perSqFtCents * sq;
    addonsCents += c;
    breakdown.push({ label: "Floor removal", cents: c });
  }
  if (cfg.underlayment && cfg.flooring !== "stairs") {
    const c = ADDONS[1].perSqFtCents * sq;
    addonsCents += c;
    breakdown.push({ label: "Underlayment", cents: c });
  }
  if (cfg.transition) {
    const c = ADDONS[2].flatCents;
    addonsCents += c;
    breakdown.push({ label: "Transitions", cents: c });
  }

  return {
    labourCents,
    addonsCents,
    totalCents: labourCents + addonsCents,
    breakdown,
  };
}
