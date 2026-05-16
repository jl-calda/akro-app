"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createSubAssembly(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const scope = String(formData.get("scope") ?? "global") as "global" | "system" | "model_only";
  if (!name) redirect("/catalog/sub-assemblies?error=Name+required");

  const { data: sa, error } = await supabase
    .from("sub_assemblies")
    .insert({ organization_id: ctx.organizationId, name, scope })
    .select("id")
    .single();
  if (error || !sa) redirect(`/catalog/sub-assemblies?error=${encodeURIComponent(error?.message ?? "Insert failed")}`);
  await supabase.from("sub_assembly_versions").insert({
    sub_assembly_id: sa!.id,
    version: 1,
    parameter_signature: [],
    parts_list: [],
    labour_rules: [],
    is_published: false,
    created_by: ctx.user.id,
  });
  revalidatePath("/catalog/sub-assemblies");
  revalidatePath("/catalog");
  redirect(`/catalog/sub-assemblies/${sa!.id}`);
}
