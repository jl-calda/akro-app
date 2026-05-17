"use client";

import { useState, useMemo } from "react";
import { Btn, Chip, Pill, NumInput, Select } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { evaluateModelInstance, type PartsListRow } from "@/lib/rules/engine";
import { deriveDimensions, type DimensionPattern } from "@/lib/rules/dim-derive";
import { LinearDimensionInput, type LinearInputs } from "./dimension-input-linear";
import { SegmentedDimensionInput, type SegmentedInputs } from "./dimension-input-segmented";
import { ComputedDimsPanel } from "./computed-dims-panel";

type SystemOption = {
  id: string;
  name: string;
  description: string | null;
  pattern: DimensionPattern | null;
};
type ShapeOption = { id: string; name: string };
type ModelOption = {
  id: string;
  versionId: string;
  name: string;
  code: string | null;
  version: number;
  systemId: string;
  partsList: PartsListRow[];
};
type SubstrateOption = { id: string; name: string };

function BuilderSection({
  num,
  title,
  status = "ok",
  hint,
  children,
}: {
  num: string;
  title: string;
  status?: "ok" | "missing" | "error";
  hint?: string;
  children: React.ReactNode;
}) {
  const statusColor = {
    ok: "var(--success)",
    missing: "var(--hivis-ink)",
    error: "var(--danger)",
  }[status];
  return (
    <div className="pl-card" style={{ marginBottom: 14 }}>
      <div className="pl-card-head" style={{ alignItems: "center" }}>
        <span className="mono" style={{ fontSize: 11, color: "var(--ink-5)", fontWeight: 600, letterSpacing: "0.04em" }}>{num}</span>
        <span className="pl-card-title">{title}</span>
        {hint && <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>· {hint}</span>}
        <span
          style={{
            marginLeft: "auto",
            width: 8,
            height: 8,
            borderRadius: 4,
            background: statusColor,
          }}
        />
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

export function InstanceBuilder({
  projectId,
  systems,
  shapes,
  models,
  substrates,
  systemVersionMap,
}: {
  projectId: string;
  systems: SystemOption[];
  shapes: ShapeOption[];
  models: ModelOption[];
  substrates: SubstrateOption[];
  systemVersionMap: Record<string, string>; // systemId → systemVersionId
}) {
  const [systemId, setSystemId] = useState<string>(systems[0]?.id ?? "");
  const [shapeId, setShapeId] = useState<string>("");
  const [substrateId, setSubstrateId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [linearInputs, setLinearInputs] = useState<LinearInputs>({ length: 24 });
  const [segmentedInputs, setSegmentedInputs] = useState<SegmentedInputs>({
    segments: [{ len: 24, corner_angle: null }],
  });
  const [variantSelections, setVariantSelections] = useState<string>("{}");

  const availableModels = useMemo(() => models.filter((m) => m.systemId === systemId), [models, systemId]);
  const selectedModel = availableModels.find((m) => m.id === modelId);
  const selectedSystem = systems.find((s) => s.id === systemId);
  const selectedSubstrate = substrates.find((s) => s.id === substrateId);

  const pattern = selectedSystem?.pattern ?? null;
  const primitive = pattern?.primitive ?? "linear";

  // Build the system_dimensions payload for the rule engine from the active inputs.
  const systemDimensions = useMemo(() => {
    if (primitive === "segmented") {
      return {
        segments: segmentedInputs.segments,
        spacing: segmentedInputs.spacing,
        start_offset: segmentedInputs.start_offset,
        end_offset: segmentedInputs.end_offset,
        corner_offset: segmentedInputs.corner_offset,
      };
    }
    return {
      length: linearInputs.length,
      spacing: linearInputs.spacing,
      start_offset: linearInputs.start_offset,
      end_offset: linearInputs.end_offset,
    };
  }, [primitive, linearInputs, segmentedInputs]);

  // Live derived dims for the right Computed panel (separate from the model preview).
  const derivedDims = useMemo(() => {
    if (!pattern) return {};
    try {
      return deriveDimensions(pattern, systemDimensions);
    } catch {
      return {};
    }
  }, [pattern, systemDimensions]);

  const preview = useMemo(() => {
    if (!selectedModel) return null;
    let variants: Record<string, unknown> = {};
    try {
      variants = JSON.parse(variantSelections);
    } catch {
      // ignore
    }
    try {
      return evaluateModelInstance({
        system_dimensions: systemDimensions,
        dimension_pattern: pattern ?? undefined,
        variants,
        substrate: selectedSubstrate?.name,
        parts_list: selectedModel.partsList,
      });
    } catch (err) {
      return { rows: [], totals: { qty_by_alias: {} }, errors: [(err as Error).message] };
    }
  }, [selectedModel, systemDimensions, pattern, variantSelections, selectedSubstrate]);

  const sectionStatus = (filled: boolean): "ok" | "missing" => (filled ? "ok" : "missing");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", alignItems: "flex-start", minHeight: 0, flex: 1 }}>
      <div className="pl-scroll" style={{ padding: "18px 22px", minWidth: 0 }}>
        <BuilderSection num="01" title="System & Shape" status={sectionStatus(Boolean(systemId))}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <div className="pl-label">System</div>
              <select
                className="pl-input"
                style={{ width: "100%" }}
                value={systemId}
                onChange={(e) => setSystemId(e.target.value)}
              >
                <option value="">— pick —</option>
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {selectedSystem?.description && (
                <div style={{ fontSize: 11, color: "var(--ink-5)", marginTop: 4 }}>{selectedSystem.description}</div>
              )}
            </div>
            <div>
              <div className="pl-label">Shape</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {shapes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setShapeId(s.id)}
                    className={"pl-btn sm" + (shapeId === s.id ? " primary" : "")}
                  >
                    {s.name}
                  </button>
                ))}
                {shapes.length === 0 && (
                  <span style={{ fontSize: 11.5, color: "var(--ink-5)" }}>No shapes defined yet.</span>
                )}
              </div>
            </div>
          </div>
        </BuilderSection>

        <BuilderSection
          num="02"
          title={primitive === "segmented" ? "Dimensions · segmented" : "Dimensions · linear"}
          status={sectionStatus(
            primitive === "segmented"
              ? segmentedInputs.segments.length > 0 && segmentedInputs.segments.every((s) => s.len > 0)
              : Boolean(linearInputs.length),
          )}
          hint={pattern ? undefined : "This System has no pattern set — using a single length input."}
        >
          {primitive === "segmented" && pattern?.primitive === "segmented" ? (
            <SegmentedDimensionInput
              pattern={pattern}
              values={segmentedInputs}
              onChange={setSegmentedInputs}
            />
          ) : (
            <LinearDimensionInput
              pattern={pattern?.primitive === "linear" ? pattern : { primitive: "linear", modifiers: {} }}
              values={linearInputs}
              onChange={setLinearInputs}
            />
          )}
        </BuilderSection>

        <BuilderSection num="03" title="Substrate" status={sectionStatus(Boolean(substrateId))}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {substrates.map((s) => (
              <button
                key={s.id}
                onClick={() => setSubstrateId(s.id)}
                className={"pl-btn sm" + (substrateId === s.id ? " primary" : "")}
              >
                {s.name}
              </button>
            ))}
            {substrates.length === 0 && (
              <span style={{ fontSize: 11.5, color: "var(--ink-5)" }}>
                No substrates yet. Add some under Catalog → Substrates.
              </span>
            )}
          </div>
        </BuilderSection>

        <BuilderSection num="04" title="Model" status={sectionStatus(Boolean(modelId))}>
          {availableModels.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--ink-5)" }}>
              No published Models for this System yet. Add one under Catalog → Models.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              {availableModels.map((m) => {
                const active = m.id === modelId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setModelId(m.id)}
                    className="pl-card"
                    style={{
                      padding: 12,
                      textAlign: "left",
                      border: "1px solid " + (active ? "var(--primary-line)" : "var(--line)"),
                      background: active ? "var(--primary-soft)" : "var(--surface)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      {m.code && <Chip>{m.code}</Chip>}
                      <span style={{ fontSize: 11, color: "var(--ink-5)" }} className="mono">v{m.version}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 2 }}>
                      {m.partsList.length} parts rows
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </BuilderSection>

        <BuilderSection num="05" title="Variants" hint="Override per-instance">
          <div className="pl-label">Variant selections (JSON)</div>
          <textarea
            className="pl-input mono"
            style={{ width: "100%", minHeight: 80, padding: 10, fontSize: 11.5 }}
            value={variantSelections}
            onChange={(e) => setVariantSelections(e.target.value)}
            placeholder='{"cable_diameter": "8mm"}'
          />
          <div style={{ marginTop: 6, fontSize: 11, color: "var(--ink-5)" }}>
            The visual variant picker ships in a follow-up. For now, type the JSON.
          </div>
        </BuilderSection>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
          <Btn variant="ghost">Discard</Btn>
          <Btn>Save draft</Btn>
          <Btn variant="primary" ico="check">Save &amp; recompute</Btn>
        </div>
      </div>

      {/* RIGHT — live MTO preview */}
      <aside
        style={{
          borderLeft: "1px solid var(--line)",
          background: "var(--surface)",
          position: "sticky",
          top: 0,
          alignSelf: "flex-start",
          height: "calc(100vh - 56px - 90px)",
          overflowY: "auto",
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Computed dims — live as the user types */}
        {pattern && <ComputedDimsPanel derived={derivedDims} />}

        <div>
          <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 4 }}>
            Live MTO preview
          </div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {selectedModel ? selectedModel.name : "Pick a Model to preview"}
          </div>
        </div>

        {!selectedModel ? (
          <div
            style={{
              padding: 18,
              background: "var(--surface-2)",
              borderRadius: 6,
              fontSize: 12,
              color: "var(--ink-4)",
              textAlign: "center",
            }}
          >
            Once you pick a System and Model, the rule engine computes the bill of quantities here.
          </div>
        ) : preview ? (
          <>
            {preview.errors.length > 0 && (
              <div
                style={{
                  padding: 12,
                  background: "var(--danger-soft)",
                  border: "1px solid #F4C0C0",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "var(--danger)",
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{preview.errors.length} errors</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {preview.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div
              style={{
                padding: 12,
                background: "var(--primary-soft)",
                border: "1px solid var(--primary-line)",
                borderRadius: 6,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 10.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Lines
                </div>
                <div className="mono tnum" style={{ fontSize: 22, fontWeight: 600, color: "var(--primary)" }}>
                  {preview.rows.filter((r) => !r.skipped && r.qty != null).length}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Skipped
                </div>
                <div className="mono tnum" style={{ fontSize: 22, fontWeight: 600, color: "var(--ink-3)" }}>
                  {preview.rows.filter((r) => r.skipped).length}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 6 }}>
                Computed quantities
              </div>
              <div style={{ border: "1px solid var(--line)", borderRadius: 4 }}>
                {preview.rows.length === 0 ? (
                  <div style={{ padding: 14, fontSize: 12, color: "var(--ink-5)" }}>
                    Model has no parts list rows yet.
                  </div>
                ) : (
                  preview.rows.map((r) => (
                    <div
                      key={r.row_id}
                      style={{
                        padding: "8px 10px",
                        borderBottom: "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span className="mono" style={{ fontSize: 11.5, color: "var(--primary)", flex: 1 }}>
                        {r.row_id}
                      </span>
                      {r.skipped ? (
                        <Pill variant="draft">skip · {r.reason ?? ""}</Pill>
                      ) : (
                        <span className="mono tnum" style={{ fontSize: 12, fontWeight: 600 }}>
                          {r.qty != null ? r.qty.toLocaleString() : "—"}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}
