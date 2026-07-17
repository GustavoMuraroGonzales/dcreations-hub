ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS mercado_livre_url text,
  ADD COLUMN IF NOT EXISTS shopee_url text,
  ADD COLUMN IF NOT EXISTS elo7_url text,
  ADD COLUMN IF NOT EXISTS amazon_url text,
  ADD COLUMN IF NOT EXISTS other_store_url text,
  ADD COLUMN IF NOT EXISTS other_store_label text;