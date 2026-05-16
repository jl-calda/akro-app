"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { evaluateModelInstance, type PartsListRow } from "@/lib/rules/engine";

export async function updateModelVersion(formData: FormData) {
  const supabase = await createClient();
  await requireContext();
  const modelId = String(formData.get("modelId"));
  const versionId = String(formData.get("versionId"));
  const partsListRaw = String(formData.get("parts_list") ?? "[]");
  let parts_list: unknown;
  try {
    parts_list = JSON.parse(partsListRaw);
  } catch {
    redirect(`/catalog/models/${modelId}?error=Invalid+JSON`);
  }
  await supabase
    .from("model_versions")
    .update({ parts_list: parts_list as never })
    .eq("id", versionId);
  revalidatePath(`/catalog/models/${modelId}`);
}

export async function publishModel(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const modelId = String(formData.get("modelId"));
  const versionId = String(formData.get("versionId"));
  await supabase
    .from("model_versions")
    .update({ is_published: true, published_at: new Date().toISOString() })
    .eq("id", versionId);
  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    user_id: ctx.user.id,
    event_type: "model.published",
    payload: { model_id: modelId, version_id: versionId },
  });
  revalidatePath(`/catalog/models/${modelId}`);
}

export async function previewRule(prevState: unknown, formData: FormData) {
  await requireContext();
  const partsListRaw = String(formData.get("parts_list") ?? "[]");
  const dimsRaw = String(formData.get("dimensions") ?? "{}");
  try {
    const parts_list = JSON.parse(partsListRaw) as PartsListRow[];
    const dimensions = JSON.parse(dimsRaw) as Record<string, unknown>;
    const result = evaluateModelInstance({
      system_dimensions: dimensions,
      parts_list,
    });
    return { ok: true as const, result };
  } catch (err) {
    return { ok: false as const, error: (err as Error).message };
  }
}
