"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createSystem(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) redirect("/catalog/systems?error=Name+required");

  const { data: sys, error } = await supabase
    .from("systems")
    .insert({ organization_id: ctx.organizationId, name, description })
    .select("id")
    .single();
  if (error || !sys) redirect(`/catalog/systems?error=${encodeURIComponent(error?.message ?? "Insert failed")}`);
  // Create v1
  await supabase.from("system_versions").insert({
    system_id: sys!.id,
    version: 1,
    dimension_schema: [],
    allowed_shapes: [],
    allowed_substrates: [],
    is_published: false,
    created_by: ctx.user.id,
  });
  revalidatePath("/catalog/systems");
  revalidatePath("/catalog");
  redirect(`/catalog/systems/${sys!.id}`);
}
