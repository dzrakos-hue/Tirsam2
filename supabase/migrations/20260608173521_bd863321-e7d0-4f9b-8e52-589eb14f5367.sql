REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

DROP POLICY IF EXISTS "Anyone can view visible products" ON public.products;
CREATE POLICY "Anyone can view visible products" ON public.products FOR SELECT TO anon, authenticated
USING (is_visible = true);