import Link from "next/link";
import { Btn } from "@/components/ui/primitives";
import { signUpWithPassword } from "./actions";
import { signInWithGoogle } from "../login/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div
      className="pl-card"
      style={{ width: 380, padding: 24, boxShadow: "0 8px 32px rgba(15,23,42,0.08)" }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 4 }}>
        Create your account
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 18 }}>
        You&apos;ll set up your workspace next.
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
            marginBottom: 14,
          }}
        >
          {params.error}
        </div>
      )}

      <form action={signUpWithPassword} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <label className="pl-label">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="pl-input"
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label className="pl-label">Password</label>
          <input
            type="password"
            name="password"
            minLength={8}
            required
            className="pl-input"
            style={{ width: "100%" }}
          />
          <div style={{ fontSize: 10.5, color: "var(--ink-5)", marginTop: 4 }}>
            Minimum 8 characters.
          </div>
        </div>
        <Btn variant="primary" type="submit" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
          Create account
        </Btn>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          margin: "16px 0 10px",
          color: "var(--ink-5)",
          fontSize: 11,
        }}
      >
        <span style={{ height: 1, background: "var(--line)", flex: 1 }} />
        <span>OR</span>
        <span style={{ height: 1, background: "var(--line)", flex: 1 }} />
      </div>

      <form action={signInWithGoogle}>
        <input type="hidden" name="redirectTo" value="/onboarding" />
        <button
          type="submit"
          className="pl-btn"
          style={{ width: "100%", justifyContent: "center", height: 36 }}
        >
          Continue with Google
        </button>
      </form>

      <div
        style={{
          marginTop: 18,
          fontSize: 12,
          color: "var(--ink-4)",
          textAlign: "center",
        }}
      >
        Already have an account?{" "}
        <Link href="/login" className="pl-link">
          Sign in
        </Link>
      </div>
    </div>
  );
}
