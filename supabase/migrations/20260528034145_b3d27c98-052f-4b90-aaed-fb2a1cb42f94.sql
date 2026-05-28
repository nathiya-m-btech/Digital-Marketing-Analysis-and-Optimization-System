CREATE POLICY "Users update own surveys, Admin any"
ON public.surveys
FOR UPDATE
TO authenticated
USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'Admin'::app_role))
WITH CHECK ((user_id = auth.uid()) OR has_role(auth.uid(), 'Admin'::app_role));