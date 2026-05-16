import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, HiVis, Pill } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { submitMtoForApproval } from "./actions";
import { MtoWithPanel, type MtoLine, type LocationStock } from "@/components/screens/mto/mto-with-panel";

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
    .select("state")
    .eq("project_id", projectId)
    .maybeSingle();

  const { data: instances } = await supabase
    .from("system_instances")
    .select("id")
    .eq("project_id", projectId)
    .eq("organization_id", ctx.organizationId);

  const instanceIds = (instances ?? []).map((i) => i.id);

  const { data: rawLines } = await supabase
    .from("mto_lines")
    .select(
      "id, quantity, unit, unit_cost, wastage_pct, is_overridden, sub_assembly_alias, material_version:material_versions(id, material:materials(code, name, emoji, category:material_categories(name), supplier:suppliers(name)))",
    )
    .eq("organization_id", ctx.organizationId)
    .in("system_instance_id", instanceIds.length > 0 ? instanceIds : ["00000000-0000-0000-0000-000000000000"]);

  const lines: MtoLine[] = (rawLines ?? []).map((l) => {
    const mv = l.material_version as unknown as
      | {
          material: {
            code: string;
            name: string;
            emoji: string | null;
            category: { name: string } | null;
            supplier: { name: string } | null;
          } | null;
        }
      | null;
    return {
      id: l.id,
      alias: l.sub_assembly_alias,
      quantity: Number(l.quantity),
      unit: l.unit,
      unit_cost: Number(l.unit_cost),
      wastage_pct: l.wastage_pct != null ? Number(l.wastage_pct) : null,
      is_overridden: l.is_overridden,
      material_code: mv?.material?.code ?? null,
      material_name: mv?.material?.name ?? null,
      material_emoji: mv?.material?.emoji ?? null,
      category_name: mv?.material?.category?.name ?? null,
      supplier_name: mv?.material?.supplier?.name ?? null,
    };
  });

  // Stock by location per material (read for the selected lines only)
  const materialIds = Array.from(
    new Set(
      (rawLines ?? [])
        .map((l) => (l.material_version as unknown as { material: { id?: string } | null } | null)?.material)
        .filter(Boolean)
        .map((m) => (m as { id?: string }).id)
        .filter(Boolean),
    ),
  );
  const locationStock: Record<string, LocationStock[]> = {};
  if (materialIds.length > 0) {
    const { data: stockRows } = await supabase
      .from("stock_balances")
      .select("material_id, location_id, balance, location:warehouse_locations(name)")
      .eq("organization_id", ctx.organizationId)
      .in("material_id", materialIds as string[]);
    // map by mto_line_id is awkward — we keyed by the line ID. Since line→material is 1:1 by mv,
    // we look up by material_id and dupe into each line.
    const byMaterial: Record<string, LocationStock[]> = {};
    (stockRows ?? []).forEach((r) => {
      if (!r.material_id) return;
      const loc = r.location as unknown as { name: string } | null;
      byMaterial[r.material_id] ??= [];
      byMaterial[r.material_id].push({
        location_id: r.location_id ?? "",
        location_name: loc?.name ?? "—",
        balance: Number(r.balance ?? 0),
      });
    });
    (rawLines ?? []).forEach((l) => {
      const m = (l.material_version as unknown as { material: { id?: string } | null } | null)?.material;
      const id = (m as { id?: string } | null)?.id;
      if (id && byMaterial[id]) {
        locationStock[l.id] = byMaterial[id];
      }
    });
  }

  const state = mtoState?.state ?? "draft";

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

      {lines.length === 0 ? (
        <EmptyState
          ico="list"
          title="No MTO lines yet"
          description="Add a system instance to the Working Set — its rule engine output will land here as MTO lines."
        />
      ) : (
        <MtoWithPanel lines={lines} locationStock={locationStock} />
      )}
    </AppShellWithSession>
  );
}
