import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Catalog","Sub-assemblies","Edit"]} title="Sub-assembly editor">
      <EmptyState
        ico="fork"
        title="This is a placeholder for Sub-assembly editor"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
