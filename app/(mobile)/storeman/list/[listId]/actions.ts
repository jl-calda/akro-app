"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

function genQrToken(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export async function issueStock(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const projectId = String(formData.get("projectId"));
  const mtoLineId = String(formData.get("mtoLineId"));
  const materialId = String(formData.get("materialId"));
  const locationId = String(formData.get("locationId"));
  const qty = Number(formData.get("qty"));

  if (qty <= 0) {
    redirect(`/storeman/list/${projectId}?error=Qty+must+be+positive`);
  }

  const { data: txn, error } = await supabase
    .from("stock_transactions")
    .insert({
      organization_id: ctx.organizationId,
      txn_type: "issuance",
      material_id: materialId,
      location_id: locationId,
      qty,
      project_id: projectId,
      mto_line_id: mtoLineId || null,
      performed_by: ctx.user.id,
    })
    .select("id")
    .single();

  if (error || !txn) {
    redirect(
      `/storeman/list/${projectId}?error=${encodeURIComponent(error?.message ?? "Failed to record issuance")}`,
    );
    return;
  }

  // Mint the handover ticket
  await supabase.from("handover_tickets").insert({
    organization_id: ctx.organizationId,
    project_id: projectId,
    issuance_txn_id: txn!.id,
    qr_token: genQrToken("HT"),
  });

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    user_id: ctx.user.id,
    project_id: projectId,
    event_type: "stock.issuance",
    payload: { material_id: materialId, qty, location_id: locationId },
  });

  revalidatePath(`/storeman/list/${projectId}`);
  revalidatePath(`/storeman`);
  revalidatePath("/stock");
  revalidatePath("/audit");
  revalidatePath(`/projects/${projectId}/mto`);
}
