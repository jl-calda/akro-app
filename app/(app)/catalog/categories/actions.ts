"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createCategory(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/catalog/categories?error=Name+required");
  const { error } = await supabase.from("material_categories").insert({
    organization_id: ctx.organizationId,
    name,
    parameter_definitions: [],
  });
  if (error) redirect(`/catalog/categories?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/catalog/categories");
  revalidatePath("/catalog");
  redirect("/catalog/categories");
}

export async function deleteCategory(formData: FormData) {
  await requireContext();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  await supabase.from("material_categories").delete().eq("id", id);
  revalidatePath("/catalog/categories");
}
