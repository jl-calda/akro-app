"use client";

import { useState } from "react";
import { Btn, Chip, Pill, NumInput, ProgressBar, Seg } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export type MtoLine = {
  id: string;
  alias: string | null;
  quantity: number;
  unit: string;
  unit_cost: number;
  wastage_pct: number | null;
  is_overridden: boolean;
  material_code: string | null;
  material_name: string | null;
  material_emoji: string | null;
  supplier_name: string | null;
  category_name: string | null;
};

export type LocationStock = {
  location_id: string;
  location_name: string;
  balance: number;
};

export function MtoWithPanel({
  lines,
  locationStock,
}: {
  lines: MtoLine[];
  locationStock: Record<string, LocationStock[]>;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(lines[0]?.id ?? null);
  const selected = lines.find((l) => l.id === selectedId);

  const total = lines.reduce((s, l) => s + l.quantity * l.unit_cost, 0);

  return (
    <>
      <div className="pl-filterbar">
        <div style={{ fontSize: 13, fontWeight: 600 }}>MTO · Bill of Quantities</div>
        <span style={{ color: "var(--ink-5)" }}>·</span>
        <span className="tnum" style={{ fontSize: 12, color: "var(--ink-4)" }}>
          {lines.length} lines · ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>Group by</span>
          <Seg items={["System", "Material", "Category", "Supplier"]} active="System" />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0, background: "var(--surface)" }}>
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 44 }}></th>
                <th style={{ width: 130 }}>SKU</th>
                <th>Material</th>
                <th style={{ width: 100 }}>Supplier</th>
                <th className="num" style={{ width: 80 }}>Qty</th>
                <th style={{ width: 100 }}>Stock progress</th>
                <th className="num" style={{ width: 70 }}>Waste</th>
                <th className="num" style={{ width: 80 }}>Unit</th>
                <th className="num" style={{ width: 90 }}>Line total</th>
                <th style={{ width: 28 }}></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l) => {
                const isSel = l.id === selectedId;
                const locStock = locationStock[l.id] ?? [];
                const totalAvail = locStock.reduce((s, ls) => s + Math.max(0, ls.balance), 0);
                const progress = l.quantity > 0 ? Math.min(100, (totalAvail / l.quantity) * 100) : 0;
                return (
                  <tr
                    key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    className={isSel ? "is-selected" : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div className="pl-thumb">{l.material_emoji ?? "📦"}</div>
                    </td>
                    <td className="mono" style={{ color: "var(--ink-3)" }}>{l.material_code ?? "—"}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontWeight: 500 }}>{l.material_name ?? l.alias ?? "—"}</span>
                        {l.is_overridden && <Pill variant="modified">overridden</Pill>}
                      </div>
                      {l.category_name && (
                        <div style={{ fontSize: 10.5, color: "var(--ink-5)", marginTop: 1 }}>{l.category_name}</div>
                      )}
                    </td>
                    <td style={{ color: "var(--ink-3)" }}>{l.supplier_name ?? "—"}</td>
                    <td className="num mono">
                      {Number(l.quantity).toLocaleString()}
                      <span className="unit">{l.unit}</span>
                    </td>
                    <td>
                      <ProgressBar value={totalAvail} max={l.quantity || 1} tone={progress >= 100 ? "success" : progress < 50 ? "warn" : ""} />
                    </td>
                    <td className="num mono" style={{ color: "var(--ink-4)" }}>
                      {l.wastage_pct != null ? `${l.wastage_pct}%` : "—"}
                    </td>
                    <td className="num mono">${Number(l.unit_cost).toFixed(2)}</td>
                    <td className="num mono" style={{ fontWeight: 600 }}>
                      ${(l.quantity * l.unit_cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      <Icon name="dots" size={14} style={{ color: "var(--ink-5)" }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right detail panel */}
        {selected && (
          <aside
            style={{
              width: 360,
              flex: "0 0 360px",
              background: "var(--surface)",
              borderLeft: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
            }}
          >
            <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid var(--line)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Chip>{selected.material_code ?? selected.alias ?? "—"}</Chip>
                <Pill variant="info">selected</Pill>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{ marginLeft: "auto", background: "transparent", border: "none", color: "var(--ink-5)", cursor: "pointer" }}
                >
                  <Icon name="x" />
                </button>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
                {selected.material_name ?? selected.alias ?? "Untitled"}
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>
                {selected.category_name ?? "—"} · {selected.supplier_name ?? "—"}
              </div>
            </div>

            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="pl-label">Override · Quantity</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <NumInput value={String(selected.quantity)} unit={selected.unit} width={120} />
                  <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
                    rule produced{" "}
                    <span className="mono tnum">
                      {Number(selected.quantity).toLocaleString()} {selected.unit}
                    </span>
                  </span>
                </div>
              </div>

              <div>
                <label className="pl-label">Wastage · Per-line</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <NumInput value={String(selected.wastage_pct ?? 0)} unit="%" width={90} />
                  <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>project default 0%</span>
                </div>
              </div>

              <div>
                <label className="pl-label">Substitute</label>
                <div className="pl-select" style={{ width: "100%" }}>
                  <span style={{ color: "var(--ink-4)" }}>Pick a different material…</span>
                  <Icon name="chev" size={12} />
                </div>
                <div style={{ marginTop: 6, fontSize: 11.5, color: "var(--ink-4)" }}>
                  Soft warning if category or substrate mismatch.
                </div>
              </div>

              <div>
                <label className="pl-label">Stock by location</label>
                <div style={{ border: "1px solid var(--line)", borderRadius: 4 }}>
                  {(locationStock[selected.id] ?? []).length === 0 ? (
                    <div style={{ padding: "10px 14px", fontSize: 11.5, color: "var(--ink-5)" }}>
                      No balance recorded yet.
                    </div>
                  ) : (
                    (locationStock[selected.id] ?? []).map((s, i) => (
                      <div
                        key={s.location_id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr auto auto",
                          alignItems: "center",
                          padding: "8px 10px",
                          gap: 12,
                          borderTop: i ? "1px solid var(--line)" : "none",
                          fontSize: 12,
                        }}
                      >
                        <span>{s.location_name}</span>
                        <span className="mono tnum" style={{ color: "var(--ink-3)" }}>
                          {Number(s.balance).toLocaleString()} {selected.unit}
                        </span>
                        <span style={{ width: 56 }}>
                          <ProgressBar value={Math.max(0, s.balance)} max={Math.max(s.balance, selected.quantity)} />
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="pl-label">Certifications</label>
                <div
                  style={{
                    padding: "10px 12px",
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    borderRadius: 4,
                    fontSize: 11.5,
                    color: "var(--ink-4)",
                  }}
                >
                  Cert chips ship once Model certifications are wired (model_versions.certifications jsonb).
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid var(--line)",
                display: "flex",
                gap: 8,
                justifyContent: "flex-end",
                marginTop: "auto",
              }}
            >
              <Btn variant="ghost">Cancel</Btn>
              <Btn variant="primary">Apply override</Btn>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
