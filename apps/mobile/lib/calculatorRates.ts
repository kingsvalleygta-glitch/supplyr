/** Simplified install estimate rates (mirrors web /calculator). */

export type AreaKey = "basement" | "first" | "second" | "condo";

export type FlooringType =
  | "hardwood"
  | "engineered"
  | "resilient"
  | "laminate"
  | "tile"
  | "carpet";

export const AREAS: { key: AreaKey; label: string }[] = [
  { key: "basement", label: "Basement" },
  { key: "first", label: "1st Floor" },
  { key: "second", label: "2nd Floor" },
  { key: "condo", label: "Condo" },
];

export const FLOORING_OPTIONS: {
  key: FlooringType;
  label: string;
  ratePerSqFtCents: number;
}[] = [
  { key: "hardwood", label: "Hardwood", ratePerSqFtCents: 850 },
  { key: "engineered", label: "Engineered hardwood", ratePerSqFtCents: 750 },
  { key: "resilient", label: "Resilient / vinyl (LVP)", ratePerSqFtCents: 450 },
  { key: "laminate", label: "Laminate", ratePerSqFtCents: 400 },
  { key: "tile", label: "Tile / stone", ratePerSqFtCents: 950 },
  { key: "carpet", label: "Carpet", ratePerSqFtCents: 350 },
];

export function estimateCents(
  flooring: FlooringType,
  sqFt: number,
  removal: boolean,
  underlayment: boolean
): { labourCents: number; addonsCents: number; totalCents: number } {
  const opt = FLOORING_OPTIONS.find((f) => f.key === flooring)!;
  const sq = Math.max(0, sqFt);
  const labourCents = Math.round(opt.ratePerSqFtCents * sq);
  let addonsCents = 0;
  if (removal) addonsCents += 150 * sq;
  if (underlayment) addonsCents += 75 * sq;
  return {
    labourCents,
    addonsCents,
    totalCents: labourCents + addonsCents,
  };
}
