"use client";

import { useState } from "react";
import { Btn, Chip } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { QtySpinner } from "./qty-spinner";

export function IssueBottomSheet({
  open,
  onClose,
  materialCode,
  materialName,
  unit,
  mtoQty,
  issuedQty,
  locations,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  materialCode: string;
  materialName: string;
  unit: string;
  mtoQty: number;
  issuedQty: number;
  locations: { id: string; name: string; balance: number }[];
  onConfirm: (qty: number, locationId: string) => Promise<void> | void;
}) {
  const remaining = Math.max(0, mtoQty - issuedQty);
  const [qty, setQty] = useState<number>(remaining);
  const [locationId, setLocationId] = useState<string>(locations[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);
  const selectedLoc = locations.find((l) => l.id === locationId);

  if (!open) return null;

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirm(qty, locationId);
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(11,18,32,0.45)",
          zIndex: 30,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--surface)",
          borderRadius: "16px 16px 0 0",
          padding: 18,
          zIndex: 31,
          boxShadow: "0 -10px 30px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            background: "var(--line-2)",
            borderRadius: 2,
            margin: "0 auto 14px",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Chip>{materialCode}</Chip>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>Issue stock</span>
          <button
            onClick={onClose}
            style={{
              marginLeft: "auto",
              background: "transparent",
              border: "none",
              color: "var(--ink-5)",
              cursor: "pointer",
            }}
          >
            <Icon name="x" />
          </button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 14 }}>
          {materialName}
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="pl-label" style={{ marginBottom: 8 }}>
            Quantity to issue
          </div>
          <QtySpinner
            value={qty}
            onChange={setQty}
            step={1}
            min={0}
            max={selectedLoc?.balance ?? undefined}
            unit={unit}
          />
          <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 6 }}>
            MTO requires <span className="mono tnum">{mtoQty}</span> · already issued{" "}
            <span className="mono tnum">{issuedQty}</span> · remaining{" "}
            <span className="mono tnum">{remaining}</span>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div className="pl-label" style={{ marginBottom: 8 }}>
            From location
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {locations.length === 0 ? (
              <div
                style={{
                  padding: 12,
                  background: "var(--hivis-soft)",
                  border: "1px solid var(--hivis-line)",
                  borderRadius: 6,
                  fontSize: 12,
                  color: "var(--hivis-ink)",
                }}
              >
                No stock at any location — record a receipt first.
              </div>
            ) : (
              locations.map((l) => {
                const insufficient = l.balance < qty;
                return (
                  <button
                    key={l.id}
                    onClick={() => setLocationId(l.id)}
                    style={{
                      padding: 12,
                      background: locationId === l.id ? "var(--primary-soft)" : "var(--surface)",
                      border: "1px solid " + (locationId === l.id ? "var(--primary-line)" : "var(--line)"),
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{l.name}</div>
                      <div
                        style={{
                          fontSize: 11,
                          color: insufficient ? "var(--hivis-ink)" : "var(--ink-4)",
                        }}
                      >
                        balance{" "}
                        <span className="mono tnum" style={{ fontWeight: 600 }}>
                          {l.balance}
                        </span>{" "}
                        {unit}
                        {insufficient && " · insufficient"}
                      </div>
                    </div>
                    {locationId === l.id && (
                      <span
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          background: "var(--primary)",
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Icon name="check" size={11} />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>
            Cancel
          </Btn>
          <Btn
            variant="primary"
            ico="check"
            onClick={handleConfirm}
            style={{ flex: 2, justifyContent: "center", height: 44 }}
          >
            {submitting ? "Issuing…" : `Issue ${qty} ${unit}`}
          </Btn>
        </div>
      </div>
    </>
  );
}
