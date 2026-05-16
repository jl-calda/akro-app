import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { createSubAssembly } from "./actions";

export default async function SubAssembliesListPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const ctx = await requireContext();
  const params = await searchParams;
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("sub_assemblies")
    .select("id, name, scope, created_at, sub_assembly_versions(version, is_published)")
    .eq("organization_id", ctx.organizationId)
    .order("name");

  return (
    <AppShellWithSession crumbs={["Catalog", "Sub-assemblies"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Sub-assemblies</div>
            <div className="pl-page-sub">
              Parametric components referenced from Models. Each version has a parameter signature.
            </div>
          </div>
          <Pill variant="info">{(rows ?? []).length}</Pill>
        </div>
      </div>

      {params.error && (
        <div style={{ margin: "12px 24px 0", padding: "8px 10px", background: "var(--danger-soft)", border: "1px solid #F4C0C0", borderRadius: 4, color: "var(--danger)", fontSize: 12 }}>
          {params.error}
        </div>
      )}

      <div style={{ padding: "12px 24px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <form action={createSubAssembly} style={{ display: "grid", gridTemplateColumns: "2fr 200px auto", gap: 8, alignItems: "flex-end" }}>
          <div>
            <div className="pl-label">Add sub-assembly</div>
            <input name="name" placeholder="End termination kit, intermediate anchor…" className="pl-input" style={{ width: "100%" }} required />
          </div>
          <div>
            <div className="pl-label">Scope</div>
            <select name="scope" className="pl-input" style={{ width: "100%" }} defaultValue="global">
              <option value="global">Global</option>
              <option value="system">System-scoped</option>
              <option value="model_only">Model-only</option>
            </select>
          </div>
          <Btn variant="primary" ico="plus" type="submit">Add</Btn>
        </form>
      </div>

      <div className="pl-scroll" style={{ padding: 24 }}>
        {(rows ?? []).length === 0 ? (
          <EmptyState
            ico="fork"
            title="No sub-assemblies yet"
            description="Examples: end-termination kit, intermediate anchor, fastener pack. Reference them from Model parts lists with parameter bindings."
          />
        ) : (
          <table className="pl-table" style={{ background: "var(--surface)" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Scope</th>
                <th>Version</th>
                <th style={{ width: 110 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).map((s) => {
                const versions = ((s.sub_assembly_versions as unknown as { version: number; is_published: boolean }[]) ?? []).sort((a, b) => b.version - a.version);
                const latest = versions[0];
                return (
                  <tr key={s.id}>
                    <td>
                      <Link href={`/catalog/sub-assemblies/${s.id}`} className="pl-link" style={{ fontWeight: 500 }}>
                        {s.name}
                      </Link>
                    </td>
                    <td><Chip>{s.scope}</Chip></td>
                    <td><Chip>v{latest?.version ?? 1}</Chip></td>
                    <td>
                      <Pill variant={latest?.is_published ? "approved" : "draft"} dot>
                        {latest?.is_published ? "published" : "draft"}
                      </Pill>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AppShellWithSession>
  );
}
