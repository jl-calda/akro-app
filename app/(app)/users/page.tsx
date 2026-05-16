import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { ROLES, ROLE_LABEL } from "@/lib/auth/roles";
import { changeRole, removeMember } from "./actions";

export default async function UsersPage() {
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("memberships")
    .select("user_id, role, created_at")
    .eq("organization_id", ctx.organizationId)
    .order("created_at");

  return (
    <AppShellWithSession crumbs={["Users"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Users</div>
            <div className="pl-page-sub">Members of <span style={{ fontWeight: 600 }}>{ctx.organizationName}</span>.</div>
          </div>
          <Pill variant="info">{(members ?? []).length}</Pill>
          <div className="pl-page-actions">
            <Btn variant="primary" ico="plus">Invite teammate</Btn>
          </div>
        </div>
      </div>

      <div className="pl-scroll" style={{ background: "var(--surface)" }}>
        <table className="pl-table">
          <thead>
            <tr>
              <th>User</th>
              <th style={{ width: 200 }}>Role</th>
              <th style={{ width: 140 }}>Joined</th>
              <th style={{ width: 80 }} />
            </tr>
          </thead>
          <tbody>
            {(members ?? []).map((m) => {
              const isSelf = m.user_id === ctx.user.id;
              return (
                <tr key={m.user_id}>
                  <td>
                    <span className="mono" style={{ color: "var(--ink-3)" }}>{m.user_id.slice(0, 8)}…</span>
                    {isSelf && (
                      <Pill variant="info" dot>you</Pill>
                    )}
                  </td>
                  <td>
                    <form action={changeRole} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input type="hidden" name="user_id" value={m.user_id} />
                      <select
                        name="role"
                        defaultValue={m.role}
                        className="pl-input"
                        style={{ width: 180, height: 28 }}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="pl-btn sm">Apply</button>
                    </form>
                  </td>
                  <td className="mono tnum" style={{ color: "var(--ink-4)" }}>
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    {!isSelf && (
                      <form action={removeMember}>
                        <input type="hidden" name="user_id" value={m.user_id} />
                        <button type="submit" className="pl-btn danger sm">Remove</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div
          style={{
            margin: 24,
            padding: 14,
            background: "var(--primary-soft)",
            border: "1px solid var(--primary-line)",
            borderRadius: 6,
            fontSize: 12,
            color: "var(--primary)",
          }}
        >
          <strong>Inviting teammates:</strong> until the invite flow ships, ask the teammate to sign up at{" "}
          <span className="mono">/signup</span> and accept onboarding. An admin can then add their membership directly,
          or use the Supabase dashboard to insert into <span className="mono">memberships(user_id, organization_id, role)</span>.
        </div>
      </div>
    </AppShellWithSession>
  );
}
