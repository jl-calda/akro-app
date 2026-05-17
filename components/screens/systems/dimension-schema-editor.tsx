"use client";

import { useState } from "react";
import { Btn, Chip, Pill, Check } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export type DimensionRow = {
  key: string;
  label: string;
  type: "number" | "integer" | "string" | "boolean";
  unit?: string;
  required?: boolean;
  default?: unknown;
  min?: number;
  max?: number;
  help?: string;
};

const TYPE_OPTIONS: DimensionRow["type"][] = ["number", "integer", "string", "boolean"];

export function DimensionSchemaEditor({
  initial,
  onSave,
}: {
  initial: DimensionRow[];
  onSave: (rows: DimensionRow[]) => Promise<void> | void;
}) {
  const [rows, setRows] = useState<DimensionRow[]>(initial);
  const [showJson, setShowJson] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  function update(i: number, patch: Partial<DimensionRow>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => [
      ...rs,
      { key: `dim_${rs.length + 1}`, label: "New dimension", type: "number" },
    ]);
  }
  function deleteRow(i: number) {
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  }
  function moveUp(i: number) {
    if (i === 0) return;
    setRows((rs) => {
      const next = [...rs];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }
  function moveDown(i: number) {
    setRows((rs) => {
      if (i === rs.length - 1) return rs;
      const next = [...rs];
      [next[i + 1], next[i]] = [next[i], next[i + 1]];
      return next;
    });
  }

  async function save() {
    await onSave(rows);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  return (
    <div className="pl-card" style={{ overflow: "hidden" }}>
      <div className="pl-card-head">
        <Icon name="list" />
        <span className="pl-card-title">Rows · {rows.length}</span>
        {savedFlash && <Pill variant="approved" dot>saved</Pill>}
        <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setShowJson((v) => !v)}
            className="pl-btn ghost sm"
          >
            {showJson ? "Hide JSON" : "View JSON"}
          </button>
          <button type="button" onClick={addRow} className="pl-btn sm">
            <Icon name="plus" size={11} />
            Add row
          </button>
          <button type="button" onClick={save} className="pl-btn sm primary">
            Save schema
          </button>
        </span>
      </div>

      {rows.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "var(--ink-4)" }}>
          No dimensions defined. Click <span className="mono">+ Add row</span> to start.
        </div>
      ) : (
        <table className="pl-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th style={{ width: 22 }} />
              <th style={{ width: 150 }}>Key</th>
              <th>Label</th>
              <th style={{ width: 110 }}>Type</th>
              <th style={{ width: 70 }}>Unit</th>
              <th style={{ width: 70 }}>Req.</th>
              <th style={{ width: 90 }}>Default</th>
              <th style={{ width: 130 }}>Min · Max</th>
              <th>Help text</th>
              <th style={{ width: 42 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => moveUp(i)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        color: "var(--ink-5)",
                        cursor: "pointer",
                        lineHeight: 0.6,
                      }}
                    >
                      ▴
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(i)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        color: "var(--ink-5)",
                        cursor: "pointer",
                        lineHeight: 0.6,
                      }}
                    >
                      ▾
                    </button>
                  </div>
                </td>
                <td>
                  <input
                    className="pl-input mono"
                    style={{ width: "100%", height: 26, padding: "0 6px", fontSize: 11.5, color: "var(--primary)" }}
                    value={r.key}
                    onChange={(e) => update(i, { key: e.target.value.replace(/\s+/g, "_") })}
                  />
                </td>
                <td>
                  <input
                    className="pl-input"
                    style={{ width: "100%", height: 26, padding: "0 6px", fontSize: 12 }}
                    value={r.label}
                    onChange={(e) => update(i, { label: e.target.value })}
                  />
                </td>
                <td>
                  <select
                    className="pl-input"
                    style={{ width: "100%", height: 26, padding: "0 4px", fontSize: 12 }}
                    value={r.type}
                    onChange={(e) => update(i, { type: e.target.value as DimensionRow["type"] })}
                  >
                    {TYPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="pl-input mono"
                    style={{ width: "100%", height: 26, padding: "0 6px", fontSize: 11.5 }}
                    value={r.unit ?? ""}
                    onChange={(e) => update(i, { unit: e.target.value || undefined })}
                    placeholder="m"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => update(i, { required: !r.required })}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                    aria-label="Toggle required"
                  >
                    <Check state={Boolean(r.required)} />
                  </button>
                </td>
                <td>
                  <input
                    className="pl-input mono"
                    style={{ width: "100%", height: 26, padding: "0 6px", fontSize: 11.5, fontVariantNumeric: "tabular-nums" }}
                    value={r.default == null ? "" : String(r.default)}
                    onChange={(e) =>
                      update(i, {
                        default:
                          e.target.value === ""
                            ? undefined
                            : r.type === "number" || r.type === "integer"
                              ? Number(e.target.value)
                              : r.type === "boolean"
                                ? e.target.value === "true"
                                : e.target.value,
                      })
                    }
                  />
                </td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <input
                      className="pl-input mono"
                      style={{ width: "50%", height: 26, padding: "0 4px", fontSize: 11 }}
                      value={r.min ?? ""}
                      onChange={(e) =>
                        update(i, { min: e.target.value === "" ? undefined : Number(e.target.value) })
                      }
                      placeholder="min"
                    />
                    <input
                      className="pl-input mono"
                      style={{ width: "50%", height: 26, padding: "0 4px", fontSize: 11 }}
                      value={r.max ?? ""}
                      onChange={(e) =>
                        update(i, { max: e.target.value === "" ? undefined : Number(e.target.value) })
                      }
                      placeholder="max"
                    />
                  </div>
                </td>
                <td>
                  <input
                    className="pl-input"
                    style={{ width: "100%", height: 26, padding: "0 6px", fontSize: 11.5, color: "var(--ink-4)" }}
                    value={r.help ?? ""}
                    onChange={(e) => update(i, { help: e.target.value || undefined })}
                    placeholder="optional"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => deleteRow(i)}
                    className="pl-btn ghost sm"
                    style={{ padding: 4 }}
                    title="Delete row"
                  >
                    <Icon name="trash" size={11} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showJson && (
        <div style={{ padding: 14, borderTop: "1px solid var(--line)", background: "var(--surface-2)" }}>
          <div className="pl-label">Raw JSON (read-only)</div>
          <pre
            className="mono"
            style={{
              fontSize: 11,
              padding: 10,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 4,
              overflow: "auto",
              maxHeight: 300,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {JSON.stringify(rows, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
