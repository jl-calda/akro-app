import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { transitionQuote, updateQuotePricing } from "./actions";

const STATUS_VARIANT: Record<string, "draft" | "info" | "approved" | "modified" | "danger"> = {
  draft: "draft",
  internal_review: "info",
  sent: "info",
  awarded: "approved",
  rejected: "danger",
  expired: "modified",
};

const NEXT_STATUS: Record<string, { label: string; status: string }[]> = {
  draft: [{ label: "Submit for internal review", status: "internal_review" }],
  internal_review: [
    { label: "Approve & mark sent", status: "sent" },
    { label: "Reject", status: "rejected" },
  ],
  sent: [
    { label: "Mark awarded", status: "awarded" },
    { label: "Mark rejected", status: "rejected" },
    { label: "Mark expired", status: "expired" },
  ],
  awarded: [],
  rejected: [],
  expired: [],
};

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ quoteId: string }>;
}) {
  const { quoteId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: q } = await supabase
    .from("quotes")
    .select(
      "id, quote_number, name, status, expiry_date, margin_pct, contingency_pct, tax_pct, total_cost, awarded_at, project_id, project:projects(name, code, client_name)",
    )
    .eq("id", quoteId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!q) notFound();

  const project = q.project as unknown as { name: string; code: string | null; client_name: string | null } | null;

  return (
    <AppShellWithSession crumbs={["Quotes", q.quote_number]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <Chip>{q.quote_number}</Chip>
          <div className="pl-page-title">{q.name ?? project?.name ?? "Untitled"}</div>
          <Pill variant={STATUS_VARIANT[q.status] ?? "draft"} dot>{q.status.replace(/_/g, " ")}</Pill>
          <div className="pl-page-actions">
            <Btn ico="download">PDF</Btn>
            {(NEXT_STATUS[q.status] ?? []).map((opt) => (
              <form key={opt.status} action={transitionQuote}>
                <input type="hidden" name="id" value={q.id} />
                <input type="hidden" name="status" value={opt.status} />
                <Btn
                  variant={opt.status === "awarded" ? "primary" : opt.status === "rejected" ? "danger" : "default"}
                  type="submit"
                >
                  {opt.label}
                </Btn>
              </form>
            ))}
          </div>
        </div>
      </div>

      <div className="pl-meta" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <Stat label="Project" value={project ? `${project.code ? project.code + " · " : ""}${project.name}` : "—"} />
        <Stat label="Client" value={project?.client_name ?? "—"} />
        <Stat label="Expiry" value={q.expiry_date ?? "—"} />
        <Stat label="Status" value={q.status.replace(/_/g, " ")} />
        <Stat label="Awarded" value={q.awarded_at ? new Date(q.awarded_at).toLocaleDateString() : "—"} />
      </div>

      <div className="pl-tabs">
        <div className="pl-tab is-active">Build</div>
        <div className="pl-tab">Price</div>
        <div className="pl-tab">Document</div>
      </div>

      <div className="pl-scroll" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="pl-card">
          <div className="pl-card-head">
            <span className="pl-card-title">System instances</span>
            <span style={{ marginLeft: "auto" }}>
              <Btn variant="primary" ico="plus" size="sm">Add instance</Btn>
            </span>
          </div>
          <div style={{ padding: 18, color: "var(--ink-4)", fontSize: 12.5 }}>
            Instance builder ships in B6 — once a Model is published, you&apos;ll add instances here with live MTO preview.
          </div>
        </div>

        <div className="pl-card">
          <div className="pl-card-head">
            <span className="pl-card-title">Pricing</span>
          </div>
          <form
            action={updateQuotePricing}
            style={{
              padding: 18,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            <input type="hidden" name="id" value={q.id} />
            <div>
              <div className="pl-label">Margin %</div>
              <input
                name="margin_pct"
                type="number"
                step="0.5"
                defaultValue={q.margin_pct ?? 0}
                className="pl-input num-input"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div className="pl-label">Contingency %</div>
              <input
                name="contingency_pct"
                type="number"
                step="0.5"
                defaultValue={q.contingency_pct ?? 0}
                className="pl-input num-input"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div className="pl-label">Tax %</div>
              <input
                name="tax_pct"
                type="number"
                step="0.5"
                defaultValue={q.tax_pct ?? 0}
                className="pl-input num-input"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div className="pl-label">Total</div>
              <input
                name="total_cost"
                type="number"
                step="100"
                defaultValue={q.total_cost ?? 0}
                className="pl-input num-input"
                style={{ width: "100%" }}
              />
            </div>
            <Btn type="submit" variant="primary">Save</Btn>
          </form>
        </div>

        <div className="pl-card">
          <div className="pl-card-head">
            <span className="pl-card-title">Document</span>
          </div>
          <div style={{ padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="mono"
              style={{
                width: 60,
                height: 80,
                background: "var(--surface-2)",
                border: "1px solid var(--line)",
                borderRadius: 4,
                display: "grid",
                placeItems: "center",
                fontSize: 11,
                color: "var(--ink-4)",
              }}
            >
              PDF
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Generated quote PDF</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
                PDF generation endpoint ships in a later batch. Will render via react-pdf server-side.
              </div>
            </div>
            <Btn ico="download">Generate PDF</Btn>
          </div>
        </div>
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
