import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill, ProgressBar, Seg } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export default async function ProjectSchedulePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, code, name, start_date, needed_by_date")
    .eq("id", projectId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!project) notFound();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, name, start_date, end_date, duration_days, is_milestone, is_on_hold, manual_status, progress_percent, phase:phases(label, colour)")
    .eq("project_id", projectId)
    .order("start_date");

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "Schedule"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
          <Pill variant="info">Schedule</Pill>
          <div className="pl-page-actions">
            <Seg items={["Gantt", "List"]} active="Gantt" />
            <Link href={`/projects/${projectId}/schedule/kanban`}>
              <Btn variant="ghost">Kanban</Btn>
            </Link>
          </div>
        </div>
      </div>
      <ProjectTabs projectId={projectId} />

      {(tasks ?? []).length === 0 ? (
        <EmptyState
          ico="calendar"
          title="No tasks yet"
          description="Add a system instance to the Working Set. Tasks auto-generate from the System's schedule template (or phase defaults if no template)."
        />
      ) : (
        <div className="pl-scroll" style={{ padding: 24 }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Phase</th>
                <th style={{ width: 120 }}>Start</th>
                <th style={{ width: 120 }}>End</th>
                <th style={{ width: 200 }}>Progress</th>
                <th style={{ width: 120 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(tasks ?? []).map((t) => {
                const phase = t.phase as unknown as { label: string; colour: string } | null;
                const status = t.is_on_hold ? "on hold" : t.manual_status ?? "—";
                return (
                  <tr key={t.id}>
                    <td>
                      {t.is_milestone && <span style={{ marginRight: 6 }}>◆</span>}
                      <span style={{ fontWeight: 500 }}>{t.name}</span>
                    </td>
                    <td>
                      {phase ? (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 11,
                            color: phase.colour,
                          }}
                        >
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
                      ) : "—"}
                    </td>
                    <td className="mono tnum">{t.start_date ?? "—"}</td>
                    <td className="mono tnum">{t.end_date ?? "—"}</td>
                    <td>
                      <ProgressBar value={Number(t.progress_percent ?? 0)} max={100} />
                      <div className="mono tnum" style={{ fontSize: 10, color: "var(--ink-4)", textAlign: "right", marginTop: 2 }}>
                        {t.progress_percent ?? 0}%
                      </div>
                    </td>
                    <td>
                      <Pill variant={t.is_on_hold ? "modified" : "draft"} dot>{status}</Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AppShellWithSession>
  );
}
