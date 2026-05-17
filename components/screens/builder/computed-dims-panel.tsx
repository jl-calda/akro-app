"use client";

import { Pill } from "@/components/ui/primitives";

const PRIMITIVE_KEYS = new Set([
  "length",
  "spacing",
  "start_offset",
  "end_offset",
  "corner_offset",
  "segments",
]);

export function ComputedDimsPanel({ derived }: { derived: Record<string, unknown> }) {
  const entries = Object.entries(derived).filter(([key]) => !PRIMITIVE_KEYS.has(key));

  return (
    <div className="pl-card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="pl-card-head">
        <span className="pl-card-title">Computed dimensions</span>
        <Pill variant="info">live</Pill>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-4)" }}>
          {entries.length} derived
        </span>
      </div>
      <div style={{ padding: "8px 14px 12px" }}>
        {entries.length === 0 ? (
          <div style={{ fontSize: 11.5, color: "var(--ink-5)", padding: "12px 0" }}>
            No derived dims yet — fill in inputs above.
          </div>
        ) : (
          entries.map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 0",
                borderBottom: "1px solid var(--line)",
                fontSize: 12,
              }}
            >
              <span className="mono" style={{ color: "var(--success)", flex: 1 }}>
                {k}
              </span>
              <span className="mono tnum" style={{ fontWeight: 600 }}>
                {fmt(v)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function fmt(v: unknown): string {
  if (Array.isArray(v)) {
    if (v.every((n) => typeof n === "number")) return `[${v.join(", ")}]`;
    return `[${v.length}]`;
  }
  if (typeof v === "number") {
    return Number.isInteger(v) ? String(v) : v.toFixed(2);
  }
  return String(v);
}
