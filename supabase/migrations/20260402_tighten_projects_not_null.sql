-- Tighten NOT NULL constraints on columns that the application always requires.
-- This ensures the database enforces the same invariants as the app-level validation.

-- First set defaults for any existing NULL values (safe for current data)
UPDATE public.projects SET short_description = '' WHERE short_description IS NULL;
UPDATE public.projects SET description = '' WHERE description IS NULL;
UPDATE public.projects SET category = 'Tech' WHERE category IS NULL;
UPDATE public.projects SET owner_name = 'Unknown' WHERE owner_name IS NULL;
UPDATE public.projects SET target_amount = 0 WHERE target_amount IS NULL;
UPDATE public.projects SET image_url = '' WHERE image_url IS NULL;
UPDATE public.projects SET owner_username = '' WHERE owner_username IS NULL;

-- Now add NOT NULL constraints
ALTER TABLE public.projects ALTER COLUMN short_description SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN description SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN category SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN owner_name SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN target_amount SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN image_url SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN deadline SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN owner_username SET NOT NULL;

-- Also ensure current_amount and supporters_count have safe defaults and NOT NULL
UPDATE public.projects SET current_amount = 0 WHERE current_amount IS NULL;
UPDATE public.projects SET supporters_count = 0 WHERE supporters_count IS NULL;
ALTER TABLE public.projects ALTER COLUMN current_amount SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN supporters_count SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN current_amount SET DEFAULT 0;
ALTER TABLE public.projects ALTER COLUMN supporters_count SET DEFAULT 0;
