CREATE TABLE public.segments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.segments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.segments TO authenticated;
GRANT ALL ON public.segments TO service_role;
ALTER TABLE public.segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Segments public read" ON public.segments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Segments admin write" ON public.segments FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'super_admin'::app_role));
CREATE TRIGGER segments_updated_at BEFORE UPDATE ON public.segments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.product_segments (
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  segment_id uuid NOT NULL REFERENCES public.segments(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, segment_id)
);
GRANT SELECT ON public.product_segments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_segments TO authenticated;
GRANT ALL ON public.product_segments TO service_role;
ALTER TABLE public.product_segments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product segments public read" ON public.product_segments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Product segments admin write" ON public.product_segments FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'super_admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role) OR private.has_role(auth.uid(), 'super_admin'::app_role));