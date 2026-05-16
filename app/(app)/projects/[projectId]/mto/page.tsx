import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, HiVis, Pill, Seg } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { submitMtoForApproval } from "./actions";

export default async function ProjectMtoPage({
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

  const { data: mtoState } = await supabase
    .from("mto_states")
    .select("state, submitted_at, approved_at, rejected_at, rejection_reason")
    .eq("project_id", projectId)
    .maybeSingle();

  const { data: lines } = await supabase
    .from("mto_lines")
    .select("id, quantity, unit, unit_cost, wastage_pct, is_overridden, sub_assembly_alias")
    .eq("organization_id", ctx.organizationId)
    .in(
      "system_instance_id",
      (
        await supabase
          .from("system_instances")
          .select("id")
          .eq("project_id", projectId)
          .eq("organization_id", ctx.organizationId)
      ).data?.map((i) => i.id) ?? [],
    );

  const state = mtoState?.state ?? "draft";
  const total = (lines ?? []).reduce((s, l) => s + Number(l.quantity) * Number(l.unit_cost), 0);

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "MTO"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
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
            <Btn ico="download">Export</Btn>
            {state === "draft" && (
              <form action={submitMtoForApproval}>
                <input type="hidden" name="projectId" value={projectId} />
                <Btn variant="primary" ico="check" type="submit">
                  Submit for approval
                </Btn>
              </form>
            )}
            {(state === "approved" || state === "modified_after_approval") && (
              <Btn variant="primary" ico="refresh">Re-issue to storeman</Btn>
            )}
          </div>
        </div>
      </div>

      <ProjectTabs projectId={projectId} />

      <div className="pl-filterbar">
        <div style={{ fontSize: 13, fontWeight: 600 }}>MTO · Bill of Quantities</div>
        <span style={{ color: "var(--ink-5)" }}>·</span>
        <span className="tnum" style={{ fontSize: 12, color: "var(--ink-4)" }}>
          {(lines ?? []).length} lines · ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>Group by</span>
          <Seg items={["System", "Material", "Category", "Supplier"]} active="System" />
        </div>
      </div>

      {(lines ?? []).length === 0 ? (
        <EmptyState
          ico="list"
          title="No MTO lines yet"
          description="Add a system instance to the Working Set — its rule engine output will land here as MTO lines."
        />
      ) : (
        <div className="pl-scroll" style={{ background: "var(--surface)" }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th>Sub-assembly</th>
                <th className="num">Qty</th>
                <th>Unit</th>
                <th className="num">Unit cost</th>
                <th className="num">Wastage</th>
                <th className="num">Line total</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {(lines ?? []).map((l) => (
                <tr key={l.id}>
                  <td>{l.sub_assembly_alias ?? "—"}</td>
                  <td className="num mono">{Number(l.quantity).toLocaleString()}</td>
                  <td>{l.unit}</td>
                  <td className="num mono">${Number(l.unit_cost).toFixed(2)}</td>
                  <td className="num mono" style={{ color: "var(--ink-4)" }}>
                    {l.wastage_pct ?? 0}%
                  </td>
                  <td className="num mono" style={{ fontWeight: 600 }}>
                    ${(Number(l.quantity) * Number(l.unit_cost)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    {l.is_overridden && <Pill variant="modified">overridden</Pill>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShellWithSession>
  );
}
