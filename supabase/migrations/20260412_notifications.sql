-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('new_supporter', 'new_comment')),
  title text NOT NULL,
  body text NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast per-user queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_user_unread_idx ON public.notifications(user_id, read) WHERE read = false;

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
CREATE POLICY "users can read own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = (SELECT auth.uid()));

-- Users can update (mark as read) their own notifications
CREATE POLICY "users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = (SELECT auth.uid()));

-- Service role inserts notifications (called from webhooks/server actions)
CREATE POLICY "service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
