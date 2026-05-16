import { MobileShell, MobileHeader } from "@/components/chrome/mobile-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function ForemanProjectsPage() {
  await requireContext();
  return (
    <MobileShell which="foreman">
      <MobileHeader title="My projects" subtitle="Site Foreman" />
      <EmptyState
        ico="folder"
        title="No assigned projects"
        description="Once a project manager assigns you, projects appear here for read-only access + photo uploads."
      />
    </MobileShell>
  );
}
