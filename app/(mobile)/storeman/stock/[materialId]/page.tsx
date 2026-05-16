import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function StoremanStockPage() {
  await requireContext();
  return (
    <MobileShell which="storeman">
      <MobileHeader title="Stock" subtitle="By location" back="/storeman" />
      <EmptyState
        ico="store"
        title="Stock balances will appear here"
        description="Scan a material QR or pick from the catalog to see balances + recent movements."
      />
    </MobileShell>
  );
}
