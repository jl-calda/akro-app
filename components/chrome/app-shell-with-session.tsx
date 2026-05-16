import { AppShell } from "./app-shell";
import { getCurrentContext } from "@/lib/auth/session";
import { ROLE_LABEL } from "@/lib/auth/roles";

type Crumb = string | { label: string; href?: string };

export async function AppShellWithSession({
  crumbs = [],
  search,
  children,
}: {
  crumbs?: Crumb[];
  search?: string;
  children: React.ReactNode;
}) {
  const ctx = await getCurrentContext();
  const user = ctx
    ? {
        name: ctx.user.email?.split("@")[0] ?? "User",
        role: `${ROLE_LABEL[ctx.role]} · ${ctx.organizationName}`,
      }
    : undefined;
  return (
    <AppShell crumbs={crumbs} search={search} user={user} org={ctx?.organizationName}>
      {children}
    </AppShell>
  );
}
