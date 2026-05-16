import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { ModelEditWorkbench } from "@/components/screens/models/model-edit-workbench";

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
      "id, name, code, system:systems(id, name), model_versions(id, version, parts_list, labour_rules, custom_dimensions, variants, certifications, is_published, published_at)",
    )
    .eq("id", modelId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!model) notFound();

  const sys = model.system as unknown as { name: string } | null;
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
      />
    </AppShellWithSession>
  );
}
