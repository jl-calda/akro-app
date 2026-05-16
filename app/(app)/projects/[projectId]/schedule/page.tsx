import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill, Seg } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { GanttGrid, GanttLegend, type GanttTask } from "@/components/screens/schedule/gantt-grid";

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
    .select(
      "id, name, parent_task_id, start_date, end_date, is_milestone, is_on_hold, manual_status, progress_percent, phase:phases(label, colour), system_instance:system_instances(name)",
    )
    .eq("project_id", projectId)
    .order("start_date");

  const ganttTasks: GanttTask[] = (tasks ?? []).map((t) => {
    const phase = t.phase as unknown as { label: string; colour: string } | null;
    const inst = t.system_instance as unknown as { name: string | null } | null;
    return {
      id: t.id,
      name: t.name,
      group: inst?.name ?? "Project tasks",
      phaseColour: phase?.colour ?? null,
      phaseLabel: phase?.label ?? null,
      startDate: t.start_date,
      endDate: t.end_date,
      progressPercent: t.progress_percent != null ? Number(t.progress_percent) : null,
      isMilestone: t.is_milestone,
      isOnHold: t.is_on_hold,
      status:
        t.manual_status === "done"
          ? "done"
          : (t.progress_percent ?? 0) > 0
            ? "in_progress"
            : "ready",
    };
  });

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
        <div className="pl-scroll" style={{ padding: "18px 24px 24px" }}>
          <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
              <span className="mono tnum">{ganttTasks.length}</span> tasks
            </span>
            <GanttLegend />
          </div>
          <GanttGrid tasks={ganttTasks} />
        </div>
      )}
    </AppShellWithSession>
  );
}
