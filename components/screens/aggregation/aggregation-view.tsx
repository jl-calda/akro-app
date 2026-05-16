"use client";

import { useState } from "react";
import { Btn, Check, Chip, Pill, Seg } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { generatePoFromGroup } from "@/app/(app)/procurement/aggregation/actions";

type ProjectRow = { id: string; code: string | null; name: string; total: number };

type LineRow = {
  materialId: string;
  code: string;
  name: string;
  emoji: string | null;
  unit: string;
  totalQty: number;
  unitCost: number;
  supplierId: string | null;
  supplierName: string | null;
  perProject: { projectId: string; projectCode: string | null; projectName: string; qty: number }[];
};

const PROJECT_COLORS = ["#1E40AF", "#0F766E", "#A16B3B", "#6B5BB3", "#B91C1C", "#475569"];

export function AggregationView({
  projects,
  lines,
}: {
  projects: ProjectRow[];
  lines: LineRow[];
}) {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set(projects.map((p) => p.id)),
  );
  const [selectedLine, setSelectedLine] = useState<string | null>(lines[0]?.materialId ?? null);

  const projectColorMap: Record<string, string> = {};
  projects.forEach((p, i) => {
    projectColorMap[p.id] = PROJECT_COLORS[i % PROJECT_COLORS.length];
  });

  function toggleProject(id: string) {
    setSelectedProjects((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filteredLines = lines
    .map((l) => ({
      ...l,
      perProject: l.perProject.filter((pp) => selectedProjects.has(pp.projectId)),
    }))
    .filter((l) => l.perProject.length > 0)
    .map((l) => ({
      ...l,
      totalQty: l.perProject.reduce((s, pp) => s + pp.qty, 0),
    }));

  // Group by supplier
  const bySupplier = new Map<
    string,
    { supplierId: string | null; supplierName: string; lines: typeof filteredLines; total: number }
  >();
  for (const l of filteredLines) {
    const key = l.supplierId ?? "_none";
    if (!bySupplier.has(key)) {
      bySupplier.set(key, {
        supplierId: l.supplierId,
        supplierName: l.supplierName ?? "— no supplier —",
        lines: [],
        total: 0,
      });
    }
    const g = bySupplier.get(key)!;
    g.lines.push(l);
    g.total += l.totalQty * l.unitCost;
  }

  const grandTotal = filteredLines.reduce((s, l) => s + l.totalQty * l.unitCost, 0);
  const selectedLineData = filteredLines.find((l) => l.materialId === selectedLine);

  return (
    <>
      {/* Project selector strip */}
      <div
        style={{
          padding: "14px 24px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 8 }}>
          Projects · {selectedProjects.size} of {projects.length}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {projects.map((p) => {
            const active = selectedProjects.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProject(p.id)}
                style={{
                  padding: 12,
                  textAlign: "left",
                  background: active ? "var(--primary-soft)" : "var(--surface)",
                  border: "1px solid " + (active ? "var(--primary-line)" : "var(--line)"),
                  borderRadius: 6,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 28,
                    background: projectColorMap[p.id],
                    borderRadius: 2,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                    {p.code && <Chip>{p.code}</Chip>}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.name}
                  </div>
                </div>
                <Check state={active} />
              </button>
            );
          })}
          {/* Combined total card */}
          <div
            className="pl-card"
            style={{
              padding: 12,
              background: "var(--primary)",
              color: "#fff",
              border: "1px solid var(--primary)",
            }}
          >
            <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.8 }}>
              Combined total
            </div>
            <div className="mono tnum" style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>
              ${grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>
              {filteredLines.length} unique SKUs · {bySupplier.size} suppliers
            </div>
          </div>
        </div>
      </div>

      <div className="pl-filterbar">
        <span style={{ fontSize: 13, fontWeight: 600 }}>Aggregated demand</span>
        <span style={{ color: "var(--ink-5)" }}>·</span>
        <span className="tnum" style={{ fontSize: 12, color: "var(--ink-4)" }}>
          {filteredLines.length} SKUs
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>Group by</span>
          <Seg items={["Supplier", "Category", "Project", "None"]} active="Supplier" />
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0, background: "var(--surface)" }}>
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 36 }}></th>
                <th style={{ width: 140 }}>SKU</th>
                <th>Material</th>
                <th style={{ width: 180 }}>Provenance</th>
                <th className="num" style={{ width: 90 }}>Qty</th>
                <th className="num" style={{ width: 90 }}>Unit cost</th>
                <th className="num" style={{ width: 110 }}>Line total</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(bySupplier.entries()).map(([key, g]) => (
                <>
                  <tr key={key + "-header"} className="group-row">
                    <td colSpan={3}>
                      <span style={{ marginRight: 10 }}>{g.supplierName}</span>
                      <span className="group-count">{g.lines.length} lines</span>
                    </td>
                    <td colSpan={3} className="num mono" style={{ fontWeight: 600 }}>
                      ${g.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td>
                      {g.supplierId && (
                        <form action={generatePoFromGroup} style={{ display: "inline" }}>
                          <input type="hidden" name="supplier_id" value={g.supplierId} />
                          <input
                            type="hidden"
                            name="project_ids"
                            value={Array.from(selectedProjects).join(",")}
                          />
                          <button type="submit" className="pl-btn sm primary">
                            <Icon name="plus" size={11} />
                            PO
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                  {g.lines.map((l) => {
                    const isSel = l.materialId === selectedLine;
                    return (
                      <tr
                        key={l.materialId}
                        onClick={() => setSelectedLine(l.materialId)}
                        className={isSel ? "is-selected" : ""}
                        style={{ cursor: "pointer" }}
                      >
                        <td>
                          <div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 12 }}>
                            {l.emoji ?? "📦"}
                          </div>
                        </td>
                        <td className="mono" style={{ color: "var(--ink-3)" }}>{l.code}</td>
                        <td><span style={{ fontWeight: 500 }}>{l.name}</span></td>
                        <td>
                          <div style={{ display: "flex", height: 8, borderRadius: 2, overflow: "hidden", border: "1px solid var(--line)", background: "var(--surface-2)" }}>
                            {l.perProject.map((pp) => (
                              <span
                                key={pp.projectId}
                                title={`${pp.projectName} · ${pp.qty}`}
                                style={{
                                  flex: pp.qty,
                                  background: projectColorMap[pp.projectId],
                                }}
                              />
                            ))}
                          </div>
                          <div className="mono tnum" style={{ fontSize: 10.5, color: "var(--ink-5)", marginTop: 2 }}>
                            {l.perProject.length} projects
                          </div>
                        </td>
                        <td className="num mono">
                          {l.totalQty.toLocaleString()}
                          <span className="unit">{l.unit}</span>
                        </td>
                        <td className="num mono">${Number(l.unitCost).toFixed(2)}</td>
                        <td className="num mono" style={{ fontWeight: 600 }}>
                          ${(l.totalQty * l.unitCost).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </td>
                      </tr>
                    );
                  })}
                </>
              ))}
              {filteredLines.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "var(--ink-4)" }}>
                    No demand from selected projects yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right detail panel */}
        {selectedLineData && (
          <aside
            style={{
              width: 320,
              flex: "0 0 320px",
              background: "var(--surface)",
              borderLeft: "1px solid var(--line)",
              padding: "14px 16px",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Chip>{selectedLineData.code}</Chip>
              <Pill variant="info">selected</Pill>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {selectedLineData.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-4)", marginTop: 2 }}>
              {selectedLineData.supplierName ?? "no supplier"}
            </div>

            <div
              style={{
                marginTop: 14,
                padding: 12,
                background: "var(--primary-soft)",
                border: "1px solid var(--primary-line)",
                borderRadius: 4,
              }}
            >
              <div style={{ fontSize: 10.5, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
                Aggregated qty
              </div>
              <div className="mono tnum" style={{ fontSize: 22, fontWeight: 600, color: "var(--primary)" }}>
                {selectedLineData.totalQty.toLocaleString()} {selectedLineData.unit}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                × ${Number(selectedLineData.unitCost).toFixed(2)} = ${" "}
                <span className="mono tnum">
                  {(selectedLineData.totalQty * selectedLineData.unitCost).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <div className="pl-label">Provenance</div>
              {selectedLineData.perProject.map((pp) => (
                <div
                  key={pp.projectId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 28,
                      background: projectColorMap[pp.projectId],
                      borderRadius: 2,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {pp.projectName}
                    </div>
                    {pp.projectCode && (
                      <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-5)" }}>
                        {pp.projectCode}
                      </div>
                    )}
                  </div>
                  <span className="mono tnum" style={{ fontWeight: 600 }}>
                    {pp.qty.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {selectedLineData.supplierId && (
              <form action={generatePoFromGroup} style={{ marginTop: 14 }}>
                <input type="hidden" name="supplier_id" value={selectedLineData.supplierId} />
                <input
                  type="hidden"
                  name="project_ids"
                  value={Array.from(selectedProjects).join(",")}
                />
                <Btn variant="primary" ico="plus" type="submit" style={{ width: "100%", justifyContent: "center" }}>
                  Generate PO for {selectedLineData.supplierName}
                </Btn>
              </form>
            )}
          </aside>
        )}
      </div>
    </>
  );
}
