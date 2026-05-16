"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function updateTenant(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const currency = String(formData.get("currency") ?? "USD");
  if (!name) redirect("/settings/tenant?error=Name+required");
  await supabase
    .from("organizations")
    .update({ name, currency })
    .eq("id", ctx.organizationId);
  revalidatePath("/settings/tenant");
  redirect("/settings/tenant?saved=1");
}
