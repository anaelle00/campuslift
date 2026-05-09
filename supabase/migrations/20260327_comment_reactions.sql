create table if not exists public.comment_reactions (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction_type text not null check (reaction_type in ('like', 'dislike')),
  created_at timestamptz not null default timezone('utc', now()),
  primary key (comment_id, user_id)
);

create index if not exists comment_reactions_comment_id_idx
on public.comment_reactions (comment_id);

alter table public.comment_reactions enable row level security;

create policy "Comment reactions are viewable by everyone"
on public.comment_reactions
for select
using (true);

create policy "Authenticated users can insert their own reactions"
on public.comment_reactions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own reactions"
on public.comment_reactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own reactions"
on public.comment_reactions
for delete
to authenticated
using (auth.uid() = user_id);
