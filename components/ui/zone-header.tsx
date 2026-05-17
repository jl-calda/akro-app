import React from "react";

/**
 * Numbered zone header used by the Model + System catalog workbenches.
 * Pattern lifted from the design's model-edit.jsx zone strip.
 */
export function ZoneHeader({
  idx,
  title,
  sub,
  actions,
}: {
  idx: string;
  title: string;
  sub?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 10 }}>
      <span
        className="mono"
        style={{ fontSize: 11, color: "var(--ink-5)", fontWeight: 600, letterSpacing: "0.04em" }}
      >
        {idx}
      </span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{sub}</div>}
      </div>
      {actions && <div style={{ marginLeft: "auto" }}>{actions}</div>}
    </div>
  );
}

/**
 * Zone strip nav rendered under the sticky header in workbenches.
 * Each cell shows the zone index, title, and a sub-line (e.g. row count).
 */
export function ZoneStrip({
  zones,
}: {
  zones: { title: string; sub: string }[];
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 24px 10px",
        fontSize: 11.5,
      }}
    >
      {zones.map((z, i) => (
        <div key={z.title} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="mono" style={{ color: "var(--ink-5)" }}>
            0{i + 1}
          </span>
          <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>{z.title}</span>
          <span style={{ color: "var(--ink-5)" }}>· {z.sub}</span>
        </div>
      ))}
    </div>
  );
}
