"use client";

export function QtySpinner({
  value,
  onChange,
  step = 1,
  min = 0,
  max,
  unit,
}: {
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}) {
  function bump(delta: number) {
    let next = value + delta;
    if (min != null) next = Math.max(min, next);
    if (max != null) next = Math.min(max, next);
    onChange(Number(next.toFixed(2)));
  }
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "var(--surface)",
        border: "1px solid var(--line-2)",
        borderRadius: 6,
        padding: 2,
      }}
    >
      <button
        onClick={() => bump(-step)}
        type="button"
        style={{
          width: 36,
          height: 36,
          fontSize: 18,
          fontWeight: 600,
          background: "transparent",
          border: "none",
          color: "var(--ink-2)",
          cursor: "pointer",
        }}
      >
        −
      </button>
      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mono tnum"
        style={{
          width: 80,
          height: 36,
          textAlign: "center",
          fontSize: 16,
          fontWeight: 600,
          border: "none",
          outline: "none",
          background: "transparent",
        }}
      />
      {unit && (
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-4)", paddingRight: 8 }}>
          {unit}
        </span>
      )}
      <button
        onClick={() => bump(step)}
        type="button"
        style={{
          width: 36,
          height: 36,
          fontSize: 18,
          fontWeight: 600,
          background: "transparent",
          border: "none",
          color: "var(--ink-2)",
          cursor: "pointer",
        }}
      >
        +
      </button>
    </div>
  );
}
