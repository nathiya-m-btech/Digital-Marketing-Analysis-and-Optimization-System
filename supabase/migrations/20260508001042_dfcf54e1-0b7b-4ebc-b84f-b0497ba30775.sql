-- Allow Freelancers to upload their own campaigns
DROP POLICY IF EXISTS "Uploaders can insert own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Uploaders can update own campaigns" ON public.campaigns;
DROP POLICY IF EXISTS "Uploaders can delete own campaigns" ON public.campaigns;

CREATE POLICY "Uploaders can insert own campaigns"
ON public.campaigns FOR INSERT TO authenticated
WITH CHECK (
  owner_id = auth.uid() AND (
    has_role(auth.uid(), 'Admin'::app_role) OR
    has_role(auth.uid(), 'Marketing Manager'::app_role) OR
    has_role(auth.uid(), 'Digital Marketing Specialist'::app_role) OR
    has_role(auth.uid(), 'Freelancer'::app_role) OR
    has_role(auth.uid(), 'Business Owner'::app_role)
  )
);

CREATE POLICY "Uploaders can update own campaigns"
ON public.campaigns FOR UPDATE TO authenticated
USING (owner_id = auth.uid());

CREATE POLICY "Uploaders can delete own campaigns"
ON public.campaigns FOR DELETE TO authenticated
USING (owner_id = auth.uid());

-- Surveys table
CREATE TABLE IF NOT EXISTS public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 0,
  feedback TEXT,
  campaign_name TEXT,
  answers JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own surveys, Admin/DMS view all"
ON public.surveys FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR
  has_role(auth.uid(), 'Admin'::app_role) OR
  has_role(auth.uid(), 'Digital Marketing Specialist'::app_role)
);

CREATE POLICY "Users insert own surveys"
ON public.surveys FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users delete own surveys, Admin any"
ON public.surveys FOR DELETE TO authenticated
USING (user_id = auth.uid() OR has_role(auth.uid(), 'Admin'::app_role));