import { AppShell } from "@/components/chrome/app-shell";
import { AdminHomeScreen } from "@/components/screens/admin-home";

export default function DashboardPage() {
  return (
    <AppShell
      crumbs={["Dashboard"]}
      search="Search projects, materials, models, sub-assemblies, suppliers…"
    >
      <AdminHomeScreen />
    </AppShell>
  );
}
