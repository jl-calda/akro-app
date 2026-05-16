"use client";

import { useState } from "react";
import clsx from "clsx";
import { Btn, Chip, Pill, PhaseStack } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { FlagList } from "./flag-list";

type Tab = "summary" | "full" | "flags" | "diff" | "comments";

type Flag = { tone: "crit" | "warn" | "info"; label: string; detail: string };

export function ApprovalTabs({
  projectId,
  projectName,
  projectCode,
  client,
  location,
  pmEmail,
  submittedAt,
  state,
  mtoLines,
  totalMaterialCost,
  totalLabourCost,
  totalLines,
  approveAction,
  rejectAction,
}: {
  projectId: string;
  projectName: string;
  projectCode: string | null;
  client: string | null;
  location: string | null;
  pmEmail: string | null;
  submittedAt: string | null;
  state: string;
  mtoLines: Array<{
    id: string;
    quantity: number;
    unit_cost: number;
    unit: string;
    code: string | null;
    name: string | null;
    emoji: string | null;
    is_overridden: boolean;
  }>;
  totalMaterialCost: number;
  totalLabourCost: number;
  totalLines: number;
  approveAction: (fd: FormData) => Promise<void>;
  rejectAction: (fd: FormData) => Promise<void>;
}) {
  const [tab, setTab] = useState<Tab>("summary");
  const total = totalMaterialCost + totalLabourCost;
  const topLines = mtoLines
    .slice()
    .sort((a, b) => b.quantity * b.unit_cost - a.quantity * a.unit_cost)
    .slice(0, 8);

  // Synthetic flags from the data
  const flags: Flag[] = [];
  const overrides = mtoLines.filter((l) => l.is_overridden);
  if (overrides.length > 0) {
    flags.push({
      tone: "warn",
      label: `${overrides.length} line${overrides.length === 1 ? "" : "s"} overridden`,
      detail: `${overrides.map((l) => l.code ?? l.name).join(", ")} were adjusted manually after rule computation.`,
    });
  }
  if (mtoLines.length === 0) {
    flags.push({
      tone: "crit",
      label: "No MTO lines",
      detail: "This project has no MTO lines yet. Approving will issue an empty bill of quantities.",
    });
  }
  if (state === "modified_after_approval") {
    flags.push({
      tone: "crit",
      label: "Modified after approval",
      detail: "The PM edited this MTO post-approval. The storeman will see the new totals on re-issue.",
    });
  }

  return (
    <>
      <div className="pl-tabs">
        {(["summary", "full", "flags", "diff", "comments"] as Tab[]).map((t) => (
          <div
            key={t}
            onClick={() => setTab(t)}
            className={clsx("pl-tab", tab === t && "is-active")}
            style={{ cursor: "pointer" }}
          >
            {t === "summary"
              ? "Summary"
              : t === "full"
                ? "Full MTO"
                : t === "flags"
                  ? "Flags"
                  : t === "diff"
                    ? "Diff from last approved"
                    : "Comments"}
            {t === "full" && <span className="pl-tab-count">{totalLines}</span>}
            {t === "flags" && flags.length > 0 && <span className="pl-tab-count">{flags.length}</span>}
          </div>
        ))}
      </div>

      <div className="pl-scroll" style={{ padding: "18px 24px 96px" }}>
        {tab === "summary" && (
          <>
            {/* Two-col hero */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginBottom: 14 }}>
              <div className="pl-card">
                <div className="pl-card-head"><div className="pl-card-title">Project details</div></div>
                <div className="pl-meta" style={{ gridTemplateColumns: "repeat(3, 1fr)", borderTop: "none" }}>
                  <Cell label="Client" value={client ?? "—"} />
                  <Cell label="Location" value={location ?? "—"} />
                  <Cell label="Project Manager" value={pmEmail ?? "—"} />
                  <Cell label="Project code" value={projectCode ?? "—"} mono />
                  <Cell label="Submitted" value={submittedAt ? new Date(submittedAt).toLocaleString() : "—"} mono />
                  <Cell label="State" value={state.replace(/_/g, " ")} />
                </div>
              </div>
              <div className="pl-card">
                <div className="pl-card-head">
                  <div className="pl-card-title">Costs</div>
                  <span style={{ marginLeft: "auto" }}><Pill variant="info">total</Pill></span>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <CostRow label="Materials" value={totalMaterialCost} color="var(--primary)" />
                  <CostRow label="Labour" value={totalLabourCost} color="var(--labour-ink)" />
                  <div style={{ height: 1, background: "var(--line)", margin: "10px 0" }} />
                  <CostRow label="Project total" value={total} bold large />
                  {total > 0 && (
                    <>
                      <span className="pl-stack" style={{ marginTop: 12 }}>
                        <span style={{ width: `${(totalMaterialCost / total) * 100}%`, background: "var(--primary)" }} />
                        <span style={{ width: `${(totalLabourCost / total) * 100}%`, background: "var(--labour-ink)" }} />
                      </span>
                      <div style={{ marginTop: 6, fontSize: 11, color: "var(--ink-4)", display: "flex", justifyContent: "space-between" }}>
                        <span>
                          <span style={{ width: 6, height: 6, background: "var(--primary)", display: "inline-block", marginRight: 4 }} />
                          Materials <span className="mono tnum">{((totalMaterialCost / total) * 100).toFixed(0)}%</span>
                        </span>
                        <span>
                          <span style={{ width: 6, height: 6, background: "var(--labour-ink)", display: "inline-block", marginRight: 4 }} />
                          Labour <span className="mono tnum">{((totalLabourCost / total) * 100).toFixed(0)}%</span>
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Flags inline */}
            {flags.length > 0 && (
              <div className="pl-card" style={{ marginBottom: 14 }}>
                <div className="pl-card-head">
                  <Icon name="warn" size={14} style={{ color: "var(--hivis-ink)" }} />
                  <div className="pl-card-title">Flags · {flags.length}</div>
                  <span style={{ fontSize: 11, color: "var(--ink-4)" }}>auto-detected · review before approval</span>
                </div>
                <FlagList flags={flags} />
              </div>
            )}

            {/* Top contributors */}
            <div className="pl-card">
              <div className="pl-card-head">
                <div className="pl-card-title">MTO preview · top contributors</div>
                <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-4)" }}>
                  {topLines.length} of {totalLines} lines · switch to Full MTO for all
                </span>
              </div>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}></th>
                    <th style={{ width: 130 }}>SKU</th>
                    <th>Material</th>
                    <th className="num" style={{ width: 80 }}>Qty</th>
                    <th className="num" style={{ width: 100 }}>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {topLines.map((l) => (
                    <tr key={l.id}>
                      <td><div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 13 }}>{l.emoji ?? "📦"}</div></td>
                      <td className="mono" style={{ color: "var(--ink-3)" }}>{l.code ?? "—"}</td>
                      <td><span style={{ fontWeight: 500 }}>{l.name ?? "—"}</span> {l.is_overridden && <Pill variant="modified">override</Pill>}</td>
                      <td className="num mono">{l.quantity.toLocaleString()} <span className="unit">{l.unit}</span></td>
                      <td className="num mono" style={{ fontWeight: 600 }}>${(l.quantity * l.unit_cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "full" && (
          <div className="pl-card">
            <table className="pl-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}></th>
                  <th style={{ width: 140 }}>SKU</th>
                  <th>Material</th>
                  <th className="num">Qty</th>
                  <th className="num">Unit cost</th>
                  <th className="num">Line total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {mtoLines.map((l) => (
                  <tr key={l.id}>
                    <td><div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 13 }}>{l.emoji ?? "📦"}</div></td>
                    <td className="mono" style={{ color: "var(--ink-3)" }}>{l.code ?? "—"}</td>
                    <td><span style={{ fontWeight: 500 }}>{l.name ?? "—"}</span></td>
                    <td className="num mono">{l.quantity.toLocaleString()} <span className="unit">{l.unit}</span></td>
                    <td className="num mono">${l.unit_cost.toFixed(2)}</td>
                    <td className="num mono" style={{ fontWeight: 600 }}>${(l.quantity * l.unit_cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    <td>{l.is_overridden && <Pill variant="modified">override</Pill>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "flags" && (
          <div className="pl-card">
            <FlagList flags={flags} />
          </div>
        )}

        {tab === "diff" && (
          <div className="pl-card" style={{ padding: 20 }}>
            <div className="pl-card-title">Diff from last approved</div>
            <div style={{ marginTop: 10, fontSize: 12.5, color: "var(--ink-4)" }}>
              {state === "modified_after_approval" ? (
                <span>This MTO has been edited since approval. A line-by-line diff against the last snapshot ships in a follow-up batch.</span>
              ) : (
                <span>No previous approved version to diff against — this is the first approval.</span>
              )}
            </div>
          </div>
        )}

        {tab === "comments" && (
          <div className="pl-card" style={{ padding: 20 }}>
            <div className="pl-card-title">Comments</div>
            <div style={{ marginTop: 10, fontSize: 12.5, color: "var(--ink-4)" }}>
              Inline-comment thread on MTO lines ships in a follow-up.
            </div>
          </div>
        )}
      </div>

      {state === "pending_approval" && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "var(--surface)",
            borderTop: "1px solid var(--line-2)",
            padding: "12px 24px",
            display: "flex",
            gap: 8,
            alignItems: "center",
            boxShadow: "0 -8px 24px rgba(15,23,42,0.05)",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--ink-4)", marginRight: "auto" }}>
            Approving makes the MTO visible to the storeman immediately.
          </div>
          <form action={rejectAction} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="hidden" name="projectId" value={projectId} />
            <input
              name="reason"
              placeholder="Rejection reason (optional)"
              className="pl-input"
              style={{ width: 220, height: 30 }}
            />
            <Btn variant="danger" type="submit">Reject</Btn>
          </form>
          <form action={approveAction}>
            <input type="hidden" name="projectId" value={projectId} />
            <Btn variant="primary" ico="check" type="submit">
              Approve MTO
            </Btn>
          </form>
        </div>
      )}
    </>
  );
}

function Cell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="pl-meta-cell">
      <div className="pl-meta-label">{label}</div>
      <div className={"pl-meta-value" + (mono ? " mono" : "")} style={{ fontSize: 13 }}>{value}</div>
    </div>
  );
}

function CostRow({ label, value, color, sub, bold, large }: { label: string; value: number; color?: string; sub?: string; bold?: boolean; large?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
      {color && <span style={{ width: 8, height: 8, background: color, borderRadius: 2 }} />}
      <span style={{ fontSize: large ? 14 : 12.5, fontWeight: bold ? 700 : 500 }}>{label}</span>
      {sub && <span style={{ fontSize: 11, color: "var(--ink-5)" }}>· {sub}</span>}
      <span
        className="mono tnum"
        style={{ marginLeft: "auto", fontSize: large ? 18 : 13, fontWeight: bold ? 700 : 500 }}
      >
        ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}
