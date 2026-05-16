import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function ForemanConfirmPage() {
  await requireContext();
  return (
    <MobileShell which="foreman">
      <MobileHeader title="Confirm receipt" subtitle="Handover ticket" back="/foreman" />
      <EmptyState
        ico="check"
        title="Handover confirmation"
        description="After scanning a ticket, qty defaults to issued. Edit if there&apos;s a discrepancy — it&apos;s logged for audit."
      />
    </MobileShell>
  );
}
