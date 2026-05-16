import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Check, Chip, Pill, Seg } from "@/components/ui/primitives";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export default async function AggregationPage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("id, code, name, mto_state:mto_states(state)")
    .eq("organization_id", ctx.organizationId);

  const approved = (projects ?? []).filter((p) => {
    const s = ((p.mto_state as unknown as { state: string }[]) ?? [])[0]?.state;
    return s === "approved";
  });

  return (
    <AppShellWithSession crumbs={["Procurement", "Aggregation"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">MTO aggregation</div>
            <div className="pl-page-sub">
              Combine material demand across approved MTOs. Generate POs grouped by supplier.
            </div>
          </div>
          <div className="pl-page-actions">
            <Btn ico="filter" variant="ghost">Filter</Btn>
            <Btn variant="primary" ico="plus" suffix="chev">Generate PO</Btn>
          </div>
        </div>
      </div>

      <div className="pl-filterbar">
        <span style={{ fontSize: 13, fontWeight: 600 }}>Projects · {approved.length} approved</span>
        <span style={{ color: "var(--ink-5)" }}>·</span>
        <span style={{ fontSize: 12, color: "var(--ink-4)" }}>Select projects to combine demand</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>Group by</span>
          <Seg items={["Supplier", "Category", "Project", "None"]} active="Supplier" />
        </div>
      </div>

      {approved.length === 0 ? (
        <EmptyState
          ico="fork"
          title="No approved MTOs yet"
          description="Aggregation requires at least one approved MTO. Approve a project's MTO, then come back here."
        />
      ) : (
        <div className="pl-scroll" style={{ background: "var(--surface)" }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 28 }}><Check /></th>
                <th>Code</th>
                <th>Project</th>
                <th>MTO state</th>
              </tr>
            </thead>
            <tbody>
              {approved.map((p) => (
                <tr key={p.id}>
                  <td><Check /></td>
                  <td>{p.code && <Chip>{p.code}</Chip>}</td>
                  <td>{p.name}</td>
                  <td><Pill variant="approved" dot>approved</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              margin: 24,
              padding: 14,
              background: "var(--surface-2)",
              borderRadius: 6,
              fontSize: 12.5,
              color: "var(--ink-3)",
            }}
          >
            Demand aggregation logic (sum + pack-size rounding + provenance breakdown) ships in a later batch
            alongside the visual PO Generator. The supplier-grouped table and right-side provenance panel are
            visible in the design at <span className="mono">aggregation.jsx</span>.
          </div>
        </div>
      )}
    </AppShellWithSession>
  );
}
