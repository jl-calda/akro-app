"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createPhase(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const key = String(formData.get("key") ?? "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const label = String(formData.get("label") ?? "").trim();
  const colour = String(formData.get("colour") ?? "#475569");
  const default_rate = Number(formData.get("default_rate") ?? 0);
  const default_crew_size = Number(formData.get("default_crew_size") ?? 1);
  if (!key || !label) redirect("/settings/labour?error=Key+and+label+required");
  const { error } = await supabase.from("phases").insert({
    organization_id: ctx.organizationId,
    key,
    label,
    colour,
    default_rate,
    default_crew_size,
  });
  if (error) redirect(`/settings/labour?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/settings/labour");
  redirect("/settings/labour");
}

export async function updatePhase(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const default_rate = Number(formData.get("default_rate") ?? 0);
  const default_crew_size = Number(formData.get("default_crew_size") ?? 1);
  const include_in_totals = formData.get("include_in_totals") === "on";
  await supabase
    .from("phases")
    .update({ default_rate, default_crew_size, include_in_totals })
    .eq("id", id)
    .eq("organization_id", ctx.organizationId);
  revalidatePath("/settings/labour");
}

export async function deletePhase(formData: FormData) {
  await requireContext();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  await supabase.from("phases").delete().eq("id", id);
  revalidatePath("/settings/labour");
}
