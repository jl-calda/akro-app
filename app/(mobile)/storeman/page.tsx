import { MobileShell } from "@/components/chrome/mobile-shell";
import { StoremanHomeScreen, type StoremanList } from "@/components/screens/storeman-home";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

function dueLabel(needed_by: string | null): { label: string; urgent: boolean } {
  if (!needed_by) return { label: "—", urgent: false };
  const d = new Date(needed_by);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { label: "OVERDUE", urgent: true };
  if (diff === 0) return { label: "Today", urgent: true };
  if (diff === 1) return { label: "Tomorrow", urgent: false };
  return {
    label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    urgent: diff <= 3,
  };
}

export default async function StoremanHomePage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  // Approved projects → picking lists
  const { data: approvedStates } = await supabase
    .from("mto_states")
    .select(
      "project_id, project:projects(id, code, name, client_name, needed_by_date)",
    )
    .eq("state", "approved");

  const { data: locations } = await supabase
    .from("warehouse_locations")
    .select("name")
    .eq("organization_id", ctx.organizationId)
    .limit(1);

  // For each approved project, count MTO lines and issued lines
  const lists: StoremanList[] = [];
  for (const s of approvedStates ?? []) {
    const proj = s.project as unknown as { id: string; code: string | null; name: string; client_name: string | null; needed_by_date: string | null } | null;
    if (!proj) continue;
    const { data: instances } = await supabase
      .from("system_instances")
      .select("id")
      .eq("project_id", proj.id);
    const instanceIds = (instances ?? []).map((i) => i.id);
    const { data: lines } = await supabase
      .from("mto_lines")
      .select("id")
      .in("system_instance_id", instanceIds.length > 0 ? instanceIds : ["00000000-0000-0000-0000-000000000000"]);
    const total = (lines ?? []).length;
    const lineIds = (lines ?? []).map((l) => l.id);
    let issued = 0;
    if (lineIds.length > 0) {
      const { data: issuedRows } = await supabase
        .from("stock_transactions")
        .select("mto_line_id")
        .eq("txn_type", "issuance")
        .in("mto_line_id", lineIds);
      // count distinct mto_line_id that have at least one issuance
      const fulfilled = new Set((issuedRows ?? []).map((r) => r.mto_line_id));
      issued = fulfilled.size;
    }
    const due = dueLabel(proj.needed_by_date);
    lists.push({
      id: proj.id,
      code: proj.code,
      name: proj.name,
      client: proj.client_name,
      dueLabel: due.label,
      urgent: due.urgent,
      issued,
      total,
    });
  }

  // Recent transaction counts
  const { data: recentTxns } = await supabase
    .from("stock_transactions")
    .select("txn_type")
    .eq("organization_id", ctx.organizationId)
    .gte("performed_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const stats = {
    receipts: (recentTxns ?? []).filter((t) => t.txn_type === "receipt").length,
    issued: (recentTxns ?? []).filter((t) => t.txn_type === "issuance").length,
    returns: (recentTxns ?? []).filter((t) => t.txn_type === "return").length,
    open: lists.length,
    overdue: lists.filter((l) => l.urgent && l.issued < l.total).length,
  };

  return (
    <MobileShell which="storeman">
      <StoremanHomeScreen
        stats={stats}
        lists={lists}
        locationName={locations?.[0]?.name ?? "Main Yard"}
      />
    </MobileShell>
  );
}
