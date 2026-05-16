import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const STATUS_VARIANT: Record<string, "draft" | "info" | "approved" | "modified" | "danger"> = {
  draft: "draft",
  internal_review: "info",
  sent: "info",
  awarded: "approved",
  rejected: "danger",
  expired: "modified",
};

export default async function ProjectQuotesPage({
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

  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, quote_number, name, status, total_cost, expiry_date")
    .eq("project_id", projectId)
    .eq("organization_id", ctx.organizationId)
    .order("created_at", { ascending: false });

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "Quotes"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
          <Pill variant="info">Quotes</Pill>
          <div className="pl-page-actions">
            <Btn variant="primary" ico="plus">New quote</Btn>
          </div>
        </div>
      </div>
      <ProjectTabs projectId={projectId} />
      <div className="pl-scroll" style={{ background: "var(--surface)" }}>
        {(quotes ?? []).length === 0 ? (
          <EmptyState
            ico="edit"
            title="No quotes on this project"
            description="Create the first quote — Build / Price / Document sections walk through the lifecycle."
          />
        ) : (
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 130 }}>#</th>
                <th>Name</th>
                <th style={{ width: 140 }}>Status</th>
                <th className="num" style={{ width: 120 }}>Total</th>
                <th style={{ width: 120 }}>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {(quotes ?? []).map((q) => (
                <tr key={q.id}>
                  <td><Chip>{q.quote_number}</Chip></td>
                  <td>
                    <Link href={`/quotes/${q.id}`} className="pl-link" style={{ fontWeight: 500 }}>
                      {q.name ?? "Untitled"}
                    </Link>
                  </td>
                  <td>
                    <Pill variant={STATUS_VARIANT[q.status] ?? "draft"} dot>
                      {q.status.replace(/_/g, " ")}
                    </Pill>
                  </td>
                  <td className="num mono">
                    {q.total_cost ? `$${Number(q.total_cost).toLocaleString()}` : "—"}
                  </td>
                  <td className="mono tnum" style={{ color: "var(--ink-3)" }}>{q.expiry_date ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShellWithSession>
  );
}
