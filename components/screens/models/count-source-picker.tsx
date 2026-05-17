"use client";

import { Pill } from "@/components/ui/primitives";
import type { DimensionPattern } from "@/lib/rules/dim-derive";

export type PickedCount =
  | { source: "(constant)"; multiplier: number }
  | { source: string; multiplier: number };

export function CountSourcePicker({
  pattern,
  siblingAliases,
  value,
  onChange,
}: {
  pattern: DimensionPattern | null;
  siblingAliases: string[];
  value: PickedCount;
  onChange: (v: PickedCount) => void;
}) {
  const sources = collectSources(pattern, siblingAliases);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div>
        <div className="pl-label">Count source</div>
        <select
          className="pl-input"
          style={{ width: "100%" }}
          value={value.source}
          onChange={(e) => onChange({ ...value, source: e.target.value })}
        >
          {sources.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.items.map((it) => (
                <option key={it.value} value={it.value}>
                  {it.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div>
        <div className="pl-label">× Multiplier</div>
        <span className="pl-input-group" style={{ width: 140 }}>
          <input
            type="number"
            step="0.1"
            className="pl-input num-input"
            style={{ width: "100%" }}
            value={value.multiplier}
            onChange={(e) => onChange({ ...value, multiplier: Number(e.target.value) })}
          />
        </span>
      </div>
      <div
        style={{
          padding: "8px 10px",
          background: "var(--surface-2)",
          borderRadius: 4,
          fontSize: 11.5,
          color: "var(--ink-3)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Pill variant="info">qty =</Pill>
        <span className="mono" style={{ fontWeight: 600 }}>
          {pickedCountToFormula(value)}
        </span>
      </div>
    </div>
  );
}

export function pickedCountToFormula(pc: PickedCount): string {
  if (pc.source === "(constant)") return String(pc.multiplier);
  if (pc.multiplier === 1) return pc.source;
  return `${pc.source} * ${pc.multiplier}`;
}

function collectSources(
  pattern: DimensionPattern | null,
  siblings: string[],
): { label: string; items: { value: string; label: string }[] }[] {
  const groups: { label: string; items: { value: string; label: string }[] }[] = [];

  groups.push({
    label: "Constant",
    items: [{ value: "(constant)", label: "(constant) · use multiplier as a literal number" }],
  });

  if (pattern?.primitive === "linear") {
    const items: { value: string; label: string }[] = [
      { value: "length", label: "length · primitive" },
      { value: "usable_length", label: "usable_length · derived" },
    ];
    if (pattern.modifiers?.spacing) {
      items.push({ value: "intermediate_count", label: "intermediate_count · derived" });
      items.push({ value: "total_node_count", label: "total_node_count · derived" });
    }
    groups.push({ label: "System dimensions", items });
  } else if (pattern?.primitive === "segmented") {
    const items: { value: string; label: string }[] = [
      { value: "total_length", label: "total_length · derived" },
      { value: "length", label: "length · alias of total_length" },
      { value: "corner_count", label: "corner_count · derived" },
    ];
    if (pattern.modifiers?.brackets_per_corner) {
      items.push({ value: "corner_bracket_count", label: "corner_bracket_count · derived" });
    }
    if (pattern.modifiers?.spacing) {
      items.push({ value: "intermediate_count_total", label: "intermediate_count_total · derived" });
      items.push({ value: "intermediate_count", label: "intermediate_count · alias" });
      items.push({ value: "total_node_count", label: "total_node_count · derived" });
    }
    groups.push({ label: "System dimensions", items });
  } else {
    groups.push({
      label: "System dimensions",
      items: [{ value: "length", label: "length · raw" }],
    });
  }

  if (siblings.length > 0) {
    groups.push({
      label: "Other rows in this Model",
      items: siblings.map((alias) => ({
        value: `${alias}.qty`,
        label: `${alias}.qty · references the ${alias} row`,
      })),
    });
  }

  return groups;
}

/**
 * Best-effort parse of an existing formula string back into a PickedCount.
 * Returns null if the formula doesn't match a simple "source * multiplier" or
 * "source" or numeric-literal shape.
 */
export function parseFormulaToPicked(formula: string | undefined | null): PickedCount | null {
  if (!formula) return null;
  const s = formula.trim();
  if (s === "") return null;

  // numeric literal
  const asNum = Number(s);
  if (!Number.isNaN(asNum) && /^[-+]?\d+(\.\d+)?$/.test(s)) {
    return { source: "(constant)", multiplier: asNum };
  }

  // identifier (possibly dotted) optionally followed by " * <number>"
  const single = /^([a-zA-Z_][a-zA-Z_0-9]*(?:\.[a-zA-Z_][a-zA-Z_0-9]*)?)$/.exec(s);
  if (single) return { source: single[1], multiplier: 1 };

  const multipart = /^([a-zA-Z_][a-zA-Z_0-9]*(?:\.[a-zA-Z_][a-zA-Z_0-9]*)?)\s*\*\s*([-+]?\d+(?:\.\d+)?)$/.exec(s);
  if (multipart) return { source: multipart[1], multiplier: Number(multipart[2]) };

  const flipped = /^([-+]?\d+(?:\.\d+)?)\s*\*\s*([a-zA-Z_][a-zA-Z_0-9]*(?:\.[a-zA-Z_][a-zA-Z_0-9]*)?)$/.exec(s);
  if (flipped) return { source: flipped[2], multiplier: Number(flipped[1]) };

  return null;
}
