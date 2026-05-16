"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function confirmHandover(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const ticketId = String(formData.get("ticketId"));
  const confirmedQty = Number(formData.get("confirmed_qty"));
  const notes = String(formData.get("notes") ?? "").trim() || null;

  // Look up the handover ticket + linked issuance txn
  const { data: ticket } = await supabase
    .from("handover_tickets")
    .select("id, project_id, issuance_txn_id, qr_token")
    .eq("id", ticketId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();

  if (!ticket) {
    redirect(`/foreman?error=Ticket+not+found`);
    return;
  }

  const { data: issuance } = await supabase
    .from("stock_transactions")
    .select("material_id, location_id, qty")
    .eq("id", ticket.issuance_txn_id ?? "")
    .maybeSingle();
  const issuedQty = Number(issuance?.qty ?? 0);
  const discrepancy = Math.abs(confirmedQty - issuedQty) > 0.0001;

  // Insert a site_receipt transaction
  if (issuance) {
    await supabase.from("stock_transactions").insert({
      organization_id: ctx.organizationId,
      txn_type: "site_receipt",
      material_id: issuance.material_id,
      location_id: issuance.location_id,
      qty: confirmedQty,
      project_id: ticket.project_id,
      handover_ticket_id: ticket.id,
      performed_by: ctx.user.id,
      notes,
    });
  }

  // Close the ticket
  await supabase
    .from("handover_tickets")
    .update({
      confirmed_at: new Date().toISOString(),
      confirmed_by: ctx.user.id,
      confirmed_qty: confirmedQty,
      discrepancy_logged: discrepancy,
      notes,
    })
    .eq("id", ticket.id);

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    user_id: ctx.user.id,
    project_id: ticket.project_id,
    event_type: discrepancy ? "handover.confirmed_with_discrepancy" : "handover.confirmed",
    payload: {
      ticket_id: ticket.id,
      confirmed_qty: confirmedQty,
      issued_qty: issuedQty,
    },
  });

  revalidatePath(`/foreman`);
  revalidatePath(`/foreman/confirm/${ticketId}`);
  revalidatePath("/audit");
  redirect(`/foreman?confirmed=${encodeURIComponent(ticketId.slice(0, 8))}`);
}
