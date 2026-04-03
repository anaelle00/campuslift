-- Add indexes on foreign keys that were missing coverage.
-- Flagged by the Supabase performance advisor.

CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id
ON public.comment_reactions (user_id);

CREATE INDEX IF NOT EXISTS idx_comment_reports_user_id
ON public.comment_reports (user_id);

CREATE INDEX IF NOT EXISTS idx_comment_reports_reviewed_by
ON public.comment_reports (reviewed_by);

CREATE INDEX IF NOT EXISTS idx_comments_user_id
ON public.comments (user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_project_id
ON public.favorites (project_id);

CREATE INDEX IF NOT EXISTS idx_pledges_project_id
ON public.pledges (project_id);

CREATE INDEX IF NOT EXISTS idx_pledges_user_id
ON public.pledges (user_id);

CREATE INDEX IF NOT EXISTS idx_projects_owner_id
ON public.projects (owner_id);
