import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { Icon } from "@/components/ui/icon";
import { requireContext } from "@/lib/auth/session";

export default async function StoremanScanPage() {
  await requireContext();
  return (
    <MobileShell which="storeman">
      <MobileHeader title="Scan" subtitle="Smart routing" />
      <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
        <div
          style={{
            aspectRatio: "1/1",
            background: "#0B1220",
            borderRadius: 12,
            position: "relative",
            overflow: "hidden",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "12% 12%",
              border: "2px solid #FACC15",
              borderRadius: 8,
              boxShadow: "0 0 0 4000px rgba(11,18,32,0.4) inset",
            }}
          />
          <Icon name="qr" size={36} style={{ color: "#94A3B8" }} />
        </div>
        <div
          style={{
            padding: 12,
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            fontSize: 12,
            color: "var(--ink-3)",
          }}
        >
          Camera will open here. Smart routing reads the QR payload prefix:
          <ul style={{ margin: "6px 0 0 18px", lineHeight: 1.7 }}>
            <li><span className="mono">MAT:</span> material lookup</li>
            <li><span className="mono">PL:</span> picking list → issue sheet</li>
            <li><span className="mono">PO:</span> purchase order → receive</li>
            <li><span className="mono">HT:</span> handover ticket → site receipt</li>
          </ul>
        </div>
      </div>
    </MobileShell>
  );
}
