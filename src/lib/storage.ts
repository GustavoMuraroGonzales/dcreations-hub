import { supabase } from "@/integrations/supabase/client";

export const PRODUCT_IMAGES_BUCKET = "product-images";
// 10 years — long-lived signed URL so images render publicly without a public bucket.
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function uploadProductImage(file: File): Promise<{ path: string; url: string }> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;

  const { data, error: urlErr } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (urlErr || !data) throw urlErr ?? new Error("Falha ao gerar URL da imagem");
  return { path, url: data.signedUrl };
}

export async function removeProductImage(path: string | null | undefined) {
  if (!path) return;
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);
}
