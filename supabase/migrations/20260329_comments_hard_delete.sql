drop policy if exists "Users can delete their own comments" on public.comments;

create policy "Users can delete their own comments"
on public.comments
for delete
to authenticated
using (auth.uid() = user_id);
