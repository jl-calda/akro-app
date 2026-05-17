"use client";

import type { LinearPattern, ModifierSource } from "@/lib/rules/dim-derive";

export type LinearInputs = {
  length: number;
  spacing?: number;
  start_offset?: number;
  end_offset?: number;
};

export function LinearDimensionInput({
  pattern,
  values,
  onChange,
}: {
  pattern: LinearPattern;
  values: LinearInputs;
  onChange: (next: LinearInputs) => void;
}) {
  const mods = (pattern.modifiers ?? {}) as Record<string, ModifierSource | undefined>;
  const userInputMods = (["spacing", "start_offset", "end_offset"] as const).filter((k) => {
    const m = mods[k];
    return m && m.source === "user_input";
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, alignItems: "end" }}>
      <NumField
        label="Total length"
        value={values.length}
        unit="m"
        onChange={(v) => onChange({ ...values, length: v })}
      />
      {userInputMods.map((k) => {
        const m = mods[k]!;
        const def = m.source === "user_input" ? (m.default ?? 0) : 0;
        return (
          <NumField
            key={k}
            label={LABEL[k]}
            value={values[k] ?? def}
            unit="m"
            onChange={(v) => onChange({ ...values, [k]: v })}
          />
        );
      })}
    </div>
  );
}

const LABEL: Record<string, string> = {
  spacing: "Spacing",
  start_offset: "Start offset",
  end_offset: "End offset",
};

function NumField({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="pl-label">{label}</div>
      <span className="pl-input-group" style={{ width: "100%" }}>
        <input
          type="number"
          step="0.1"
          min="0"
          className="pl-input num-input"
          style={{ width: "100%" }}
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        {unit && <span className="pl-input-suffix">{unit}</span>}
      </span>
    </div>
  );
}
