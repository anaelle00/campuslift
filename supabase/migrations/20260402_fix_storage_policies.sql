-- Fix storage policies:
-- 1. Remove duplicate avatar upload policy
-- 2. Restrict avatar uploads to the user's own folder
-- 3. Add explicit SELECT policy for project-images

-- Remove duplicate
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;

-- Tighten avatar upload: users can only write to their own folder
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
CREATE POLICY "Authenticated users can upload their own avatars"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- Tighten avatar update: users can only update files in their own folder
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
CREATE POLICY "Authenticated users can update their own avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- Add explicit SELECT policy for project-images
CREATE POLICY "Public can read project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Note: bucket-level restrictions (file_size_limit, allowed_mime_types)
-- were applied separately via:
--   avatars:        5 MB limit, image/jpeg, image/png, image/webp, image/gif
--   project-images: 10 MB limit, image/jpeg, image/png, image/webp, image/gif
