"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import type { AppRole } from "@/lib/auth/roles";

export async function changeRole(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const user_id = String(formData.get("user_id"));
  const role = String(formData.get("role")) as AppRole;
  // RLS will block this unless current user is owner/admin
  await supabase
    .from("memberships")
    .update({ role })
    .eq("organization_id", ctx.organizationId)
    .eq("user_id", user_id);
  revalidatePath("/users");
}

export async function removeMember(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const user_id = String(formData.get("user_id"));
  await supabase
    .from("memberships")
    .delete()
    .eq("organization_id", ctx.organizationId)
    .eq("user_id", user_id);
  revalidatePath("/users");
}
