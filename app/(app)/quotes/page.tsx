import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const STATUS_VARIANT: Record<string, "draft" | "approved" | "info" | "modified" | "danger"> = {
  draft: "draft",
  internal_review: "info",
  sent: "info",
  awarded: "approved",
  rejected: "danger",
  expired: "modified",
};

export default async function QuotesDashboardPage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, quote_number, name, status, total_cost, expiry_date, awarded_at, project:projects(id, name, client_name)")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });

  const rows = quotes ?? [];

  const buckets = {
    needsPricing: rows.filter((q) => q.status === "draft"),
    internalReview: rows.filter((q) => q.status === "internal_review"),
    sent: rows.filter((q) => q.status === "sent"),
    awarded: rows.filter((q) => q.status === "awarded"),
  };

  return (
    <AppShellWithSession crumbs={["Quotes"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Quotes</div>
            <div className="pl-page-sub">Estimator workspace.</div>
          </div>
          <Pill variant="info">{rows.length}</Pill>
          <div className="pl-page-actions">
            <Btn ico="download" variant="ghost">Export</Btn>
            <Btn variant="primary" ico="plus">New quote</Btn>
          </div>
        </div>
      </div>

      <div className="pl-meta" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <Card label="Needs pricing" value={buckets.needsPricing.length} />
        <Card label="Internal review" value={buckets.internalReview.length} />
        <Card label="Sent" value={buckets.sent.length} />
        <Card label="Awarded" value={buckets.awarded.length} />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          ico="edit"
          title="No quotes yet"
          description="Create a project first, then add a quote under it."
        />
      ) : (
        <div className="pl-scroll" style={{ background: "var(--surface)" }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 130 }}>Quote #</th>
                <th>Project</th>
                <th>Client</th>
                <th style={{ width: 120 }}>Status</th>
                <th className="num" style={{ width: 110 }}>Total</th>
                <th style={{ width: 120 }}>Expiry</th>
                <th style={{ width: 28 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((q) => {
                const proj = (q.project as unknown as { id: string; name: string; client_name: string | null }) ?? null;
                return (
                  <tr key={q.id}>
                    <td><Chip>{q.quote_number}</Chip></td>
                    <td>
                      <Link
                        href={`/quotes/${q.id}`}
                        className="pl-link"
                        style={{ fontWeight: 500 }}
                      >
                        {q.name ?? proj?.name ?? "Untitled"}
                      </Link>
                    </td>
                    <td style={{ color: "var(--ink-3)" }}>{proj?.client_name ?? "—"}</td>
                    <td>
                      <Pill variant={STATUS_VARIANT[q.status] ?? "draft"} dot>
                        {q.status.replace(/_/g, " ")}
                      </Pill>
                    </td>
                    <td className="num mono">
                      {q.total_cost ? `$${Number(q.total_cost).toLocaleString()}` : "—"}
                    </td>
                    <td className="mono tnum" style={{ color: "var(--ink-3)" }}>
                      {q.expiry_date ?? "—"}
                    </td>
                    <td />
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

function Card({ label, value }: { label: string; value: number }) {
  return (
    <div className="pl-meta-cell">
      <div className="pl-meta-label">{label}</div>
      <div className="pl-meta-value mono tnum" style={{ fontSize: 22 }}>{value}</div>
    </div>
  );
}
