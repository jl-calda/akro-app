import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill, Seg } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const COLUMNS = [
  { key: "not_started", label: "Not started", tone: "draft" },
  { key: "ready", label: "Ready", tone: "info" },
  { key: "blocked", label: "Blocked", tone: "modified" },
  { key: "in_progress", label: "In progress", tone: "info" },
  { key: "done", label: "Done", tone: "approved" },
] as const;

export default async function KanbanPage({
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

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, name, manual_status, progress_percent, phase:phases(label, colour)")
    .eq("project_id", projectId);

  function columnFor(t: { manual_status: string | null; progress_percent: number | null }) {
    if (t.manual_status === "done") return "done";
    if ((t.progress_percent ?? 0) > 0) return "in_progress";
    return "not_started";
  }

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "Schedule", "Kanban"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
          <Pill variant="info">Kanban</Pill>
          <div className="pl-page-actions">
            <Link href={`/projects/${projectId}/schedule`}>
              <Btn variant="ghost">Gantt</Btn>
            </Link>
          </div>
        </div>
      </div>
      <ProjectTabs projectId={projectId} />

      <div className="pl-scroll" style={{ padding: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {COLUMNS.map((col) => {
            const tasksInCol = (tasks ?? []).filter((t) => columnFor(t) === col.key);
            return (
              <div key={col.key} className="pl-card" style={{ minHeight: 400 }}>
                <div className="pl-card-head">
                  <Pill variant={col.tone} dot>
                    {col.label}
                  </Pill>
                  <span className="mono tnum" style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-4)" }}>
                    {tasksInCol.length}
                  </span>
                </div>
                <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                  {tasksInCol.map((t) => {
                    const phase = t.phase as unknown as { label: string; colour: string } | null;
                    return (
                      <div
                        key={t.id}
                        className="pl-card"
                        style={{
                          padding: 10,
                          fontSize: 12,
                          background: "var(--surface-2)",
                          border: "1px solid var(--line)",
                        }}
                      >
                        <div style={{ fontWeight: 500 }}>{t.name}</div>
                        {phase && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 10.5, color: phase.colour }}>
                            <span
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: 3,
                                background: phase.colour,
                              }}
                            />
                            {phase.label}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {tasksInCol.length === 0 && (
                    <div style={{ fontSize: 11, color: "var(--ink-5)", textAlign: "center", padding: 16 }}>
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShellWithSession>
  );
}
