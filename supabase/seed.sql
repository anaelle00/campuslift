-- Local development seed for CampusLift.
-- Safe to re-run: profiles use ON CONFLICT, projects are only inserted when none exist.
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

-- Insert 9 realistic demo projects (only when the table is empty)
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
select v.title, v.short_description, v.description, v.category,
       coalesce(profile.display_name, profile.username, 'CampusLift Creator'),
       profile.id,
       coalesce(profile.username, 'campuslift-creator'),
       v.target_amount, v.current_amount, v.image_url,
       current_date + v.days_until_deadline, v.supporters_count
from public.profiles as profile
cross join (values

  (
    'Open-source campus indoor navigation app',
    'A mobile app that helps students find their way inside large university buildings.',
    'Our campus has 14 interconnected buildings and hundreds of rooms that change every semester. Students — especially newcomers — waste 10–15 minutes per day looking for classrooms, study rooms, or offices. We want to build a free, open-source Flutter app with an interactive floor map, QR-code anchors at key intersections, and offline support. The funding will cover Bluetooth beacon hardware for 3 pilot buildings, hosting for the map tile server, and a small stipend for two student developers over the summer.',
    'Tech',
    1800, 1240,
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?q=80&w=1200&auto=format&fit=crop',
    21, 34
  ),

  (
    'Student mental health peer support network',
    'Training 20 student volunteers to run weekly peer listening sessions on campus.',
    'One in four university students reports significant anxiety or depression, yet fewer than 40% seek professional help — cost, wait times, and stigma are the main barriers. Our association wants to train 20 volunteer student listeners through a certified 12-hour program, then run weekly 90-minute drop-in sessions in a dedicated quiet room. The budget covers trainer fees, printed materials, light refreshments, and liability insurance for the first academic year. Every dollar goes directly toward making mental health support more accessible and less intimidating.',
    'Social',
    2200, 870,
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
    42, 19
  ),

  (
    'Campus community garden — second plot',
    'Expanding our existing garden with 12 new raised beds and a composting station.',
    'Last year we launched a 6-bed community garden that filled up within 48 hours. Students use it to grow vegetables, decompress between classes, and learn urban agriculture. This season we want to double the capacity with 12 new raised cedar beds, install a three-bin composting system fed by the campus cafeteria, and add a tool shed. The garden is fully student-managed and open to all. This project also ties into two environmental science courses whose students will use the plots for coursework.',
    'Social',
    950, 950,
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop',
    14, 61
  ),

  (
    '72-hour game jam — spring edition',
    'Three days, 40 students, zero budget excuses. Help us host the biggest campus game jam yet.',
    'Our game development club has run a 24-hour jam for two years. This spring we want to scale up to 72 hours with 40 participants, professional judges from two local studios, and a proper prize pool. The venue is confirmed (engineering atrium), but we need to cover food for three days, a cloud build server rental, software licenses, prizes, and streaming equipment to broadcast the final showcase online. Last year''s winning team is now doing an internship at a Montreal studio — this event works.',
    'Tech',
    1200, 340,
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    55, 12
  ),

  (
    'Podcast studio for student journalists',
    'A soundproofed recording booth and editing workstation for the campus radio association.',
    'The campus radio association produces 6 hours of original content per week — interviews, news, cultural segments — but records everything in a repurposed storage room with terrible acoustics. We want to convert an unused 9 m² office into a proper podcast studio: acoustic foam panels, a 4-input audio interface, two broadcast microphones, a compact mixing desk, and an editing workstation loaded with Reaper. The studio will be open to all student clubs, not just radio. Bookings will be managed via an online calendar.',
    'Art',
    1600, 720,
    'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=1200&auto=format&fit=crop',
    28, 22
  ),

  (
    'AI-powered lecture summarizer',
    'A browser extension that auto-generates structured notes from recorded lecture videos.',
    'Many courses post recorded lectures but students still spend hours re-watching them before exams. We are building a browser extension that runs a lightweight local LLM to chunk, transcribe, and summarize lecture videos into structured markdown notes — with timestamps, key terms highlighted, and an optional flashcard export. Privacy-first: everything runs in the browser, nothing is sent to external servers. We need funding for API credits during the beta phase, a UX designer for two weeks, and server costs for the optional cloud sync feature.',
    'Education',
    2500, 1875,
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
    60, 48
  ),

  (
    'Wheelchair-accessible campus tour guide',
    'An illustrated accessible route map and guided audio tour for students with reduced mobility.',
    'New students with reduced mobility told us that the official campus map does not show which entrances have ramps, which elevators are often out of service, or where the accessible washrooms are. We want to produce a beautifully illustrated PDF map and a web-based version with turn-by-turn audio guidance between 25 key campus locations. We will conduct interviews with current wheelchair users to validate every route before publishing. The project will be freely available and updated each semester.',
    'Education',
    800, 530,
    'https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?q=80&w=1200&auto=format&fit=crop',
    35, 18
  ),

  (
    'Cultural festival — Night of 40 Flags',
    'A one-night multicultural festival celebrating the 40+ nationalities on our campus.',
    'Our campus has students from 43 countries but almost no events that celebrate that diversity. The Night of 40 Flags is a free evening festival with food stands, performances, and a photo exhibition curated by international students. Each participating country runs its own stand — we just need to cover the shared costs: stage rental, PA system, lighting, printed signage, and a food safety permit. Last year''s pilot with 12 countries drew 400 attendees. This year we are aiming for 40 flags and 1 000 people.',
    'Event',
    3000, 2100,
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop',
    18, 87
  ),

  (
    'Robotics club — regional competition kit',
    'Parts and travel budget for our first appearance at the Canadian Robotics Challenge.',
    'Our robotics club qualified for the Canadian Robotics Challenge for the first time this year — competing against 60+ university teams. Our current robot is held together with zip-ties and optimism. We need to rebuild the drivetrain with proper machined parts, add a vision module for object recognition tasks, and cover two nights of accommodation and travel for 6 students. We have the engineering talent; we just need the resources to show up and compete properly.',
    'Association',
    2800, 1050,
    'https://images.unsplash.com/photo-1561144257-e32e8506e12c?q=80&w=1200&auto=format&fit=crop',
    45, 28
  )

) as v(title, short_description, description, category, target_amount, current_amount, image_url, days_until_deadline, supporters_count)
where not exists (select 1 from public.projects)
order by profile.id
limit 1;

-- Optional manual helper for local moderation testing:
-- update public.profiles
-- set role = 'admin'
-- where username = 'your_username';
