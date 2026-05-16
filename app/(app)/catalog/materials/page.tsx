import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Check, Chip, Pill, Seg } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { NewMaterialButton } from "@/components/screens/catalog/new-material-modal";

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; cat?: string }>;
}) {
  const ctx = await requireContext();
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: cats }, { data: sups }, { data: mats }] = await Promise.all([
    supabase
      .from("material_categories")
      .select("id, name, parameter_definitions")
      .eq("organization_id", ctx.organizationId)
      .order("name"),
    supabase
      .from("suppliers")
      .select("id, name")
      .eq("organization_id", ctx.organizationId)
      .order("name"),
    supabase
      .from("materials")
      .select(
        "id, code, name, emoji, category:material_categories(name), supplier:suppliers(name), material_versions(unit, unit_cost, pack_size, default_wastage_pct, reorder_level, version)",
      )
      .eq("organization_id", ctx.organizationId)
      .order("code"),
  ]);

  const categories = (cats ?? []).map((c) => ({
    id: c.id,
    label: c.name,
    parameter_definitions: c.parameter_definitions as { key: string; label: string; type: string }[] | undefined,
  }));
  const suppliers = (sups ?? []).map((s) => ({ id: s.id, label: s.name }));

  const rows = (mats ?? []).map((m) => {
    const versions = (m.material_versions ?? []) as Array<{
      unit: string;
      unit_cost: number;
      pack_size: number;
      default_wastage_pct: number;
      reorder_level: number;
      version: number;
    }>;
    const v = versions.sort((a, b) => b.version - a.version)[0];
    return {
      id: m.id,
      code: m.code,
      name: m.name,
      emoji: m.emoji,
      categoryName: (m.category as unknown as { name: string } | null)?.name ?? null,
      supplierName: (m.supplier as unknown as { name: string } | null)?.name ?? null,
      unit: v?.unit ?? "—",
      unitCost: v?.unit_cost ?? 0,
      packSize: v?.pack_size ?? 1,
      version: v?.version ?? 1,
    };
  });

  return (
    <AppShellWithSession crumbs={["Catalog", "Materials"]} search="Search materials, suppliers, parameter values…">
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div className="pl-page-title">Materials</div>
          <Pill variant="info">{rows.length} SKUs</Pill>
          <span style={{ fontSize: 12, color: "var(--ink-4)" }}>
            across {categories.length} categories · {suppliers.length} suppliers
          </span>
          <div className="pl-page-actions">
            <Btn ico="upload" variant="ghost">Import CSV</Btn>
            <Btn ico="download" variant="ghost">Export</Btn>
            <NewMaterialButton categories={categories} suppliers={suppliers} />
          </div>
        </div>
      </div>

      {params.error && (
        <div
          style={{
            margin: "0 24px",
            marginTop: 12,
            padding: "8px 10px",
            background: "var(--danger-soft)",
            border: "1px solid #F4C0C0",
            borderRadius: 4,
            color: "var(--danger)",
            fontSize: 12,
          }}
        >
          {params.error}
        </div>
      )}

      <div className="pl-tabs">
        <div className="pl-tab is-active">
          All
          <span className="pl-tab-count">{rows.length}</span>
        </div>
        {categories.map((c) => {
          const count = rows.filter((r) => r.categoryName === c.label).length;
          return (
            <div key={c.id} className="pl-tab">
              {c.label}
              <span className="pl-tab-count">{count}</span>
            </div>
          );
        })}
      </div>

      <div className="pl-filterbar">
        <div className="pl-search" style={{ width: 280, height: 30 }}>
          <Icon name="search" size={13} />
          <span style={{ color: "var(--ink-4)" }}>Search SKU or name…</span>
        </div>
        <button className="pl-filter-chip">
          Supplier <span className="pl-filter-val">All</span>
          <Icon name="chev" size={11} />
        </button>
        <button className="pl-filter-chip">
          Stock <span className="pl-filter-val">All</span>
          <Icon name="chev" size={11} />
        </button>
        <button className="pl-filter-chip">
          Version <span className="pl-filter-val">Latest</span>
          <Icon name="chev" size={11} />
        </button>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }} className="tnum">
            {rows.length} total
          </span>
          <Seg items={["Table", "Cards"]} active="Table" />
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          ico="package"
          title="No materials yet"
          description="Add your first material. Defaults you seeded during onboarding are already wired."
        />
      ) : (
        <div className="pl-scroll" style={{ background: "var(--surface)" }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 28 }}>
                  <Check />
                </th>
                <th style={{ width: 44 }} />
                <th style={{ width: 140 }}>SKU</th>
                <th>Name</th>
                <th style={{ width: 120 }}>Category</th>
                <th style={{ width: 120 }}>Supplier</th>
                <th className="num" style={{ width: 90 }}>Unit cost</th>
                <th style={{ width: 100 }}>Pack</th>
                <th style={{ width: 60 }}>Ver</th>
                <th style={{ width: 28 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Check />
                  </td>
                  <td>
                    <div className="pl-thumb">{r.emoji ?? "📦"}</div>
                  </td>
                  <td className="mono" style={{ color: "var(--ink-3)" }}>
                    {r.code}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{r.name}</span>
                  </td>
                  <td>
                    {r.categoryName ? <Chip>{r.categoryName}</Chip> : <span style={{ color: "var(--ink-5)" }}>—</span>}
                  </td>
                  <td style={{ color: "var(--ink-3)" }}>{r.supplierName ?? "—"}</td>
                  <td className="num mono">${Number(r.unitCost).toFixed(2)}</td>
                  <td style={{ color: "var(--ink-4)", fontSize: 12 }}>
                    {r.packSize} / pack · <span className="mono">{r.unit}</span>
                  </td>
                  <td>
                    <Chip>v{r.version}</Chip>
                  </td>
                  <td>
                    <Icon name="dots" size={14} style={{ color: "var(--ink-5)" }} />
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
