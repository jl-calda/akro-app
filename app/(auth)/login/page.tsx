import Link from "next/link";
import { Btn } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { signInWithGoogle, signInWithPassword } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const params = await searchParams;
  const redirectTo = params.redirectTo ?? "/dashboard";

  return (
    <div
      className="pl-card"
      style={{ width: 380, padding: 24, boxShadow: "0 8px 32px rgba(15,23,42,0.08)" }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 4 }}>
        Sign in
      </div>
      <div style={{ fontSize: 12, color: "var(--ink-4)", marginBottom: 18 }}>
        Welcome back to akro-app.
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

      <form action={signInWithPassword} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="hidden" name="redirectTo" value={redirectTo} />
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
            required
            className="pl-input"
            style={{ width: "100%" }}
          />
        </div>
        <Btn variant="primary" type="submit" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
          Sign in with email
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
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button
          type="submit"
          className="pl-btn"
          style={{ width: "100%", justifyContent: "center", height: 36 }}
        >
          <GoogleGlyph />
          <span>Continue with Google</span>
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
        New here?{" "}
        <Link href="/signup" className="pl-link">
          Create an account
        </Link>
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
