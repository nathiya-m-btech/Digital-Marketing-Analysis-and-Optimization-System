
-- 1. Fix privilege escalation: handle_new_user must ignore client-supplied role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _name TEXT;
BEGIN
  _name := COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

  INSERT INTO public.profiles (id, name, email)
  VALUES (NEW.id, _name, NEW.email);

  -- Always default new signups to 'Freelancer'. Role elevation must go through
  -- the admin-protected user management flow.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'Freelancer'::app_role);

  RETURN NEW;
END;
$function$;

-- 2. Tighten profiles SELECT policy: own row, Admin, or CMO
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users view own profile; Admin/CMO view all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR public.has_role(auth.uid(), 'Admin'::app_role)
    OR public.has_role(auth.uid(), 'CMO'::app_role)
  );

-- 3. Add explicit public SELECT policy on avatars bucket (intentional public design)
CREATE POLICY "Avatar images are publicly viewable"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- 4. Revoke EXECUTE on SECURITY DEFINER helpers from anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO service_role;
