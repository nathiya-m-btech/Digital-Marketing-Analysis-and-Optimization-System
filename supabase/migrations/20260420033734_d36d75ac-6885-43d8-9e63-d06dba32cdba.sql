-- Add demo flag
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false;

-- Replace policies
DROP POLICY IF EXISTS "Admin or Marketing Manager can delete campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admin or Marketing Manager can insert campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Admin or Marketing Manager can update campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Authenticated users can view campaigns" ON public.campaigns;

CREATE POLICY "View own, demo, or as Admin/CMO"
ON public.campaigns FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid()
  OR is_demo = true
  OR public.has_role(auth.uid(), 'Admin'::app_role)
  OR public.has_role(auth.uid(), 'CMO'::app_role)
);

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

CREATE POLICY "Uploaders can update own campaigns"
ON public.campaigns FOR UPDATE
TO authenticated
USING (
  owner_id = auth.uid()
  AND (
    public.has_role(auth.uid(), 'Admin'::app_role)
    OR public.has_role(auth.uid(), 'Marketing Manager'::app_role)
    OR public.has_role(auth.uid(), 'Digital Marketing Specialist'::app_role)
  )
);

CREATE POLICY "Uploaders can delete own campaigns"
ON public.campaigns FOR DELETE
TO authenticated
USING (
  owner_id = auth.uid()
  AND (
    public.has_role(auth.uid(), 'Admin'::app_role)
    OR public.has_role(auth.uid(), 'Marketing Manager'::app_role)
    OR public.has_role(auth.uid(), 'Digital Marketing Specialist'::app_role)
  )
);

CREATE POLICY "Admins can update any campaign"
ON public.campaigns FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'Admin'::app_role));

CREATE POLICY "Admins can delete any campaign"
ON public.campaigns FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'Admin'::app_role));