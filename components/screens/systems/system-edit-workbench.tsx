"use client";

import { useState } from "react";
import Link from "next/link";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { ZoneHeader, ZoneStrip } from "@/components/ui/zone-header";
import {
  DimensionSchemaEditor,
  type DimensionRow,
} from "./dimension-schema-editor";
import { DimensionPatternBuilder } from "./dimension-pattern-builder";
import type { DimensionPattern } from "@/lib/rules/dim-derive";
import {
  updateAllowedShapes,
  updateAllowedSubstrates,
  updateSystemMeta,
  updateDimensionSchemaStructured,
  updateDimensionPattern,
  publishSystem,
} from "@/app/(app)/catalog/systems/[systemId]/actions";

type Option = { id: string; name: string };
type ModelLink = { id: string; name: string; code: string | null; version: number; isPublished: boolean };

export function SystemEditWorkbench({
  systemId,
  versionId,
  initialName,
  initialDescription,
  versionLabel,
  isPublished,
  initialSchema,
  initialPattern,
  shapes,
  substrates,
  initialShapeIds,
  initialSubstrateIds,
  models,
}: {
  systemId: string;
  versionId: string;
  initialName: string;
  initialDescription: string | null;
  versionLabel: string;
  isPublished: boolean;
  initialSchema: DimensionRow[];
  initialPattern: DimensionPattern | null;
  shapes: Option[];
  substrates: Option[];
  initialShapeIds: string[];
  initialSubstrateIds: string[];
  models: ModelLink[];
}) {
  const [showRawSchema, setShowRawSchema] = useState(false);
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [shapeIds, setShapeIds] = useState<Set<string>>(new Set(initialShapeIds));
  const [substrateIds, setSubstrateIds] = useState<Set<string>>(new Set(initialSubstrateIds));
  const [schema, setSchema] = useState<DimensionRow[]>(initialSchema);
  const [metaSaved, setMetaSaved] = useState(false);

  async function handleSaveMeta() {
    const fd = new FormData();
    fd.set("systemId", systemId);
    fd.set("name", name);
    fd.set("description", description);
    await updateSystemMeta(fd);
    setMetaSaved(true);
    setTimeout(() => setMetaSaved(false), 1500);
  }

  async function toggleShape(id: string) {
    const next = new Set(shapeIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setShapeIds(next);
    const fd = new FormData();
    fd.set("versionId", versionId);
    fd.set("shape_ids", Array.from(next).join(","));
    await updateAllowedShapes(fd);
  }

  async function toggleSubstrate(id: string) {
    const next = new Set(substrateIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSubstrateIds(next);
    const fd = new FormData();
    fd.set("versionId", versionId);
    fd.set("substrate_ids", Array.from(next).join(","));
    await updateAllowedSubstrates(fd);
  }

  async function saveSchema(rows: DimensionRow[]) {
    setSchema(rows);
    const fd = new FormData();
    fd.set("versionId", versionId);
    fd.set("rows", JSON.stringify(rows));
    await updateDimensionSchemaStructured(fd);
  }

  return (
    <div className="pl-main">
      {/* Sticky header */}
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--line)",
          flex: "0 0 auto",
        }}
      >
        <div
          style={{
            padding: "14px 24px 12px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Chip>SYS</Chip>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>{name}</div>
          <Pill variant={isPublished ? "approved" : "draft"} dot>
            {versionLabel} · {isPublished ? "published" : "draft"}
          </Pill>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <Btn ico="history" variant="ghost">History</Btn>
            <Btn ico="copy" variant="ghost">Duplicate</Btn>
            {!isPublished && (
              <form action={publishSystem}>
                <input type="hidden" name="systemId" value={systemId} />
                <input type="hidden" name="versionId" value={versionId} />
                <Btn variant="primary" ico="check" type="submit">
                  Publish {versionLabel}
                </Btn>
              </form>
            )}
          </div>
        </div>
        <ZoneStrip
          zones={[
            { title: "Header", sub: `${models.length} models` },
            { title: "Dimension schema", sub: `${schema.length} rows` },
            { title: "Shapes", sub: `${shapeIds.size} allowed` },
            { title: "Substrates", sub: `${substrateIds.size} allowed` },
            { title: "Schedule template", sub: "not set" },
          ]}
        />
      </div>

      {/* Two-pane scroll body */}
      <div
        className="pl-scroll"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          alignItems: "flex-start",
          minHeight: 0,
        }}
      >
        <div style={{ padding: "18px 22px", minWidth: 0 }}>
          {/* ZONE 1 — Header */}
          <ZoneHeader
            idx="01"
            title="Header"
            sub="Identity for this System catalog entry."
            actions={
              <Btn
                size="sm"
                ico="check"
                onClick={handleSaveMeta}
                variant={metaSaved ? "primary" : "default"}
              >
                {metaSaved ? "Saved" : "Save meta"}
              </Btn>
            }
          />
          <div className="pl-card" style={{ padding: 14, marginBottom: 18 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr",
                gap: 14,
                alignItems: "start",
              }}
            >
              <label className="pl-label" style={{ paddingTop: 8 }}>System name</label>
              <input
                className="pl-input"
                style={{ width: "100%" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label className="pl-label" style={{ paddingTop: 8 }}>Description</label>
              <textarea
                className="pl-input"
                style={{ width: "100%", minHeight: 60, padding: 10, fontSize: 12.5 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="One-line description shown in catalog cards."
              />
            </div>
          </div>

          {/* ZONE 2 — Dimension pattern (recipe-driven) */}
          <ZoneHeader
            idx="02"
            title="Dimension pattern"
            sub="Pick the primitive shape, toggle modifiers. Derived dims appear automatically — no formula writing."
            actions={
              <button
                type="button"
                onClick={() => setShowRawSchema((v) => !v)}
                className="pl-btn ghost sm"
              >
                {showRawSchema ? "Hide raw schema" : "Advanced · raw schema"}
              </button>
            }
          />
          <div style={{ marginBottom: 18 }}>
            <DimensionPatternBuilder
              versionId={versionId}
              initial={initialPattern}
              onSave={async (pattern) => {
                const fd = new FormData();
                fd.set("versionId", versionId);
                fd.set("pattern", JSON.stringify(pattern));
                await updateDimensionPattern(fd);
              }}
            />
          </div>
          {showRawSchema && (
            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  padding: "8px 12px",
                  background: "var(--hivis-soft)",
                  border: "1px solid var(--hivis-line)",
                  borderRadius: 4,
                  fontSize: 11.5,
                  color: "var(--hivis-ink)",
                  marginBottom: 8,
                }}
              >
                <strong>Power-user mode:</strong> raw dimension_schema editor.
                Use the pattern builder above whenever possible; this textarea
                bypasses derived dims and is shown for back-compat.
              </div>
              <DimensionSchemaEditor initial={schema} onSave={saveSchema} />
            </div>
          )}

          {/* ZONE 3 — Shapes */}
          <ZoneHeader
            idx="03"
            title="Shapes"
            sub="Geometries this System supports. Shape choice unlocks per-shape dimensions (e.g. segments)."
          />
          <div className="pl-card" style={{ padding: 14, marginBottom: 18 }}>
            {shapes.length === 0 ? (
              <div
                style={{
                  padding: "10px 12px",
                  background: "var(--surface-2)",
                  border: "1px dashed var(--line)",
                  borderRadius: 4,
                  fontSize: 12,
                  color: "var(--ink-4)",
                }}
              >
                No shapes defined for this tenant yet. The shapes catalog page is a follow-up;
                until then you can author Models without picking shape — the Instance Builder will
                accept a single <span className="mono">length</span> input only.
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {shapes.map((s) => {
                  const active = shapeIds.has(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleShape(s.id)}
                      className={"pl-btn sm" + (active ? " primary" : "")}
                    >
                      {active && <Icon name="check" size={11} />}
                      {s.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ZONE 4 — Substrates */}
          <ZoneHeader
            idx="04"
            title="Substrates"
            sub="Surfaces this System can mount on. Used as a filter + drives gated parts in Models."
          />
          <div className="pl-card" style={{ padding: 14, marginBottom: 18 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {substrates.map((s) => {
                const active = substrateIds.has(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSubstrate(s.id)}
                    className={"pl-btn sm" + (active ? " primary" : "")}
                  >
                    {active && <Icon name="check" size={11} />}
                    {s.name}
                  </button>
                );
              })}
              {substrates.length === 0 && (
                <span style={{ fontSize: 12, color: "var(--ink-5)" }}>
                  No substrates yet — add some under{" "}
                  <Link href="/catalog/substrates" className="pl-link">
                    Catalog → Substrates
                  </Link>
                  .
                </span>
              )}
            </div>
          </div>

          {/* ZONE 5 — Schedule template */}
          <ZoneHeader
            idx="05"
            title="Default schedule template"
            sub="When a System Instance is added to a Working Set, this template seeds the project's tasks."
          />
          <div
            className="pl-card"
            style={{
              padding: 16,
              marginBottom: 18,
              fontSize: 12.5,
              color: "var(--ink-4)",
              lineHeight: 1.5,
            }}
          >
            No template attached. Without one, tasks fall back to one umbrella task per System
            Instance plus one sub-task per labour phase used by the Model. The schedule-template
            editor ships in a later batch.
          </div>
        </div>

        {/* RIGHT DRAWER */}
        <aside
          style={{
            borderLeft: "1px solid var(--line)",
            background: "var(--surface)",
            position: "sticky",
            top: 0,
            alignSelf: "flex-start",
            height: "calc(100vh - 56px - 90px)",
            overflowY: "auto",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              Models using this System
            </div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              {models.length}{" "}
              <span style={{ fontSize: 12, color: "var(--ink-4)", fontWeight: 400 }}>
                {models.length === 1 ? "Model" : "Models"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {models.length === 0 ? (
              <div
                style={{
                  padding: 12,
                  background: "var(--surface-2)",
                  border: "1px solid var(--line)",
                  borderRadius: 4,
                  fontSize: 12,
                  color: "var(--ink-4)",
                }}
              >
                No Models reference this System yet.
                <div style={{ marginTop: 8 }}>
                  <Link href="/catalog/models" className="pl-link">
                    Author a Model →
                  </Link>
                </div>
              </div>
            ) : (
              models.map((m) => (
                <Link
                  key={m.id}
                  href={`/catalog/models/${m.id}`}
                  className="pl-card"
                  style={{
                    padding: 10,
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {m.code && <Chip>{m.code}</Chip>}
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500 }}>{m.name}</span>
                  <Chip>v{m.version}</Chip>
                  {m.isPublished ? (
                    <Pill variant="approved" dot>pub</Pill>
                  ) : (
                    <Pill variant="draft" dot>draft</Pill>
                  )}
                </Link>
              ))
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
            <div className="pl-label">Try it</div>
            <Link href={`/projects`} style={{ textDecoration: "none" }}>
              <Btn variant="primary" ico="diamond" style={{ width: "100%", justifyContent: "center" }}>
                Test in Instance Builder
              </Btn>
            </Link>
            <div style={{ fontSize: 11, color: "var(--ink-5)", marginTop: 6 }}>
              Opens a project where you can mount this System and watch the rule engine compute
              an MTO live.
            </div>
          </div>

          <div
            style={{
              marginTop: "auto",
              padding: 12,
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              borderRadius: 6,
              fontSize: 11.5,
              color: "var(--ink-4)",
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--ink-2)", marginBottom: 4 }}>
              How a System becomes useful
            </div>
            (1) Define the dimension schema (length, users, spacing…). (2) Pick allowed shapes +
            substrates. (3) Publish. (4) Author one or more Models under it with parts-list
            formulas that reference these dimensions.
          </div>
        </aside>
      </div>
    </div>
  );
}
