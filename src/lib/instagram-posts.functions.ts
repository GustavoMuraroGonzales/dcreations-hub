import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { InstagramPost } from "./instagram-posts";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: any) => r.role);
  if (!roles.includes("admin") && !roles.includes("super_admin")) {
    throw new Error("Forbidden");
  }
}

function normalizeUrl(url: string): string {
  const parsed = new URL(url);
  const pathParts = parsed.pathname.split("/").filter(Boolean);
  const postIndex = pathParts.indexOf("p");
  if (postIndex !== -1 && pathParts[postIndex + 1]) {
    return `https://www.instagram.com/p/${pathParts[postIndex + 1]}/`;
  }
  if (pathParts.length > 0) {
    return `https://www.instagram.com/p/${pathParts[pathParts.length - 1]}/`;
  }
  throw new Error("URL do Instagram inválida");
}

export const listInstagramPostsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("instagram_posts" as any)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as InstagramPost[];
  });

export const createInstagramPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      post_url: string;
      caption?: string;
      sort_order?: number;
      is_active?: boolean;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const normalized = normalizeUrl(data.post_url);
    const { error } = await context.supabase.from("instagram_posts" as any).insert({
      post_url: normalized,
      caption: data.caption ?? null,
      sort_order: data.sort_order ?? 0,
      is_active: data.is_active ?? true,
    });
    if (error) throw error;
    return { ok: true };
  });

export const updateInstagramPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      id: string;
      post_url: string;
      caption?: string;
      sort_order?: number;
      is_active?: boolean;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const normalized = normalizeUrl(data.post_url);
    const { error } = await context.supabase
      .from("instagram_posts" as any)
      .update({
        post_url: normalized,
        caption: data.caption ?? null,
        sort_order: data.sort_order ?? 0,
        is_active: data.is_active ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const deleteInstagramPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("instagram_posts" as any)
      .delete()
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
