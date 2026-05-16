import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "./roles";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export type CurrentContext = {
  user: { id: string; email: string | null };
  organizationId: string;
  organizationName: string;
  role: AppRole;
};

/**
 * Resolve the user's current organization context.
 * Picks the first membership; multi-org switcher is a follow-up.
 */
export async function getCurrentContext(): Promise<CurrentContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("memberships")
    .select("organization_id, role, organizations(name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  return {
    user: { id: user.id, email: user.email ?? null },
    organizationId: membership.organization_id,
    organizationName:
      (membership.organizations as unknown as { name: string } | null)?.name ?? "",
    role: membership.role,
  };
}

export async function requireContext(): Promise<CurrentContext> {
  const ctx = await getCurrentContext();
  if (!ctx) redirect("/onboarding");
  return ctx;
}

export async function requireRole(allowed: AppRole | AppRole[]) {
  const ctx = await requireContext();
  const allow = Array.isArray(allowed) ? allowed : [allowed];
  if (!allow.includes(ctx.role)) redirect("/dashboard");
  return ctx;
}
