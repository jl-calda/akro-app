"use client";

import { useState } from "react";
import { Btn, Chip, HiVis, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { QtySpinner } from "@/components/mobile/qty-spinner";
import { confirmHandover } from "@/app/(mobile)/foreman/confirm/[ticketId]/actions";

export function ConfirmForm({
  ticketId,
  qrToken,
  issuedQty,
  unit,
  materialCode,
  materialName,
  materialEmoji,
  projectName,
  projectCode,
}: {
  ticketId: string;
  qrToken: string;
  issuedQty: number;
  unit: string;
  materialCode: string;
  materialName: string;
  materialEmoji: string | null;
  projectName: string;
  projectCode: string | null;
}) {
  const [qty, setQty] = useState<number>(issuedQty);
  const [notes, setNotes] = useState<string>("");
  const discrepancy = Math.abs(qty - issuedQty) > 0.0001;

  return (
    <>
      <div style={{ padding: "12px 16px 14px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          {projectCode && <Chip>{projectCode}</Chip>}
          <Pill variant="info">handover</Pill>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{projectName}</div>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>
          ticket {qrToken.slice(0, 12)}…
        </div>
      </div>

      <form
        action={confirmHandover}
        style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 16px 100px", gap: 14 }}
      >
        <input type="hidden" name="ticketId" value={ticketId} />

        <div
          style={{
            padding: 14,
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div className="pl-thumb" style={{ width: 34, height: 34, fontSize: 18 }}>
              {materialEmoji ?? "📦"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{materialCode}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{materialName}</div>
            </div>
          </div>

          <div className="pl-label" style={{ marginBottom: 6 }}>Confirm quantity received</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <QtySpinner value={qty} onChange={setQty} step={1} min={0} unit={unit} />
            <input type="hidden" name="confirmed_qty" value={qty} />
            <div style={{ flex: 1, fontSize: 11.5, color: "var(--ink-4)" }}>
              Storeman issued{" "}
              <span className="mono tnum" style={{ fontWeight: 600 }}>
                {issuedQty}
              </span>{" "}
              {unit}
            </div>
          </div>

          {discrepancy && (
            <div
              style={{
                marginTop: 10,
                padding: "10px 12px",
                background: "var(--hivis-soft)",
                border: "1px solid var(--hivis-line)",
                borderRadius: 6,
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <Icon name="warn" size={13} style={{ color: "var(--hivis-ink)", marginTop: 2 }} />
              <div style={{ fontSize: 11.5, color: "var(--hivis-ink)", lineHeight: 1.5 }}>
                Discrepancy: confirmed{" "}
                <span className="mono tnum" style={{ fontWeight: 600 }}>
                  {qty}
                </span>{" "}
                vs issued{" "}
                <span className="mono tnum" style={{ fontWeight: 600 }}>
                  {issuedQty}
                </span>
                . Add a note below — this will be logged for admin audit.
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="pl-label">Notes (optional)</div>
          <textarea
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="pl-input"
            style={{ width: "100%", minHeight: 80, padding: 10, fontSize: 12.5 }}
            placeholder="Damage, missing items, packaging…"
          />
        </div>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          <Btn
            variant="primary"
            ico="check"
            type="submit"
            style={{ width: "100%", justifyContent: "center", height: 44, fontSize: 14 }}
          >
            Confirm receipt
          </Btn>
          {discrepancy && (
            <div style={{ textAlign: "center" }}>
              <HiVis>discrepancy will be logged</HiVis>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
