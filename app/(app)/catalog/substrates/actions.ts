"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createSubstrate(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!name) redirect("/catalog/substrates?error=Name+required");
  const { error } = await supabase.from("substrates").insert({
    organization_id: ctx.organizationId,
    name,
    notes,
  });
  if (error) redirect(`/catalog/substrates?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/catalog/substrates");
  revalidatePath("/catalog");
  redirect("/catalog/substrates");
}

export async function deleteSubstrate(formData: FormData) {
  await requireContext();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  await supabase.from("substrates").delete().eq("id", id);
  revalidatePath("/catalog/substrates");
}
