"use client";

type Piece = { x: number; y: number; w: number; h: number; rotated: boolean };

export function PlateSheet({
  idx,
  pieces,
  sheetW,
  sheetH,
  utilizationPct,
}: {
  idx: number;
  pieces: Piece[];
  sheetW: number;
  sheetH: number;
  utilizationPct: number;
}) {
  const scaleX = (n: number) => (n / sheetW) * 100;
  const scaleY = (n: number) => (n / sheetH) * 100;
  const PALETTE = ["#1E40AF", "#0F766E", "#A16B3B", "#6B5BB3", "#B91C1C"];

  return (
    <div className="pl-card" style={{ padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span
          className="mono"
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
            display: "grid",
            placeItems: "center",
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {idx}
        </span>
        <span style={{ fontSize: 12, fontWeight: 500 }}>Sheet {idx}</span>
        <span className="mono tnum" style={{ fontSize: 11, color: "var(--ink-4)" }}>
          {sheetW}×{sheetH}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-4)" }}>
          util <span className="mono tnum" style={{ fontWeight: 600, color: utilizationPct > 75 ? "var(--success)" : utilizationPct > 50 ? "var(--ink)" : "var(--hivis-ink)" }}>
            {utilizationPct.toFixed(0)}%
          </span>
        </span>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: `${(sheetH / sheetW) * 100}%`,
          background: "var(--surface-2)",
          border: "1px solid var(--line-2)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {pieces.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${scaleX(p.x)}%`,
              top: `${scaleY(p.y)}%`,
              width: `${scaleX(p.w)}%`,
              height: `${scaleY(p.h)}%`,
              background: PALETTE[i % PALETTE.length] + "DD",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              display: "grid",
              placeItems: "center",
              fontSize: 9,
              fontWeight: 600,
            }}
            className="mono"
          >
            {p.w}×{p.h}
            {p.rotated && <span style={{ fontSize: 7, opacity: 0.7 }}>R</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
