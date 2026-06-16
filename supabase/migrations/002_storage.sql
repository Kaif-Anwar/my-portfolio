-- Storage bucket setup (run in Supabase SQL editor after creating buckets in dashboard)

-- Create buckets via dashboard: Storage → New bucket
--   project-images (public)
--   project-videos (public)

CREATE POLICY "Public read project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Auth upload project images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Auth update project images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Auth delete project images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Public read project videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-videos');

CREATE POLICY "Auth upload project videos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-videos');

CREATE POLICY "Auth update project videos"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-videos');

CREATE POLICY "Auth delete project videos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-videos');
