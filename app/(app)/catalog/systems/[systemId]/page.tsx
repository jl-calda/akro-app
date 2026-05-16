import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { publishSystem, updateSystemSchema } from "./actions";

export default async function SystemDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ systemId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { systemId } = await params;
  const sp = await searchParams;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: system } = await supabase
    .from("systems")
    .select("id, name, description, system_versions(id, version, dimension_schema, allowed_shapes, allowed_substrates, is_published, published_at)")
    .eq("id", systemId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!system) notFound();

  const versions = ((system.system_versions as unknown as Array<{
    id: string;
    version: number;
    dimension_schema: unknown;
    allowed_shapes: string[];
    allowed_substrates: string[];
    is_published: boolean;
    published_at: string | null;
  }>) ?? []).sort((a, b) => b.version - a.version);
  const latest = versions[0];

  return (
    <AppShellWithSession crumbs={["Catalog", "Systems", system.name]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <Chip>SYS</Chip>
          <div className="pl-page-title">{system.name}</div>
          {latest && (
            <Pill variant={latest.is_published ? "approved" : "draft"} dot>
              v{latest.version} {latest.is_published ? "published" : "draft"}
            </Pill>
          )}
          <div className="pl-page-actions">
            {latest && !latest.is_published && (
              <form action={publishSystem}>
                <input type="hidden" name="systemId" value={systemId} />
                <input type="hidden" name="versionId" value={latest.id} />
                <Btn variant="primary" ico="check" type="submit">Publish</Btn>
              </form>
            )}
          </div>
        </div>
      </div>

      {sp.error && (
        <div style={{ margin: "12px 24px 0", padding: "8px 10px", background: "var(--danger-soft)", border: "1px solid #F4C0C0", borderRadius: 4, color: "var(--danger)", fontSize: 12 }}>
          {sp.error}
        </div>
      )}

      <div className="pl-scroll" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="pl-card">
          <div className="pl-card-head">
            <Icon name="list" />
            <span className="pl-card-title">Dimension schema</span>
          </div>
          <form action={updateSystemSchema} style={{ padding: 18 }}>
            <input type="hidden" name="systemId" value={systemId} />
            <input type="hidden" name="versionId" value={latest?.id ?? ""} />
            <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginBottom: 6 }}>
              Edit as JSON. Each entry: <span className="mono">{`{ key, label, type, required?, default? }`}</span>.
              The visual schema editor ships in a later batch.
            </div>
            <textarea
              name="dimension_schema"
              defaultValue={JSON.stringify(latest?.dimension_schema ?? [], null, 2)}
              className="pl-input mono"
              style={{ width: "100%", height: 240, padding: 10, fontSize: 12, lineHeight: 1.45 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <Btn type="submit" variant="primary">Save schema</Btn>
            </div>
          </form>
        </div>

        <div className="pl-card">
          <div className="pl-card-head">
            <Icon name="history" />
            <span className="pl-card-title">Versions</span>
          </div>
          <table className="pl-table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Status</th>
                <th>Published at</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.id}>
                  <td><Chip>v{v.version}</Chip></td>
                  <td>
                    <Pill variant={v.is_published ? "approved" : "draft"} dot>
                      {v.is_published ? "published" : "draft"}
                    </Pill>
                  </td>
                  <td className="mono tnum">{v.published_at ? new Date(v.published_at).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShellWithSession>
  );
}
