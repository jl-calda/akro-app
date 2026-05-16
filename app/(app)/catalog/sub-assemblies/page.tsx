import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Catalog","Sub-assemblies"]} title="Sub-assemblies" subtitle="Parametric sub-assemblies referenced from Models.">
      <EmptyState
        ico="fork"
        title="This is a placeholder for Sub-assemblies"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
