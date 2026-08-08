-- Pacnix India — normalized CMS schema for Supabase (free tier)
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ─── Site settings (singleton) ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  logo            TEXT NOT NULL DEFAULT '',
  logo_dark       TEXT NOT NULL DEFAULT '',
  logo_alt        TEXT NOT NULL DEFAULT '',
  favicon         TEXT NOT NULL DEFAULT '',
  url             TEXT NOT NULL DEFAULT '',
  locale          TEXT NOT NULL DEFAULT 'en_IN',
  default_title   TEXT NOT NULL DEFAULT '',
  title_template  TEXT NOT NULL DEFAULT '%s | Pacnix India',
  default_description TEXT NOT NULL DEFAULT '',
  default_og_image TEXT NOT NULL DEFAULT '',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Company (singleton + JSONB for nested sections edited together) ───────────
CREATE TABLE IF NOT EXISTS company (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  brand_name      TEXT NOT NULL DEFAULT '',
  legal_name      TEXT NOT NULL DEFAULT '',
  tagline         TEXT NOT NULL DEFAULT '',
  owner           TEXT NOT NULL DEFAULT '',
  hero            JSONB NOT NULL DEFAULT '{}'::jsonb,
  about           JSONB NOT NULL DEFAULT '{}'::jsonb,
  contact         JSONB NOT NULL DEFAULT '{}'::jsonb,
  stats           JSONB NOT NULL DEFAULT '[]'::jsonb,
  core_values     JSONB NOT NULL DEFAULT '[]'::jsonb,
  timeline        JSONB NOT NULL DEFAULT '[]'::jsonb,
  why_choose_us   JSONB NOT NULL DEFAULT '[]'::jsonb,
  social          JSONB NOT NULL DEFAULT '[]'::jsonb,
  navigation      JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Quality page (singleton) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quality (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  intro           TEXT NOT NULL DEFAULT '',
  pillars         JSONB NOT NULL DEFAULT '[]'::jsonb,
  process         JSONB NOT NULL DEFAULT '[]'::jsonb,
  standards       JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Product categories ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_categories (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  slug            TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  category_id     TEXT REFERENCES product_categories(id) ON DELETE SET NULL,
  featured        BOOLEAN NOT NULL DEFAULT false,
  summary         TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL DEFAULT '',
  features        JSONB NOT NULL DEFAULT '[]'::jsonb,
  applications    JSONB NOT NULL DEFAULT '[]'::jsonb,
  benefits        JSONB NOT NULL DEFAULT '[]'::jsonb,
  specifications  JSONB NOT NULL DEFAULT '[]'::jsonb,
  images          JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_alt       TEXT NOT NULL DEFAULT '',
  catalogue_path  TEXT NOT NULL DEFAULT '',
  related_slugs   JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products (category_id);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured) WHERE featured = true;

-- ─── Industries ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS industries (
  id              TEXT PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  icon            TEXT NOT NULL DEFAULT 'Package',
  description     TEXT NOT NULL DEFAULT '',
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Infrastructure ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS infrastructure_sections (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  image           TEXT NOT NULL DEFAULT '',
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Gallery ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_items (
  id              TEXT PRIMARY KEY,
  category        TEXT NOT NULL,
  src             TEXT NOT NULL,
  alt             TEXT NOT NULL DEFAULT '',
  attribution     TEXT,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gallery_items_category_idx ON gallery_items (category);

-- ─── Certificates ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certificates (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL DEFAULT '',
  thumbnail       TEXT NOT NULL DEFAULT '',
  file_path       TEXT NOT NULL DEFAULT '',
  is_placeholder  BOOLEAN NOT NULL DEFAULT false,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Downloads ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS downloads (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL DEFAULT '',
  file_path       TEXT NOT NULL DEFAULT '',
  description     TEXT NOT NULL DEFAULT '',
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Blog posts ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  slug            TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL DEFAULT '',
  published_at    TIMESTAMPTZ,
  author          TEXT NOT NULL DEFAULT '',
  read_minutes    INT NOT NULL DEFAULT 5,
  excerpt         TEXT NOT NULL DEFAULT '',
  body            TEXT NOT NULL DEFAULT '',
  image           TEXT NOT NULL DEFAULT '',
  image_alt       TEXT NOT NULL DEFAULT '',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_posts_published_idx ON blog_posts (published_at DESC);

-- ─── Careers ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS careers (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  location        TEXT NOT NULL DEFAULT '',
  type            TEXT NOT NULL DEFAULT 'Full-time',
  description     TEXT NOT NULL DEFAULT '',
  requirements    JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Testimonials ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT '',
  company         TEXT NOT NULL DEFAULT '',
  quote           TEXT NOT NULL DEFAULT '',
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── FAQs ──────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faqs (
  id              TEXT PRIMARY KEY,
  question        TEXT NOT NULL,
  answer          TEXT NOT NULL DEFAULT '',
  sort_order      INT NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Contact enquiries ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  company         TEXT,
  phone           TEXT NOT NULL,
  email           TEXT NOT NULL,
  product         TEXT,
  message         TEXT NOT NULL,
  email_sent      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS inquiries_created_at_idx ON inquiries (created_at DESC);

-- ─── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE company ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE careers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Public read for all CMS content tables
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read company" ON company FOR SELECT USING (true);
CREATE POLICY "Public read quality" ON quality FOR SELECT USING (true);
CREATE POLICY "Public read product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read industries" ON industries FOR SELECT USING (true);
CREATE POLICY "Public read infrastructure" ON infrastructure_sections FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public read downloads" ON downloads FOR SELECT USING (true);
CREATE POLICY "Public read blogs" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read careers" ON careers FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);

-- Writes go through service-role API only (no public insert/update on CMS tables)
CREATE POLICY "Public insert inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- ─── Storage bucket ────────────────────────────────────────────────────────────
-- Run supabase/storage.sql to create the public "media" bucket (images + PDFs).
-- Files are managed via Admin → Media library, not stored in the git repo.
