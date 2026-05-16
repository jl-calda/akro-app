import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { publishModel, updateModelVersion } from "./actions";

export default async function ModelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ modelId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { modelId } = await params;
  const sp = await searchParams;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: model } = await supabase
    .from("models")
    .select(
      "id, name, code, system:systems(id, name), model_versions(id, version, parts_list, labour_rules, certifications, is_published, published_at)",
    )
    .eq("id", modelId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!model) notFound();

  const sys = model.system as unknown as { name: string } | null;
  const versions = ((model.model_versions as unknown as Array<{
    id: string;
    version: number;
    parts_list: unknown;
    labour_rules: unknown;
    certifications: unknown;
    is_published: boolean;
    published_at: string | null;
  }>) ?? []).sort((a, b) => b.version - a.version);
  const latest = versions[0];

  return (
    <AppShellWithSession crumbs={["Catalog", "Models", model.name]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {model.code && <Chip>{model.code}</Chip>}
          <div className="pl-page-title">{model.name}</div>
          <span style={{ fontSize: 12, color: "var(--ink-4)" }}>under {sys?.name ?? "—"}</span>
          {latest && (
            <Pill variant={latest.is_published ? "approved" : "draft"} dot>
              v{latest.version} {latest.is_published ? "published" : "draft"}
            </Pill>
          )}
          <div className="pl-page-actions">
            <a href={`/catalog/models/${modelId}/cut-plan`}>
              <Btn ico="scan" variant="ghost">Cut plan</Btn>
            </a>
            {latest && !latest.is_published && (
              <form action={publishModel}>
                <input type="hidden" name="modelId" value={modelId} />
                <input type="hidden" name="versionId" value={latest.id} />
                <Btn variant="primary" ico="check" type="submit">
                  Publish
                </Btn>
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

      <div className="pl-tabs">
        <div className="pl-tab is-active">Parts list</div>
        <div className="pl-tab">Variants</div>
        <div className="pl-tab">Labour</div>
        <div className="pl-tab">Certifications</div>
      </div>

      <div className="pl-scroll" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="pl-card">
          <div className="pl-card-head">
            <Icon name="list" />
            <span className="pl-card-title">Parts list</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-4)" }}>
              Edit as JSON for now. Inline editor with live rule preview ships in B6.
            </span>
          </div>
          <form action={updateModelVersion} style={{ padding: 18 }}>
            <input type="hidden" name="modelId" value={modelId} />
            <input type="hidden" name="versionId" value={latest?.id ?? ""} />
            <textarea
              name="parts_list"
              defaultValue={JSON.stringify(latest?.parts_list ?? [], null, 2)}
              className="pl-input mono"
              style={{ width: "100%", height: 380, padding: 10, fontSize: 12, lineHeight: 1.45 }}
              placeholder={`[\n  {\n    "row_id": "cable",\n    "item_kind": "material",\n    "item_id": "<material uuid>",\n    "item_version": 1,\n    "count_or_qty_formula": "length"\n  }\n]`}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, gap: 8 }}>
              <Btn type="submit" variant="primary">
                Save parts list
              </Btn>
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
                  <td>
                    <Chip>v{v.version}</Chip>
                  </td>
                  <td>
                    <Pill variant={v.is_published ? "approved" : "draft"} dot>
                      {v.is_published ? "published" : "draft"}
                    </Pill>
                  </td>
                  <td className="mono tnum">
                    {v.published_at ? new Date(v.published_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShellWithSession>
  );
}
