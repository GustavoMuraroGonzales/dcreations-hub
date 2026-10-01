DROP POLICY IF EXISTS "product-images public read" ON storage.objects;
CREATE POLICY "product-images admin read" ON storage.objects
FOR SELECT TO authenticated
USING (bucket_id = 'product-images' AND private.has_role(auth.uid(), 'admin'::app_role));