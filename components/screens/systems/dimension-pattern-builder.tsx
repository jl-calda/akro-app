"use client";

import { useEffect, useMemo, useState } from "react";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { PrimitiveCard } from "./primitive-cards";
import { patternToSchema, type DimensionPattern, type ModifierSource } from "@/lib/rules/dim-derive";

type Source = "user_input" | "hardcoded";

type ModifierKey =
  | "spacing"
  | "start_offset"
  | "end_offset"
  | "corner_offset"
  | "brackets_per_corner";

type ModifierMeta = {
  key: ModifierKey;
  label: string;
  description: string;
  derives: string[]; // derived dims it activates
  unit?: string;
  defaultValue?: number;
  appliesTo: ("linear" | "segmented")[];
  hardcodedOnly?: boolean;
};

const MODIFIERS: ModifierMeta[] = [
  {
    key: "spacing",
    label: "Intermediate spacing",
    description: "Distance between intermediate brackets / stanchions / anchors along the run.",
    derives: ["intermediate_count", "total_node_count"],
    unit: "m",
    defaultValue: 2.4,
    appliesTo: ["linear", "segmented"],
  },
  {
    key: "start_offset",
    label: "Start offset",
    description: "Distance from the start of the run to the first intermediate bracket.",
    derives: ["usable_length"],
    unit: "m",
    defaultValue: 0,
    appliesTo: ["linear", "segmented"],
  },
  {
    key: "end_offset",
    label: "End offset",
    description: "Distance from the last intermediate bracket to the end of the run.",
    derives: ["usable_length"],
    unit: "m",
    defaultValue: 0,
    appliesTo: ["linear", "segmented"],
  },
  {
    key: "corner_offset",
    label: "Corner offset",
    description: "Distance from each corner to the nearest intermediate bracket (both sides).",
    derives: ["intermediate_count_per_leg"],
    unit: "m",
    defaultValue: 0.5,
    appliesTo: ["segmented"],
  },
  {
    key: "brackets_per_corner",
    label: "Brackets per corner",
    description: "How many fixed brackets each corner consumes. Typical: 2 (one each side).",
    derives: ["corner_bracket_count"],
    defaultValue: 2,
    appliesTo: ["segmented"],
    hardcodedOnly: true,
  },
];

// We store the pattern internally with a relaxed modifier shape so the
// builder can mutate uniformly. handleSave casts back to the exported type.
type LoosePattern = {
  primitive: "linear" | "segmented";
  modifiers: Record<string, ModifierSource | undefined>;
};

function normalize(pattern: DimensionPattern | null): LoosePattern {
  if (!pattern) return { primitive: "linear", modifiers: {} };
  return {
    primitive: pattern.primitive,
    modifiers: (pattern.modifiers ?? {}) as Record<string, ModifierSource | undefined>,
  };
}

export function DimensionPatternBuilder({
  versionId,
  initial,
  onSave,
}: {
  versionId: string;
  initial: DimensionPattern | null;
  onSave: (pattern: DimensionPattern) => Promise<void> | void;
}) {
  const [pattern, setPattern] = useState<LoosePattern>(normalize(initial));
  const [savedFlash, setSavedFlash] = useState(false);

  const applicableModifiers = useMemo(
    () => MODIFIERS.filter((m) => m.appliesTo.includes(pattern.primitive)),
    [pattern.primitive],
  );

  const mods = (pattern.modifiers ?? {}) as Record<ModifierKey, ModifierSource | undefined>;

  function setPrimitive(p: "linear" | "segmented") {
    setPattern({ primitive: p, modifiers: {} });
  }

  function toggleModifier(key: ModifierKey, meta: ModifierMeta) {
    const current = mods[key];
    const next = { ...mods };
    if (current) {
      delete next[key];
    } else {
      if (meta.hardcodedOnly) {
        next[key] = { source: "hardcoded", value: meta.defaultValue ?? 0 } as ModifierSource;
      } else {
        next[key] = { source: "user_input", default: meta.defaultValue ?? 0 } as ModifierSource;
      }
    }
    setPattern({ ...pattern, modifiers: next });
  }

  function setSource(key: ModifierKey, source: Source) {
    const current = mods[key];
    if (!current) return;
    const next = { ...mods };
    if (source === "user_input") {
      const meta = MODIFIERS.find((m) => m.key === key);
      next[key] = { source: "user_input", default: meta?.defaultValue ?? 0 } as ModifierSource;
    } else {
      const meta = MODIFIERS.find((m) => m.key === key);
      next[key] = { source: "hardcoded", value: meta?.defaultValue ?? 0 } as ModifierSource;
    }
    setPattern({ ...pattern, modifiers: next });
  }

  function setValue(key: ModifierKey, value: number) {
    const current = mods[key];
    if (!current) return;
    const next = { ...mods };
    if (current.source === "user_input") {
      next[key] = { source: "user_input", default: value };
    } else {
      next[key] = { source: "hardcoded", value };
    }
    setPattern({ ...pattern, modifiers: next });
  }

  async function handleSave() {
    // Cast through unknown — modifiers union has narrower types for brackets_per_corner
    // than ModifierSource. Runtime shape is correct.
    await onSave(pattern as unknown as DimensionPattern);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  const userInputDims = patternToSchema(pattern);
  const derivedDims = collectDerived(pattern);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* PRIMITIVE PICKER */}
      <div>
        <div className="pl-label" style={{ marginBottom: 8 }}>
          Primitive · what shape is this System
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <PrimitiveCard
            kind="linear"
            active={pattern.primitive === "linear"}
            onClick={() => setPrimitive("linear")}
          />
          <PrimitiveCard
            kind="segmented"
            active={pattern.primitive === "segmented"}
            onClick={() => setPrimitive("segmented")}
          />
        </div>
      </div>

      {/* MODIFIERS */}
      <div>
        <div className="pl-label" style={{ marginBottom: 8 }}>
          Modifiers · toggle the engineering options that apply
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {applicableModifiers.map((m) => {
            const enabled = !!mods[m.key];
            const current = mods[m.key];
            return (
              <div
                key={m.key}
                className="pl-card"
                style={{
                  padding: 12,
                  border: "1px solid " + (enabled ? "var(--primary-line)" : "var(--line)"),
                  background: enabled ? "var(--primary-soft)" : "var(--surface)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => toggleModifier(m.key, m)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 3,
                      border: "1px solid " + (enabled ? "var(--primary)" : "var(--line-strong)"),
                      background: enabled ? "var(--primary)" : "var(--surface)",
                      display: "grid",
                      placeItems: "center",
                      flex: "0 0 18px",
                      marginTop: 2,
                      cursor: "pointer",
                    }}
                    aria-label={`Toggle ${m.label}`}
                  >
                    {enabled && <Icon name="check" size={11} style={{ color: "#fff" }} />}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{m.label}</span>
                      {m.derives.map((d) => (
                        <Pill key={d} variant="info">
                          → {d}
                        </Pill>
                      ))}
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 2, lineHeight: 1.4 }}>
                      {m.description}
                    </div>

                    {enabled && current && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginTop: 10,
                          padding: 8,
                          background: "var(--surface)",
                          borderRadius: 4,
                          border: "1px solid var(--line)",
                        }}
                      >
                        {!m.hardcodedOnly && (
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              type="button"
                              className={"pl-btn sm" + (current.source === "user_input" ? " primary" : "")}
                              onClick={() => setSource(m.key, "user_input")}
                            >
                              User-input
                            </button>
                            <button
                              type="button"
                              className={"pl-btn sm" + (current.source === "hardcoded" ? " primary" : "")}
                              onClick={() => setSource(m.key, "hardcoded")}
                            >
                              Hardcoded
                            </button>
                          </div>
                        )}
                        <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
                          {current.source === "user_input" ? "Default value" : "Value"}
                        </span>
                        <span className="pl-input-group" style={{ width: 110 }}>
                          <input
                            type="number"
                            step="0.1"
                            className="pl-input num-input"
                            style={{ width: "100%", height: 26 }}
                            value={
                              current.source === "user_input"
                                ? (current.default ?? 0)
                                : (current.value ?? 0)
                            }
                            onChange={(e) => setValue(m.key, Number(e.target.value))}
                          />
                          {m.unit && <span className="pl-input-suffix">{m.unit}</span>}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="pl-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="pl-card-head">
          <Icon name="list" />
          <span className="pl-card-title">Dimension contract preview</span>
          {savedFlash && <Pill variant="approved" dot>saved</Pill>}
          <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <Btn variant="primary" ico="check" size="sm" onClick={handleSave}>
              Save pattern
            </Btn>
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--line)" }}>
          <div style={{ background: "var(--surface)", padding: 14 }}>
            <div className="pl-label" style={{ marginBottom: 6 }}>User inputs (PM sees these)</div>
            {userInputDims.length === 0 ? (
              <div style={{ fontSize: 11.5, color: "var(--ink-5)" }}>None.</div>
            ) : (
              userInputDims.map((d) => (
                <div
                  key={d.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 0",
                    fontSize: 12,
                  }}
                >
                  <span className="mono" style={{ color: "var(--primary)", flex: "0 0 160px" }}>
                    {d.key}
                  </span>
                  <span style={{ flex: 1 }}>{d.label}</span>
                  {d.unit && <Chip>{d.unit}</Chip>}
                  {d.required && <Pill variant="modified">required</Pill>}
                </div>
              ))
            )}
          </div>
          <div style={{ background: "var(--surface)", padding: 14 }}>
            <div className="pl-label" style={{ marginBottom: 6 }}>Derived (Models reference these)</div>
            {derivedDims.length === 0 ? (
              <div style={{ fontSize: 11.5, color: "var(--ink-5)" }}>
                Toggle a modifier to activate derived dims.
              </div>
            ) : (
              derivedDims.map((d) => (
                <div
                  key={d.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 0",
                    fontSize: 12,
                  }}
                  title={d.formula}
                >
                  <span
                    className="mono"
                    style={{ color: "var(--success)", flex: "0 0 200px" }}
                  >
                    {d.key}
                  </span>
                  <span style={{ flex: 1, color: "var(--ink-4)", fontSize: 11.5 }}>{d.formula}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function collectDerived(pattern: DimensionPattern): { key: string; formula: string }[] {
  const mods = (pattern.modifiers ?? {}) as Record<string, unknown>;
  const has = (k: string) => Boolean(mods[k]);

  const out: { key: string; formula: string }[] = [];

  if (pattern.primitive === "linear") {
    if (has("start_offset") || has("end_offset")) {
      out.push({ key: "usable_length", formula: "length − start_offset − end_offset" });
    }
    if (has("spacing")) {
      out.push({ key: "intermediate_count", formula: "floor(usable_length / spacing)" });
      out.push({ key: "total_node_count", formula: "intermediate_count + 2" });
    }
  } else if (pattern.primitive === "segmented") {
    out.push({ key: "total_length", formula: "sum(segments[].len)" });
    out.push({ key: "corner_count", formula: "count(segments where corner_angle ≠ null)" });
    if (has("brackets_per_corner")) {
      out.push({ key: "corner_bracket_count", formula: "corner_count × brackets_per_corner" });
    }
    if (has("spacing")) {
      out.push({
        key: "intermediate_count_per_leg",
        formula: "[ floor(usable_len[i] / spacing) ]",
      });
      out.push({
        key: "intermediate_count_total",
        formula: "sum(intermediate_count_per_leg)",
      });
      out.push({
        key: "total_node_count",
        formula: "intermediate_count_total + corner_bracket_count + 2",
      });
    }
  }
  return out;
}
