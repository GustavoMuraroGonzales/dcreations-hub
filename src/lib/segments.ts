import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Segment = Database["public"]["Tables"]["segments"]["Row"];

export async function fetchSegments(): Promise<Segment[]> {
  const { data, error } = await supabase.from("segments").select("*").order("sort_order").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function fetchSegmentBySlug(slug: string): Promise<{ segment: Segment; productIds: string[] } | null> {
  const { data: segment, error } = await supabase.from("segments").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!segment) return null;
  const { data: links, error: e2 } = await supabase
    .from("product_segments")
    .select("product_id")
    .eq("segment_id", segment.id);
  if (e2) throw e2;
  return { segment, productIds: (links ?? []).map((l) => l.product_id) };
}

export async function fetchProductSegmentIds(productId: string): Promise<string[]> {
  const { data, error } = await supabase.from("product_segments").select("segment_id").eq("product_id", productId);
  if (error) throw error;
  return (data ?? []).map((r) => r.segment_id);
}

export async function setProductSegments(productId: string, segmentIds: string[]) {
  const { error } = await supabase.from("product_segments").delete().eq("product_id", productId);
  if (error) throw error;
  if (segmentIds.length) {
    const { error: e2 } = await supabase
      .from("product_segments")
      .insert(segmentIds.map((segment_id) => ({ product_id: productId, segment_id })));
    if (e2) throw e2;
  }
}

/** Indicados primeiro, depois o restante, mantendo a ordem original em cada grupo. */
export function orderBySegment<T extends { id: string }>(items: T[], ids: string[]) {
  const set = new Set(ids);
  return { recommended: items.filter((p) => set.has(p.id)), others: items.filter((p) => !set.has(p.id)) };
}
