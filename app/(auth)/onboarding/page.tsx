import { Btn } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { completeOnboarding } from "./actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // If user already has a membership, skip onboarding.
  const { data: membership } = await supabase
    .from("memberships")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  if (membership) redirect("/dashboard");

  return (
    <div
      className="pl-card"
      style={{
        width: 560,
        padding: 24,
        boxShadow: "0 8px 32px rgba(15,23,42,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 6,
            background: "var(--primary-soft)",
            color: "var(--primary)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Icon name="folder" />
        </span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Set up your workspace
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-4)" }}>
            We&apos;ll seed defaults you can edit later in Settings.
          </div>
        </div>
      </div>

      {params.error && (
        <div
          style={{
            padding: "8px 10px",
            background: "var(--danger-soft)",
            border: "1px solid #F4C0C0",
            borderRadius: 4,
            color: "var(--danger)",
            fontSize: 12,
            margin: "14px 0",
          }}
        >
          {params.error}
        </div>
      )}

      <form action={completeOnboarding} style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
        <div>
          <label className="pl-label">Company name</label>
          <input
            name="orgName"
            required
            placeholder="e.g. Vertex Safety Solutions"
            className="pl-input"
            style={{ width: "100%" }}
            autoFocus
          />
        </div>

        <div>
          <label className="pl-label">Currency</label>
          <select
            name="currency"
            className="pl-input"
            style={{ width: "100%" }}
            defaultValue="USD"
          >
            <option value="USD">USD — US Dollar</option>
            <option value="SGD">SGD — Singapore Dollar</option>
            <option value="AUD">AUD — Australian Dollar</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="EUR">EUR — Euro</option>
            <option value="PHP">PHP — Philippine Peso</option>
          </select>
        </div>

        <div
          style={{
            padding: 12,
            background: "var(--surface-2)",
            border: "1px solid var(--line)",
            borderRadius: 6,
            fontSize: 11.5,
            color: "var(--ink-4)",
          }}
        >
          <div style={{ fontWeight: 600, color: "var(--ink-2)", marginBottom: 4 }}>
            We&apos;ll seed:
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>4 labour phases — Fabrication, Installation, Commissioning, Inspection</li>
            <li>9 material categories — Cable, Anchor, Stanchion, Fastener, Rail, Post, Termination, Adhesive, PPE</li>
            <li>5 substrates — Steel I-beam, Concrete deck, Steel column, Metal deck roof, Timber rafter</li>
            <li>1 warehouse location — Main Yard (rename in Settings)</li>
          </ul>
        </div>

        <Btn variant="primary" type="submit" style={{ justifyContent: "center", height: 36 }}>
          Create workspace
        </Btn>
      </form>
    </div>
  );
}
