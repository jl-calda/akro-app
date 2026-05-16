import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip } from "@/components/ui/primitives";
import { requireContext } from "@/lib/auth/session";
import { createProject } from "../actions";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireContext();
  const params = await searchParams;

  return (
    <AppShellWithSession crumbs={["Projects", "New"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">New project</div>
            <div className="pl-page-sub">Set up the project shell. Quotes + Working Set come next.</div>
          </div>
        </div>
      </div>

      {params.error && (
        <div style={{ margin: "12px 24px 0", padding: "8px 10px", background: "var(--danger-soft)", border: "1px solid #F4C0C0", borderRadius: 4, color: "var(--danger)", fontSize: 12 }}>
          {params.error}
        </div>
      )}

      <div className="pl-scroll" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          {[
            { n: 1, label: "Project info", active: true },
            { n: 2, label: "First quote", active: false },
            { n: 3, label: "Confirm", active: false },
          ].map((s, i, arr) => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: s.active ? "var(--primary)" : "var(--surface-2)",
                  border: "1px solid " + (s.active ? "var(--primary)" : "var(--line-2)"),
                  color: s.active ? "#fff" : "var(--ink-4)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {s.n}
              </span>
              <span style={{ fontSize: 12.5, fontWeight: s.active ? 600 : 500, color: s.active ? "var(--ink)" : "var(--ink-4)" }}>
                {s.label}
              </span>
              {i < arr.length - 1 && <span style={{ width: 60, height: 1, background: "var(--line)" }} />}
            </div>
          ))}
        </div>

        <form action={createProject} className="pl-card" style={{ padding: 24, maxWidth: 720, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 10 }}>
            <div>
              <div className="pl-label">Project code</div>
              <input name="code" placeholder="PRJ-2026-001" className="pl-input mono" style={{ width: "100%" }} />
            </div>
            <div>
              <div className="pl-label">Project name</div>
              <input name="name" placeholder="Aurora Bridge — North Span" required className="pl-input" style={{ width: "100%" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div className="pl-label">Client</div>
              <input name="client_name" className="pl-input" style={{ width: "100%" }} placeholder="Acme Corp" />
            </div>
            <div>
              <div className="pl-label">Location</div>
              <input name="location" className="pl-input" style={{ width: "100%" }} placeholder="San Francisco, CA" />
            </div>
          </div>

          <div>
            <div className="pl-label">Site contact</div>
            <input name="site_contact" className="pl-input" style={{ width: "100%" }} placeholder="M. Ortega · +1 415 555 0142" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div className="pl-label">Start date</div>
              <input name="start_date" type="date" className="pl-input" style={{ width: "100%" }} />
            </div>
            <div>
              <div className="pl-label">Needed by</div>
              <input name="needed_by_date" type="date" className="pl-input" style={{ width: "100%" }} />
            </div>
          </div>

          <div
            style={{
              padding: 12,
              background: "var(--primary-soft)",
              border: "1px solid var(--primary-line)",
              borderRadius: 4,
              fontSize: 12,
              color: "var(--primary)",
              display: "flex",
              gap: 8,
            }}
          >
            <Chip>NEXT</Chip>
            <span style={{ flex: 1, color: "var(--ink-3)" }}>
              After saving, you&apos;ll be taken to the project overview. Add quotes and Working Set system instances from there.
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Btn variant="ghost" type="button">Cancel</Btn>
            <Btn variant="primary" type="submit" ico="check">Create project</Btn>
          </div>
        </form>
      </div>
    </AppShellWithSession>
  );
}
