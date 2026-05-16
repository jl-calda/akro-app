import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const LIFECYCLE = [
  "draft",
  "pending_approval",
  "sent",
  "partially_received",
  "fully_received",
  "closed",
];

export default async function PoDetailPage({
  params,
}: {
  params: Promise<{ poId: string }>;
}) {
  const { poId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: po } = await supabase
    .from("purchase_orders")
    .select(
      "id, po_number, status, source, expected_delivery, sent_at, created_at, supplier:suppliers(name, contact), po_lines(id, ordered_qty, unit_cost, material:materials(name, emoji, code))",
    )
    .eq("id", poId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!po) notFound();

  const sup = po.supplier as unknown as { name: string; contact: string | null } | null;
  const lines = (po.po_lines as unknown as Array<{
    id: string;
    ordered_qty: number;
    unit_cost: number;
    material: { name: string; emoji: string | null; code: string } | null;
  }>) ?? [];

  const total = lines.reduce((s, l) => s + Number(l.ordered_qty) * Number(l.unit_cost), 0);
  const stepIndex = LIFECYCLE.indexOf(po.status);

  return (
    <AppShellWithSession crumbs={["Procurement", "PO", po.po_number]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <Chip>{po.po_number}</Chip>
          <div className="pl-page-title">{sup?.name ?? "—"}</div>
          <Pill variant={po.status === "fully_received" ? "approved" : "info"} dot>
            {po.status.replace(/_/g, " ")}
          </Pill>
          <div className="pl-page-actions">
            <Btn ico="download">PDF</Btn>
            <Btn variant="primary" ico="check">Mark sent</Btn>
          </div>
        </div>
      </div>

      <div className="pl-meta" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <Stat label="Supplier" value={sup?.name ?? "—"} />
        <Stat label="Source" value={po.source.replace(/_/g, " ")} />
        <Stat label="Expected delivery" value={po.expected_delivery ?? "—"} />
        <Stat label="Lines" value={lines.length.toString()} />
        <Stat label="Total" value={`$${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
      </div>

      {/* lifecycle rail */}
      <div style={{ padding: "16px 24px", background: "var(--surface)", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 8 }}>
        {LIFECYCLE.map((s, i) => {
          const isDone = i < stepIndex;
          const isCurrent = i === stepIndex;
          return (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  background: isDone
                    ? "var(--success)"
                    : isCurrent
                      ? "var(--primary)"
                      : "var(--surface-2)",
                  color: isDone || isCurrent ? "#fff" : "var(--ink-4)",
                  border: "1px solid " + (isDone ? "var(--success)" : isCurrent ? "var(--primary)" : "var(--line)"),
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {isDone ? <Icon name="check" size={12} /> : <span style={{ fontSize: 11, fontWeight: 600 }} className="mono">{i + 1}</span>}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: isCurrent ? "var(--ink)" : "var(--ink-4)",
                  fontWeight: isCurrent ? 600 : 500,
                }}
              >
                {s.replace(/_/g, " ")}
              </span>
              {i < LIFECYCLE.length - 1 && (
                <span style={{ width: 28, height: 1, background: "var(--line)" }} />
              )}
            </div>
          );
        })}
      </div>

      <div className="pl-scroll" style={{ background: "var(--surface)" }}>
        <table className="pl-table">
          <thead>
            <tr>
              <th style={{ width: 44 }} />
              <th style={{ width: 140 }}>SKU</th>
              <th>Material</th>
              <th className="num">Ordered</th>
              <th className="num">Unit cost</th>
              <th className="num">Line total</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id}>
                <td><div className="pl-thumb">{l.material?.emoji ?? "📦"}</div></td>
                <td className="mono" style={{ color: "var(--ink-3)" }}>{l.material?.code ?? "—"}</td>
                <td><span style={{ fontWeight: 500 }}>{l.material?.name ?? "—"}</span></td>
                <td className="num mono">{Number(l.ordered_qty).toLocaleString()}</td>
                <td className="num mono">${Number(l.unit_cost).toFixed(2)}</td>
                <td className="num mono" style={{ fontWeight: 600 }}>
                  ${(Number(l.ordered_qty) * Number(l.unit_cost)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
            {lines.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 32, textAlign: "center", color: "var(--ink-4)" }}>
                  No lines on this PO.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShellWithSession>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="pl-meta-cell">
      <div className="pl-meta-label">{label}</div>
      <div className="pl-meta-value" style={{ fontSize: 13 }}>{value}</div>
    </div>
  );
}
