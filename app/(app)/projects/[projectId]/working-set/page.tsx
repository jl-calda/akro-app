import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export default async function WorkingSetPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, code, name")
    .eq("id", projectId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!project) notFound();

  const { data: instances } = await supabase
    .from("system_instances")
    .select("id, name, dimensions, variant_selections, created_at")
    .eq("project_id", projectId)
    .eq("organization_id", ctx.organizationId)
    .order("created_at");

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "Working set"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
          <Pill variant="info">Working set</Pill>
          <div className="pl-page-actions">
            <Btn variant="primary" ico="plus">Add system instance</Btn>
          </div>
        </div>
      </div>
      <ProjectTabs projectId={projectId} />
      <div className="pl-scroll" style={{ padding: 24 }}>
        {(instances ?? []).length === 0 ? (
          <EmptyState
            ico="cube"
            title="Working set is empty"
            description="Add a system instance directly or award a quote — its instances will snapshot in here."
          />
        ) : (
          <table className="pl-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Variants</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {(instances ?? []).map((i) => (
                <tr key={i.id}>
                  <td>{i.name ?? "—"}</td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    {JSON.stringify(i.variant_selections)}
                  </td>
                  <td className="mono tnum">{new Date(i.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShellWithSession>
  );
}
