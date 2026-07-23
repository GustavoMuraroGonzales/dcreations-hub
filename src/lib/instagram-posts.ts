import { supabase } from "@/integrations/supabase/client";

export type InstagramPost = {
  id: string;
  post_url: string;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export async function fetchInstagramPosts(): Promise<InstagramPost[]> {
  const { data, error } = await (supabase as any)
    .from("instagram_posts")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as InstagramPost[];
}

export function extractInstagramPostId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const postIndex = pathParts.indexOf("p");
    if (postIndex !== -1 && pathParts[postIndex + 1]) {
      return pathParts[postIndex + 1];
    }
    // Handle reels / tv / share URLs
    if (pathParts.length > 0) {
      return pathParts[pathParts.length - 1];
    }
  } catch {
    return null;
  }
  return null;
}

export function normalizeInstagramUrl(url: string): string | null {
  const postId = extractInstagramPostId(url);
  if (!postId) return null;
  return `https://www.instagram.com/p/${postId}/`;
}
