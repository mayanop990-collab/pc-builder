import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Returns the signed-in user's email and whether they are listed in public.admins. */
export async function getAdminStatus() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return { supabase, email: null, isAdmin: false };

  const email = (claims.email as string | undefined) ?? null;
  const { data: row } = await supabase.from("admins").select("user_id").eq("user_id", claims.sub).maybeSingle();
  if (row) return { supabase, email, isAdmin: true };

  // First-run setup: the first signed-in user becomes admin while no admin exists yet.
  const { data: claimed } = await supabase.rpc("claim_first_admin");
  return { supabase, email, isAdmin: claimed === true };
}

/** Use at the top of every admin Server Action and page. Database RLS enforces the same rule. */
export async function requireAdmin() {
  const status = await getAdminStatus();
  if (!status.email) redirect("/admin/login");
  if (!status.isAdmin) throw new Error("Not authorized");
  return status.supabase;
}

export async function isAdminSetupNeeded() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("admin_setup_needed");
  return data === true;
}
