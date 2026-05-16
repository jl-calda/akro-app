import { PlumbMark, Chip, HiVis } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export const dynamic = "force-dynamic";

const SUPABASE_URL = "https://vyhdtxxhvdhgjtoyqgum.supabase.co";

export default function SetupPage() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "24px 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
          <PlumbMark />
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em" }}>akro-app</span>
          <HiVis>setup required</HiVis>
        </header>

        <div className="pl-card" style={{ padding: 24, boxShadow: "0 8px 32px rgba(15,23,42,0.08)" }}>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Finish setup — connect Supabase
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6 }}>
            The middleware needs the Supabase URL and anon key as environment variables on Vercel. Add them in your
            Vercel project settings, then redeploy.
          </div>

          <div style={{ display: "grid", gap: 8, marginTop: 18 }}>
            <Row label="NEXT_PUBLIC_SUPABASE_URL" ok={hasUrl} value={SUPABASE_URL} />
            <Row
              label="NEXT_PUBLIC_SUPABASE_ANON_KEY"
              ok={hasKey}
              value="sb_publishable_…  (from Supabase dashboard → API)"
            />
          </div>

          <div
            style={{
              marginTop: 18,
              padding: 14,
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
              borderRadius: 6,
              fontSize: 12,
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 6, color: "var(--ink-2)" }}>How to fix</div>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              <li>Open your Vercel project → Settings → Environment Variables.</li>
              <li>
                Add <span className="mono">NEXT_PUBLIC_SUPABASE_URL</span> ={" "}
                <span className="mono">{SUPABASE_URL}</span>
              </li>
              <li>
                Add <span className="mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> — copy from
                Supabase dashboard → Project Settings → API.
              </li>
              <li>Apply to Production + Preview + Development.</li>
              <li>Redeploy (push a commit or click <em>Redeploy</em> on the latest deployment).</li>
            </ol>
          </div>

          <div
            style={{
              marginTop: 14,
              padding: 12,
              background: "var(--primary-soft)",
              border: "1px solid var(--primary-line)",
              borderRadius: 4,
              fontSize: 11.5,
              color: "var(--primary)",
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <Icon name="warn" size={13} />
            <div style={{ color: "var(--ink-3)" }}>
              Google OAuth additionally needs <span className="mono">NEXT_PUBLIC_APP_URL</span> set to your deployed URL,
              and Supabase&apos;s Google provider configured with the project&apos;s OAuth client.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--ink-5)", textAlign: "center" }}>
          Once env vars are set, this page will be replaced by the normal login flow.
        </div>
      </div>
    </div>
  );
}

function Row({ label, ok, value }: { label: string; ok: boolean; value: string }) {
  return (
    <div
      style={{
        padding: 12,
        background: ok ? "var(--success-soft)" : "var(--hivis-soft)",
        border: "1px solid " + (ok ? "#BFDDD8" : "var(--hivis-line)"),
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          background: ok ? "var(--success)" : "var(--hivis)",
          color: ok ? "#fff" : "#1E1B0B",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon name={ok ? "check" : "warn"} size={12} />
      </span>
      <div style={{ flex: 1 }}>
        <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: ok ? "var(--success)" : "var(--hivis-ink)" }}>
          {label}
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", marginTop: 2 }}>
          {value}
        </div>
      </div>
      <Chip>{ok ? "set" : "missing"}</Chip>
    </div>
  );
}
