-- ============================================================
-- Resume Builder Schema — Jobnique
-- ============================================================

-- Templates catalogue (seeded, not user-owned)
CREATE TABLE IF NOT EXISTS templates (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  category      TEXT NOT NULL,
  ats_score     INT  NOT NULL DEFAULT 80,
  description   TEXT,
  popular       BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- User resumes
CREATE TABLE IF NOT EXISTS resumes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL,
  title       TEXT NOT NULL DEFAULT 'My Resume',
  template_id TEXT REFERENCES templates(id) ON DELETE SET NULL,
  data        JSONB NOT NULL DEFAULT '{}',
  ats_score   INT,
  is_public   BOOLEAN DEFAULT FALSE,
  public_slug TEXT UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes(user_id);

-- Version history
CREATE TABLE IF NOT EXISTS resume_versions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id      UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  version_number INT  NOT NULL DEFAULT 1,
  label          TEXT,
  data           JSONB NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS resume_versions_resume_id_idx ON resume_versions(resume_id);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS resumes_updated_at ON resumes;
CREATE TRIGGER resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed templates
INSERT INTO templates (id, name, category, ats_score, description, popular) VALUES
  ('classic',     'Classic',     'Professional',  98, 'Clean timeless layout, works for any industry',      TRUE),
  ('executive',   'Executive',   'Executive',     95, 'Authoritative design for senior & C-suite roles',    FALSE),
  ('modern',      'Modern',      'Modern',        90, 'Sleek contemporary look with bold typography',       TRUE),
  ('minimal',     'Minimal',     'Minimal',       96, 'Ultra-clean, lots of white space, zero clutter',     FALSE),
  ('tech',        'Tech',        'Modern',        92, 'Built for developers — highlights skills & projects', TRUE),
  ('creative',    'Creative',    'Creative',      78, 'Bold visual identity for design & media roles',      FALSE),
  ('ats-pro',     'ATS Pro',     'ATS-Friendly',  99, 'Maximum ATS compatibility, recruiter-tested',        TRUE),
  ('graduate',    'Graduate',    'Minimal',       94, 'Perfect for students and recent graduates',          FALSE)
ON CONFLICT (id) DO NOTHING;
