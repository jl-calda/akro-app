import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Icon } from "@/components/ui/icon";
import { Chip } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export default async function AuditPage() {
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("activity_events")
    .select("id, event_type, payload, occurred_at, user_id, project_id")
    .eq("organization_id", ctx.organizationId)
    .order("occurred_at", { ascending: false })
    .limit(200);

  return (
    <AppShellWithSession crumbs={["Audit log"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Audit log</div>
            <div className="pl-page-sub">Append-only record of every meaningful action.</div>
          </div>
          <Chip>{(events ?? []).length} events</Chip>
        </div>
      </div>
      <div className="pl-scroll" style={{ background: "var(--surface)" }}>
        <table className="pl-table">
          <thead>
            <tr>
              <th style={{ width: 220 }}>When</th>
              <th style={{ width: 200 }}>Event</th>
              <th style={{ width: 140 }}>User</th>
              <th style={{ width: 140 }}>Project</th>
              <th>Payload</th>
            </tr>
          </thead>
          <tbody>
            {(events ?? []).map((e) => (
              <tr key={e.id}>
                <td className="mono tnum" style={{ color: "var(--ink-3)" }}>
                  {new Date(e.occurred_at).toLocaleString()}
                </td>
                <td>
                  <span className="mono" style={{ color: "var(--primary)" }}>{e.event_type}</span>
                </td>
                <td className="mono" style={{ color: "var(--ink-4)" }}>
                  {e.user_id ? e.user_id.slice(0, 8) + "…" : "—"}
                </td>
                <td className="mono" style={{ color: "var(--ink-4)" }}>
                  {e.project_id ? e.project_id.slice(0, 8) + "…" : "—"}
                </td>
                <td
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: "var(--ink-3)",
                    maxWidth: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.payload ? JSON.stringify(e.payload) : "—"}
                </td>
              </tr>
            ))}
            {(events ?? []).length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--ink-4)" }}>
                  No events yet. Activity will accrue as you use the app.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShellWithSession>
  );
}
