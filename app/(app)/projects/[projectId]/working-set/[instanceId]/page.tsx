import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Chip, Pill } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { InstanceBuilder } from "@/components/screens/builder/instance-builder";
import type { PartsListRow } from "@/lib/rules/engine";

export default async function SystemInstanceBuilderPage({
  params,
}: {
  params: Promise<{ projectId: string; instanceId: string }>;
}) {
  const { projectId, instanceId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, code, name")
    .eq("id", projectId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!project) notFound();

  const [{ data: systemsData }, { data: shapesData }, { data: substratesData }, { data: modelsData }] =
    await Promise.all([
      supabase
        .from("systems")
        .select("id, name, description, system_versions(id, version, is_published, dimension_pattern)")
        .eq("organization_id", ctx.organizationId)
        .order("name"),
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
        .select("id, name, code, system_id, model_versions(id, version, parts_list, is_published)")
        .eq("organization_id", ctx.organizationId)
        .order("name"),
    ]);

  const systems = (systemsData ?? []).map((s) => {
    const versions = ((s.system_versions as unknown as Array<{
      id: string;
      version: number;
      is_published: boolean;
      dimension_pattern: unknown;
    }>) ?? []).sort((a, b) => b.version - a.version);
    const latest = versions[0];
    return {
      id: s.id,
      name: s.name,
      description: s.description,
      pattern: (latest?.dimension_pattern as
        | import("@/lib/rules/dim-derive").DimensionPattern
        | null) ?? null,
    };
  });
  const shapes = (shapesData ?? []).map((s) => ({ id: s.id, name: s.name }));
  const substrates = (substratesData ?? []).map((s) => ({ id: s.id, name: s.name }));

  const models = (modelsData ?? []).map((m) => {
    const versions = ((m.model_versions as unknown as Array<{
      id: string;
      version: number;
      parts_list: unknown;
      is_published: boolean;
    }>) ?? []).sort((a, b) => b.version - a.version);
    const latest = versions[0];
    return {
      id: m.id,
      versionId: latest?.id ?? "",
      name: m.name,
      code: m.code,
      version: latest?.version ?? 1,
      systemId: m.system_id,
      partsList: ((latest?.parts_list as PartsListRow[]) ?? []),
    };
  });

  const systemVersionMap: Record<string, string> = {};
  (systemsData ?? []).forEach((s) => {
    const versions = ((s.system_versions as unknown as Array<{ id: string; version: number; is_published: boolean }>) ?? []).sort(
      (a, b) => b.version - a.version,
    );
    if (versions[0]) systemVersionMap[s.id] = versions[0].id;
  });

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "Working set", "New instance"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
          <Pill variant="info">System Instance Builder</Pill>
          <Chip>{instanceId === "new" ? "new" : instanceId.slice(0, 8) + "…"}</Chip>
        </div>
        <div className="pl-page-sub">
          Fill sections in any order. The right pane updates live; the rule engine validates as you type.
        </div>
      </div>
      <ProjectTabs projectId={projectId} />
      <InstanceBuilder
        projectId={projectId}
        systems={systems}
        shapes={shapes}
        models={models}
        substrates={substrates}
        systemVersionMap={systemVersionMap}
      />
    </AppShellWithSession>
  );
}
