import { notFound } from "next/navigation";
import { MobileShell } from "@/components/chrome/mobile-shell";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { StoremanListDetail, type PickLine } from "@/components/screens/storeman/list-detail";

export default async function StoremanListPage({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  // The "listId" is the project ID in this MVP — the picking list is the project's approved MTO.
  const { listId: projectId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, code, name, mto_state:mto_states(state)")
    .eq("id", projectId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!project) notFound();

  const state = ((project.mto_state as unknown as { state: string }[]) ?? [])[0]?.state ?? "draft";

  const { data: instances } = await supabase
    .from("system_instances")
    .select("id")
    .eq("project_id", projectId);
  const instanceIds = (instances ?? []).map((i) => i.id);

  const { data: rawLines } = await supabase
    .from("mto_lines")
    .select(
      "id, quantity, unit, material_version:material_versions(material:materials(id, code, name, emoji))",
    )
    .eq("organization_id", ctx.organizationId)
    .in("system_instance_id", instanceIds.length > 0 ? instanceIds : ["00000000-0000-0000-0000-000000000000"]);

  // Compute issued qty per mto_line
  const lineIds = (rawLines ?? []).map((l) => l.id);
  const { data: issuedRows } = await supabase
    .from("stock_transactions")
    .select("mto_line_id, qty")
    .eq("organization_id", ctx.organizationId)
    .eq("txn_type", "issuance")
    .in("mto_line_id", lineIds.length > 0 ? lineIds : ["00000000-0000-0000-0000-000000000000"]);
  const issuedByLine: Record<string, number> = {};
  (issuedRows ?? []).forEach((r) => {
    if (!r.mto_line_id) return;
    issuedByLine[r.mto_line_id] = (issuedByLine[r.mto_line_id] ?? 0) + Number(r.qty);
  });

  // Stock balances + warehouse locations
  const materialIds = (rawLines ?? [])
    .map((l) => (l.material_version as unknown as { material: { id: string } | null } | null)?.material?.id)
    .filter((id): id is string => !!id);
  const { data: balances } = await supabase
    .from("stock_balances")
    .select("material_id, location_id, balance, location:warehouse_locations(name)")
    .eq("organization_id", ctx.organizationId)
    .in("material_id", materialIds.length > 0 ? materialIds : ["00000000-0000-0000-0000-000000000000"]);

  const byMaterial: Record<string, { id: string; name: string; balance: number }[]> = {};
  (balances ?? []).forEach((b) => {
    if (!b.material_id) return;
    const loc = b.location as unknown as { name: string } | null;
    byMaterial[b.material_id] ??= [];
    byMaterial[b.material_id].push({
      id: b.location_id ?? "",
      name: loc?.name ?? "—",
      balance: Number(b.balance ?? 0),
    });
  });

  const lines: PickLine[] = (rawLines ?? []).map((l) => {
    const mat = (l.material_version as unknown as { material: { id: string; code: string; name: string; emoji: string | null } | null } | null)?.material;
    const matId = mat?.id ?? "";
    return {
      id: l.id,
      materialId: matId,
      code: mat?.code ?? "—",
      name: mat?.name ?? l.id.slice(0, 8),
      emoji: mat?.emoji ?? null,
      unit: l.unit,
      mtoQty: Number(l.quantity),
      issuedQty: issuedByLine[l.id] ?? 0,
      locations: byMaterial[matId] ?? [],
    };
  });

  return (
    <MobileShell which="storeman">
      <StoremanListDetail
        projectId={projectId}
        projectCode={project.code}
        projectName={project.name}
        state={state}
        lines={lines}
      />
    </MobileShell>
  );
}
