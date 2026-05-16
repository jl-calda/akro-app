import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { createModel } from "./actions";

export default async function ModelsListPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const ctx = await requireContext();
  const params = await searchParams;
  const supabase = await createClient();

  const [{ data: models }, { data: systems }] = await Promise.all([
    supabase
      .from("models")
      .select("id, name, code, created_at, system:systems(id, name), model_versions(version, is_published)")
      .eq("organization_id", ctx.organizationId)
      .order("name"),
    supabase
      .from("systems")
      .select("id, name")
      .eq("organization_id", ctx.organizationId)
      .order("name"),
  ]);

  return (
    <AppShellWithSession crumbs={["Catalog", "Models"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Models</div>
            <div className="pl-page-sub">Buildable Models with parts lists, labour rules, certifications.</div>
          </div>
          <Pill variant="info">{(models ?? []).length}</Pill>
        </div>
      </div>

      {params.error && (
        <div style={{ margin: "12px 24px 0", padding: "8px 10px", background: "var(--danger-soft)", border: "1px solid #F4C0C0", borderRadius: 4, color: "var(--danger)", fontSize: 12 }}>
          {params.error}
        </div>
      )}

      <div style={{ padding: "12px 24px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <form action={createModel} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 8, alignItems: "flex-end" }}>
          <div>
            <div className="pl-label">Name</div>
            <input name="name" placeholder="Cable Lifeline 8mm SS316" className="pl-input" style={{ width: "100%" }} required />
          </div>
          <div>
            <div className="pl-label">SKU / code</div>
            <input name="code" placeholder="LL-CBL-08-SS316" className="pl-input mono" style={{ width: "100%" }} />
          </div>
          <div>
            <div className="pl-label">System</div>
            <select name="system_id" required className="pl-input" style={{ width: "100%" }}>
              <option value="">— pick a system —</option>
              {(systems ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Btn variant="primary" ico="plus" type="submit">Add</Btn>
        </form>
        {(systems ?? []).length === 0 && (
          <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--ink-4)" }}>
            Add a System first under <Link href="/catalog/systems" className="pl-link">Catalog → Systems</Link>.
          </div>
        )}
      </div>

      <div className="pl-scroll" style={{ padding: 24 }}>
        {(models ?? []).length === 0 ? (
          <EmptyState
            ico="cube"
            title="No models yet"
            description="A Model is the buildable version of a System (e.g., a specific cable size + termination kit + anchors)."
          />
        ) : (
          <table className="pl-table" style={{ background: "var(--surface)" }}>
            <thead>
              <tr>
                <th style={{ width: 140 }}>Code</th>
                <th>Name</th>
                <th>System</th>
                <th>Version</th>
                <th style={{ width: 110 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(models ?? []).map((m) => {
                const sys = m.system as unknown as { name: string } | null;
                const versions = ((m.model_versions as unknown as { version: number; is_published: boolean }[]) ?? []).sort((a, b) => b.version - a.version);
                const latest = versions[0];
                return (
                  <tr key={m.id}>
                    <td className="mono">{m.code ?? "—"}</td>
                    <td>
                      <Link href={`/catalog/models/${m.id}`} className="pl-link" style={{ fontWeight: 500 }}>
                        {m.name}
                      </Link>
                    </td>
                    <td>{sys?.name ?? "—"}</td>
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
