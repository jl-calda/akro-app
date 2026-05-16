import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { createSystem } from "./actions";

export default async function SystemsListPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const ctx = await requireContext();
  const params = await searchParams;
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("systems")
    .select("id, name, description, created_at, system_versions(version, is_published)")
    .eq("organization_id", ctx.organizationId)
    .order("name");

  return (
    <AppShellWithSession crumbs={["Catalog", "Systems"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Systems</div>
            <div className="pl-page-sub">Top-level safety systems. Each has a dimension contract + allowed shapes/substrates.</div>
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
        <form action={createSystem} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <div className="pl-label">Add system</div>
            <input name="name" placeholder="Lifeline, Guardrail, Anchor Point…" className="pl-input" style={{ width: "100%" }} required />
          </div>
          <div style={{ flex: 2 }}>
            <div className="pl-label">Description</div>
            <input name="description" className="pl-input" style={{ width: "100%" }} placeholder="optional" />
          </div>
          <Btn variant="primary" ico="plus" type="submit">Add</Btn>
        </form>
      </div>

      <div className="pl-scroll" style={{ padding: 24 }}>
        {(rows ?? []).length === 0 ? (
          <div
            className="pl-card"
            style={{ padding: 32, textAlign: "center", color: "var(--ink-4)" }}
          >
            No systems yet. Lifeline, Guardrail, Anchor Point, Ladder are typical starters.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {(rows ?? []).map((s) => {
              const versions = (s.system_versions as unknown as { version: number; is_published: boolean }[]) ?? [];
              const latest = versions.sort((a, b) => b.version - a.version)[0];
              return (
                <Link
                  key={s.id}
                  href={`/catalog/systems/${s.id}`}
                  className="pl-card"
                  style={{ padding: 16, textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                      <Icon name="diamond" size={16} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "var(--ink-5)" }}>v{latest?.version ?? 1}</div>
                    </div>
                    {latest?.is_published ? (
                      <Pill variant="approved" dot>published</Pill>
                    ) : (
                      <Pill variant="draft" dot>draft</Pill>
                    )}
                  </div>
                  {s.description && (
                    <div style={{ fontSize: 11.5, color: "var(--ink-4)", lineHeight: 1.5 }}>{s.description}</div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppShellWithSession>
  );
}
