"use client";

import { useState } from "react";
import { Btn, NumInput } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createMaterial } from "@/app/(app)/catalog/materials/actions";

type Option = { id: string; label: string };
type CategoryOption = Option & { parameter_definitions?: { key: string; label: string; type: string }[] };

const EMOJIS = ["🪢", "⚓", "🔩", "📐", "🛡️", "🧷", "🔧", "🥾", "⛓️", "🧪", "🪛", "🪜"];

export function NewMaterialButton({
  categories,
  suppliers,
}: {
  categories: CategoryOption[];
  suppliers: Option[];
}) {
  const [open, setOpen] = useState(false);
  const [emoji, setEmoji] = useState<string>("🪢");

  return (
    <>
      <Btn variant="primary" ico="plus" onClick={() => setOpen(true)}>
        New material
      </Btn>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(11, 18, 32, 0.45)",
            display: "grid",
            placeItems: "center",
            zIndex: 100,
            padding: 24,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              width: 720,
              maxWidth: "100%",
              background: "var(--surface)",
              borderRadius: 8,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)",
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "16px 20px 14px",
                borderBottom: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span className="pl-chip">NEW</span>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Add material</div>
              <button
                style={{
                  marginLeft: "auto",
                  background: "transparent",
                  border: "none",
                  color: "var(--ink-5)",
                  cursor: "pointer",
                }}
                onClick={() => setOpen(false)}
              >
                <Icon name="x" />
              </button>
            </div>

            <form
              action={createMaterial}
              style={{
                padding: 18,
                display: "grid",
                gridTemplateColumns: "160px 1fr",
                gap: 18,
                overflowY: "auto",
              }}
            >
              <div>
                <div className="pl-label">Thumbnail</div>
                <input type="hidden" name="emoji" value={emoji} />
                <div
                  style={{
                    width: 140,
                    height: 140,
                    border: "1px dashed var(--line-2)",
                    borderRadius: 6,
                    display: "grid",
                    placeItems: "center",
                    background: "var(--surface-2)",
                  }}
                >
                  <div style={{ fontSize: 64, lineHeight: 1 }}>{emoji}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, marginTop: 8 }}>
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className="pl-btn sm"
                      style={{
                        padding: 0,
                        height: 24,
                        fontSize: 14,
                        background: emoji === e ? "var(--primary-soft)" : undefined,
                        borderColor: emoji === e ? "var(--primary-line)" : undefined,
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <div className="pl-label">Name</div>
                  <input
                    name="name"
                    required
                    placeholder="Cable, 7×19 SS316, ⌀8 mm"
                    className="pl-input"
                    style={{ width: "100%", height: 34 }}
                  />
                </div>
                <div>
                  <div className="pl-label">SKU code</div>
                  <input
                    name="code"
                    required
                    placeholder="CBL-SS-08-100"
                    className="pl-input mono"
                    style={{ width: "100%", height: 34 }}
                  />
                </div>
                <div>
                  <div className="pl-label">Supplier</div>
                  <select name="supplier_id" className="pl-input" style={{ width: "100%", height: 34 }}>
                    <option value="">— none —</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="pl-label">Category</div>
                  <select name="category_id" className="pl-input" style={{ width: "100%", height: 34 }}>
                    <option value="">— none —</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="pl-label">Unit</div>
                  <select name="unit" className="pl-input" style={{ width: "100%", height: 34 }}>
                    <option value="pcs">pcs</option>
                    <option value="m">m</option>
                    <option value="kg">kg</option>
                    <option value="kit">kit</option>
                    <option value="cart">cart</option>
                    <option value="bundle">bundle</option>
                    <option value="drum">drum</option>
                  </select>
                </div>
                <div>
                  <div className="pl-label">Unit cost</div>
                  <input
                    name="unit_cost"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue="0"
                    className="pl-input"
                    style={{ width: "100%", height: 34 }}
                  />
                </div>
                <div>
                  <div className="pl-label">Pack size</div>
                  <input
                    name="pack_size"
                    type="number"
                    step="1"
                    min="1"
                    defaultValue="1"
                    className="pl-input"
                    style={{ width: "100%", height: 34 }}
                  />
                </div>
                <div>
                  <div className="pl-label">Default wastage %</div>
                  <input
                    name="default_wastage_pct"
                    type="number"
                    step="0.5"
                    min="0"
                    defaultValue="0"
                    className="pl-input"
                    style={{ width: "100%", height: 34 }}
                  />
                </div>
                <div>
                  <div className="pl-label">Reorder level</div>
                  <input
                    name="reorder_level"
                    type="number"
                    step="1"
                    min="0"
                    defaultValue="0"
                    className="pl-input"
                    style={{ width: "100%", height: 34 }}
                  />
                </div>
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                  marginTop: 4,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 8,
                  paddingTop: 14,
                  borderTop: "1px solid var(--line)",
                }}
              >
                <button
                  type="button"
                  className="pl-btn ghost"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pl-btn primary">
                  Save material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
