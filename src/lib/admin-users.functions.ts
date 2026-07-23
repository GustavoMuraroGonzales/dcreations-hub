import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Role = "admin" | "user" | "super_admin";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: any) => r.role as Role);
  return {
    isAdmin: roles.includes("admin") || roles.includes("super_admin"),
    isSuperAdmin: roles.includes("super_admin"),
  };
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { isAdmin } = await assertAdmin(context.supabase, context.userId);
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: usersData, error: uErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (uErr) throw new Error(uErr.message);

    const { data: rolesData, error: rErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (rErr) throw new Error(rErr.message);

    const rolesByUser = new Map<string, Role[]>();
    for (const r of rolesData ?? []) {
      const list = rolesByUser.get(r.user_id) ?? [];
      list.push(r.role as Role);
      rolesByUser.set(r.user_id, list);
    }

    return usersData.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      email_confirmed_at: u.email_confirmed_at ?? null,
      provider: (u.app_metadata as any)?.provider ?? "email",
      roles: rolesByUser.get(u.id) ?? [],
    }));
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { userId: string; role: "admin" | "user"; grant: boolean }) => input,
  )
  .handler(async ({ data, context }) => {
    const { isAdmin, isSuperAdmin } = await assertAdmin(context.supabase, context.userId);
    if (!isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Check if target is super_admin — only super_admin can modify them
    const { data: targetRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", data.userId);
    const targetIsSuper = (targetRoles ?? []).some((r) => r.role === "super_admin");
    if (targetIsSuper && !isSuperAdmin) {
      throw new Error("Somente super administradores podem modificar este usuário.");
    }

    // Prevent removing your own admin role
    if (data.userId === context.userId && data.role === "admin" && !data.grant) {
      throw new Error("Você não pode remover seu próprio acesso de administrador.");
    }

    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) => input)
  .handler(async ({ data, context }) => {
    const { isAdmin, isSuperAdmin } = await assertAdmin(context.supabase, context.userId);
    if (!isAdmin) throw new Error("Forbidden");
    if (data.userId === context.userId) throw new Error("Você não pode excluir a si mesmo.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: targetRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", data.userId);
    const targetIsSuper = (targetRoles ?? []).some((r) => r.role === "super_admin");
    if (targetIsSuper && !isSuperAdmin) {
      throw new Error("Somente super administradores podem excluir este usuário.");
    }
    if (targetIsSuper) {
      throw new Error("Super administradores não podem ser excluídos.");
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
