import { MobileShell } from "@/components/chrome/mobile-shell";
import { StoremanHomeScreen } from "@/components/screens/storeman-home";
import { requireContext } from "@/lib/auth/session";

export default async function StoremanHomePage() {
  await requireContext();
  return (
    <MobileShell which="storeman">
      <StoremanHomeScreen />
    </MobileShell>
  );
}
