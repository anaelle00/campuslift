-- Add status column to projects table.
-- Possible values: 'draft' | 'published' | 'archived'
-- Default is 'published' to preserve existing rows.

ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published'
CONSTRAINT projects_status_check CHECK (status IN ('draft', 'published', 'archived'));

-- Allow owners to update status via the UPDATE policy already in place.
-- No additional RLS changes needed.
