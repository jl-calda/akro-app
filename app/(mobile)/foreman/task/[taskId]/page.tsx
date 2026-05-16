import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function ForemanTaskPage() {
  await requireContext();
  return (
    <MobileShell which="foreman">
      <MobileHeader title="Task" back="/foreman/projects" />
      <EmptyState
        ico="camera"
        title="Task detail"
        description="Add progress photos, update progress %, view the task's MTO lines."
      />
    </MobileShell>
  );
}
