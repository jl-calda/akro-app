"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function updateSystemSchema(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const systemId = String(formData.get("systemId"));
  const versionId = String(formData.get("versionId"));
  const schemaRaw = String(formData.get("dimension_schema") ?? "[]");
  let schema: unknown;
  try {
    schema = JSON.parse(schemaRaw);
  } catch {
    redirect(`/catalog/systems/${systemId}?error=Invalid+JSON`);
  }
  await supabase
    .from("system_versions")
    .update({ dimension_schema: schema as never })
    .eq("id", versionId);
  revalidatePath(`/catalog/systems/${systemId}`);
}

export async function publishSystem(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const systemId = String(formData.get("systemId"));
  const versionId = String(formData.get("versionId"));
  await supabase
    .from("system_versions")
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq("id", versionId);
  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    user_id: ctx.user.id,
    event_type: "system.published",
    payload: { system_id: systemId, version_id: versionId },
  });
  revalidatePath(`/catalog/systems/${systemId}`);
}
