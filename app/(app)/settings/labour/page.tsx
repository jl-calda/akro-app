import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { createPhase, deletePhase, updatePhase } from "./actions";

export default async function LabourSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const ctx = await requireContext();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("phases")
    .select("id, key, label, colour, default_rate, default_crew_size, include_in_totals, display_order")
    .eq("organization_id", ctx.organizationId)
    .order("display_order");

  return (
    <AppShellWithSession crumbs={["Settings", "Labour"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Labour phases</div>
            <div className="pl-page-sub">
              Each phase has a default crew size + rate. Models reference these when computing labour cost.
            </div>
          </div>
          <Pill variant="info">{(rows ?? []).length} phases</Pill>
        </div>
      </div>

      {params.error && (
        <div style={{ margin: "12px 24px 0", padding: "8px 10px", background: "var(--danger-soft)", border: "1px solid #F4C0C0", borderRadius: 4, color: "var(--danger)", fontSize: 12 }}>
          {params.error}
        </div>
      )}

      <div style={{ padding: "12px 24px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <form action={createPhase} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px 110px 110px auto", gap: 8, alignItems: "flex-end" }}>
          <div>
            <div className="pl-label">Key</div>
            <input name="key" placeholder="welding" className="pl-input mono" style={{ width: "100%" }} required />
          </div>
          <div>
            <div className="pl-label">Label</div>
            <input name="label" placeholder="Welding" className="pl-input" style={{ width: "100%" }} required />
          </div>
          <div>
            <div className="pl-label">Colour</div>
            <input name="colour" type="color" defaultValue="#475569" className="pl-input" style={{ width: "100%", padding: 0, height: 30 }} />
          </div>
          <div>
            <div className="pl-label">Rate</div>
            <input name="default_rate" type="number" step="0.5" min="0" defaultValue="0" className="pl-input" style={{ width: "100%" }} />
          </div>
          <div>
            <div className="pl-label">Crew</div>
            <input name="default_crew_size" type="number" step="1" min="1" defaultValue="1" className="pl-input" style={{ width: "100%" }} />
          </div>
          <Btn variant="primary" ico="plus" type="submit">Add</Btn>
        </form>
      </div>

      <div className="pl-scroll" style={{ background: "var(--surface)" }}>
        <table className="pl-table">
          <thead>
            <tr>
              <th style={{ width: 36 }} />
              <th style={{ width: 120 }}>Key</th>
              <th>Label</th>
              <th className="num" style={{ width: 120 }}>Rate</th>
              <th className="num" style={{ width: 90 }}>Crew</th>
              <th style={{ width: 100 }}>In totals</th>
              <th style={{ width: 80 }} />
              <th style={{ width: 50 }} />
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r) => (
              <tr key={r.id}>
                <td>
                  <span
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 14,
                      borderRadius: 3,
                      background: r.colour,
                      border: "1px solid var(--line)",
                    }}
                  />
                </td>
                <td className="mono" style={{ color: "var(--ink-3)" }}>{r.key}</td>
                <td><span style={{ fontWeight: 500 }}>{r.label}</span></td>
                <td>
                  <form action={updatePhase}>
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      name="default_rate"
                      type="number"
                      step="0.5"
                      min="0"
                      defaultValue={r.default_rate}
                      className="pl-input num-input"
                      style={{ width: 100, height: 26 }}
                    />
                    <input type="hidden" name="default_crew_size" value={r.default_crew_size} />
                    <input type="hidden" name="include_in_totals" value={r.include_in_totals ? "on" : ""} />
                  </form>
                </td>
                <td>
                  <form action={updatePhase}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="default_rate" value={r.default_rate} />
                    <input
                      name="default_crew_size"
                      type="number"
                      step="1"
                      min="1"
                      defaultValue={r.default_crew_size}
                      className="pl-input num-input"
                      style={{ width: 70, height: 26 }}
                    />
                    <input type="hidden" name="include_in_totals" value={r.include_in_totals ? "on" : ""} />
                  </form>
                </td>
                <td>
                  <Pill variant={r.include_in_totals ? "approved" : "draft"} dot>
                    {r.include_in_totals ? "Yes" : "No"}
                  </Pill>
                </td>
                <td>
                  <form action={updatePhase}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="default_rate" value={r.default_rate} />
                    <input type="hidden" name="default_crew_size" value={r.default_crew_size} />
                    <input type="hidden" name="include_in_totals" value={r.include_in_totals ? "" : "on"} />
                    <button type="submit" className="pl-btn sm">
                      Toggle
                    </button>
                  </form>
                </td>
                <td>
                  <form action={deletePhase}>
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
                <td colSpan={8} style={{ textAlign: "center", padding: 32, color: "var(--ink-4)" }}>
                  No phases yet. Onboarding usually seeds 4 defaults.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShellWithSession>
  );
}
