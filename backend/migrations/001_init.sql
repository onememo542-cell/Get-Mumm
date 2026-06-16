-- ============================================================
-- Get Mumm – Initial Schema
-- Matches the Drizzle ORM table definitions in src/db/schema/*
-- ============================================================

CREATE TABLE IF NOT EXISTS "categories" (
  "id"              serial PRIMARY KEY,
  "name"            text    NOT NULL,
  "name_ar"         text    NOT NULL,
  "slug"            text    NOT NULL UNIQUE,
  "description"     text    NOT NULL,
  "description_ar"  text    NOT NULL,
  "image_url"       text    NOT NULL,
  "item_count"      integer NOT NULL DEFAULT 0,
  "created_at"      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "chefs" (
  "id"              serial PRIMARY KEY,
  "name"            text    NOT NULL,
  "name_ar"         text    NOT NULL,
  "bio"             text    NOT NULL,
  "bio_ar"          text    NOT NULL,
  "image_url"       text    NOT NULL,
  "specialties"     text[]  NOT NULL DEFAULT '{}',
  "specialties_ar"  text[]  NOT NULL DEFAULT '{}',
  "item_count"      integer NOT NULL DEFAULT 0,
  "rating"          real    NOT NULL DEFAULT 4.8,
  "joined_year"     integer NOT NULL,
  "created_at"      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "menu_items" (
  "id"                serial  PRIMARY KEY,
  "name"              text    NOT NULL,
  "name_ar"           text    NOT NULL,
  "description"       text    NOT NULL,
  "description_ar"    text    NOT NULL,
  "price"             real    NOT NULL,
  "category_id"       integer NOT NULL,
  "category_name"     text    NOT NULL,
  "category_name_ar"  text    NOT NULL,
  "image_url"         text    NOT NULL,
  "dietary"           text[]  NOT NULL DEFAULT '{}',
  "is_available"      boolean NOT NULL DEFAULT true,
  "is_featured"       boolean NOT NULL DEFAULT false,
  "chef_name"         text    NOT NULL,
  "chef_name_ar"      text    NOT NULL,
  "rating"            real,
  "prep_time_minutes" integer,
  "created_at"        timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "testimonials" (
  "id"          serial  PRIMARY KEY,
  "name"        text    NOT NULL,
  "name_ar"     text    NOT NULL,
  "quote"       text    NOT NULL,
  "quote_ar"    text    NOT NULL,
  "type"        text    NOT NULL DEFAULT 'customer',
  "rating"      integer NOT NULL DEFAULT 5,
  "avatar_url"  text    NOT NULL,
  "company"     text,
  "company_ar"  text,
  "role"        text,
  "role_ar"     text,
  "created_at"  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "blog_posts" (
  "id"                 serial  PRIMARY KEY,
  "title"              text    NOT NULL,
  "title_ar"           text    NOT NULL,
  "slug"               text    NOT NULL UNIQUE,
  "excerpt"            text    NOT NULL,
  "excerpt_ar"         text    NOT NULL,
  "content"            text    NOT NULL,
  "content_ar"         text    NOT NULL,
  "image_url"          text    NOT NULL,
  "type"               text    NOT NULL DEFAULT 'blog',
  "published_at"       text    NOT NULL,
  "author"             text    NOT NULL,
  "author_ar"          text    NOT NULL,
  "read_time_minutes"  integer NOT NULL DEFAULT 5,
  "tags"               text[]  NOT NULL DEFAULT '{}',
  "created_at"         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "subscription_plans" (
  "id"               serial  PRIMARY KEY,
  "name"             text    NOT NULL,
  "name_ar"          text    NOT NULL,
  "description"      text    NOT NULL,
  "description_ar"   text    NOT NULL,
  "price"            real    NOT NULL,
  "period"           text    NOT NULL DEFAULT 'monthly',
  "features"         text[]  NOT NULL DEFAULT '{}',
  "features_ar"      text[]  NOT NULL DEFAULT '{}',
  "is_popular"       boolean NOT NULL DEFAULT false,
  "target_audience"  text    NOT NULL DEFAULT 'individual',
  "created_at"       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "contacts" (
  "id"          serial PRIMARY KEY,
  "name"        text   NOT NULL,
  "email"       text   NOT NULL,
  "phone"       text,
  "message"     text   NOT NULL,
  "subject"     text,
  "created_at"  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "office_inquiries" (
  "id"             serial  PRIMARY KEY,
  "company_name"   text    NOT NULL,
  "contact_name"   text    NOT NULL,
  "email"          text    NOT NULL,
  "phone"          text,
  "head_count"     integer NOT NULL,
  "delivery_area"  text,
  "frequency"      text,
  "message"        text    NOT NULL,
  "created_at"     timestamptz NOT NULL DEFAULT now()
);
