import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Chip, HiVis, Pill } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { approveMto, rejectMto } from "../actions";
import { ApprovalTabs } from "@/components/screens/mto/approval-tabs";

export default async function MtoApprovalPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, code, name, client_name, location, created_by")
    .eq("id", projectId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!project) notFound();

  const { data: mtoState } = await supabase
    .from("mto_states")
    .select("state, submitted_at")
    .eq("project_id", projectId)
    .maybeSingle();

  const { data: instances } = await supabase
    .from("system_instances")
    .select("id")
    .eq("project_id", projectId);
  const instanceIds = (instances ?? []).map((i) => i.id);

  const { data: rawLines } = await supabase
    .from("mto_lines")
    .select(
      "id, quantity, unit, unit_cost, is_overridden, material_version:material_versions(material:materials(code, name, emoji))",
    )
    .eq("organization_id", ctx.organizationId)
    .in("system_instance_id", instanceIds.length > 0 ? instanceIds : ["00000000-0000-0000-0000-000000000000"]);

  const lines = (rawLines ?? []).map((l) => {
    const mv = l.material_version as unknown as
      | { material: { code: string; name: string; emoji: string | null } | null }
      | null;
    return {
      id: l.id,
      quantity: Number(l.quantity),
      unit_cost: Number(l.unit_cost),
      unit: l.unit,
      code: mv?.material?.code ?? null,
      name: mv?.material?.name ?? null,
      emoji: mv?.material?.emoji ?? null,
      is_overridden: l.is_overridden,
    };
  });

  const { data: labour } = await supabase
    .from("labour_lines")
    .select("hours, rate")
    .eq("organization_id", ctx.organizationId)
    .in("system_instance_id", instanceIds.length > 0 ? instanceIds : ["00000000-0000-0000-0000-000000000000"]);

  const totalMaterialCost = lines.reduce((s, l) => s + l.quantity * l.unit_cost, 0);
  const totalLabourCost = (labour ?? []).reduce(
    (s, l) => s + Number(l.hours) * Number(l.rate),
    0,
  );

  const state = mtoState?.state ?? "draft";

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "MTO", "Approve"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
          {state === "pending_approval" ? (
            <Pill variant="info" dot>pending approval</Pill>
          ) : state === "modified_after_approval" ? (
            <HiVis>Modified · re-review</HiVis>
          ) : (
            <Pill variant={state === "approved" ? "approved" : "draft"} dot>
              {state.replace(/_/g, " ")}
            </Pill>
          )}
        </div>
      </div>
      <ProjectTabs projectId={projectId} />

      <ApprovalTabs
        projectId={projectId}
        projectName={project.name}
        projectCode={project.code}
        client={project.client_name}
        location={project.location}
        pmEmail={null}
        submittedAt={mtoState?.submitted_at ?? null}
        state={state}
        mtoLines={lines}
        totalMaterialCost={totalMaterialCost}
        totalLabourCost={totalLabourCost}
        totalLines={lines.length}
        approveAction={approveMto}
        rejectAction={rejectMto}
      />
    </AppShellWithSession>
  );
}
