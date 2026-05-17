"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function updateSystemSchema(formData: FormData) {
  await requireContext();
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

export async function updateDimensionSchemaStructured(formData: FormData) {
  await requireContext();
  const supabase = await createClient();
  const versionId = String(formData.get("versionId"));
  const rowsRaw = String(formData.get("rows") ?? "[]");
  let rows: unknown;
  try {
    rows = JSON.parse(rowsRaw);
  } catch {
    return { ok: false as const, error: "Invalid JSON payload" };
  }
  // Loose validation: must be an array of objects with at least key + label + type
  if (!Array.isArray(rows)) return { ok: false as const, error: "Expected an array" };
  for (const r of rows) {
    if (!r || typeof r !== "object") return { ok: false as const, error: "Row must be an object" };
    const o = r as Record<string, unknown>;
    if (typeof o.key !== "string" || o.key.length === 0)
      return { ok: false as const, error: "Each row needs a key" };
    if (typeof o.label !== "string")
      return { ok: false as const, error: `Row ${o.key} needs a label` };
    if (!["number", "integer", "string", "boolean"].includes(String(o.type)))
      return { ok: false as const, error: `Row ${o.key} type must be number/integer/string/boolean` };
  }
  await supabase
    .from("system_versions")
    .update({ dimension_schema: rows as never })
    .eq("id", versionId);
  revalidatePath(`/catalog/systems`);
  return { ok: true as const };
}

export async function updateAllowedShapes(formData: FormData) {
  await requireContext();
  const supabase = await createClient();
  const versionId = String(formData.get("versionId"));
  const ids = String(formData.get("shape_ids") ?? "")
    .split(",")
    .filter(Boolean);
  await supabase
    .from("system_versions")
    .update({ allowed_shapes: ids })
    .eq("id", versionId);
  revalidatePath(`/catalog/systems`);
}

export async function updateAllowedSubstrates(formData: FormData) {
  await requireContext();
  const supabase = await createClient();
  const versionId = String(formData.get("versionId"));
  const ids = String(formData.get("substrate_ids") ?? "")
    .split(",")
    .filter(Boolean);
  await supabase
    .from("system_versions")
    .update({ allowed_substrates: ids })
    .eq("id", versionId);
  revalidatePath(`/catalog/systems`);
}

export async function updateSystemMeta(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const systemId = String(formData.get("systemId"));
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return;
  await supabase
    .from("systems")
    .update({ name, description })
    .eq("id", systemId)
    .eq("organization_id", ctx.organizationId);
  revalidatePath(`/catalog/systems/${systemId}`);
  revalidatePath(`/catalog/systems`);
}

export async function updateDimensionPattern(formData: FormData) {
  await requireContext();
  const supabase = await createClient();
  const versionId = String(formData.get("versionId"));
  const patternRaw = String(formData.get("pattern") ?? "null");
  let pattern: unknown;
  try {
    pattern = JSON.parse(patternRaw);
  } catch {
    return { ok: false as const, error: "Invalid pattern JSON" };
  }
  await supabase
    .from("system_versions")
    .update({ dimension_pattern: pattern as never })
    .eq("id", versionId);
  revalidatePath(`/catalog/systems`);
  return { ok: true as const };
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
