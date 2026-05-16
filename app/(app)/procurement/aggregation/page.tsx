import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { AggregationView } from "@/components/screens/aggregation/aggregation-view";

export default async function AggregationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const ctx = await requireContext();
  const sp = await searchParams;
  const supabase = await createClient();

  // Approved projects + their lines
  const { data: states } = await supabase
    .from("mto_states")
    .select("project_id, project:projects(id, code, name)")
    .eq("state", "approved");

  const projectList: { id: string; code: string | null; name: string; total: number }[] = [];
  for (const s of states ?? []) {
    const p = s.project as unknown as { id: string; code: string | null; name: string } | null;
    if (p) projectList.push({ id: p.id, code: p.code, name: p.name, total: 0 });
  }

  // Fetch MTO lines for all approved instances
  const { data: instances } = await supabase
    .from("system_instances")
    .select("id, project_id")
    .in("project_id", projectList.map((p) => p.id).length ? projectList.map((p) => p.id) : ["00000000-0000-0000-0000-000000000000"]);
  const instanceProjectMap = new Map<string, string>();
  (instances ?? []).forEach((i) => {
    if (i.project_id) instanceProjectMap.set(i.id, i.project_id);
  });

  const { data: rawLines } = await supabase
    .from("mto_lines")
    .select(
      "system_instance_id, quantity, unit, unit_cost, material_version:material_versions(material:materials(id, code, name, emoji, supplier_id, supplier:suppliers(name)))",
    )
    .eq("organization_id", ctx.organizationId)
    .in(
      "system_instance_id",
      Array.from(instanceProjectMap.keys()).length > 0
        ? Array.from(instanceProjectMap.keys())
        : ["00000000-0000-0000-0000-000000000000"],
    );

  // Aggregate per material
  type Agg = {
    materialId: string;
    code: string;
    name: string;
    emoji: string | null;
    unit: string;
    unitCost: number;
    supplierId: string | null;
    supplierName: string | null;
    perProject: Map<string, number>;
  };
  const byMaterial = new Map<string, Agg>();
  const projectMeta = new Map<string, { id: string; code: string | null; name: string }>();
  projectList.forEach((p) => projectMeta.set(p.id, p));

  (rawLines ?? []).forEach((l) => {
    const mv = l.material_version as unknown as
      | {
          material: {
            id: string;
            code: string;
            name: string;
            emoji: string | null;
            supplier_id: string | null;
            supplier: { name: string } | null;
          } | null;
        }
      | null;
    const m = mv?.material;
    if (!m) return;
    const projectId = instanceProjectMap.get(l.system_instance_id);
    if (!projectId) return;
    let agg = byMaterial.get(m.id);
    if (!agg) {
      agg = {
        materialId: m.id,
        code: m.code,
        name: m.name,
        emoji: m.emoji,
        unit: l.unit,
        unitCost: Number(l.unit_cost),
        supplierId: m.supplier_id,
        supplierName: m.supplier?.name ?? null,
        perProject: new Map(),
      };
      byMaterial.set(m.id, agg);
    }
    agg.perProject.set(projectId, (agg.perProject.get(projectId) ?? 0) + Number(l.quantity));
  });

  const lines = Array.from(byMaterial.values()).map((a) => {
    const totalQty = Array.from(a.perProject.values()).reduce((s, n) => s + n, 0);
    return {
      materialId: a.materialId,
      code: a.code,
      name: a.name,
      emoji: a.emoji,
      unit: a.unit,
      totalQty,
      unitCost: a.unitCost,
      supplierId: a.supplierId,
      supplierName: a.supplierName,
      perProject: Array.from(a.perProject.entries()).map(([pid, qty]) => {
        const pm = projectMeta.get(pid);
        return {
          projectId: pid,
          projectCode: pm?.code ?? null,
          projectName: pm?.name ?? "—",
          qty,
        };
      }),
    };
  });

  // Compute per-project totals
  const projectTotalMap = new Map<string, number>();
  lines.forEach((l) => {
    l.perProject.forEach((pp) => {
      projectTotalMap.set(
        pp.projectId,
        (projectTotalMap.get(pp.projectId) ?? 0) + pp.qty * l.unitCost,
      );
    });
  });
  const projectsWithTotal = projectList.map((p) => ({
    ...p,
    total: projectTotalMap.get(p.id) ?? 0,
  }));

  return (
    <AppShellWithSession crumbs={["Procurement", "Aggregation"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">MTO aggregation</div>
            <div className="pl-page-sub">
              Combine material demand across approved MTOs. Click a line to see project provenance.
            </div>
          </div>
        </div>
      </div>

      {sp.error && (
        <div
          style={{
            margin: "12px 24px 0",
            padding: "8px 10px",
            background: "var(--danger-soft)",
            border: "1px solid #F4C0C0",
            borderRadius: 4,
            color: "var(--danger)",
            fontSize: 12,
          }}
        >
          {sp.error}
        </div>
      )}

      {projectList.length === 0 ? (
        <EmptyState
          ico="fork"
          title="No approved MTOs yet"
          description="Aggregation requires at least one approved MTO. Approve a project's MTO, then come back here."
        />
      ) : (
        <AggregationView projects={projectsWithTotal} lines={lines} />
      )}
    </AppShellWithSession>
  );
}
