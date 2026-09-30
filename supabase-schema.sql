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

-- ============================================================
-- Roles & users (RBAC) — see requirement.md
-- A user can have multiple roles; permissions per role live in code
-- (src/modules/auth/permissions.ts), not in the database.
-- ============================================================

-- roles — lookup table (not an enum, so roles can be added/renamed easily)
create table if not exists roles (
  id    text primary key,
  label text not null
);

insert into roles (id, label) values
  ('admin',     'Admin'),
  ('teacher',   'Teacher'),
  ('student',   'Student'),
  ('developer', 'Developer')
on conflict (id) do update set label = excluded.label;

-- profiles — one row per auth user (email copied here because the app
-- can't query the auth schema through the API)
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  avatar_url text,
  created_at timestamptz default now()
);

-- user_roles — which roles each user has (many-to-many)
create table if not exists user_roles (
  user_id    uuid not null references profiles(id) on delete cascade,
  role_id    text not null references roles(id) on update cascade on delete restrict,
  created_at timestamptz default now(),
  primary key (user_id, role_id)
);

-- New signups get a profile and the default 'student' role automatically
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role_id)
  values (new.id, 'student')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users who signed up before this existed (safe to re-run)
insert into profiles (id, email, full_name, avatar_url)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name'),
  coalesce(u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture')
from auth.users u
on conflict (id) do nothing;

insert into user_roles (user_id, role_id)
select p.id, 'student'
from profiles p
where not exists (select 1 from user_roles ur where ur.user_id = p.id);

-- RLS: logged-in users can read the role list and their own profile/roles.
-- There are deliberately NO insert/update/delete policies — users must never
-- be able to grant themselves roles. Role changes go through supabaseAdmin.
alter table roles      enable row level security;
alter table profiles   enable row level security;
alter table user_roles enable row level security;

drop policy if exists "Authenticated read roles" on roles;
create policy "Authenticated read roles"
  on roles for select to authenticated using (true);

drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile"
  on profiles for select to authenticated using ((select auth.uid()) = id);

drop policy if exists "Users read own roles" on user_roles;
create policy "Users read own roles"
  on user_roles for select to authenticated using ((select auth.uid()) = user_id);

-- Making a user admin: the user logs in once (gets the default 'student'
-- role), then in Table Editor → user_roles change their role_id to 'admin'.
