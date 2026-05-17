"use client";

import { Btn, Chip } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import type { SegmentedPattern, ModifierSource, Segment } from "@/lib/rules/dim-derive";

export type SegmentedInputs = {
  segments: Segment[];
  spacing?: number;
  start_offset?: number;
  end_offset?: number;
  corner_offset?: number;
};

export function SegmentedDimensionInput({
  pattern,
  values,
  onChange,
}: {
  pattern: SegmentedPattern;
  values: SegmentedInputs;
  onChange: (next: SegmentedInputs) => void;
}) {
  const mods = (pattern.modifiers ?? {}) as Record<string, ModifierSource | undefined>;
  const userInputMods = (["spacing", "start_offset", "end_offset", "corner_offset"] as const).filter(
    (k) => {
      const m = mods[k];
      return m && m.source === "user_input";
    },
  );

  function addSegment() {
    onChange({
      ...values,
      segments: [
        ...values.segments,
        { len: 0, corner_angle: values.segments.length === 0 ? null : 180 },
      ],
    });
  }
  function updateSegment(i: number, patch: Partial<Segment>) {
    onChange({
      ...values,
      segments: values.segments.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    });
  }
  function deleteSegment(i: number) {
    onChange({ ...values, segments: values.segments.filter((_, idx) => idx !== i) });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Segments */}
      <div>
        <div className="pl-label" style={{ marginBottom: 6 }}>
          Segments · enter each leg&apos;s length + the angle at the next corner
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {values.segments.map((seg, i) => {
            const isLast = i === values.segments.length - 1;
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "32px 1fr 1fr 28px",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <Chip style={{ justifyContent: "center" }}>{i + 1}</Chip>
                <span className="pl-input-group" style={{ width: "100%" }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="pl-input num-input"
                    style={{ width: "100%" }}
                    value={seg.len}
                    onChange={(e) => updateSegment(i, { len: Number(e.target.value) })}
                    placeholder="leg length"
                  />
                  <span className="pl-input-suffix">m</span>
                </span>
                {isLast ? (
                  <span style={{ fontSize: 11.5, color: "var(--ink-5)", paddingLeft: 8 }}>
                    end
                  </span>
                ) : (
                  <span className="pl-input-group" style={{ width: "100%" }}>
                    <input
                      type="number"
                      step="0.5"
                      className="pl-input num-input"
                      style={{ width: "100%" }}
                      value={seg.corner_angle ?? 180}
                      onChange={(e) =>
                        updateSegment(i, { corner_angle: Number(e.target.value) })
                      }
                      placeholder="corner angle"
                    />
                    <span className="pl-input-suffix">°</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => deleteSegment(i)}
                  className="pl-btn ghost sm"
                  style={{ padding: 4 }}
                  title="Delete segment"
                >
                  <Icon name="trash" size={11} />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={addSegment}
            className="pl-btn ghost sm"
            style={{ alignSelf: "flex-start", marginTop: 4 }}
          >
            <Icon name="plus" size={11} />
            Add segment
          </button>
        </div>
      </div>

      {/* Per-segment user-input modifiers */}
      {userInputMods.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {userInputMods.map((k) => {
            const m = mods[k]!;
            const def = m.source === "user_input" ? (m.default ?? 0) : 0;
            return (
              <div key={k}>
                <div className="pl-label">{LABEL[k]}</div>
                <span className="pl-input-group" style={{ width: "100%" }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="pl-input num-input"
                    style={{ width: "100%" }}
                    value={values[k] ?? def}
                    onChange={(e) => onChange({ ...values, [k]: Number(e.target.value) })}
                  />
                  <span className="pl-input-suffix">m</span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const LABEL: Record<string, string> = {
  spacing: "Spacing",
  start_offset: "Start offset",
  end_offset: "End offset",
  corner_offset: "Corner offset",
};
