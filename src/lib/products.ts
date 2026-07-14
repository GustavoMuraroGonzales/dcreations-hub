import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type ProductImage = Database["public"]["Tables"]["product_images"]["Row"];

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

export type ProductDetail = ProductWithCategory & {
  images: ProductImage[];
};

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchProducts(options?: {
  categorySlug?: string | null;
  activeOnly?: boolean;
  limit?: number;
}): Promise<ProductWithCategory[]> {
  let q = supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (options?.activeOnly !== false) q = q.eq("is_active", true);
  if (options?.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  let list = (data ?? []) as ProductWithCategory[];
  if (options?.categorySlug) {
    list = list.filter((p) => p.category?.slug === options.categorySlug);
  }
  return list;
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: images, error: imgErr } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", data.id)
    .order("sort_order", { ascending: true });
  if (imgErr) throw imgErr;
  return { ...(data as ProductWithCategory), images: images ?? [] };
}

export async function fetchProductById(id: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", data.id)
    .order("sort_order", { ascending: true });
  return { ...(data as ProductWithCategory), images: images ?? [] };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}
