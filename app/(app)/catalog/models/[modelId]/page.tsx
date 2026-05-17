import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { ModelEditWorkbench } from "@/components/screens/models/model-edit-workbench";
import type { MaterialOption } from "@/components/screens/models/material-picker";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: model } = await supabase
    .from("models")
    .select(
      "id, name, code, system:systems(id, name, system_versions(version, dimension_pattern, allowed_substrates)), model_versions(id, version, parts_list, labour_rules, custom_dimensions, variants, certifications, is_published, published_at)",
    )
    .eq("id", modelId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!model) notFound();

  const sys = model.system as unknown as {
    id: string;
    name: string;
    system_versions: Array<{
      version: number;
      dimension_pattern: unknown;
      allowed_substrates: string[] | null;
    }>;
  } | null;
  const sysVersion = (sys?.system_versions ?? []).sort((a, b) => b.version - a.version)[0];
  const pattern = (sysVersion?.dimension_pattern as
    | import("@/lib/rules/dim-derive").DimensionPattern
    | null) ?? null;

  const versions = ((model.model_versions as unknown as Array<{
    id: string;
    version: number;
    parts_list: unknown;
    labour_rules: unknown;
    custom_dimensions: unknown;
    variants: unknown;
    certifications: unknown;
    is_published: boolean;
    published_at: string | null;
  }>) ?? []).sort((a, b) => b.version - a.version);
  const latest = versions[0];

  // Load materials for the row picker (org-scoped, with latest version)
  const { data: rawMaterials } = await supabase
    .from("materials")
    .select(
      "id, code, name, emoji, category:material_categories(name), supplier:suppliers(name), material_versions(id, version, unit)",
    )
    .eq("organization_id", ctx.organizationId)
    .order("name");
  const materials: MaterialOption[] = (rawMaterials ?? []).map((m) => {
    const mvs = ((m.material_versions as unknown as { id: string; version: number; unit: string }[]) ?? []).sort(
      (a, b) => b.version - a.version,
    );
    const top = mvs[0];
    return {
      id: m.id,
      versionId: top?.id ?? "",
      code: m.code,
      name: m.name,
      emoji: m.emoji,
      unit: top?.unit ?? "pcs",
      category: (m.category as unknown as { name: string } | null)?.name ?? null,
      supplier: (m.supplier as unknown as { name: string } | null)?.name ?? null,
    };
  });

  // Load substrates for the gate picker
  const { data: subsData } = await supabase
    .from("substrates")
    .select("id, name")
    .eq("organization_id", ctx.organizationId);
  const substratesById = new Map((subsData ?? []).map((s) => [s.id, s.name]));
  const allowedSubstrates = (sysVersion?.allowed_substrates ?? [])
    .map((id) => substratesById.get(id))
    .filter((n): n is string => !!n);

  return (
    <AppShellWithSession crumbs={["Catalog", "Models", model.name]}>
      <ModelEditWorkbench
        modelId={modelId}
        versionId={latest?.id ?? ""}
        modelName={model.name}
        modelCode={model.code}
        systemName={sys?.name ?? "—"}
        versionLabel={`v${latest?.version ?? 1}`}
        isPublished={latest?.is_published ?? false}
        partsList={(latest?.parts_list as never) ?? []}
        customDimensions={(latest?.custom_dimensions as never) ?? []}
        variants={(latest?.variants as never) ?? []}
        systemPattern={pattern}
        materials={materials}
        allowedSubstrates={allowedSubstrates}
      />
    </AppShellWithSession>
  );
}
