/** Geometric category placeholders — industrial, license-safe, no emoji. */

const PALETTE: Record<
  string,
  { bg: string; ink: string; accent: string; mid: string }
> = {
  "cat-lumber": {
    bg: "#e8dfd2",
    ink: "#5c4030",
    accent: "#c4782a",
    mid: "#b89a78",
  },
  "cat-fasteners": {
    bg: "#dfe4ea",
    ink: "#3a4554",
    accent: "#8a93a0",
    mid: "#9aa3b0",
  },
  "cat-concrete": {
    bg: "#e4e2de",
    ink: "#4a4742",
    accent: "#8b8680",
    mid: "#a8a49e",
  },
  "cat-electrical": {
    bg: "#e8e4d4",
    ink: "#3d3a28",
    accent: "#d4a017",
    mid: "#c4b878",
  },
  "cat-plumbing": {
    bg: "#d9e4ec",
    ink: "#2a4558",
    accent: "#4a7fa0",
    mid: "#7aa0b8",
  },
  "cat-tools": {
    bg: "#e6e0d8",
    ink: "#3d3428",
    accent: "#c4782a",
    mid: "#a89070",
  },
  "cat-insulation": {
    bg: "#e4ebe4",
    ink: "#2f4634",
    accent: "#5a8a64",
    mid: "#8ab090",
  },
  "cat-safety": {
    bg: "#ece6d4",
    ink: "#4a3d18",
    accent: "#d4a017",
    mid: "#c4b060",
  },
};

const FALLBACK = {
  bg: "#e8e6e1",
  ink: "#3a4554",
  accent: "#c4782a",
  mid: "#9aa3b0",
};

function Pattern({
  categoryId,
  className = "",
}: {
  categoryId: string;
  className?: string;
}) {
  const c = PALETTE[categoryId] ?? FALLBACK;
  const id = categoryId.replace(/[^a-z0-9]/gi, "");

  switch (categoryId) {
    case "cat-lumber":
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <g stroke={c.mid} strokeWidth="3" fill="none">
            <rect x="18" y="28" width="124" height="14" rx="2" fill={c.accent} opacity="0.35" />
            <rect x="18" y="52" width="124" height="14" rx="2" fill={c.ink} opacity="0.12" />
            <rect x="18" y="76" width="124" height="14" rx="2" fill={c.accent} opacity="0.25" />
          </g>
          <path d="M28 35h104M28 59h104M28 83h104" stroke={c.ink} strokeWidth="1" opacity="0.25" />
        </svg>
      );
    case "cat-fasteners":
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <circle cx="48" cy="42" r="14" fill="none" stroke={c.ink} strokeWidth="4" />
          <circle cx="48" cy="42" r="5" fill={c.accent} />
          <rect x="72" y="36" width="60" height="12" rx="2" fill={c.ink} opacity="0.55" />
          <circle cx="48" cy="82" r="14" fill="none" stroke={c.ink} strokeWidth="4" />
          <circle cx="48" cy="82" r="5" fill={c.mid} />
          <rect x="72" y="76" width="48" height="12" rx="2" fill={c.ink} opacity="0.4" />
        </svg>
      );
    case "cat-concrete":
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <g fill={c.ink} opacity="0.18">
            <rect x="20" y="24" width="36" height="28" rx="2" />
            <rect x="62" y="24" width="36" height="28" rx="2" />
            <rect x="104" y="24" width="36" height="28" rx="2" />
            <rect x="20" y="60" width="36" height="28" rx="2" />
            <rect x="62" y="60" width="36" height="28" rx="2" />
            <rect x="104" y="60" width="36" height="28" rx="2" />
          </g>
          <g fill={c.accent} opacity="0.45">
            <rect x="24" y="28" width="28" height="8" />
            <rect x="66" y="64" width="28" height="8" />
            <rect x="108" y="28" width="28" height="8" />
          </g>
        </svg>
      );
    case "cat-electrical":
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <path
            d="M78 22 L58 62 H78 L68 98 L108 52 H84 Z"
            fill={c.accent}
            stroke={c.ink}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="36" cy="88" r="6" fill={c.ink} opacity="0.35" />
          <circle cx="124" cy="32" r="4" fill={c.ink} opacity="0.25" />
        </svg>
      );
    case "cat-plumbing":
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <path
            d="M36 70 H70 V40 H100 V70 H124"
            fill="none"
            stroke={c.ink}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
          <path
            d="M36 70 H70 V40 H100 V70 H124"
            fill="none"
            stroke={c.accent}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="36" cy="70" r="8" fill={c.mid} />
          <circle cx="124" cy="70" r="8" fill={c.mid} />
        </svg>
      );
    case "cat-tools":
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <g transform="translate(40 28) rotate(25)">
            <rect x="0" y="8" width="70" height="14" rx="3" fill={c.ink} opacity="0.5" />
            <rect x="58" y="0" width="36" height="30" rx="4" fill={c.accent} />
          </g>
          <g transform="translate(55 55) rotate(-20)">
            <rect x="0" y="10" width="55" height="10" rx="2" fill={c.mid} />
            <polygon points="55,0 80,15 55,30" fill={c.ink} opacity="0.55" />
          </g>
        </svg>
      );
    case "cat-insulation":
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <defs>
            <pattern id={`insul-${id}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M0 8 Q4 0 8 8 T16 8" fill="none" stroke={c.accent} strokeWidth="2" opacity="0.6" />
            </pattern>
          </defs>
          <rect x="24" y="28" width="112" height="64" rx="4" fill={`url(#insul-${id})`} stroke={c.ink} strokeWidth="2" opacity="0.9" />
        </svg>
      );
    case "cat-safety":
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <path
            d="M80 22 L118 40 V68 C118 88 100 100 80 106 C60 100 42 88 42 68 V40 Z"
            fill={c.accent}
            opacity="0.85"
            stroke={c.ink}
            strokeWidth="2"
          />
          <path d="M80 42 V72 M66 58 H94" stroke={c.ink} strokeWidth="5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 160 120" className={className} aria-hidden>
          <rect width="160" height="120" fill={c.bg} />
          <rect x="40" y="36" width="80" height="48" rx="6" fill={c.mid} opacity="0.4" />
          <circle cx="80" cy="60" r="12" fill={c.accent} opacity="0.7" />
        </svg>
      );
  }
}

export function CategoryVisual({
  categoryId,
  className = "",
  label,
}: {
  categoryId: string;
  className?: string;
  label?: string;
}) {
  const c = PALETTE[categoryId] ?? FALLBACK;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: c.bg }}
      role="img"
      aria-label={label}
    >
      <Pattern categoryId={categoryId} className="h-full w-full object-cover" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 11px, #000 11px, #000 12px)",
        }}
      />
    </div>
  );
}

export function categoryAccent(categoryId: string) {
  return (PALETTE[categoryId] ?? FALLBACK).accent;
}
