create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create index if not exists comments_project_created_at_idx
on public.comments (project_id, created_at desc);

create index if not exists comments_parent_created_at_idx
on public.comments (parent_id, created_at asc);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone"
on public.comments
for select
using (true);

create policy "Authenticated users can insert their own comments"
on public.comments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own comments"
on public.comments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
