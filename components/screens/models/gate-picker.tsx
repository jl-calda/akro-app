"use client";

import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export type GateCondition =
  | { kind: "substrate"; substrate: string }
  | { kind: "variant"; key: string; value: string }
  | { kind: "always" };

export function GatePicker({
  conditions,
  onChange,
  substrates,
  variants,
}: {
  conditions: GateCondition[];
  onChange: (next: GateCondition[]) => void;
  substrates: string[];
  variants: { key: string; options: string[] }[];
}) {
  function addCondition(kind: GateCondition["kind"]) {
    if (kind === "substrate") {
      onChange([...conditions, { kind: "substrate", substrate: substrates[0] ?? "" }]);
    } else if (kind === "variant") {
      const first = variants[0];
      onChange([
        ...conditions,
        { kind: "variant", key: first?.key ?? "", value: first?.options[0] ?? "" },
      ]);
    } else {
      onChange([{ kind: "always" }]);
    }
  }

  function updateCondition(i: number, patch: Partial<GateCondition>) {
    onChange(conditions.map((c, idx) => (idx === i ? ({ ...c, ...patch } as GateCondition) : c)));
  }

  function deleteCondition(i: number) {
    onChange(conditions.filter((_, idx) => idx !== i));
  }

  if (conditions.length === 0) {
    return (
      <div
        style={{
          padding: 10,
          background: "var(--surface-2)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          fontSize: 12,
          color: "var(--ink-4)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Pill variant="approved" dot>
          always
        </Pill>
        <span>This row is included regardless of project conditions.</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button type="button" onClick={() => addCondition("substrate")} className="pl-btn sm">
            <Icon name="plus" size={11} />
            When substrate…
          </button>
          {variants.length > 0 && (
            <button type="button" onClick={() => addCondition("variant")} className="pl-btn sm">
              <Icon name="plus" size={11} />
              When variant…
            </button>
          )}
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {conditions.map((c, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 8,
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 4,
          }}
        >
          {i === 0 ? <Pill variant="info">when</Pill> : <Pill>and</Pill>}
          {c.kind === "substrate" && (
            <>
              <span className="mono" style={{ color: "var(--primary)", fontSize: 12 }}>
                substrate
              </span>
              <span style={{ color: "var(--ink-4)" }}>=</span>
              <select
                className="pl-input"
                style={{ height: 26, fontSize: 12 }}
                value={c.substrate}
                onChange={(e) => updateCondition(i, { substrate: e.target.value })}
              >
                {substrates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </>
          )}
          {c.kind === "variant" && (
            <>
              <span className="mono" style={{ color: "var(--primary)", fontSize: 12 }}>
                variant.
                <select
                  style={{ font: "inherit", color: "inherit" }}
                  value={c.key}
                  onChange={(e) => {
                    const v = variants.find((x) => x.key === e.target.value);
                    updateCondition(i, { key: e.target.value, value: v?.options[0] ?? "" });
                  }}
                >
                  {variants.map((v) => (
                    <option key={v.key} value={v.key}>
                      {v.key}
                    </option>
                  ))}
                </select>
              </span>
              <span style={{ color: "var(--ink-4)" }}>=</span>
              <select
                className="pl-input"
                style={{ height: 26, fontSize: 12 }}
                value={c.value}
                onChange={(e) => updateCondition(i, { value: e.target.value })}
              >
                {(variants.find((v) => v.key === c.key)?.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </>
          )}
          <button
            type="button"
            onClick={() => deleteCondition(i)}
            className="pl-btn ghost sm"
            style={{ padding: 4, marginLeft: "auto" }}
            title="Delete condition"
          >
            <Icon name="trash" size={11} />
          </button>
        </div>
      ))}
      <div style={{ display: "flex", gap: 4 }}>
        <button type="button" onClick={() => addCondition("substrate")} className="pl-btn ghost sm">
          <Icon name="plus" size={11} />
          And substrate…
        </button>
        {variants.length > 0 && (
          <button type="button" onClick={() => addCondition("variant")} className="pl-btn ghost sm">
            <Icon name="plus" size={11} />
            And variant…
          </button>
        )}
      </div>
    </div>
  );
}

/** Generate the formula-string from a set of structured gate conditions. */
export function gateConditionsToFormula(conditions: GateCondition[]): string | null {
  if (conditions.length === 0) return null;
  const parts: string[] = [];
  for (const c of conditions) {
    if (c.kind === "substrate") parts.push(`substrate == '${escape(c.substrate)}'`);
    else if (c.kind === "variant") parts.push(`variant.${c.key} == '${escape(c.value)}'`);
    else if (c.kind === "always") return null;
  }
  return parts.join(" && ");
}

function escape(s: string): string {
  return s.replace(/'/g, "\\'");
}

/** Best-effort parse of a gate formula back into structured conditions. */
export function parseGateFormula(formula: string | null | undefined): GateCondition[] {
  if (!formula) return [];
  const out: GateCondition[] = [];
  for (const seg of formula.split(/\s*&&\s*/)) {
    const sub = /^substrate\s*==\s*'([^']+)'$/.exec(seg.trim());
    if (sub) {
      out.push({ kind: "substrate", substrate: sub[1] });
      continue;
    }
    const v = /^variant\.([a-zA-Z_][a-zA-Z_0-9]*)\s*==\s*'([^']+)'$/.exec(seg.trim());
    if (v) {
      out.push({ kind: "variant", key: v[1], value: v[2] });
      continue;
    }
    // Unparseable — treat as opaque "always" so we don't lose the original meaning;
    // the raw-formula fallback will still surface this.
  }
  return out;
}
