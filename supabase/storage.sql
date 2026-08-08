-- Supabase Storage setup for Pacnix India CMS media
-- Run in SQL Editor after main schema.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  8388608,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
    'image/svg+xml',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read for website visitors
CREATE POLICY "Public read media objects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Uploads/deletes go through service-role API (admin panel) — no public write policy needed
