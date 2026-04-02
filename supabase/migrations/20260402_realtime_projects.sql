-- Enable Supabase Realtime for the projects table so clients can subscribe
-- to live updates on current_amount and supporters_count.
alter publication supabase_realtime add table public.projects;
