import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { AdminHomeScreen } from "@/components/screens/admin-home";
import { requireContext } from "@/lib/auth/session";

export default async function DashboardPage() {
  const ctx = await requireContext();
  return (
    <AppShellWithSession
      crumbs={["Dashboard"]}
      search="Search projects, materials, models, sub-assemblies, suppliers…"
    >
      <AdminHomeScreen userName={ctx.user.email?.split("@")[0] ?? "there"} />
    </AppShellWithSession>
  );
}
