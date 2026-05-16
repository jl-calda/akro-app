import { MobileShell, MobileHeader, MStat } from "@/components/chrome/mobile-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function ForemanHomePage() {
  await requireContext();
  return (
    <MobileShell which="foreman">
      <MobileHeader title="Pending Receipts" subtitle="Site Foreman" />
      <div style={{ padding: "12px 14px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        <MStat value="0" label="Pending" />
        <MStat value="0" label="Today" />
        <MStat value="0" label="Open issues" />
      </div>
      <EmptyState
        ico="scan"
        title="No handover tickets yet"
        description="Tickets scanned at site will appear here. Use the centre Scan button to start."
      />
    </MobileShell>
  );
}
