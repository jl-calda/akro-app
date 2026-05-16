import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Pill, HiVis } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { requireContext } from "@/lib/auth/session";

export default async function BillingPage() {
  await requireContext();
  return (
    <AppShellWithSession crumbs={["Settings", "Billing"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Billing</div>
            <div className="pl-page-sub">Plan, payment method, invoice history.</div>
          </div>
          <Pill variant="info">UI preview</Pill>
        </div>
      </div>

      <div className="pl-scroll" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="pl-card" style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr auto", gap: 16, alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>
              Current plan
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>Studio</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
              Up to 25 users · 10 projects · 1,000 SKUs
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="mono tnum" style={{ fontSize: 26, fontWeight: 600 }}>$199</div>
            <div style={{ fontSize: 11, color: "var(--ink-5)" }}>/ month</div>
            <Btn variant="primary" style={{ marginTop: 8 }}>Manage subscription</Btn>
          </div>
        </div>

        <div className="pl-card">
          <div className="pl-card-head">
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <Icon name="list" />
              <div className="pl-card-title">Invoice history</div>
            </div>
            <HiVis>UI only</HiVis>
          </div>
          <table className="pl-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th className="num">Amount</th>
                <th>Status</th>
                <th style={{ width: 80 }} />
              </tr>
            </thead>
            <tbody>
              {[
                { id: "INV-2026-005", date: "2026-05-01", amount: 199, status: "Paid" },
                { id: "INV-2026-004", date: "2026-04-01", amount: 199, status: "Paid" },
                { id: "INV-2026-003", date: "2026-03-01", amount: 199, status: "Paid" },
                { id: "INV-2026-002", date: "2026-02-01", amount: 199, status: "Paid" },
                { id: "INV-2026-001", date: "2026-01-01", amount: 99, status: "Paid" },
              ].map((i) => (
                <tr key={i.id}>
                  <td className="mono" style={{ color: "var(--ink-3)" }}>{i.id}</td>
                  <td className="mono tnum">{i.date}</td>
                  <td className="num mono">${i.amount}</td>
                  <td>
                    <Pill variant="approved" dot>{i.status}</Pill>
                  </td>
                  <td>
                    <button className="pl-btn ghost sm">
                      <Icon name="download" size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pl-card" style={{ padding: 20 }}>
          <div className="pl-card-title">Payment method</div>
          <div style={{ marginTop: 12, padding: 16, background: "var(--surface-2)", borderRadius: 6, display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 42,
                height: 28,
                borderRadius: 4,
                background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              VISA
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }} className="mono">•••• 4242</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>Expires 12/2028</div>
            </div>
            <Btn variant="ghost">Update</Btn>
          </div>
          <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--ink-5)" }}>
            Stripe integration is not wired in this preview. UI is shown for layout review.
          </div>
        </div>
      </div>
    </AppShellWithSession>
  );
}
