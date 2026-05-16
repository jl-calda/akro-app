"use client";

import { Chip, Pill, ProgressBar } from "@/components/ui/primitives";

export function MaterialCard({
  emoji,
  code,
  name,
  stockLabel,
  mtoQty,
  issuedQty,
  unit,
  done,
  low,
  onClick,
}: {
  emoji: string | null;
  code: string;
  name: string;
  stockLabel: string;
  mtoQty: number;
  issuedQty: number;
  unit: string;
  done?: boolean;
  low?: boolean;
  onClick?: () => void;
}) {
  const progress = mtoQty > 0 ? (issuedQty / mtoQty) * 100 : 0;
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        padding: 12,
        background: "var(--surface)",
        border: "1px solid " + (low ? "var(--hivis-line)" : "var(--line)"),
        borderRadius: 10,
        marginBottom: 8,
        position: "relative",
        cursor: "pointer",
      }}
    >
      {low && (
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: 3,
            background: "var(--hivis)",
            borderRadius: "10px 0 0 10px",
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="pl-thumb" style={{ width: 34, height: 34, fontSize: 18 }}>
          {emoji ?? "📦"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Chip>{code}</Chip>
            {done && <Pill variant="approved" dot>done</Pill>}
            {low && !done && <Pill variant="modified">low</Pill>}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>
            <span className="mono tnum">{stockLabel}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="mono tnum" style={{ fontSize: 12, fontWeight: 600 }}>
            {issuedQty} / {mtoQty}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--ink-5)" }} className="mono">
            {unit}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 8 }}>
        <ProgressBar
          value={issuedQty}
          max={mtoQty}
          tone={progress >= 100 ? "success" : low ? "warn" : ""}
        />
      </div>
    </button>
  );
}
