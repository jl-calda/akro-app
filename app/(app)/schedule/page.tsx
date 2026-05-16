import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Seg } from "@/components/ui/primitives";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { GanttGrid, GanttLegend, type GanttTask } from "@/components/screens/schedule/gantt-grid";

export default async function CrossSchedulePage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select(
      "id, name, start_date, end_date, is_milestone, is_on_hold, manual_status, progress_percent, phase:phases(label, colour), project:projects(id, code, name)",
    )
    .eq("organization_id", ctx.organizationId)
    .order("start_date");

  const ganttTasks: GanttTask[] = (tasks ?? []).map((t) => {
    const phase = t.phase as unknown as { label: string; colour: string } | null;
    const proj = t.project as unknown as { id: string; code: string | null; name: string } | null;
    return {
      id: t.id,
      name: t.name,
      group: proj ? (proj.code ? `${proj.code} · ${proj.name}` : proj.name) : "—",
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
      href: proj ? `/projects/${proj.id}/schedule` : undefined,
    };
  });

  return (
    <AppShellWithSession crumbs={["Schedule"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Cross-project schedule</div>
            <div className="pl-page-sub">Gantt across active projects · today is highlighted</div>
          </div>
          <div className="pl-page-actions">
            <Seg items={["Gantt", "List"]} active="Gantt" />
            <Seg items={["Week", "Month"]} active="Week" />
            <Btn ico="filter" variant="ghost">Filter</Btn>
          </div>
        </div>
      </div>

      {ganttTasks.length === 0 ? (
        <EmptyState
          ico="calendar"
          title="No scheduled work yet"
          description="Add a project + system instance to see tasks generated on the cross-project Gantt."
        />
      ) : (
        <div className="pl-scroll" style={{ padding: "18px 24px 24px" }}>
          <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
              <span className="mono tnum">{ganttTasks.length}</span> tasks across the workspace
            </span>
            <GanttLegend />
          </div>
          <GanttGrid tasks={ganttTasks} daysToShow={84} />
        </div>
      )}
    </AppShellWithSession>
  );
}
