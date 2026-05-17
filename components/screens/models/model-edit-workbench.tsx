"use client";

import { useState, useTransition } from "react";
import { Btn, Chip, Pill, NumInput } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { previewRule } from "@/app/(app)/catalog/models/[modelId]/actions";
import { MaterialPicker } from "./material-picker";
import {
  CountSourcePicker,
  type PickedCount,
  pickedCountToFormula,
  parseFormulaToPicked,
} from "./count-source-picker";
import {
  GatePicker,
  type GateCondition,
  gateConditionsToFormula,
  parseGateFormula,
} from "./gate-picker";

type PartsListRow = {
  row_id: string;
  item_kind: "material" | "sub_assembly";
  item_id: string;
  item_version: number;
  count_or_qty_formula: string;
  criteria_gate?: string | null;
  wastage_pct?: number;
  notes?: string;
  cut_plan_enabled?: boolean;
};

type CustomDimension = {
  key: string;
  label: string;
  type: string;
  unit?: string;
  required?: boolean;
  default?: unknown;
  help?: string;
};

type Variant = {
  key: string;
  kind: "enum" | "boolean";
  options: string[];
  default?: string;
};

const TOKEN_COLOR = {
  fn: "#7C2D12",
  param: "#1E40AF",
  op: "#475569",
  num: "#0F766E",
  paren: "#94A3B8",
  str: "#B91C1C",
};

const FN_NAMES = new Set([
  "ceil",
  "floor",
  "round",
  "min",
  "max",
  "abs",
  "if",
  "linearCut",
  "plateCut",
]);

/** Tokenize a formula for color-coded display. Lightweight; doesn't validate. */
function colorTokens(formula: string): { v: string; c: string }[] {
  const out: { v: string; c: string }[] = [];
  let i = 0;
  while (i < formula.length) {
    const c = formula[i];
    // whitespace
    if (/\s/.test(c)) {
      let j = i;
      while (j < formula.length && /\s/.test(formula[j])) j++;
      out.push({ v: formula.slice(i, j), c: TOKEN_COLOR.op });
      i = j;
      continue;
    }
    // string
    if (c === "'" || c === '"') {
      const q = c;
      let j = i + 1;
      while (j < formula.length && formula[j] !== q) j++;
      out.push({ v: formula.slice(i, j + 1), c: TOKEN_COLOR.str });
      i = j + 1;
      continue;
    }
    // number
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < formula.length && /[0-9.]/.test(formula[j])) j++;
      out.push({ v: formula.slice(i, j), c: TOKEN_COLOR.num });
      i = j;
      continue;
    }
    // ident
    if (/[a-zA-Z_]/.test(c)) {
      let j = i;
      while (j < formula.length && /[a-zA-Z_0-9.]/.test(formula[j])) j++;
      const word = formula.slice(i, j);
      const colour = FN_NAMES.has(word) ? TOKEN_COLOR.fn : TOKEN_COLOR.param;
      out.push({ v: word, c: colour });
      i = j;
      continue;
    }
    // paren
    if (c === "(" || c === ")") {
      out.push({ v: c, c: TOKEN_COLOR.paren });
      i++;
      continue;
    }
    // operator / punctuation
    out.push({ v: c, c: TOKEN_COLOR.op });
    i++;
  }
  return out;
}

export function FormulaCell({ formula, preview }: { formula: string; preview?: string | number | null }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, maxWidth: "100%" }}>
      <span
        className="mono"
        style={{
          fontSize: 11.5,
          background: "var(--surface-2)",
          border: "1px solid var(--line)",
          padding: "3px 7px",
          borderRadius: 3,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {colorTokens(formula).map((t, i) => (
          <span key={i} style={{ color: t.c, whiteSpace: "pre" }}>{t.v}</span>
        ))}
      </span>
      {preview != null && (
        <span className="mono tnum" style={{ fontSize: 11, color: "var(--ink-3)" }}>
          = {String(preview)}
        </span>
      )}
    </span>
  );
}

function ZoneHeader({ idx, title, sub, actions }: { idx: string; title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 10 }}>
      <span className="mono" style={{ fontSize: 11, color: "var(--ink-5)", fontWeight: 600, letterSpacing: "0.04em" }}>{idx}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{sub}</div>}
      </div>
      {actions && <div style={{ marginLeft: "auto" }}>{actions}</div>}
    </div>
  );
}

export function ModelEditWorkbench({
  modelId,
  versionId,
  modelName,
  modelCode,
  systemName,
  versionLabel,
  isPublished,
  partsList: initialPartsList,
  customDimensions,
  variants,
  systemPattern,
  materials,
  allowedSubstrates,
}: {
  modelId: string;
  versionId: string;
  modelName: string;
  modelCode: string | null;
  systemName: string;
  versionLabel: string;
  isPublished: boolean;
  partsList: PartsListRow[];
  customDimensions: CustomDimension[];
  variants: Variant[];
  systemPattern: import("@/lib/rules/dim-derive").DimensionPattern | null;
  materials: import("./material-picker").MaterialOption[];
  allowedSubstrates: string[];
}) {
  const [selectedRow, setSelectedRow] = useState<string | null>(initialPartsList[0]?.row_id ?? null);
  const [partsList, setPartsList] = useState<PartsListRow[]>(initialPartsList);
  const [sampleInputs, setSampleInputs] = useState<string>(
    JSON.stringify({ length: 24, substrate: "metal_deck" }, null, 2),
  );
  const [previewResult, setPreviewResult] = useState<{
    ok: boolean;
    rows?: Array<{ row_id: string; qty: number | null; skipped: boolean; reason?: string }>;
    errors?: string[];
    error?: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedRowData = partsList.find((r) => r.row_id === selectedRow);
  const previewForRow = (rowId: string) =>
    previewResult?.rows?.find((r) => r.row_id === rowId);

  function updateRow(rowId: string, patch: Partial<PartsListRow>) {
    setPartsList((rows) =>
      rows.map((r) => (r.row_id === rowId ? { ...r, ...patch } : r)),
    );
  }

  function addRow() {
    const newId = `row_${Date.now()}`;
    setPartsList((rows) => [
      ...rows,
      {
        row_id: newId,
        item_kind: "material",
        item_id: "",
        item_version: 1,
        count_or_qty_formula: "0",
      },
    ]);
    setSelectedRow(newId);
  }

  function deleteRow(rowId: string) {
    setPartsList((rows) => rows.filter((r) => r.row_id !== rowId));
    if (selectedRow === rowId) setSelectedRow(null);
  }

  function runPreview() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("parts_list", JSON.stringify(partsList));
      formData.set("dimensions", sampleInputs);
      const result = await previewRule(null, formData);
      if (result.ok) {
        setPreviewResult({
          ok: true,
          rows: result.result.rows.map((r) => ({
            row_id: r.row_id,
            qty: r.qty,
            skipped: r.skipped,
            reason: r.reason,
          })),
          errors: result.result.errors,
        });
      } else {
        setPreviewResult({ ok: false, error: result.error });
      }
    });
  }

  async function saveParts() {
    const formData = new FormData();
    formData.set("modelId", modelId);
    formData.set("versionId", versionId);
    formData.set("parts_list", JSON.stringify(partsList));
    const { updateModelVersion } = await import(
      "@/app/(app)/catalog/models/[modelId]/actions"
    );
    await updateModelVersion(formData);
  }

  return (
    <div className="pl-main">
      {/* Sticky header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)", flex: "0 0 auto" }}>
        <div style={{ padding: "14px 24px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          {modelCode && <Chip>{modelCode}</Chip>}
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>{modelName}</div>
          <Pill variant="info">{versionLabel} · {isPublished ? "published" : "draft"}</Pill>
          <span style={{ fontSize: 12, color: "var(--ink-4)" }}>under {systemName}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <Btn ico="history" variant="ghost">History</Btn>
            <Btn ico="copy" variant="ghost">Duplicate</Btn>
            <Btn onClick={runPreview}>
              {isPending ? "Running…" : "Test with sample"}
            </Btn>
            <button className="pl-btn" onClick={saveParts}>Save parts list</button>
            <Btn variant="primary" ico="check">{isPublished ? "Saved" : "Publish " + versionLabel}</Btn>
          </div>
        </div>
        {/* Zone strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 24px 10px", fontSize: 11.5 }}>
          {[
            ["Header", "constraints + certs"],
            ["Custom dimensions", `${customDimensions.length} defined`],
            ["Variants", `${variants.length} defined`],
            ["Parts list", `${partsList.length} rows`],
            ["Labour", "phased rules"],
          ].map(([z, sub], i) => (
            <div key={z as string} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="mono" style={{ color: "var(--ink-5)" }}>0{i + 1}</span>
              <span style={{ color: "var(--ink-2)", fontWeight: 600 }}>{z}</span>
              <span style={{ color: "var(--ink-5)" }}>· {sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two-pane body */}
      <div className="pl-scroll" style={{ display: "grid", gridTemplateColumns: "1fr 540px", alignItems: "flex-start", minHeight: 0 }}>
        {/* LEFT — zones */}
        <div style={{ padding: "18px 22px", minWidth: 0 }}>
          {/* ZONE 1 */}
          <ZoneHeader idx="01" title="Header" sub="Constraints that decide when this Model is selectable in a project." />
          <div className="pl-card" style={{ padding: 14, marginBottom: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 10, columnGap: 14 }}>
              <FieldLabel>System</FieldLabel>
              <FieldValue><Chip>{systemName}</Chip></FieldValue>
              <FieldLabel>Pinned material versions</FieldLabel>
              <FieldValue>
                <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
                  Snapshot taken on save · pinned via parts_list.item_version
                </span>
              </FieldValue>
            </div>
          </div>

          {/* ZONE 2 */}
          <ZoneHeader idx="02" title="Custom dimensions" sub="Extend the System's dimension schema." actions={<Btn size="sm" ico="plus">Add dimension</Btn>} />
          <div className="pl-card" style={{ overflow: "hidden", marginBottom: 18 }}>
            <table className="pl-table">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>Key</th>
                  <th>Label</th>
                  <th style={{ width: 100 }}>Type</th>
                  <th style={{ width: 80 }}>Unit</th>
                  <th style={{ width: 80 }}>Required</th>
                  <th style={{ width: 80 }}>Default</th>
                </tr>
              </thead>
              <tbody>
                {customDimensions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 18, color: "var(--ink-4)", textAlign: "center" }}>
                      No custom dimensions. Most Models inherit dimensions from their System.
                    </td>
                  </tr>
                ) : (
                  customDimensions.map((d) => (
                    <tr key={d.key}>
                      <td className="mono" style={{ color: "var(--primary)" }}>{d.key}</td>
                      <td>{d.label}</td>
                      <td><Chip>{d.type}</Chip></td>
                      <td className="mono" style={{ color: "var(--ink-4)" }}>{d.unit ?? "—"}</td>
                      <td>{d.required ? <Pill variant="modified">required</Pill> : <span style={{ fontSize: 11.5, color: "var(--ink-5)" }}>optional</span>}</td>
                      <td className="mono">{String(d.default ?? "—")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ZONE 3 */}
          <ZoneHeader idx="03" title="Variants" sub="User-picked options that change which materials or quantities are included." actions={<Btn size="sm" ico="plus">Add variant</Btn>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
            {variants.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", padding: 18, fontSize: 12, color: "var(--ink-4)", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 6, textAlign: "center" }}>
                No variants. Reference as <span className="mono">variant.&lt;key&gt;</span> in formulas once added.
              </div>
            ) : (
              variants.map((v) => (
                <div key={v.key} className="pl-card" style={{ padding: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span className="mono" style={{ fontSize: 12, fontWeight: 500, color: "var(--primary)" }}>{v.key}</span>
                    <Chip>{v.kind}</Chip>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {v.options.map((o) => (
                      <span key={o} className={"pl-pill" + (o === v.default ? " info" : "")}>
                        {o}
                        {o === v.default && " · default"}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ZONE 4 — Parts list */}
          <ZoneHeader idx="04" title="Parts list" sub="Materials and sub-assemblies. Each row carries its own rules inline." actions={<Btn size="sm" ico="plus" onClick={addRow}>Add row</Btn>} />
          <div className="pl-card" style={{ overflow: "visible", marginBottom: 18 }}>
            <table className="pl-table">
              <thead>
                <tr>
                  <th style={{ width: 110 }}>Alias</th>
                  <th style={{ width: 110 }}>Type</th>
                  <th>Quantity formula</th>
                  <th style={{ width: 180 }}>Gate</th>
                  <th style={{ width: 70 }}>Waste</th>
                  <th style={{ width: 24 }} />
                </tr>
              </thead>
              <tbody>
                {partsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 18, textAlign: "center", color: "var(--ink-4)" }}>
                      No parts yet. Click <span className="mono">+ Add row</span> to start.
                    </td>
                  </tr>
                ) : (
                  partsList.map((row) => {
                    const isActive = row.row_id === selectedRow;
                    const preview = previewForRow(row.row_id);
                    return (
                      <tr
                        key={row.row_id}
                        style={{ background: isActive ? "var(--primary-soft)" : "transparent", cursor: "pointer" }}
                        onClick={() => setSelectedRow(row.row_id)}
                      >
                        <td className="mono" style={{ fontWeight: 500, color: "var(--primary)" }}>{row.row_id}</td>
                        <td>
                          {row.item_kind === "sub_assembly" ? (
                            <Pill variant="info">sub-assembly</Pill>
                          ) : (
                            <Pill>material</Pill>
                          )}
                        </td>
                        <td>
                          <FormulaCell
                            formula={row.count_or_qty_formula || "0"}
                            preview={preview?.skipped ? "skip" : preview?.qty ?? null}
                          />
                        </td>
                        <td>
                          {row.criteria_gate ? (
                            <FormulaCell formula={row.criteria_gate} />
                          ) : (
                            <span style={{ fontSize: 11.5, color: "var(--ink-5)" }}>—</span>
                          )}
                        </td>
                        <td className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
                          {row.wastage_pct != null ? `${row.wastage_pct}%` : "—"}
                        </td>
                        <td>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRow(row.row_id);
                            }}
                            style={{ background: "transparent", border: "none", color: "var(--ink-5)", cursor: "pointer" }}
                          >
                            <Icon name="trash" size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ZONE 5 — Labour */}
          <ZoneHeader idx="05" title="Labour" sub="Phased manhour rules — same formula language as parts." actions={<Btn size="sm" ico="plus">Add labour row</Btn>} />
          <div className="pl-card" style={{ padding: 18, marginBottom: 18, fontSize: 12, color: "var(--ink-4)" }}>
            Labour rules editor ships in a follow-up. For now, edit via the model_versions.labour_rules JSON in the database.
          </div>

          {/* Errors */}
          {previewResult?.errors && previewResult.errors.length > 0 && (
            <div
              style={{
                padding: 14,
                background: "var(--danger-soft)",
                border: "1px solid #F4C0C0",
                borderRadius: 6,
                marginBottom: 18,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--danger)", marginBottom: 6 }}>
                Preview errors
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--danger)" }}>
                {previewResult.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT — Live preview drawer */}
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
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 4 }}>
              Live preview
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {selectedRowData ? (
                <>
                  <span className="mono" style={{ color: "var(--primary)" }}>{selectedRowData.row_id}</span>
                  {" "}<span style={{ color: "var(--ink-3)", fontWeight: 400, fontSize: 12.5 }}>· {selectedRowData.item_kind.replace("_", " ")}</span>
                </>
              ) : (
                <span style={{ color: "var(--ink-4)" }}>Select a row to preview</span>
              )}
            </div>
          </div>

          {selectedRowData && (
            <>
              {/* Material picker (replaces the UUID textarea) */}
              <div>
                <label className="pl-label">Material</label>
                <MaterialPicker
                  materials={materials}
                  selectedId={selectedRowData.item_id}
                  onPick={(m) =>
                    updateRow(selectedRowData.row_id, {
                      item_id: m.id,
                      item_kind: "material",
                    })
                  }
                />
              </div>

              {/* Count source + multiplier (replaces the formula textarea) */}
              <div>
                <label className="pl-label">Quantity (pick a source, no formula needed)</label>
                <CountSourcePicker
                  pattern={systemPattern}
                  siblingAliases={partsList
                    .map((r) => r.row_id)
                    .filter((id) => id !== selectedRowData.row_id)}
                  value={
                    parseFormulaToPicked(selectedRowData.count_or_qty_formula) ?? {
                      source: "(constant)",
                      multiplier: 1,
                    }
                  }
                  onChange={(pc) =>
                    updateRow(selectedRowData.row_id, {
                      count_or_qty_formula: pickedCountToFormula(pc),
                    })
                  }
                />
              </div>

              {/* Gate picker (replaces the gate text input) */}
              <div>
                <label className="pl-label">When does this apply?</label>
                <GatePicker
                  substrates={allowedSubstrates}
                  variants={variants.map((v) => ({ key: v.key, options: v.options ?? [] }))}
                  conditions={parseGateFormula(selectedRowData.criteria_gate)}
                  onChange={(conds) =>
                    updateRow(selectedRowData.row_id, {
                      criteria_gate: gateConditionsToFormula(conds),
                    })
                  }
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label className="pl-label">Item kind</label>
                  <select
                    className="pl-input"
                    style={{ width: "100%" }}
                    value={selectedRowData.item_kind}
                    onChange={(e) =>
                      updateRow(selectedRowData.row_id, {
                        item_kind: e.target.value as "material" | "sub_assembly",
                      })
                    }
                  >
                    <option value="material">material</option>
                    <option value="sub_assembly">sub-assembly</option>
                  </select>
                </div>
                <div>
                  <label className="pl-label">Wastage %</label>
                  <input
                    type="number"
                    step="0.5"
                    className="pl-input num-input"
                    style={{ width: "100%" }}
                    value={selectedRowData.wastage_pct ?? 0}
                    onChange={(e) =>
                      updateRow(selectedRowData.row_id, {
                        wastage_pct: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <label className="pl-label">Sample inputs (JSON)</label>
                <textarea
                  className="pl-input mono"
                  style={{ width: "100%", minHeight: 100, padding: 8, fontSize: 11.5 }}
                  value={sampleInputs}
                  onChange={(e) => setSampleInputs(e.target.value)}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Btn
                    variant="primary"
                    ico="refresh"
                    onClick={runPreview}
                    size="sm"
                  >
                    {isPending ? "Computing…" : "Run preview"}
                  </Btn>
                </div>
              </div>

              {previewResult?.ok && previewResult.rows && (
                <div
                  style={{
                    padding: 12,
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 8 }}>
                    Result
                  </div>
                  {previewResult.rows.map((r) => (
                    <div
                      key={r.row_id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "4px 0",
                        fontSize: 12,
                      }}
                    >
                      <span
                        className="mono"
                        style={{
                          color: r.row_id === selectedRowData.row_id ? "var(--primary)" : "var(--ink-3)",
                          fontWeight: r.row_id === selectedRowData.row_id ? 600 : 400,
                          flex: 1,
                        }}
                      >
                        {r.row_id}
                      </span>
                      {r.skipped ? (
                        <Pill variant="draft">skipped</Pill>
                      ) : (
                        <span className="mono tnum" style={{ fontWeight: 600 }}>
                          {r.qty != null ? r.qty.toLocaleString() : "—"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {previewResult && !previewResult.ok && (
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
                  {previewResult.error}
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 500, letterSpacing: "0.02em", padding: "8px 0" }}>
      {children}
    </div>
  );
}
function FieldValue({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", padding: "6px 0" }}>{children}</div>;
}
