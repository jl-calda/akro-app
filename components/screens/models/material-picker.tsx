"use client";

import { useState, useMemo } from "react";
import { Chip } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export type MaterialOption = {
  id: string;
  versionId: string;
  code: string;
  name: string;
  emoji: string | null;
  unit: string;
  category: string | null;
  supplier: string | null;
};

export function MaterialPicker({
  materials,
  selectedId,
  onPick,
}: {
  materials: MaterialOption[];
  selectedId: string;
  onPick: (m: MaterialOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selected = materials.find((m) => m.id === selectedId);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return materials.slice(0, 30);
    return materials
      .filter(
        (m) =>
          m.code.toLowerCase().includes(needle) ||
          m.name.toLowerCase().includes(needle) ||
          (m.category ?? "").toLowerCase().includes(needle) ||
          (m.supplier ?? "").toLowerCase().includes(needle),
      )
      .slice(0, 30);
  }, [materials, q]);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pl-input"
        style={{
          width: "100%",
          minHeight: 38,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 10px",
          textAlign: "left",
        }}
      >
        {selected ? (
          <>
            <span className="pl-thumb" style={{ width: 28, height: 28, fontSize: 14 }}>
              {selected.emoji ?? "📦"}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 12, fontWeight: 500 }}>{selected.name}</span>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)" }}>
                {selected.code}
              </span>
            </span>
          </>
        ) : (
          <span style={{ color: "var(--ink-4)" }}>Pick a material…</span>
        )}
        <Icon name="chev" size={12} style={{ color: "var(--ink-4)" }} />
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 50 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 51,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 6,
              boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
              maxHeight: 360,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "8px 10px", borderBottom: "1px solid var(--line)" }}>
              <div className="pl-search" style={{ width: "100%", height: 32 }}>
                <Icon name="search" size={13} />
                <input
                  autoFocus
                  placeholder="Search code, name, category, supplier…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    outline: "none",
                    width: "100%",
                    fontSize: 12.5,
                  }}
                />
              </div>
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {filtered.length === 0 ? (
                <div style={{ padding: 18, fontSize: 12, color: "var(--ink-4)", textAlign: "center" }}>
                  No matches.
                </div>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onPick(m);
                      setOpen(false);
                      setQ("");
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      background: m.id === selectedId ? "var(--primary-soft)" : "transparent",
                      border: "none",
                      borderBottom: "1px solid var(--line)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span className="pl-thumb" style={{ width: 26, height: 26, fontSize: 13 }}>
                      {m.emoji ?? "📦"}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 12.5, fontWeight: 500 }}>{m.name}</span>
                      <span style={{ fontSize: 11, color: "var(--ink-4)" }} className="mono">
                        {m.code} · {m.category ?? "—"}
                      </span>
                    </span>
                    <Chip>{m.unit}</Chip>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
