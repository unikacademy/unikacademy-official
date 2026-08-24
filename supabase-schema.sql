-- ============================================================
-- UNIK Academy — Supabase Schema
-- Run this entire file in the Supabase SQL Editor.
-- ============================================================

-- contacts
create table if not exists contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text not null,
  status     text not null default 'not_read'
               check (status in ('not_read', 'read', 'replied')),
  created_at timestamptz default now()
);

-- applications
create table if not exists applications (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text not null,
  position   text not null,
  message    text,
  status     text not null default 'not_read'
               check (status in ('not_read', 'read', 'shortlisted', 'rejected')),
  created_at timestamptz default now()
);

-- demo_bookings
create table if not exists demo_bookings (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text,
  phone         text not null,
  course        text not null,
  message       text,
  status        text not null default 'not_read'
                  check (status in ('not_read', 'read', 'replied')),
  booking_type  text not null default 'individual'
                  check (booking_type in ('individual', 'corporate')),
  company_name  text,
  company_size  text,
  participants  integer,
  preferred_date date,
  created_at    timestamptz default now()
);

-- Adds the corporate booking columns if this table already existed before
-- that feature was introduced (create table if not exists is a no-op on an
-- existing table, so these run unconditionally and are safe to re-run).
alter table demo_bookings add column if not exists booking_type text not null default 'individual' check (booking_type in ('individual', 'corporate'));
alter table demo_bookings add column if not exists company_name text;
alter table demo_bookings add column if not exists company_size text;
alter table demo_bookings add column if not exists participants integer;
alter table demo_bookings add column if not exists preferred_date date;

-- courses
create table if not exists courses (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text not null,
  category    text not null check (category in ('core', 'pricing', 'premium')),
  icon_key    text default 'default',
  price       text default '',
  features    text[] default '{}',
  featured    boolean default false,
  "order"     integer default 0,
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- jobs
create table if not exists jobs (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  type             text not null,
  work_mode        text not null,
  responsibilities text[] default '{}',
  eligibility      text[] default '{}',
  is_active        boolean default true,
  created_at       timestamptz default now()
);

-- ── Row Level Security ──────────────────────────────────────
-- Enable RLS on all tables (service role key bypasses RLS for admin ops)
alter table contacts     enable row level security;
alter table applications enable row level security;
alter table demo_bookings enable row level security;
alter table courses      enable row level security;
alter table jobs         enable row level security;

-- Public can read only active courses and jobs (homepage / careers page)
drop policy if exists "Public read active courses" on courses;
create policy "Public read active courses"
  on courses for select using (is_active = true);

drop policy if exists "Public read active jobs" on jobs;
create policy "Public read active jobs"
  on jobs for select using (is_active = true);

-- Public can insert into submission tables (contact form, demo booking, application)
drop policy if exists "Public insert contacts" on contacts;
create policy "Public insert contacts"
  on contacts for insert with check (true);

drop policy if exists "Public insert demo_bookings" on demo_bookings;
create policy "Public insert demo_bookings"
  on demo_bookings for insert with check (true);

drop policy if exists "Public insert applications" on applications;
create policy "Public insert applications"
  on applications for insert with check (true);

-- All other access (admin reads, updates, deletes, course/job management)
-- is handled server-side using the service role key which bypasses RLS entirely.
