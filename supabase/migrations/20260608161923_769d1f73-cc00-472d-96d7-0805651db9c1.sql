
-- Lock down SECURITY DEFINER trigger functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Strengthen orders insert policy with length checks
DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (
  length(first_name) BETWEEN 1 AND 100 AND
  length(last_name) BETWEEN 1 AND 100 AND
  length(wilaya) BETWEEN 1 AND 100 AND
  length(commune) BETWEEN 1 AND 100 AND
  length(address) BETWEEN 5 AND 500 AND
  length(phone_1) BETWEEN 6 AND 30 AND
  length(product_name) BETWEEN 1 AND 200 AND
  product_price >= 0 AND
  (email IS NULL OR length(email) <= 255) AND
  (notes IS NULL OR length(notes) <= 1000)
);
