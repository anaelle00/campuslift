-- Fix critical security issue: the previous "Authenticated users can support projects"
-- policy allowed any authenticated user to UPDATE any field on any project.
--
-- Solution: make support_project SECURITY DEFINER so it bypasses RLS,
-- then restrict UPDATE to project owners only.

-- Step 1: Recreate support_project as SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.support_project(
  p_project_id uuid,
  p_amount numeric
)
RETURNS TABLE (
  current_amount numeric,
  supporters_count integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to support a project.';
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than zero.';
  END IF;

  INSERT INTO public.pledges (user_id, project_id, amount)
  VALUES (v_user_id, p_project_id, p_amount);

  RETURN QUERY
  UPDATE public.projects
  SET
    current_amount = COALESCE(projects.current_amount, 0) + p_amount,
    supporters_count = COALESCE(projects.supporters_count, 0) + 1
  WHERE projects.id = p_project_id
  RETURNING
    projects.current_amount::numeric,
    projects.supporters_count::integer;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Project not found.';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.support_project(uuid, numeric) TO authenticated;

-- Step 2: Drop the dangerously permissive UPDATE policy
DROP POLICY IF EXISTS "Authenticated users can support projects" ON public.projects;

-- Step 3: Add a proper owner-only UPDATE policy
CREATE POLICY "Owners can update their own projects"
ON public.projects
FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = owner_id)
WITH CHECK ((SELECT auth.uid()) = owner_id);

-- Step 4: Remove the duplicate anon SELECT policy
DROP POLICY IF EXISTS "Public read access for projects" ON public.projects;
