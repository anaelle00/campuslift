-- Ensure usernames are unique across profiles.
-- Allows NULL (some profiles may not have a username yet).
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_idx
ON public.profiles (username)
WHERE username IS NOT NULL;
