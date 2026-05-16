import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, HiVis, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export default async function ProjectOverview({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, code, name, client_name, location, site_contact, start_date, needed_by_date, status")
    .eq("id", projectId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!project) notFound();

  const { data: mtoState } = await supabase
    .from("mto_states")
    .select("state, approved_at")
    .eq("project_id", projectId)
    .maybeSingle();

  const { data: instances } = await supabase
    .from("system_instances")
    .select("id, name")
    .eq("project_id", projectId)
    .eq("organization_id", ctx.organizationId);

  const state = mtoState?.state ?? "draft";

  return (
    <AppShellWithSession crumbs={["Projects", project.name]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && (
            <Chip style={{ height: 22, padding: "0 8px", fontSize: 11 }}>{project.code}</Chip>
          )}
          <div className="pl-page-title">{project.name}</div>
          {state === "modified_after_approval" ? (
            <HiVis>Modified · re-review needed</HiVis>
          ) : (
            <Pill
              variant={state === "approved" ? "approved" : state === "pending_approval" ? "info" : "draft"}
              dot
            >
              {state.replace(/_/g, " ")}
            </Pill>
          )}
          <div className="pl-page-actions">
            <Btn ico="share" variant="ghost">Share</Btn>
            <Btn ico="download">Export</Btn>
            <Btn variant="primary" ico="plus">Add system</Btn>
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="pl-meta" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        <div className="pl-meta-cell">
          <div className="pl-meta-label">Client</div>
          <div className="pl-meta-value">{project.client_name ?? "—"}</div>
        </div>
        <div className="pl-meta-cell">
          <div className="pl-meta-label">Location</div>
          <div className="pl-meta-value">{project.location ?? "—"}</div>
        </div>
        <div className="pl-meta-cell">
          <div className="pl-meta-label">Site contact</div>
          <div className="pl-meta-value">{project.site_contact ?? "—"}</div>
        </div>
        <div className="pl-meta-cell">
          <div className="pl-meta-label">Status</div>
          <div className="pl-meta-value">{project.status}</div>
        </div>
        <div className="pl-meta-cell">
          <div className="pl-meta-label">Start · Due</div>
          <div className="pl-meta-value mono">
            {project.start_date ?? "—"} → {project.needed_by_date ?? "—"}
          </div>
        </div>
        <div className="pl-meta-cell">
          <div className="pl-meta-label">System Instances</div>
          <div className="pl-meta-value mono tnum">{instances?.length ?? 0}</div>
        </div>
      </div>

      <ProjectTabs projectId={projectId} />

      <div className="pl-scroll" style={{ padding: 24 }}>
        {(instances ?? []).length === 0 ? (
          <EmptyState
            ico="cube"
            title="No system instances yet"
            description="Once you award a quote or add an instance directly to the Working Set, it'll show here. Each instance generates MTO lines + tasks."
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {(instances ?? []).map((ins) => (
              <div key={ins.id} className="pl-card" style={{ padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    background: "var(--surface-2)",
                    border: "1px solid var(--line)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name="cube" size={18} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {ins.name ?? "Untitled instance"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShellWithSession>
  );
}
