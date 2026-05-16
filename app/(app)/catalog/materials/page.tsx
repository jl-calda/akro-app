import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Catalog","Materials"]} title="Materials" subtitle="SKU catalog with categories, suppliers and stock.">
      <EmptyState
        ico="package"
        title="This is a placeholder for Materials"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
