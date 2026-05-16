"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createSupplier(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim() || null;
  if (!name) redirect("/catalog/suppliers?error=Name+required");
  const { error } = await supabase.from("suppliers").insert({
    organization_id: ctx.organizationId,
    name,
    contact,
  });
  if (error) redirect(`/catalog/suppliers?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/catalog/suppliers");
  revalidatePath("/catalog");
  redirect("/catalog/suppliers");
}

export async function deleteSupplier(formData: FormData) {
  await requireContext();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  await supabase.from("suppliers").delete().eq("id", id);
  revalidatePath("/catalog/suppliers");
}
