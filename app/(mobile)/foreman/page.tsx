import Link from "next/link";
import { MobileShell, MobileHeader, MStat } from "@/components/chrome/mobile-shell";
import { Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export default async function ForemanHomePage({
  searchParams,
}: {
  searchParams: Promise<{ confirmed?: string }>;
}) {
  const ctx = await requireContext();
  const sp = await searchParams;
  const supabase = await createClient();

  // Pending tickets (not yet confirmed)
  const { data: tickets } = await supabase
    .from("handover_tickets")
    .select(
      "id, qr_token, generated_at, project:projects(code, name)",
    )
    .eq("organization_id", ctx.organizationId)
    .is("confirmed_at", null)
    .order("generated_at", { ascending: false });

  const { data: confirmedToday } = await supabase
    .from("handover_tickets")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .gte("confirmed_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

  const { data: discrepancies } = await supabase
    .from("handover_tickets")
    .select("id")
    .eq("organization_id", ctx.organizationId)
    .eq("discrepancy_logged", true);

  return (
    <MobileShell which="foreman">
      <MobileHeader title="Pending Receipts" subtitle="Site Foreman" />

      {sp.confirmed && (
        <div
          style={{
            margin: "12px 14px 0",
            padding: "10px 12px",
            background: "var(--success-soft)",
            border: "1px solid #BFDDD8",
            borderRadius: 8,
            fontSize: 12.5,
            color: "var(--success)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon name="check" size={14} />
          Receipt confirmed · ticket {sp.confirmed}…
        </div>
      )}

      <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        <MStat value={(tickets ?? []).length} label="Pending" />
        <MStat value={(confirmedToday ?? []).length} label="Today" tone="success" />
        <MStat value={(discrepancies ?? []).length} label="Issues" tone="warn" />
      </div>

      <div style={{ flex: 1, padding: "0 14px 12px", overflow: "auto" }}>
        {(tickets ?? []).length === 0 ? (
          <div
            style={{
              margin: "30px auto",
              padding: 28,
              maxWidth: 300,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                margin: "0 auto 12px",
                borderRadius: 22,
                background: "var(--primary-soft)",
                color: "var(--primary)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="scan" size={20} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No pending receipts</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 4 }}>
              When the storeman issues materials for your project, the handover ticket appears here.
            </div>
          </div>
        ) : (
          (tickets ?? []).map((t) => {
            const proj = t.project as unknown as { code: string | null; name: string } | null;
            return (
              <Link
                key={t.id}
                href={`/foreman/confirm/${t.id}`}
                style={{
                  display: "block",
                  padding: 12,
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: 10,
                  marginBottom: 8,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  {proj?.code && <Chip>{proj.code}</Chip>}
                  <Pill variant="info">awaiting confirm</Pill>
                  <span
                    className="mono"
                    style={{ marginLeft: "auto", fontSize: 10.5, color: "var(--ink-5)" }}
                  >
                    {new Date(t.generated_at).toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{proj?.name ?? "—"}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>
                  HT-{t.id.slice(0, 8)}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </MobileShell>
  );
}
