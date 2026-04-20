ALTER TABLE public.campaigns ALTER COLUMN owner_id DROP NOT NULL;

DROP POLICY IF EXISTS "View own, demo, or as Admin/CMO" ON public.campaigns;
CREATE POLICY "View own, demo, or as Admin/CMO"
ON public.campaigns FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid()
  OR is_demo = true
  OR public.has_role(auth.uid(), 'Admin'::app_role)
  OR public.has_role(auth.uid(), 'CMO'::app_role)
);

DROP POLICY IF EXISTS "Uploaders can insert own campaigns" ON public.campaigns;
CREATE POLICY "Uploaders can insert own campaigns"
ON public.campaigns FOR INSERT
TO authenticated
WITH CHECK (
  owner_id = auth.uid()
  AND (
    public.has_role(auth.uid(), 'Admin'::app_role)
    OR public.has_role(auth.uid(), 'Marketing Manager'::app_role)
    OR public.has_role(auth.uid(), 'Digital Marketing Specialist'::app_role)
  )
);