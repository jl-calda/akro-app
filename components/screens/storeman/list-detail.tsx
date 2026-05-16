"use client";

import { useState } from "react";
import { Chip, Pill, ProgressBar } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { MaterialCard } from "@/components/mobile/material-card";
import { IssueBottomSheet } from "@/components/mobile/issue-bottom-sheet";
import { issueStock } from "@/app/(mobile)/storeman/list/[listId]/actions";

export type PickLine = {
  id: string;
  materialId: string;
  code: string;
  name: string;
  emoji: string | null;
  unit: string;
  mtoQty: number;
  issuedQty: number;
  locations: { id: string; name: string; balance: number }[];
};

export function StoremanListDetail({
  projectId,
  projectCode,
  projectName,
  state,
  lines,
}: {
  projectId: string;
  projectCode: string | null;
  projectName: string;
  state: string;
  lines: PickLine[];
}) {
  const [selectedLine, setSelectedLine] = useState<PickLine | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const issuedTotal = lines.filter((l) => l.issuedQty >= l.mtoQty).length;
  const totalLines = lines.length;

  async function handleIssue(qty: number, locationId: string) {
    if (!selectedLine) return;
    const fd = new FormData();
    fd.set("projectId", projectId);
    fd.set("mtoLineId", selectedLine.id);
    fd.set("materialId", selectedLine.materialId);
    fd.set("locationId", locationId);
    fd.set("qty", String(qty));
    await issueStock(fd);
    setToast(`Issued ${qty} ${selectedLine.unit} of ${selectedLine.code}`);
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <>
      <div className="pl-mobile-header">
        <a href="/storeman" className="pl-mobile-back" aria-label="Back">
          <Icon name="chevL" size={16} />
        </a>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            {projectCode && <Chip>{projectCode}</Chip>}
            <Pill variant={state === "approved" ? "approved" : "draft"} dot>
              {state.replace(/_/g, " ")}
            </Pill>
          </div>
          <h1 style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {projectName}
          </h1>
        </div>
      </div>

      <div style={{ padding: "12px 16px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <span
            style={{
              fontSize: 11,
              color: "var(--ink-4)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              fontWeight: 500,
            }}
          >
            Progress
          </span>
          <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600 }}>
            {issuedTotal} / {totalLines}{" "}
            <span style={{ color: "var(--ink-4)", fontWeight: 400 }}>lines</span>
          </span>
        </div>
        <ProgressBar value={issuedTotal} max={totalLines || 1} />
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "10px 14px 100px" }}>
        {lines.length === 0 ? (
          <div
            style={{
              padding: 28,
              textAlign: "center",
              color: "var(--ink-4)",
              fontSize: 13,
            }}
          >
            No MTO lines on this project. The PM may not have submitted the MTO yet, or it hasn&apos;t been approved.
          </div>
        ) : (
          lines.map((l) => (
            <MaterialCard
              key={l.id}
              emoji={l.emoji}
              code={l.code}
              name={l.name}
              stockLabel={
                l.locations.length > 0
                  ? `${l.locations[0].balance} ${l.unit} · ${l.locations[0].name}`
                  : "no stock"
              }
              mtoQty={l.mtoQty}
              issuedQty={l.issuedQty}
              unit={l.unit}
              done={l.issuedQty >= l.mtoQty}
              low={l.locations.reduce((s, x) => s + x.balance, 0) < l.mtoQty - l.issuedQty}
              onClick={() => setSelectedLine(l)}
            />
          ))
        )}
      </div>

      {toast && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 16,
            right: 16,
            padding: "10px 12px",
            background: "var(--ink)",
            color: "#fff",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
            zIndex: 40,
            fontSize: 12,
            opacity: 0.95,
          }}
        >
          <Icon name="check" size={14} style={{ color: "var(--success)" }} />
          <div style={{ flex: 1 }}>{toast}</div>
        </div>
      )}

      <IssueBottomSheet
        open={selectedLine !== null}
        onClose={() => setSelectedLine(null)}
        materialCode={selectedLine?.code ?? ""}
        materialName={selectedLine?.name ?? ""}
        unit={selectedLine?.unit ?? ""}
        mtoQty={selectedLine?.mtoQty ?? 0}
        issuedQty={selectedLine?.issuedQty ?? 0}
        locations={selectedLine?.locations ?? []}
        onConfirm={handleIssue}
      />
    </>
  );
}
