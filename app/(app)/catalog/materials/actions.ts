"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createMaterial(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim() || null;
  const category_id = String(formData.get("category_id") ?? "") || null;
  const supplier_id = String(formData.get("supplier_id") ?? "") || null;
  const unit = String(formData.get("unit") ?? "pcs");
  const unit_cost = Number(formData.get("unit_cost") ?? 0);
  const pack_size = Number(formData.get("pack_size") ?? 1);
  const default_wastage_pct = Number(formData.get("default_wastage_pct") ?? 0);
  const reorder_level = Number(formData.get("reorder_level") ?? 0);

  if (!name || !code) {
    redirect("/catalog/materials?error=Name+and+code+are+required");
  }

  const { data: mat, error } = await supabase
    .from("materials")
    .insert({
      organization_id: ctx.organizationId,
      name,
      code,
      emoji,
      category_id: category_id || null,
      supplier_id: supplier_id || null,
    })
    .select("id")
    .single();
  if (error || !mat) {
    redirect(`/catalog/materials?error=${encodeURIComponent(error?.message ?? "Insert failed")}`);
    return;
  }

  await supabase.from("material_versions").insert({
    material_id: mat.id,
    version: 1,
    unit,
    unit_cost,
    pack_size,
    default_wastage_pct,
    reorder_level,
  });

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    user_id: ctx.user.id,
    event_type: "material.created",
    payload: { material_id: mat.id, code, name },
  });

  revalidatePath("/catalog/materials");
  revalidatePath("/catalog");
  redirect("/catalog/materials");
}
