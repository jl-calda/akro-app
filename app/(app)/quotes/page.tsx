import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
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

type QuoteRow = {
  id: string;
  quote_number: string;
  name: string | null;
  status: string;
  total_cost: number | null;
  expiry_date: string | null;
  awarded_at: string | null;
  project: { id: string; name: string; client_name: string | null } | null;
};

export default async function QuotesDashboardPage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: rawQuotes } = await supabase
    .from("quotes")
    .select(
      "id, quote_number, name, status, total_cost, expiry_date, awarded_at, project:projects(id, name, client_name)",
    )
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });

  const quotes = ((rawQuotes ?? []) as unknown as QuoteRow[]) ?? [];

  // Pricing summary
  const totalValueOpen = quotes
    .filter((q) => q.status === "sent" || q.status === "internal_review" || q.status === "draft")
    .reduce((s, q) => s + (Number(q.total_cost) || 0), 0);

  const buckets = {
    needsPricing: quotes.filter((q) => q.status === "draft"),
    internalReview: quotes.filter((q) => q.status === "internal_review"),
    sent: quotes.filter((q) => q.status === "sent"),
    awarded: quotes.filter((q) => q.status === "awarded"),
    expiringSoon: quotes.filter((q) => {
      if (q.status !== "sent" || !q.expiry_date) return false;
      const days = Math.round(
        (new Date(q.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      );
      return days <= 14 && days >= 0;
    }),
  };

  return (
    <AppShellWithSession crumbs={["Quotes"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              Estimator workspace
            </div>
            <div className="pl-page-title">Quotes</div>
          </div>
          <Pill variant="info">{quotes.length}</Pill>
          <div className="pl-page-actions">
            <Btn ico="upload" variant="ghost">Bulk import</Btn>
            <Btn variant="primary" ico="plus">New quote</Btn>
          </div>
        </div>
      </div>

      <div className="pl-meta" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <Stat label="Open quote value" value={`$${totalValueOpen.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub={`${buckets.needsPricing.length + buckets.internalReview.length + buckets.sent.length} quotes`} />
        <Stat label="Needs pricing" value={buckets.needsPricing.length.toString()} />
        <Stat label="Internal review" value={buckets.internalReview.length.toString()} />
        <Stat label="Sent" value={buckets.sent.length.toString()} sub={`${buckets.expiringSoon.length} expiring < 14d`} warn={buckets.expiringSoon.length > 0} />
        <Stat label="Awarded" value={buckets.awarded.length.toString()} />
      </div>

      <div className="pl-scroll" style={{ padding: "18px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }}>
          <BucketCard
            title="Needs pricing"
            count={buckets.needsPricing.length}
            tone="primary"
            ico="edit"
            quotes={buckets.needsPricing.slice(0, 5)}
          />
          <BucketCard
            title="Internal review"
            count={buckets.internalReview.length}
            tone="primary"
            ico="check"
            quotes={buckets.internalReview.slice(0, 5)}
          />
          <BucketCard
            title="Sent — nearing expiry"
            count={buckets.expiringSoon.length}
            tone="hivis"
            ico="warn"
            quotes={buckets.expiringSoon.slice(0, 5)}
          />
          <BucketCard
            title="Recently awarded"
            count={buckets.awarded.length}
            tone="ink"
            ico="check"
            quotes={buckets.awarded.slice(0, 5)}
          />
          <BucketCard
            title="All sent"
            count={buckets.sent.length}
            tone="ink"
            ico="share"
            quotes={buckets.sent.slice(0, 5)}
          />
          <BucketCard
            title="Drafts"
            count={buckets.needsPricing.length}
            tone="ink"
            ico="edit"
            quotes={buckets.needsPricing.slice(0, 5)}
          />
        </div>

        <div className="pl-card">
          <div className="pl-card-head">
            <span className="pl-card-title">All quotes</span>
            <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-4)" }}>
              {quotes.length} total
            </span>
          </div>
          {quotes.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "var(--ink-4)" }}>
              No quotes yet. Create a project + first quote.
            </div>
          ) : (
            <table className="pl-table">
              <thead>
                <tr>
                  <th style={{ width: 130 }}>Quote #</th>
                  <th>Project</th>
                  <th>Client</th>
                  <th style={{ width: 120 }}>Status</th>
                  <th className="num" style={{ width: 110 }}>Total</th>
                  <th style={{ width: 120 }}>Expiry</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id}>
                    <td><Chip>{q.quote_number}</Chip></td>
                    <td>
                      <Link href={`/quotes/${q.id}`} className="pl-link" style={{ fontWeight: 500 }}>
                        {q.name ?? q.project?.name ?? "Untitled"}
                      </Link>
                    </td>
                    <td style={{ color: "var(--ink-3)" }}>{q.project?.client_name ?? "—"}</td>
                    <td><Pill variant={STATUS_VARIANT[q.status] ?? "draft"} dot>{q.status.replace(/_/g, " ")}</Pill></td>
                    <td className="num mono">
                      {q.total_cost ? `$${Number(q.total_cost).toLocaleString()}` : "—"}
                    </td>
                    <td className="mono tnum" style={{ color: "var(--ink-3)" }}>
                      {q.expiry_date ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShellWithSession>
  );
}

function Stat({ label, value, sub, warn }: { label: string; value: string; sub?: string; warn?: boolean }) {
  return (
    <div className="pl-meta-cell">
      <div className="pl-meta-label">{label}</div>
      <div
        className="pl-meta-value mono tnum"
        style={{ fontSize: 22, color: warn ? "var(--hivis-ink)" : "var(--ink)" }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 10.5, color: "var(--ink-5)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function BucketCard({
  title,
  count,
  tone,
  ico,
  quotes,
}: {
  title: string;
  count: number;
  tone: "primary" | "hivis" | "ink";
  ico: string;
  quotes: QuoteRow[];
}) {
  const toneStyle = {
    primary: { bg: "var(--primary-soft)", fg: "var(--primary)" },
    hivis: { bg: "var(--hivis-soft)", fg: "var(--hivis-ink)" },
    ink: { bg: "var(--surface-2)", fg: "var(--ink-3)" },
  }[tone];
  return (
    <div className="pl-card">
      <div className="pl-card-head" style={{ alignItems: "flex-start" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: toneStyle.bg,
            color: toneStyle.fg,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={ico} size={14} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="pl-card-title">{title}</span>
            {count > 0 && (
              <span className="mono tnum" style={{ fontSize: 18, fontWeight: 600, color: toneStyle.fg }}>
                {count}
              </span>
            )}
          </div>
        </div>
      </div>
      <div>
        {quotes.length === 0 ? (
          <div style={{ padding: 14, fontSize: 11.5, color: "var(--ink-5)" }}>None.</div>
        ) : (
          quotes.map((q) => (
            <Link
              key={q.id}
              href={`/quotes/${q.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 14px",
                borderBottom: "1px solid var(--line)",
                textDecoration: "none",
                color: "inherit",
                fontSize: 12,
              }}
            >
              <Chip>{q.quote_number}</Chip>
              <span style={{ flex: 1, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {q.name ?? q.project?.name ?? "Untitled"}
              </span>
              <span className="mono tnum" style={{ fontWeight: 600 }}>
                {q.total_cost ? `$${Number(q.total_cost).toLocaleString()}` : "—"}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
