"use client";

import { useState, useMemo } from "react";
import { Btn, Chip, Pill, Seg } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { linearCut, type LinearCutPlan } from "@/lib/cutting/linear";
import { plateCut, type PlatePlan } from "@/lib/cutting/plate";
import { LinearStock } from "./linear-stock";
import { PlateSheet } from "./plate-sheet";

type Mode = "linear" | "plate" | "picking" | "raw";

export function CutPlanUi({ modelName }: { modelName: string }) {
  const [mode, setMode] = useState<Mode>("linear");

  // Linear state
  const [requiredCutsRaw, setRequiredCutsRaw] = useState<string>("8.6, 4.2, 4.2, 3.2, 5.6, 4.0");
  const [stockLengthsRaw, setStockLengthsRaw] = useState<string>("12, 6");
  const [kerf, setKerf] = useState<number>(3);
  const [minReusable, setMinReusable] = useState<number>(2);

  // Plate state
  const [piecesRaw, setPiecesRaw] = useState<string>(
    `[
  { "width": 1200, "height": 800, "qty": 3 },
  { "width": 1100, "height": 800, "qty": 1 },
  { "width": 600, "height": 400, "qty": 3 },
  { "width": 1100, "height": 400, "qty": 1 }
]`,
  );
  const [sheetW, setSheetW] = useState<number>(2400);
  const [sheetH, setSheetH] = useState<number>(1200);
  const [plateKerf, setPlateKerf] = useState<number>(3);

  const linearResult = useMemo<{ ok: true; plan: LinearCutPlan } | { ok: false; error: string }>(() => {
    try {
      const cuts = requiredCutsRaw
        .split(/[,\s]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n > 0);
      const stocks = stockLengthsRaw
        .split(/[,\s]+/)
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n) && n > 0);
      if (cuts.length === 0) return { ok: false, error: "No cuts entered" };
      if (stocks.length === 0) return { ok: false, error: "No stock lengths entered" };
      const plan = linearCut(cuts, stocks, kerf / 1000, minReusable);
      return { ok: true, plan };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }, [requiredCutsRaw, stockLengthsRaw, kerf, minReusable]);

  const plateResult = useMemo<{ ok: true; plan: PlatePlan } | { ok: false; error: string }>(() => {
    try {
      const pieces = JSON.parse(piecesRaw) as { width: number; height: number; qty: number }[];
      if (!Array.isArray(pieces) || pieces.length === 0) return { ok: false, error: "No pieces entered" };
      const plan = plateCut(pieces, { width: sheetW, height: sheetH }, plateKerf);
      return { ok: true, plan };
    } catch (err) {
      return { ok: false, error: (err as Error).message };
    }
  }, [piecesRaw, sheetW, sheetH, plateKerf]);

  const totalRequired = linearResult.ok
    ? linearResult.plan.cut_plan.reduce(
        (s, p) => s + p.cuts.reduce((a, c) => a + c, 0),
        0,
      )
    : 0;

  return (
    <>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <Chip>CUT PLAN</Chip>
          <div className="pl-page-title">{modelName}</div>
          <Pill variant="info">linearCut · FFD</Pill>
          <Pill variant="approved" dot>preview</Pill>
          <div className="pl-page-actions">
            <Btn ico="download" variant="ghost">Export</Btn>
            <Btn ico="refresh" variant="primary">Re-solve</Btn>
          </div>
        </div>
        <div className="pl-page-sub">
          Pure-TS algorithms in <span className="mono">lib/cutting/&#123;linear,plate&#125;.ts</span>. Edit inputs on the right to recompute.
        </div>
      </div>

      {/* Stats strip */}
      <div className="pl-meta" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        <Stat label="Total required" value={`${totalRequired.toFixed(2)} m`} sub={linearResult.ok ? `${linearResult.plan.cut_plan.reduce((s, p) => s + p.cuts.length, 0)} cuts` : "—"} />
        <Stat
          label="Stock pieces"
          value={linearResult.ok ? Object.entries(linearResult.plan.stock_qty_by_length).map(([l, q]) => `${q}×${l}m`).join(" + ") : "—"}
          mono
        />
        <Stat
          label="Purchase length"
          value={linearResult.ok ? `${linearResult.plan.total_purchase_length.toFixed(2)} m` : "—"}
          sub={`kerf ${kerf} mm`}
        />
        <Stat
          label="Total waste"
          value={linearResult.ok ? `${linearResult.plan.total_waste.toFixed(2)} m` : "—"}
          warn
        />
        <Stat
          label="Reusable offcuts"
          value={linearResult.ok ? `${linearResult.plan.reusable_offcuts.reduce((s, n) => s + n, 0).toFixed(2)} m` : "—"}
        />
        <Stat
          label="Utilization"
          value={
            linearResult.ok && linearResult.plan.total_purchase_length > 0
              ? `${((totalRequired / linearResult.plan.total_purchase_length) * 100).toFixed(1)}%`
              : "—"
          }
        />
      </div>

      <div className="pl-scroll" style={{ display: "grid", gridTemplateColumns: "1fr 380px", alignItems: "flex-start", minHeight: 0 }}>
        <div style={{ padding: "18px 24px 24px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Seg
              items={["Linear · cable", "Plate · grating", "Picking list", "Raw inputs"]}
              active={
                mode === "linear"
                  ? "Linear · cable"
                  : mode === "plate"
                    ? "Plate · grating"
                    : mode === "picking"
                      ? "Picking list"
                      : "Raw inputs"
              }
            />
            <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-4)" }}>
              algorithm <span className="mono">First-Fit Decreasing</span> · kerf{" "}
              <span className="mono">{kerf} mm</span>
            </span>
          </div>
          {/* Mode buttons (Seg is read-only visual) */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {[
              ["linear", "Linear"],
              ["plate", "Plate"],
              ["picking", "Picking"],
              ["raw", "Raw"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key as Mode)}
                className={"pl-btn sm" + (mode === key ? " primary" : "")}
              >
                {label}
              </button>
            ))}
          </div>

          {mode === "linear" && (
            <div className="pl-card" style={{ padding: 18, marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Linear cut plan</span>
                <span className="mono tnum" style={{ fontSize: 11, color: "var(--ink-4)" }}>
                  {linearResult.ok ? linearResult.plan.cut_plan.length : 0} stock pieces ·{" "}
                  {linearResult.ok
                    ? linearResult.plan.cut_plan.reduce((s, p) => s + p.cuts.length, 0)
                    : 0}{" "}
                  cuts placed
                </span>
                <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, fontSize: 10.5, color: "var(--ink-4)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 10, height: 10, background: "#1E40AF", borderRadius: 1 }} />cut
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 10, height: 10, background: "#0F766E", borderRadius: 1 }} />reusable
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        background: "repeating-linear-gradient(45deg, #FACC15 0 4px, #fff 4px 8px)",
                        borderRadius: 1,
                        border: "1px solid #F1C20E",
                      }}
                    />
                    waste
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 1, height: 12, background: "#475569" }} />kerf
                  </span>
                </span>
              </div>
              {!linearResult.ok ? (
                <div style={{ padding: 16, fontSize: 12, color: "var(--danger)" }}>{linearResult.error}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {linearResult.plan.cut_plan.map((p, i) => {
                    const reusable = minReusable > 0 && p.offcut >= minReusable;
                    return (
                      <LinearStock
                        key={i}
                        idx={i + 1}
                        stockLength={p.stock_length}
                        cuts={p.cuts}
                        offcut={p.offcut}
                        kerfMm={kerf}
                        reusable={reusable}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {mode === "plate" && (
            <div className="pl-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Plate cut plan</span>
                <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
                  {sheetW}×{sheetH}, kerf {plateKerf} mm
                </span>
                <span className="mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-4)" }}>
                  shelf packing · longest-fit
                </span>
              </div>
              {!plateResult.ok ? (
                <div style={{ padding: 16, fontSize: 12, color: "var(--danger)" }}>{plateResult.error}</div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {plateResult.plan.placement_map.map((sheet) => {
                      // Compute per-sheet utilization
                      const usedArea = sheet.pieces.reduce((s, p) => s + p.w * p.h, 0);
                      const utilization = (usedArea / (sheetW * sheetH)) * 100;
                      return (
                        <PlateSheet
                          key={sheet.sheet_index}
                          idx={sheet.sheet_index + 1}
                          pieces={sheet.pieces}
                          sheetW={sheetW}
                          sheetH={sheetH}
                          utilizationPct={utilization}
                        />
                      );
                    })}
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      padding: "8px 12px",
                      background: "var(--success-soft)",
                      border: "1px solid #BFDDD8",
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 12,
                      color: "var(--success)",
                    }}
                  >
                    <Icon name="check" size={13} />
                    {plateResult.plan.sheet_qty} sheets ·{" "}
                    <span className="mono tnum" style={{ fontWeight: 600 }}>
                      {(plateResult.plan.total_waste_area / 1_000_000).toFixed(2)} m²
                    </span>{" "}
                    waste · {plateResult.plan.utilization_pct.toFixed(1)}% utilization
                  </div>
                </>
              )}
            </div>
          )}

          {mode === "picking" && linearResult.ok && (
            <div className="pl-card" style={{ padding: 0 }}>
              <div className="pl-card-head">
                <Icon name="list" />
                <span className="pl-card-title">Picking list — cut instructions</span>
                <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-4)" }}>
                  storeman sees these as fabrication steps
                </span>
              </div>
              {linearResult.plan.cut_plan.map((p, i) => {
                const reusable = minReusable > 0 && p.offcut >= minReusable;
                return (
                  <div
                    key={i}
                    style={{
                      padding: "12px 20px",
                      borderBottom: i < linearResult.plan.cut_plan.length - 1 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Chip>roll {i + 1}</Chip>
                      <span className="mono tnum" style={{ fontWeight: 500 }}>
                        {p.stock_length} m
                      </span>
                      <span style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--ink-5)" }}>
                        cut order: longest first
                      </span>
                    </div>
                    <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                      {p.cuts.map((c, ci) => (
                        <li
                          key={ci}
                          className="mono"
                          style={{ fontSize: 11.5, color: "var(--ink-2)", display: "flex", alignItems: "center", gap: 8 }}
                        >
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              borderRadius: 8,
                              background: "var(--primary-soft)",
                              color: "var(--primary)",
                              display: "grid",
                              placeItems: "center",
                              fontSize: 10,
                              fontWeight: 600,
                            }}
                          >
                            {ci + 1}
                          </span>
                          {c.toFixed(2)} m
                        </li>
                      ))}
                    </ol>
                    {p.offcut > 0 && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 11,
                          color: reusable ? "var(--success)" : "var(--ink-4)",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Icon name={reusable ? "check" : "x"} size={11} />
                        offcut <span className="mono tnum">{p.offcut.toFixed(2)} m</span>
                        {reusable ? " → bin (reusable)" : " → scrap"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {mode === "raw" && (
            <div className="pl-card" style={{ padding: 18 }}>
              <div className="pl-card-title" style={{ marginBottom: 8 }}>Raw inputs / outputs</div>
              <pre
                className="mono"
                style={{
                  fontSize: 11,
                  background: "var(--surface-2)",
                  padding: 14,
                  borderRadius: 6,
                  overflow: "auto",
                  maxHeight: 500,
                }}
              >
                {JSON.stringify(linearResult.ok ? linearResult.plan : linearResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right side: inputs */}
        <aside
          style={{
            borderLeft: "1px solid var(--line)",
            background: "var(--surface)",
            position: "sticky",
            top: 0,
            alignSelf: "flex-start",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minHeight: "calc(100vh - 56px - 100px)",
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500, marginBottom: 4 }}>
              {mode === "plate" ? "Plate inputs" : "Linear inputs"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Edit and re-compute live</div>
          </div>

          {mode !== "plate" && (
            <>
              <div>
                <label className="pl-label">Required cuts (m, comma-separated)</label>
                <textarea
                  className="pl-input mono"
                  style={{ width: "100%", minHeight: 64, padding: 8, fontSize: 12 }}
                  value={requiredCutsRaw}
                  onChange={(e) => setRequiredCutsRaw(e.target.value)}
                />
              </div>
              <div>
                <label className="pl-label">Stock lengths available (m)</label>
                <input
                  className="pl-input mono"
                  style={{ width: "100%" }}
                  value={stockLengthsRaw}
                  onChange={(e) => setStockLengthsRaw(e.target.value)}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <label className="pl-label">Kerf (mm)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    className="pl-input num-input"
                    style={{ width: "100%" }}
                    value={kerf}
                    onChange={(e) => setKerf(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="pl-label">Min reusable (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="pl-input num-input"
                    style={{ width: "100%" }}
                    value={minReusable}
                    onChange={(e) => setMinReusable(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}

          {mode === "plate" && (
            <>
              <div>
                <label className="pl-label">Pieces (JSON array)</label>
                <textarea
                  className="pl-input mono"
                  style={{ width: "100%", minHeight: 140, padding: 8, fontSize: 11.5 }}
                  value={piecesRaw}
                  onChange={(e) => setPiecesRaw(e.target.value)}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div>
                  <label className="pl-label">Sheet W</label>
                  <input
                    type="number"
                    className="pl-input num-input"
                    style={{ width: "100%" }}
                    value={sheetW}
                    onChange={(e) => setSheetW(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="pl-label">Sheet H</label>
                  <input
                    type="number"
                    className="pl-input num-input"
                    style={{ width: "100%" }}
                    value={sheetH}
                    onChange={(e) => setSheetH(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="pl-label">Kerf</label>
                  <input
                    type="number"
                    className="pl-input num-input"
                    style={{ width: "100%" }}
                    value={plateKerf}
                    onChange={(e) => setPlateKerf(Number(e.target.value))}
                  />
                </div>
              </div>
            </>
          )}

          <div
            style={{
              padding: 12,
              background: "var(--primary-soft)",
              border: "1px solid var(--primary-line)",
              borderRadius: 4,
              fontSize: 11.5,
              color: "var(--ink-3)",
              marginTop: "auto",
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--primary)", marginBottom: 4 }}>How this works</div>
            Linear uses FFD bin-packing from <span className="mono">lib/cutting/linear.ts</span>. Plate uses shelf packing from <span className="mono">lib/cutting/plate.ts</span>. Both pure-TS, no external dep. 18 unit tests pass.
          </div>
        </aside>
      </div>
    </>
  );
}

function Stat({ label, value, sub, warn, mono }: { label: string; value: string; sub?: string; warn?: boolean; mono?: boolean }) {
  return (
    <div className="pl-meta-cell">
      <div className="pl-meta-label">{label}</div>
      <div
        className={mono !== false ? "pl-meta-value mono tnum" : "pl-meta-value"}
        style={{ fontSize: 15, color: warn ? "var(--hivis-ink)" : "var(--ink)" }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 10.5, color: "var(--ink-5)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
