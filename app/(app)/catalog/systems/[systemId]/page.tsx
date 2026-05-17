import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { SystemEditWorkbench } from "@/components/screens/systems/system-edit-workbench";
import type { DimensionRow } from "@/components/screens/systems/dimension-schema-editor";

export default async function SystemDetailPage({
  params,
}: {
  params: Promise<{ systemId: string }>;
}) {
  const { systemId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const [{ data: system }, { data: shapesData }, { data: substratesData }, { data: modelsData }] =
    await Promise.all([
      supabase
        .from("systems")
        .select(
          "id, name, description, system_versions(id, version, dimension_schema, allowed_shapes, allowed_substrates, is_published, published_at)",
        )
        .eq("id", systemId)
        .eq("organization_id", ctx.organizationId)
        .maybeSingle(),
      supabase
        .from("shapes")
        .select("id, name")
        .eq("organization_id", ctx.organizationId)
        .order("name"),
      supabase
        .from("substrates")
        .select("id, name")
        .eq("organization_id", ctx.organizationId)
        .order("name"),
      supabase
        .from("models")
        .select("id, name, code, model_versions(version, is_published)")
        .eq("organization_id", ctx.organizationId)
        .eq("system_id", systemId)
        .order("name"),
    ]);

  if (!system) notFound();

  const versions = ((system.system_versions as unknown as Array<{
    id: string;
    version: number;
    dimension_schema: unknown;
    allowed_shapes: string[] | null;
    allowed_substrates: string[] | null;
    is_published: boolean;
    published_at: string | null;
  }>) ?? []).sort((a, b) => b.version - a.version);
  const latest = versions[0];

  const schema: DimensionRow[] = Array.isArray(latest?.dimension_schema)
    ? (latest!.dimension_schema as DimensionRow[])
    : [];

  const models = (modelsData ?? []).map((m) => {
    const mvs = ((m.model_versions as unknown as { version: number; is_published: boolean }[]) ??
      []).sort((a, b) => b.version - a.version);
    const top = mvs[0];
    return {
      id: m.id,
      name: m.name,
      code: m.code,
      version: top?.version ?? 1,
      isPublished: top?.is_published ?? false,
    };
  });

  return (
    <AppShellWithSession crumbs={["Catalog", "Systems", system.name]}>
      <SystemEditWorkbench
        systemId={systemId}
        versionId={latest?.id ?? ""}
        initialName={system.name}
        initialDescription={system.description}
        versionLabel={`v${latest?.version ?? 1}`}
        isPublished={latest?.is_published ?? false}
        initialSchema={schema}
        shapes={(shapesData ?? []).map((s) => ({ id: s.id, name: s.name }))}
        substrates={(substratesData ?? []).map((s) => ({ id: s.id, name: s.name }))}
        initialShapeIds={latest?.allowed_shapes ?? []}
        initialSubstrateIds={latest?.allowed_substrates ?? []}
        models={models}
      />
    </AppShellWithSession>
  );
}
