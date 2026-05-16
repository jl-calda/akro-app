import type { Database } from "@/lib/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const ROLES: AppRole[] = [
  "tenant_owner",
  "tenant_admin",
  "project_manager",
  "estimator",
  "project_viewer",
  "storeman",
  "site_foreman",
];

export const ROLE_LABEL: Record<AppRole, string> = {
  tenant_owner: "Tenant Owner",
  tenant_admin: "Tenant Admin",
  project_manager: "Project Manager",
  estimator: "Estimator",
  project_viewer: "Project Viewer",
  storeman: "Storeman",
  site_foreman: "Site Foreman",
};

export const ROLE_DESCRIPTION: Record<AppRole, string> = {
  tenant_owner: "Full control including billing and tenant deletion.",
  tenant_admin: "Runs the catalog, approves MTOs and POs, manages users.",
  project_manager: "Creates projects, edits Working Set, submits MTOs.",
  estimator: "Builds quotes, prices work, generates purchase orders.",
  project_viewer: "Read-only access to assigned projects.",
  storeman: "Mobile warehouse role — issues, receives, returns stock.",
  site_foreman: "Mobile field role — confirms handovers, captures photos.",
};

export function isAdmin(role: AppRole | null | undefined) {
  return role === "tenant_owner" || role === "tenant_admin";
}

export function canApproveMto(role: AppRole | null | undefined) {
  return isAdmin(role);
}
