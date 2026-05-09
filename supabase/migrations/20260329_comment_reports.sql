create table if not exists public.comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null check (reason in ('spam', 'harassment', 'hate', 'misinformation', 'other')),
  details text,
  status text not null default 'open' check (status in ('open', 'resolved', 'dismissed')),
  created_at timestamptz not null default timezone('utc', now()),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  unique (comment_id, user_id)
);

create index if not exists comment_reports_status_idx
on public.comment_reports (status, created_at desc);

create index if not exists comment_reports_comment_id_idx
on public.comment_reports (comment_id);

alter table public.comment_reports enable row level security;

create policy "Users can view their own comment reports"
on public.comment_reports
for select
to authenticated
using (auth.uid() = user_id);

create policy "Authenticated users can insert their own comment reports"
on public.comment_reports
for insert
to authenticated
with check (auth.uid() = user_id);
