"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

function genPoNumber() {
  const yr = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `PO-${yr}-${seq}`;
}
function genQrToken() {
  return `PO-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export async function generatePoFromGroup(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const supplierId = String(formData.get("supplier_id"));
  const projectIds = String(formData.get("project_ids") ?? "")
    .split(",")
    .filter(Boolean);

  if (!supplierId || projectIds.length === 0) {
    redirect("/procurement/aggregation?error=Pick+supplier+and+projects");
  }

  // Find all approved projects' MTO lines sourced from this supplier
  const { data: instances } = await supabase
    .from("system_instances")
    .select("id")
    .in("project_id", projectIds);
  const instanceIds = (instances ?? []).map((i) => i.id);
  const { data: mtoLines } = await supabase
    .from("mto_lines")
    .select(
      "quantity, unit_cost, material_version:material_versions(material:materials(id, supplier_id))",
    )
    .eq("organization_id", ctx.organizationId)
    .in("system_instance_id", instanceIds.length > 0 ? instanceIds : ["00000000-0000-0000-0000-000000000000"]);

  // Group by material_id where supplier matches
  const byMaterial: Record<string, { qty: number; unit_cost: number }> = {};
  (mtoLines ?? []).forEach((l) => {
    const mv = l.material_version as unknown as
      | { material: { id: string; supplier_id: string | null } | null }
      | null;
    const m = mv?.material;
    if (!m || m.supplier_id !== supplierId) return;
    byMaterial[m.id] ??= { qty: 0, unit_cost: Number(l.unit_cost) };
    byMaterial[m.id].qty += Number(l.quantity);
  });

  if (Object.keys(byMaterial).length === 0) {
    redirect("/procurement/aggregation?error=No+lines+match+supplier");
  }

  const poNumber = genPoNumber();
  const { data: po, error } = await supabase
    .from("purchase_orders")
    .insert({
      organization_id: ctx.organizationId,
      po_number: poNumber,
      supplier_id: supplierId,
      status: "draft",
      source: "project_demand",
      qr_token: genQrToken(),
      created_by: ctx.user.id,
    })
    .select("id")
    .single();
  if (error || !po) {
    redirect(`/procurement/aggregation?error=${encodeURIComponent(error?.message ?? "PO insert failed")}`);
    return;
  }
  await supabase.from("po_lines").insert(
    Object.entries(byMaterial).map(([material_id, v]) => ({
      po_id: po!.id,
      material_id,
      ordered_qty: v.qty,
      unit_cost: v.unit_cost,
    })),
  );
  await supabase.from("po_project_links").insert(
    projectIds.map((project_id) => ({ po_id: po!.id, project_id })),
  );

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    user_id: ctx.user.id,
    event_type: "po.generated_from_aggregation",
    payload: { po_id: po!.id, supplier_id: supplierId, project_ids: projectIds, line_count: Object.keys(byMaterial).length },
  });

  revalidatePath("/procurement");
  revalidatePath("/procurement/aggregation");
  redirect(`/procurement/pos/${po!.id}`);
}
