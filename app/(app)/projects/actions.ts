"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function createProject(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();

  const code = String(formData.get("code") ?? "").trim() || null;
  const name = String(formData.get("name") ?? "").trim();
  const client_name = String(formData.get("client_name") ?? "").trim() || null;
  const location = String(formData.get("location") ?? "").trim() || null;
  const site_contact = String(formData.get("site_contact") ?? "").trim() || null;
  const start_date = String(formData.get("start_date") ?? "").trim() || null;
  const needed_by_date = String(formData.get("needed_by_date") ?? "").trim() || null;

  if (!name) redirect("/projects/new?error=Name+required");

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      organization_id: ctx.organizationId,
      code,
      name,
      client_name,
      location,
      site_contact,
      start_date,
      needed_by_date,
      status: "draft",
      created_by: ctx.user.id,
    })
    .select("id")
    .single();
  if (error || !project) {
    redirect(`/projects/new?error=${encodeURIComponent(error?.message ?? "Could not create project")}`);
    return;
  }

  // Also initialise the MTO state row so the MTO tab has something to read.
  await supabase.from("mto_states").insert({
    project_id: project.id,
    state: "draft",
  });

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    user_id: ctx.user.id,
    project_id: project.id,
    event_type: "project.created",
    payload: { name },
  });

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect(`/projects/${project.id}/overview`);
}
