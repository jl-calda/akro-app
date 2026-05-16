"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function submitMtoForApproval(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const projectId = String(formData.get("projectId"));

  await supabase
    .from("mto_states")
    .update({
      state: "pending_approval",
      submitted_at: new Date().toISOString(),
      submitted_by: ctx.user.id,
    })
    .eq("project_id", projectId);

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    project_id: projectId,
    user_id: ctx.user.id,
    event_type: "mto.submitted",
    payload: {},
  });

  revalidatePath(`/projects/${projectId}/mto`);
  revalidatePath(`/projects/${projectId}/mto/approve`);
  revalidatePath("/dashboard");
  redirect(`/projects/${projectId}/mto`);
}

export async function approveMto(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const projectId = String(formData.get("projectId"));

  await supabase
    .from("mto_states")
    .update({
      state: "approved",
      approved_at: new Date().toISOString(),
      approved_by: ctx.user.id,
    })
    .eq("project_id", projectId);

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    project_id: projectId,
    user_id: ctx.user.id,
    event_type: "mto.approved",
    payload: {},
  });

  revalidatePath(`/projects/${projectId}/mto`);
  revalidatePath("/dashboard");
  redirect(`/projects/${projectId}/mto`);
}

export async function rejectMto(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const projectId = String(formData.get("projectId"));
  const reason = String(formData.get("reason") ?? "");

  await supabase
    .from("mto_states")
    .update({
      state: "rejected",
      rejected_at: new Date().toISOString(),
      rejected_by: ctx.user.id,
      rejection_reason: reason,
    })
    .eq("project_id", projectId);

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    project_id: projectId,
    user_id: ctx.user.id,
    event_type: "mto.rejected",
    payload: { reason },
  });

  revalidatePath(`/projects/${projectId}/mto`);
  redirect(`/projects/${projectId}/mto`);
}
