"use client";

type Primitive = "linear" | "segmented";

export function PrimitiveCard({
  kind,
  active,
  onClick,
}: {
  kind: Primitive;
  active: boolean;
  onClick: () => void;
}) {
  const meta = META[kind];
  return (
    <button
      type="button"
      onClick={onClick}
      className="pl-card"
      style={{
        padding: 14,
        textAlign: "left",
        cursor: "pointer",
        border: "1px solid " + (active ? "var(--primary)" : "var(--line)"),
        boxShadow: active ? "0 0 0 3px var(--primary-soft)" : undefined,
        background: active ? "var(--primary-soft)" : "var(--surface)",
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: 12,
        alignItems: "center",
      }}
    >
      <span
        style={{
          width: 56,
          height: 56,
          background: "var(--surface)",
          borderRadius: 6,
          display: "grid",
          placeItems: "center",
          border: "1px solid var(--line)",
        }}
      >
        {meta.glyph}
      </span>
      <span>
        <span style={{ display: "block", fontSize: 14, fontWeight: 600 }}>{meta.label}</span>
        <span
          style={{
            display: "block",
            fontSize: 11.5,
            color: "var(--ink-4)",
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          {meta.desc}
        </span>
      </span>
    </button>
  );
}

const STROKE = "#1E40AF";

const META: Record<Primitive, { label: string; desc: string; glyph: React.ReactNode }> = {
  linear: {
    label: "Linear length",
    desc: "Single straight run. Inputs: total length. Derives: intermediate-node count.",
    glyph: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <line x1="6" y1="22" x2="38" y2="22" stroke={STROKE} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="6" cy="22" r="2.4" fill={STROKE} />
        <circle cx="38" cy="22" r="2.4" fill={STROKE} />
        {[14, 22, 30].map((x) => (
          <circle key={x} cx={x} cy="22" r="1.4" fill={STROKE} />
        ))}
      </svg>
    ),
  },
  segmented: {
    label: "Segmented length",
    desc: "Multiple legs joined at corners. Inputs: per-leg length + corner angle. Derives: corner count + corner brackets.",
    glyph: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <polyline
          points="6,32 18,12 30,30 38,12"
          stroke={STROKE}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="6" cy="32" r="2.4" fill={STROKE} />
        <circle cx="18" cy="12" r="2.4" fill={STROKE} />
        <circle cx="30" cy="30" r="2.4" fill={STROKE} />
        <circle cx="38" cy="12" r="2.4" fill={STROKE} />
      </svg>
    ),
  },
};
