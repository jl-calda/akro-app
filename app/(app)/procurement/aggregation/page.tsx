import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Procurement","Aggregation"]} title="MTO aggregation" subtitle="Combine demand across projects to generate POs.">
      <EmptyState
        ico="fork"
        title="This is a placeholder for MTO aggregation"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
