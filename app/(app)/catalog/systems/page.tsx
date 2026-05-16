import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Catalog","Systems"]} title="Systems" subtitle="Safety systems with rules and dimension contracts.">
      <EmptyState
        ico="diamond"
        title="This is a placeholder for Systems"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
