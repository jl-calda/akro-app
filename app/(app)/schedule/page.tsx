import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Pill, Seg, ProgressBar } from "@/components/ui/primitives";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const PHASE_COLOR: Record<string, string> = {
  fabrication: "#A16B3B",
  installation: "#1E40AF",
  commissioning: "#0F766E",
  inspection: "#6B5BB3",
};

export default async function CrossSchedulePage() {
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, code, name, start_date, needed_by_date, status, tasks(id, name, phase_id, start_date, end_date, progress_percent)")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });

  const rows = projects ?? [];

  return (
    <AppShellWithSession crumbs={["Schedule"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Cross-project schedule</div>
            <div className="pl-page-sub">Gantt across active projects.</div>
          </div>
          <div className="pl-page-actions">
            <Seg items={["Gantt", "List"]} active="Gantt" />
            <Seg items={["Week", "Month"]} active="Week" />
            <Btn ico="filter" variant="ghost">Filter</Btn>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          ico="calendar"
          title="No scheduled work yet"
          description="Create projects + system instances to see tasks generated on the cross-project Gantt."
        />
      ) : (
        <div className="pl-scroll" style={{ padding: "20px 24px" }}>
          <div className="pl-card">
            <div className="pl-card-head">
              <span style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Projects
              </span>
              <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-4)" }}>
                {rows.length} active
              </span>
            </div>
            <table className="pl-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Start</th>
                  <th style={{ width: 120 }}>Due</th>
                  <th style={{ width: 200 }}>Tasks</th>
                  <th style={{ width: 160 }}>Phase mix</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const tasks = ((p.tasks as unknown as { id: string }[]) ?? []);
                  return (
                    <tr key={p.id}>
                      <td>
                        <a href={`/projects/${p.id}/schedule`} className="pl-link" style={{ fontWeight: 500 }}>
                          {p.code ? `${p.code} · ${p.name}` : p.name}
                        </a>
                      </td>
                      <td>
                        <Pill variant={p.status === "active" ? "approved" : "draft"} dot>{p.status}</Pill>
                      </td>
                      <td className="mono tnum" style={{ color: "var(--ink-3)" }}>{p.start_date ?? "—"}</td>
                      <td className="mono tnum" style={{ color: "var(--ink-3)" }}>{p.needed_by_date ?? "—"}</td>
                      <td className="mono tnum">{tasks.length}</td>
                      <td>
                        <div style={{ display: "flex", gap: 2, height: 8 }}>
                          {Object.values(PHASE_COLOR).map((c, i) => (
                            <span
                              key={i}
                              style={{
                                flex: 1,
                                background: c,
                                borderRadius: i === 0 ? "2px 0 0 2px" : i === 3 ? "0 2px 2px 0" : 0,
                                opacity: tasks.length > 0 ? 1 : 0.25,
                              }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShellWithSession>
  );
}
