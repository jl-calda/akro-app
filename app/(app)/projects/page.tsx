import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Check, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const STATUS_VARIANT: Record<string, "draft" | "approved" | "info" | "danger"> = {
  draft: "draft",
  active: "approved",
  on_hold: "info",
  completed: "approved",
  cancelled: "danger",
};

export default async function ProjectsPage() {
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id, code, name, client_name, location, status, needed_by_date, start_date, created_at, mto_state:mto_states(state)")
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });

  const rows = projects ?? [];

  return (
    <AppShellWithSession crumbs={["Projects"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div className="pl-page-title">Projects</div>
          <Pill variant="info">{rows.length}</Pill>
          <span style={{ fontSize: 12, color: "var(--ink-4)" }}>All projects in your workspace.</span>
          <div className="pl-page-actions">
            <Btn ico="filter" variant="ghost">Filter</Btn>
            <Btn ico="download" variant="ghost">Export</Btn>
            <Link href="/projects/new"><Btn variant="primary" ico="plus">New project</Btn></Link>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          ico="folder"
          title="No projects yet"
          description="Create your first project to begin tracking quotes, MTOs, stock, and schedule."
          actionLabel="New project"
          actionHref="/projects/new"
        />
      ) : (
        <div className="pl-scroll" style={{ background: "var(--surface)" }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 28 }}><Check /></th>
                <th style={{ width: 140 }}>Code</th>
                <th>Name</th>
                <th style={{ width: 160 }}>Client</th>
                <th style={{ width: 120 }}>Status</th>
                <th style={{ width: 130 }}>MTO state</th>
                <th style={{ width: 120 }}>Due</th>
                <th style={{ width: 28 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const mto = ((p.mto_state as unknown as { state: string }[]) ?? [])[0]?.state ?? "draft";
                const variant = STATUS_VARIANT[p.status] ?? "draft";
                return (
                  <tr key={p.id}>
                    <td><Check /></td>
                    <td>
                      {p.code ? (
                        <Chip>{p.code}</Chip>
                      ) : (
                        <span style={{ color: "var(--ink-5)" }}>—</span>
                      )}
                    </td>
                    <td>
                      <Link href={`/projects/${p.id}/overview`} className="pl-link" style={{ fontWeight: 500 }}>
                        {p.name}
                      </Link>
                      {p.location && (
                        <div style={{ fontSize: 11, color: "var(--ink-5)" }}>{p.location}</div>
                      )}
                    </td>
                    <td style={{ color: "var(--ink-3)" }}>{p.client_name ?? "—"}</td>
                    <td><Pill variant={variant} dot>{p.status}</Pill></td>
                    <td>
                      <Pill variant={mto === "approved" ? "approved" : mto === "modified_after_approval" ? "modified" : "draft"} dot>
                        {mto.replace(/_/g, " ")}
                      </Pill>
                    </td>
                    <td className="mono tnum" style={{ color: "var(--ink-3)" }}>
                      {p.needed_by_date ?? "—"}
                    </td>
                    <td><Icon name="dots" size={14} style={{ color: "var(--ink-5)" }} /></td>
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
