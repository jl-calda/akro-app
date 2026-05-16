import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Quotes"]} title="Quotes" subtitle="Estimator dashboard for quotes.">
      <EmptyState
        ico="edit"
        title="This is a placeholder for Quotes"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
