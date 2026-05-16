"use client";

export function LinearStock({
  idx,
  stockLength,
  cuts,
  offcut,
  kerfMm = 3,
  reusable,
}: {
  idx: number;
  stockLength: number;
  cuts: number[];
  offcut: number;
  kerfMm?: number;
  reusable?: boolean;
}) {
  const totalUnits = stockLength;
  const widthPct = (n: number) => (n / totalUnits) * 100;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <span
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
          className="mono"
        >
          {idx}
        </span>
        <span className="mono tnum" style={{ fontSize: 12, fontWeight: 500 }}>
          {stockLength} m
        </span>
        <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
          · {cuts.length} cut{cuts.length === 1 ? "" : "s"}
        </span>
        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-5)" }}>
          offcut <span className="mono tnum" style={{ color: reusable ? "var(--success)" : "var(--ink-3)" }}>
            {offcut.toFixed(2)} m
          </span>{" "}
          {reusable && (
            <span
              style={{
                marginLeft: 4,
                color: "var(--success)",
                fontSize: 10.5,
                fontWeight: 500,
              }}
            >
              · reusable
            </span>
          )}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          height: 32,
          border: "1px solid var(--line)",
          borderRadius: 4,
          overflow: "hidden",
          background: "var(--surface)",
        }}
      >
        {cuts.map((cut, i) => (
          <div key={i} style={{ display: "flex", height: "100%" }}>
            <div
              style={{
                width: `${widthPct(cut)}%`,
                background: "#1E40AF",
                color: "#fff",
                fontSize: 10.5,
                fontWeight: 600,
                display: "grid",
                placeItems: "center",
                position: "relative",
                minWidth: 40,
              }}
              className="mono"
            >
              {cut.toFixed(2)} m
            </div>
            {i < cuts.length - 1 && (
              <div
                style={{
                  width: `${widthPct(kerfMm / 1000)}%`,
                  minWidth: 1,
                  background: "#475569",
                }}
              />
            )}
          </div>
        ))}
        {offcut > 0 && (
          <div
            style={{
              width: `${widthPct(offcut)}%`,
              background: reusable
                ? "#0F766E"
                : "repeating-linear-gradient(45deg, #FACC15 0 6px, transparent 6px 8px), #FEF6C7",
              color: reusable ? "#fff" : "#713F12",
              fontSize: 10.5,
              fontWeight: 600,
              display: "grid",
              placeItems: "center",
              minWidth: 24,
            }}
            className="mono"
          >
            {offcut.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
