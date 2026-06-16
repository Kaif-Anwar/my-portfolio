-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_status_sort_idx ON projects (status, sort_order);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public can read published projects
CREATE POLICY "Public read published projects"
  ON projects FOR SELECT
  USING (status = 'published');

-- Authenticated users can do everything (admin)
CREATE POLICY "Authenticated full access"
  ON projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage buckets (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('project-videos', 'project-videos', true);

-- Storage policies (apply after creating buckets)
-- CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
-- CREATE POLICY "Auth upload images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
-- CREATE POLICY "Auth update images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images');
-- CREATE POLICY "Auth delete images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');
-- (repeat for project-videos bucket)
