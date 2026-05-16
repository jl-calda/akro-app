import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Icon } from "@/components/ui/icon";
import { requireContext } from "@/lib/auth/session";

type Card = { href: string; ico: string; title: string; description: string };

const CARDS: Card[] = [
  { href: "/settings/tenant", ico: "folder", title: "Tenant profile", description: "Workspace name, logo, currency." },
  { href: "/settings/labour", ico: "user", title: "Labour & phases", description: "Default phase rates, crew sizes, totals inclusion." },
  { href: "/settings/substrate", ico: "grid", title: "Substrates", description: "Allowable substrates for systems and Models." },
  { href: "/settings/code-patterns", ico: "list", title: "Code patterns", description: "Automatic SKU and project code formats." },
  { href: "/settings/wastage", ico: "list", title: "Wastage", description: "Default + category-specific wastage %." },
  { href: "/settings/approvals", ico: "check", title: "Approvals", description: "MTO and PO approval thresholds." },
  { href: "/settings/branding", ico: "edit", title: "Branding", description: "Logo, colours, EXIF-strip toggle." },
  { href: "/settings/calendar", ico: "calendar", title: "Working calendar", description: "Working days, hours per day, holidays." },
  { href: "/settings/billing", ico: "list", title: "Billing", description: "Plan, payment method, invoices." },
];

export default async function SettingsHubPage() {
  await requireContext();
  return (
    <AppShellWithSession crumbs={["Settings"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Settings</div>
            <div className="pl-page-sub">Workspace-wide configuration.</div>
          </div>
        </div>
      </div>
      <div className="pl-scroll" style={{ padding: "18px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {CARDS.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="pl-card"
              style={{ padding: 16, textDecoration: "none", color: "inherit", display: "flex", gap: 12, alignItems: "flex-start" }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: "var(--primary-soft)",
                  color: "var(--primary)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Icon name={c.ico} size={16} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{c.title}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 4 }}>{c.description}</div>
              </div>
              <Icon name="chevR" size={14} style={{ color: "var(--ink-5)" }} />
            </Link>
          ))}
        </div>
      </div>
    </AppShellWithSession>
  );
}
