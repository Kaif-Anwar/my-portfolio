-- Add experience and contact sections to site_content
ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS experiences JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS contact JSONB NOT NULL DEFAULT '{}';
