"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function updateCalendar(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const working_hours_per_day = Number(formData.get("working_hours_per_day") ?? 8);
  const days = [1, 2, 3, 4, 5, 6, 7].filter((d) => formData.get(`day_${d}`) === "on");

  await supabase
    .from("tenant_settings")
    .update({ working_hours_per_day, working_days: days })
    .eq("organization_id", ctx.organizationId);
  revalidatePath("/settings/calendar");
  redirect("/settings/calendar?saved=1");
}
