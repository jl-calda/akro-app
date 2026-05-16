import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Projects","Project","MTO"]} title="MTO">
      <EmptyState
        ico="list"
        title="This is a placeholder for MTO"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
