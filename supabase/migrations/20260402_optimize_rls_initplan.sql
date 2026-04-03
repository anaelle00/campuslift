-- Optimize RLS policies to use (SELECT auth.uid()) instead of auth.uid().
-- This prevents the function from being re-evaluated for every row scanned.
-- Flagged by the Supabase performance advisor (auth_rls_initplan).

-- === PLEDGES ===
DROP POLICY IF EXISTS "Users can read their pledges" ON public.pledges;
CREATE POLICY "Users can read their pledges"
ON public.pledges FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert pledges" ON public.pledges;
CREATE POLICY "Users can insert pledges"
ON public.pledges FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

-- === FAVORITES ===
DROP POLICY IF EXISTS "Users can read their own favorites" ON public.favorites;
CREATE POLICY "Users can read their own favorites"
ON public.favorites FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
CREATE POLICY "Users can insert their own favorites"
ON public.favorites FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- === PROFILES ===
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

-- === PROJECTS (insert) ===
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.projects;
CREATE POLICY "Users can insert their own projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = owner_id);

-- === COMMENTS ===
DROP POLICY IF EXISTS "Authenticated users can insert their own comments" ON public.comments;
CREATE POLICY "Authenticated users can insert their own comments"
ON public.comments FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments"
ON public.comments FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments"
ON public.comments FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- === COMMENT REACTIONS ===
DROP POLICY IF EXISTS "Authenticated users can insert their own reactions" ON public.comment_reactions;
CREATE POLICY "Authenticated users can insert their own reactions"
ON public.comment_reactions FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update their own reactions" ON public.comment_reactions;
CREATE POLICY "Users can update their own reactions"
ON public.comment_reactions FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete their own reactions" ON public.comment_reactions;
CREATE POLICY "Users can delete their own reactions"
ON public.comment_reactions FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- === COMMENT REPORTS ===
DROP POLICY IF EXISTS "Users can view their own comment reports" ON public.comment_reports;
CREATE POLICY "Users can view their own comment reports"
ON public.comment_reports FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Authenticated users can insert their own comment reports" ON public.comment_reports;
CREATE POLICY "Authenticated users can insert their own comment reports"
ON public.comment_reports FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);
