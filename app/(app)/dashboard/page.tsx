import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, HiVis, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function DashboardPage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  const [
    { count: projectCount },
    { count: materialCount },
    { count: supplierCount },
    { count: modelCount },
    { data: pendingApprovals },
    { data: recentActivity },
    { data: lowStockMaterials },
    { data: modified },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("materials")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("suppliers")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("models")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", ctx.organizationId),
    supabase
      .from("mto_states")
      .select("project_id, submitted_at, project:projects(id, name, code, client_name)")
      .eq("state", "pending_approval")
      .order("submitted_at", { ascending: false })
      .limit(5),
    supabase
      .from("activity_events")
      .select("id, event_type, payload, occurred_at")
      .eq("organization_id", ctx.organizationId)
      .order("occurred_at", { ascending: false })
      .limit(5),
    supabase
      .from("materials")
      .select("id, code, name, emoji, material_versions(reorder_level)")
      .eq("organization_id", ctx.organizationId)
      .limit(5),
    supabase
      .from("mto_states")
      .select("project_id, project:projects(id, name, code)")
      .eq("state", "modified_after_approval")
      .limit(5),
  ]);

  const today = new Date();
  const dayLabel = `${DAY_NAMES[today.getDay()]} · ${today.toLocaleString(undefined, { month: "short", day: "numeric" })}`;
  const userName = ctx.user.email?.split("@")[0] ?? "there";

  return (
    <AppShellWithSession crumbs={["Dashboard"]} search="Search projects, materials, models…">
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              {dayLabel} · {ctx.organizationName}
            </div>
            <div className="pl-page-title">Good day, {userName}</div>
          </div>
          <div className="pl-page-actions">
            <Link href="/catalog/materials">
              <Btn ico="upload" variant="ghost">Bulk import</Btn>
            </Link>
            <Link href="/projects/new">
              <Btn variant="primary" ico="folder">New project</Btn>
            </Link>
          </div>
        </div>
      </div>

      <div className="pl-meta" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
        <Stat label="Active projects" value={(projectCount ?? 0).toString()} link href="/projects" />
        <Stat label="MTOs awaiting approval" value={(pendingApprovals ?? []).length.toString()} warn={Boolean((pendingApprovals ?? []).length)} />
        <Stat label="Modified after approval" value={(modified ?? []).length.toString()} warn={Boolean((modified ?? []).length)} />
        <Stat label="Materials" value={(materialCount ?? 0).toString()} link href="/catalog/materials" />
        <Stat label="Suppliers" value={(supplierCount ?? 0).toString()} link href="/catalog/suppliers" />
        <Stat label="Models" value={(modelCount ?? 0).toString()} link href="/catalog/models" />
      </div>

      <div className="pl-scroll" style={{ padding: "18px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <AdminCard
            title="MTOs awaiting approval"
            count={(pendingApprovals ?? []).length}
            tone="primary"
            ico="check"
            href="/projects"
          >
            {(pendingApprovals ?? []).length === 0 ? (
              <EmptyRow text="Nothing pending — you're caught up." />
            ) : (
              (pendingApprovals ?? []).map((p) => {
                const proj = p.project as unknown as { id: string; name: string; code: string | null; client_name: string | null } | null;
                if (!proj) return null;
                return (
                  <ListRow key={p.project_id}>
                    {proj.code && <Chip>{proj.code}</Chip>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {proj.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--ink-4)" }}>{proj.client_name ?? "—"}</div>
                    </div>
                    <Link href={`/projects/${proj.id}/mto/approve`}>
                      <Btn size="sm" variant="primary">Review</Btn>
                    </Link>
                  </ListRow>
                );
              })
            )}
          </AdminCard>

          <AdminCard
            title="Modified after approval"
            count={(modified ?? []).length}
            tone="hivis"
            ico="warn"
            href="/projects"
          >
            {(modified ?? []).length === 0 ? (
              <EmptyRow text="No modifications post-approval." />
            ) : (
              (modified ?? []).map((m) => {
                const proj = m.project as unknown as { id: string; name: string; code: string | null } | null;
                if (!proj) return null;
                return (
                  <ListRow key={m.project_id}>
                    {proj.code && <Chip>{proj.code}</Chip>}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{proj.name}</div>
                    </div>
                    <HiVis>review</HiVis>
                  </ListRow>
                );
              })
            )}
          </AdminCard>

          <AdminCard
            title="Recent activity"
            count={(recentActivity ?? []).length}
            tone="ink"
            ico="history"
            href="/audit"
          >
            {(recentActivity ?? []).length === 0 ? (
              <EmptyRow text="No activity yet." />
            ) : (
              (recentActivity ?? []).map((e) => (
                <ListRow key={e.id} compact>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      background: "var(--surface-2)",
                      color: "var(--ink-3)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon name="dots" size={11} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="mono" style={{ fontSize: 12, color: "var(--primary)" }}>
                      {e.event_type}
                    </div>
                    <div style={{ fontSize: 10.5, color: "var(--ink-5)" }}>
                      {new Date(e.occurred_at).toLocaleString()}
                    </div>
                  </div>
                </ListRow>
              ))
            )}
          </AdminCard>

          <AdminCard
            title="Materials recently added"
            count={(lowStockMaterials ?? []).length}
            tone="ink"
            ico="package"
            href="/catalog/materials"
          >
            {(lowStockMaterials ?? []).length === 0 ? (
              <EmptyRow text="No materials in your catalog yet." />
            ) : (
              (lowStockMaterials ?? []).map((m) => (
                <ListRow key={m.id}>
                  <div className="pl-thumb" style={{ width: 26, height: 26, fontSize: 14 }}>
                    {m.emoji ?? "📦"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{m.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-5)" }}>{m.code}</div>
                  </div>
                </ListRow>
              ))
            )}
          </AdminCard>

          <AdminCard title="Quick links" count="" tone="primary" ico="link">
            <QuickLink href="/catalog" label="Catalog hub" />
            <QuickLink href="/catalog/systems" label="Systems" />
            <QuickLink href="/catalog/models" label="Models" />
            <QuickLink href="/projects/new" label="New project" />
            <QuickLink href="/settings" label="Settings" />
          </AdminCard>

          <AdminCard title="Help & docs" count="" tone="ink" ico="cert">
            <div style={{ padding: 14, fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
              This dashboard surfaces attention-worthy items for the tenant. There&apos;s no notification bell — your
              inbox lives here.
              <div style={{ marginTop: 10 }}>
                <Link href="/audit" className="pl-link">
                  View full audit log →
                </Link>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </AppShellWithSession>
  );
}

function Stat({ label, value, sub, warn, link, href }: { label: string; value: string; sub?: string; warn?: boolean; link?: boolean; href?: string }) {
  const body = (
    <div className="pl-meta-cell" style={{ position: "relative" }}>
      <div className="pl-meta-label">{label}</div>
      <div
        className="pl-meta-value mono tnum"
        style={{ fontSize: 22, color: warn ? "var(--hivis-ink)" : "var(--ink)" }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 10.5, color: "var(--ink-5)", marginTop: 2 }}>{sub}</div>
      )}
      {link && (
        <Icon
          name="arrowR"
          size={12}
          style={{ position: "absolute", top: 12, right: 12, color: "var(--ink-5)" }}
        />
      )}
    </div>
  );
  return href ? (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      {body}
    </Link>
  ) : (
    body
  );
}

function AdminCard({
  title,
  count,
  tone,
  ico,
  href,
  children,
}: {
  title: string;
  count: number | string;
  tone: "primary" | "warn" | "hivis" | "ink";
  ico: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const toneStyle = {
    primary: { bg: "var(--primary-soft)", fg: "var(--primary)" },
    warn: { bg: "var(--hivis-soft)", fg: "var(--hivis-ink)" },
    hivis: { bg: "var(--hivis-soft)", fg: "var(--hivis-ink)" },
    ink: { bg: "var(--surface-2)", fg: "var(--ink-3)" },
  }[tone];
  return (
    <div className="pl-card">
      <div className="pl-card-head" style={{ alignItems: "flex-start" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: toneStyle.bg,
            color: toneStyle.fg,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name={ico} size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="pl-card-title">{title}</span>
            {typeof count === "number" && count > 0 && (
              <span
                className="mono tnum"
                style={{ fontSize: 18, fontWeight: 600, color: toneStyle.fg }}
              >
                {count}
              </span>
            )}
          </div>
        </div>
        {href && (
          <Link href={href} className="pl-link" style={{ fontSize: 11.5 }}>
            View all
          </Link>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function ListRow({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <div
      style={{
        padding: compact ? "7px 14px" : "10px 14px",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div style={{ padding: 14, fontSize: 11.5, color: "var(--ink-5)" }}>{text}</div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <ListRow>
      <Link
        href={href}
        style={{
          flex: 1,
          textDecoration: "none",
          color: "var(--ink-2)",
          fontSize: 13,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {label}
        <Icon name="arrowR" size={12} style={{ color: "var(--ink-5)" }} />
      </Link>
    </ListRow>
  );
}
