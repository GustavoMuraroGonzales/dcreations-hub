-- Restrict EXECUTE on SECURITY DEFINER functions
-- grant_first_user_admin: trigger-only, revoke from all callers
REVOKE ALL ON FUNCTION public.grant_first_user_admin() FROM PUBLIC, anon, authenticated;

-- has_role: used by RLS policies; revoke from anon and public, keep for authenticated + service_role
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;