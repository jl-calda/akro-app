import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function PickListDetailPage() {
  await requireContext();
  return (
    <MobileShell which="storeman">
      <MobileHeader title="Picking list" subtitle="Detail" back="/storeman" />
      <EmptyState
        ico="list"
        title="Picking list detail"
        description="Tap an approved MTO from the home tab to see line items, scan, and issue."
      />
    </MobileShell>
  );
}
