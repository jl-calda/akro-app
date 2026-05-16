import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Pill } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { updateTenant } from "./actions";

export default async function TenantSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const ctx = await requireContext();
  const params = await searchParams;
  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select("name, currency, slug, created_at")
    .eq("id", ctx.organizationId)
    .single();

  return (
    <AppShellWithSession crumbs={["Settings", "Tenant"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Tenant profile</div>
            <div className="pl-page-sub">Workspace identity that appears throughout the app.</div>
          </div>
          {params.saved && <Pill variant="approved" dot>Saved</Pill>}
        </div>
      </div>

      {params.error && (
        <div style={{ margin: "12px 24px 0", padding: "8px 10px", background: "var(--danger-soft)", border: "1px solid #F4C0C0", borderRadius: 4, color: "var(--danger)", fontSize: 12 }}>
          {params.error}
        </div>
      )}

      <div className="pl-scroll" style={{ padding: 24 }}>
        <div className="pl-card" style={{ padding: 24, maxWidth: 640 }}>
          <form action={updateTenant} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <div className="pl-label">Workspace name</div>
              <input
                name="name"
                defaultValue={org?.name ?? ""}
                required
                className="pl-input"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <div className="pl-label">Currency</div>
              <select name="currency" defaultValue={org?.currency ?? "USD"} className="pl-input" style={{ width: "100%" }}>
                <option value="USD">USD — US Dollar</option>
                <option value="SGD">SGD — Singapore Dollar</option>
                <option value="AUD">AUD — Australian Dollar</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="EUR">EUR — Euro</option>
                <option value="PHP">PHP — Philippine Peso</option>
              </select>
            </div>
            <div>
              <div className="pl-label">Slug</div>
              <div
                className="pl-input mono"
                style={{
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  background: "var(--surface-2)",
                  color: "var(--ink-4)",
                }}
              >
                {org?.slug ?? "—"}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Btn variant="primary" type="submit">Save</Btn>
            </div>
          </form>
        </div>
      </div>
    </AppShellWithSession>
  );
}
