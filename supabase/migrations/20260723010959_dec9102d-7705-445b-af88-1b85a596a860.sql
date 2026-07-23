
CREATE TABLE public.instagram_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.instagram_posts TO anon;
GRANT SELECT ON public.instagram_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instagram_posts TO service_role;

ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active instagram posts"
  ON public.instagram_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage instagram posts"
  ON public.instagram_posts
  FOR ALL
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'super_admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role) OR private.has_role(auth.uid(), 'super_admin'::public.app_role));

CREATE INDEX instagram_posts_sort_order_idx ON public.instagram_posts (sort_order ASC, created_at DESC);

CREATE TRIGGER audit_instagram_posts
  AFTER INSERT OR UPDATE OR DELETE ON public.instagram_posts
  FOR EACH ROW EXECUTE FUNCTION public.log_audit_event();
