import { PlumbMark } from "@/components/ui/primitives";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <header
        style={{
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          gap: 9,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        <PlumbMark />
        <span>akro-app</span>
        <span
          className="pl-chip mono"
          style={{
            background: "#FFFFFF",
            borderColor: "#DCE1EA",
            color: "#64748B",
            marginLeft: 4,
          }}
        >
          v4.2
        </span>
      </header>
      <main style={{ display: "grid", placeItems: "center", padding: 24 }}>{children}</main>
    </div>
  );
}
