import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { requireContext } from "@/lib/auth/session";
import { signOut } from "@/app/(auth)/login/actions";

export default async function ForemanMorePage() {
  const ctx = await requireContext();
  return (
    <MobileShell which="foreman">
      <MobileHeader title="More" subtitle="Site Foreman" />
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="pl-card" style={{ padding: 14 }}>
          <div style={{ fontSize: 11, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Signed in as
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{ctx.user.email}</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>{ctx.organizationName} · Site Foreman</div>
        </div>

        {[
          { ico: "folder", label: "My projects", href: "/foreman/projects" },
          { ico: "history", label: "Activity", href: "/audit" },
        ].map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className="pl-card"
            style={{ padding: 12, display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}
          >
            <Icon name={m.ico} size={16} />
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{m.label}</span>
            <Icon name="chevR" size={14} style={{ color: "var(--ink-5)" }} />
          </Link>
        ))}

        <form action={signOut}>
          <button
            type="submit"
            className="pl-btn danger"
            style={{ width: "100%", justifyContent: "center", marginTop: 12, height: 36 }}
          >
            Sign out
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
