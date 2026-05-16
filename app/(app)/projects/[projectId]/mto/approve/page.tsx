import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Projects","Project","MTO","Approve"]} title="MTO approval">
      <EmptyState
        ico="check"
        title="This is a placeholder for MTO approval"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
