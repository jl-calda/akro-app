import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Pill, ProgressBar, HiVis } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export default async function StockOverviewPage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  const [{ data: balances }, { data: locations }, { data: txns }] = await Promise.all([
    supabase
      .from("stock_balances")
      .select("organization_id, material_id, location_id, balance")
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("warehouse_locations")
      .select("id, name")
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("stock_transactions")
      .select("id, txn_type, qty, performed_at, material:materials(name, emoji, code), location:warehouse_locations(name)")
      .eq("organization_id", ctx.organizationId)
      .order("performed_at", { ascending: false })
      .limit(10),
  ]);

  const balanceCount = (balances ?? []).length;
  const totalQty = (balances ?? []).reduce((s, b) => s + Number(b.balance ?? 0), 0);

  return (
    <AppShellWithSession crumbs={["Stock"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Stock</div>
            <div className="pl-page-sub">
              Balances are computed from <span className="mono">stock_transactions</span>.
            </div>
          </div>
          <div className="pl-page-actions">
            <Btn ico="upload" variant="ghost">Adjust</Btn>
            <Btn variant="primary" ico="plus">Receive</Btn>
          </div>
        </div>
      </div>

      <div className="pl-meta" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <Stat label="Stocked SKUs" value={balanceCount.toString()} />
        <Stat label="Total qty" value={totalQty.toLocaleString()} />
        <Stat label="Warehouse locations" value={(locations ?? []).length.toString()} />
        <Stat label="Movements · last 10" value={(txns ?? []).length.toString()} />
      </div>

      <div className="pl-scroll" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="pl-card">
          <div className="pl-card-head">
            <Icon name="store" />
            <div className="pl-card-title">Stock by material × location</div>
            <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-4)" }}>
              {balanceCount} rows
            </span>
          </div>
          {balanceCount === 0 ? (
            <EmptyState
              ico="package"
              title="No stock movements yet"
              description="Receive material against a PO or use the Adjust action to seed opening balances."
            />
          ) : (
            <table className="pl-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Location</th>
                  <th className="num">Balance</th>
                </tr>
              </thead>
              <tbody>
                {(balances ?? []).map((b, i) => (
                  <tr key={`${b.material_id}-${b.location_id}-${i}`}>
                    <td className="mono">{b.material_id?.slice(0, 8)}…</td>
                    <td className="mono">{b.location_id?.slice(0, 8)}…</td>
                    <td className="num mono">{Number(b.balance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="pl-card">
          <div className="pl-card-head">
            <Icon name="history" />
            <div className="pl-card-title">Recent movements</div>
          </div>
          {(txns ?? []).length === 0 ? (
            <div style={{ padding: 18, fontSize: 12, color: "var(--ink-4)" }}>
              No transactions yet.
            </div>
          ) : (
            <table className="pl-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Material</th>
                  <th>Location</th>
                  <th className="num">Qty</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {(txns ?? []).map((t) => {
                  const m = t.material as unknown as { name: string; emoji: string; code: string } | null;
                  const l = t.location as unknown as { name: string } | null;
                  return (
                    <tr key={t.id}>
                      <td>
                        <Pill variant={t.txn_type === "issuance" ? "info" : t.txn_type === "receipt" ? "approved" : "draft"} dot>
                          {t.txn_type}
                        </Pill>
                      </td>
                      <td>
                        <span style={{ marginRight: 4 }}>{m?.emoji ?? "📦"}</span>
                        <span style={{ fontWeight: 500 }}>{m?.name ?? "—"}</span>
                      </td>
                      <td style={{ color: "var(--ink-3)" }}>{l?.name ?? "—"}</td>
                      <td className="num mono">{Number(t.qty).toLocaleString()}</td>
                      <td className="mono tnum" style={{ color: "var(--ink-4)" }}>
                        {new Date(t.performed_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppShellWithSession>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="pl-meta-cell">
      <div className="pl-meta-label">{label}</div>
      <div className="pl-meta-value mono tnum" style={{ fontSize: 22 }}>{value}</div>
    </div>
  );
}
