import { notFound } from "next/navigation";
import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { ConfirmForm } from "@/components/screens/foreman/confirm-form";

export default async function ForemanConfirmPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: ticket } = await supabase
    .from("handover_tickets")
    .select(
      "id, project_id, qr_token, issuance_txn_id, confirmed_at, project:projects(name, code)",
    )
    .eq("id", ticketId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!ticket) notFound();

  const project = ticket.project as unknown as { name: string; code: string | null } | null;

  // pull the issuance txn → material
  const { data: issuance } = await supabase
    .from("stock_transactions")
    .select(
      "qty, material:materials(code, name, emoji), material_id",
    )
    .eq("id", ticket.issuance_txn_id ?? "")
    .maybeSingle();
  const mat = issuance?.material as unknown as { code: string; name: string; emoji: string | null } | null;

  return (
    <MobileShell which="foreman">
      <MobileHeader
        title="Confirm receipt"
        subtitle="Handover ticket"
        back="/foreman"
      />
      {ticket.confirmed_at ? (
        <div
          style={{
            margin: 16,
            padding: 14,
            background: "var(--success-soft)",
            border: "1px solid #BFDDD8",
            borderRadius: 6,
            fontSize: 12.5,
            color: "var(--success)",
          }}
        >
          Already confirmed at {new Date(ticket.confirmed_at).toLocaleString()}.
        </div>
      ) : (
        <ConfirmForm
          ticketId={ticket.id}
          qrToken={ticket.qr_token}
          issuedQty={Number(issuance?.qty ?? 0)}
          unit="pcs"
          materialCode={mat?.code ?? "—"}
          materialName={mat?.name ?? "—"}
          materialEmoji={mat?.emoji ?? null}
          projectName={project?.name ?? "—"}
          projectCode={project?.code ?? null}
        />
      )}
    </MobileShell>
  );
}
