import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Catalog","Substrates"]} title="Substrates" subtitle="Substrates such as steel I-beam, concrete deck.">
      <EmptyState
        ico="grid"
        title="This is a placeholder for Substrates"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
