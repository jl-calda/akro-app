import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const STATUS_VARIANT: Record<string, "draft" | "info" | "approved" | "modified"> = {
  draft: "draft",
  pending_approval: "info",
  sent: "info",
  partially_received: "modified",
  fully_received: "approved",
  closed: "draft",
};

export default async function ProcurementPage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: pos } = await supabase
    .from("purchase_orders")
    .select("id, po_number, status, source, expected_delivery, supplier:suppliers(name), created_at")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });

  const rows = pos ?? [];

  return (
    <AppShellWithSession crumbs={["Procurement"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Purchase orders</div>
            <div className="pl-page-sub">Generate POs from aggregated demand or stock replenishment.</div>
          </div>
          <Pill variant="info">{rows.length}</Pill>
          <div className="pl-page-actions">
            <Link href="/procurement/aggregation">
              <Btn ico="fork" variant="ghost">Aggregate demand</Btn>
            </Link>
            <Btn variant="primary" ico="plus">New PO</Btn>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          ico="list"
          title="No purchase orders yet"
          description="Combine demand across approved MTOs in Aggregation to generate POs grouped by supplier."
          actionLabel="Go to aggregation"
          actionHref="/procurement/aggregation"
        />
      ) : (
        <div className="pl-scroll" style={{ background: "var(--surface)" }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 140 }}>PO #</th>
                <th>Supplier</th>
                <th style={{ width: 150 }}>Status</th>
                <th style={{ width: 130 }}>Source</th>
                <th style={{ width: 130 }}>Expected delivery</th>
                <th style={{ width: 130 }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const sup = p.supplier as unknown as { name: string } | null;
                return (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/procurement/pos/${p.id}`} className="pl-link">
                        <Chip>{p.po_number}</Chip>
                      </Link>
                    </td>
                    <td><span style={{ fontWeight: 500 }}>{sup?.name ?? "—"}</span></td>
                    <td><Pill variant={STATUS_VARIANT[p.status] ?? "draft"} dot>{p.status.replace(/_/g, " ")}</Pill></td>
                    <td style={{ color: "var(--ink-3)", fontSize: 12 }}>{p.source.replace(/_/g, " ")}</td>
                    <td className="mono tnum">{p.expected_delivery ?? "—"}</td>
                    <td className="mono tnum" style={{ color: "var(--ink-4)" }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppShellWithSession>
  );
}
