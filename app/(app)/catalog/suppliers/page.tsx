import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Check, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { createSupplier, deleteSupplier } from "./actions";

export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const ctx = await requireContext();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("suppliers")
    .select("id, name, contact, notes, created_at")
    .eq("organization_id", ctx.organizationId)
    .order("name");

  return (
    <AppShellWithSession crumbs={["Catalog", "Suppliers"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div className="pl-page-title">Suppliers</div>
          <Pill variant="info">{(rows ?? []).length}</Pill>
          <div className="pl-page-actions">
            <Btn ico="upload" variant="ghost">Import CSV</Btn>
          </div>
        </div>
      </div>

      {params.error && (
        <div style={{ margin: "12px 24px 0", padding: "8px 10px", background: "var(--danger-soft)", border: "1px solid #F4C0C0", borderRadius: 4, color: "var(--danger)", fontSize: 12 }}>
          {params.error}
        </div>
      )}

      <div style={{ padding: "12px 24px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <form action={createSupplier} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div className="pl-label">Add supplier</div>
            <input name="name" placeholder="Supplier name" className="pl-input" style={{ width: "100%" }} required />
          </div>
          <div style={{ flex: 1 }}>
            <div className="pl-label">Contact</div>
            <input name="contact" placeholder="Email, phone, or notes" className="pl-input" style={{ width: "100%" }} />
          </div>
          <Btn variant="primary" ico="plus" type="submit">Add</Btn>
        </form>
      </div>

      <div className="pl-scroll" style={{ background: "var(--surface)" }}>
        <table className="pl-table">
          <thead>
            <tr>
              <th style={{ width: 28 }}><Check /></th>
              <th>Name</th>
              <th>Contact</th>
              <th style={{ width: 140 }}>Created</th>
              <th style={{ width: 60 }} />
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r) => (
              <tr key={r.id}>
                <td><Check /></td>
                <td><span style={{ fontWeight: 500 }}>{r.name}</span></td>
                <td style={{ color: "var(--ink-3)" }}>{r.contact ?? "—"}</td>
                <td className="mono tnum" style={{ color: "var(--ink-4)" }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td>
                  <form action={deleteSupplier}>
                    <input type="hidden" name="id" value={r.id} />
                    <button type="submit" className="pl-btn ghost sm" title="Delete">
                      <Icon name="trash" size={12} />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(rows ?? []).length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 32, color: "var(--ink-4)" }}>
                  No suppliers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShellWithSession>
  );
}
