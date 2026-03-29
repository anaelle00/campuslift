create or replace function public.support_project(
  p_project_id uuid,
  p_amount numeric
)
returns table (
  current_amount numeric,
  supporters_count integer
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'You must be logged in to support a project.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be greater than zero.';
  end if;

  insert into public.pledges (user_id, project_id, amount)
  values (v_user_id, p_project_id, p_amount);

  return query
  update public.projects
  set
    current_amount = coalesce(projects.current_amount, 0) + p_amount,
    supporters_count = coalesce(projects.supporters_count, 0) + 1
  where projects.id = p_project_id
  returning
    projects.current_amount::numeric,
    projects.supporters_count::integer;

  if not found then
    raise exception 'Project not found.';
  end if;
end;
$$;

grant execute on function public.support_project(uuid, numeric) to authenticated;
