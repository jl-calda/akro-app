"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createModel(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim() || null;
  const system_id = String(formData.get("system_id") ?? "");
  if (!name || !system_id) redirect("/catalog/models?error=Name+and+system+required");

  const { data: model, error } = await supabase
    .from("models")
    .insert({ organization_id: ctx.organizationId, system_id, name, code })
    .select("id")
    .single();
  if (error || !model) redirect(`/catalog/models?error=${encodeURIComponent(error?.message ?? "Insert failed")}`);
  await supabase.from("model_versions").insert({
    model_id: model!.id,
    version: 1,
    parts_list: [],
    labour_rules: [],
    certifications: [],
    is_published: false,
    created_by: ctx.user.id,
  });
  revalidatePath("/catalog/models");
  revalidatePath("/catalog");
  redirect(`/catalog/models/${model!.id}`);
}
