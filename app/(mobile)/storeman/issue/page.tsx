import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function StoremanIssuePage() {
  await requireContext();
  return (
    <MobileShell which="storeman">
      <MobileHeader title="Issue" subtitle="Post-scan" back="/storeman" />
      <EmptyState
        ico="upload"
        title="Issue sheet"
        description="Issue stock against an approved MTO. Reached via scanning a picking-list QR or tapping a list line."
      />
    </MobileShell>
  );
}
