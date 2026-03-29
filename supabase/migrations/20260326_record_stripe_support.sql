alter table public.pledges
add column if not exists stripe_checkout_session_id text,
add column if not exists stripe_payment_intent_id text;

create unique index if not exists pledges_stripe_checkout_session_id_idx
on public.pledges (stripe_checkout_session_id)
where stripe_checkout_session_id is not null;

create or replace function public.record_stripe_support(
  p_project_id uuid,
  p_user_id uuid,
  p_amount numeric,
  p_checkout_session_id text,
  p_payment_intent_id text default null
)
returns table (
  current_amount numeric,
  supporters_count integer,
  already_processed boolean
)
language plpgsql
security invoker
set search_path = public
as $$
begin
  if p_project_id is null then
    raise exception 'Project id is required.';
  end if;

  if p_user_id is null then
    raise exception 'User id is required.';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Amount must be greater than zero.';
  end if;

  if p_checkout_session_id is null or length(trim(p_checkout_session_id)) = 0 then
    raise exception 'Checkout session id is required.';
  end if;

  perform 1
  from public.projects
  where projects.id = p_project_id;

  if not found then
    raise exception 'Project not found.';
  end if;

  insert into public.pledges (
    user_id,
    project_id,
    amount,
    stripe_checkout_session_id,
    stripe_payment_intent_id
  )
  values (
    p_user_id,
    p_project_id,
    p_amount,
    p_checkout_session_id,
    p_payment_intent_id
  )
  on conflict do nothing;

  if not found then
    return query
    select
      coalesce(projects.current_amount, 0)::numeric,
      coalesce(projects.supporters_count, 0)::integer,
      true
    from public.projects
    where projects.id = p_project_id;

    return;
  end if;

  return query
  update public.projects
  set
    current_amount = coalesce(projects.current_amount, 0) + p_amount,
    supporters_count = coalesce(projects.supporters_count, 0) + 1
  where projects.id = p_project_id
  returning
    projects.current_amount::numeric,
    projects.supporters_count::integer,
    false;

  if not found then
    raise exception 'Project not found.';
  end if;
end;
$$;

grant execute on function public.record_stripe_support(uuid, uuid, numeric, text, text) to service_role;
