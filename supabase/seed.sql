-- Local development seed for CampusLift.
-- Safe to re-run.
--
-- This file does not create auth users.
-- Create at least one user through the app or Supabase Auth first.

insert into public.profiles (
  id,
  username,
  display_name,
  organization,
  phone,
  website,
  bio,
  role
)
select
  auth_user.id,
  coalesce(
    nullif(auth_user.raw_user_meta_data ->> 'username', ''),
    split_part(coalesce(auth_user.email, auth_user.id::text), '@', 1)
  ) as username,
  coalesce(
    nullif(auth_user.raw_user_meta_data ->> 'display_name', ''),
    split_part(coalesce(auth_user.email, auth_user.id::text), '@', 1)
  ) as display_name,
  nullif(auth_user.raw_user_meta_data ->> 'organization', '') as organization,
  nullif(auth_user.raw_user_meta_data ->> 'phone', '') as phone,
  nullif(auth_user.raw_user_meta_data ->> 'website', '') as website,
  nullif(auth_user.raw_user_meta_data ->> 'bio', '') as bio,
  'user' as role
from auth.users as auth_user
on conflict (id) do update
set
  username = excluded.username,
  display_name = excluded.display_name,
  organization = excluded.organization,
  phone = excluded.phone,
  website = excluded.website,
  bio = excluded.bio;

insert into public.projects (
  title,
  short_description,
  description,
  category,
  owner_name,
  owner_id,
  owner_username,
  target_amount,
  current_amount,
  image_url,
  deadline,
  supporters_count
)
select
  'Campus sustainability lab kit',
  'A first local demo project for development and UI checks.',
  'This seeded project exists only to make local exploration easier after a fresh setup. Replace it with real user-created content as soon as you have accounts and real projects in your dev database.',
  'Education',
  coalesce(profile.display_name, profile.username, 'CampusLift Creator'),
  profile.id,
  coalesce(profile.username, 'campuslift-creator'),
  1500,
  0,
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
  current_date + 30,
  0
from public.profiles as profile
where not exists (
  select 1
  from public.projects
)
order by profile.id
limit 1;

-- Optional manual helper for local moderation testing:
-- update public.profiles
-- set role = 'admin'
-- where username = 'your_username';
