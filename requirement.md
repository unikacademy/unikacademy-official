# Role-Based Dashboard — Requirements & Plan

_Written: 2026-09-28 · Last updated: 2026-09-30_

| Phase | Status |
|---|---|
| **1. Security + roles** | ✅ Complete — live on `main` (PR #3) |
| **2. Unified dashboard** | ✅ Complete — branch `feat/rbac-phase-2-sections`; user merging to `main` and testing (2026-09-30) |
| **3. Teacher & student features** | ✅ Code complete (2026-10-01) on `feat/rbac-phase-3` — awaiting user's browser test + merge (see "Phase 3") |

## Goal

Support multiple user roles — **admin, teacher, student, developer** — all using one dashboard, each seeing a limited view:

- **Admin** — sees everything (contacts, applications, demo bookings, jobs, courses/pricing, users).
- **Teacher** — their own class details and demo class sessions assigned to them.
- **Student** — their upcoming classes and other student-related info.
- **Developer** — sees everything an admin sees, **read-only** (all `:read` permissions, no `:manage`). _Decided 2026-09-29._

The system must also make it easy to **add more roles later** (e.g. counselor, sales, support, parent).

## Starting point (as of 2026-09-28 — historical; see Progress for what changed)

- Two separate dashboards:
  - `/admin/dashboard` → `src/app/admin/dashboard/page.tsx` (~3,700-line client component, tab-switched: contacts/applications/demo-bookings/jobs/courses).
  - `/user/dashboard` → `src/app/user/dashboard/page.tsx` (99 lines, stub: welcome card + "Your courses will appear here" placeholder, no real data).
- Single `/login` for everyone. No roles table — "admin" is just `user.email === process.env.ADMIN_EMAIL` in `middleware.ts`.
- `middleware.ts` matcher: `/admin/:path*`, `/user/:path*`, `/login`.
- No concept of classes, enrollments, or teacher assignment in the database yet.

## ✅ Security issue (found 2026-09-28 — fixed in Phase 1, live since 2026-09-30)

`/api/admin/*` routes are **not protected**:

- The middleware matcher does not include `/api/admin/*`.
- The route handlers do no auth check themselves (e.g. `src/app/api/admin/contacts/route.ts` calls `getAllContacts()` directly).
- The module functions use `supabaseAdmin` (service role), which bypasses RLS.

**Impact:** anyone who knows the URL can `GET /api/admin/contacts` (and applications, demo bookings) without logging in — exposing customer names, phones, emails — and likely PATCH/DELETE via the `[id]` routes.

**Fix:** a server-side guard (`requireUser()` / `requirePermission()`) called at the top of every protected API route, returning 401 (not logged in) / 403 (wrong role) as JSON.

## Decisions

### A. One dashboard, not one per role

Don't build four separate dashboards (duplicated layout/sidebar/auth, they drift apart). Don't keep one mega page with role-hidden tabs either (that's the current 3,700-line problem).

→ **One `/dashboard` with a permission-driven sidebar, separate pages per feature, and permission checks enforced server-side.**

### B. Tooling: Supabase RBAC + small in-house permission map (no CASL, no third-party service)

| Layer | Tool | Job |
|---|---|---|
| Identity + roles | Supabase Auth + `roles`/`user_roles` tables, read with a **DB lookup per request** (`fetchUserRoles`) | Role changes apply immediately. _Decided 2026-09-28 over the Custom Access Token Hook (JWT claims), which would save one small query but delay role changes up to ~1h. Can switch later by changing only `fetchUserRoles`._ |
| Can they open this page / call this API? | Our `permissions.ts` + `requirePermission()` | Role → allowed pages/actions |
| Which rows can they see? | **Supabase RLS** | Teacher → own classes, student → own enrollments (DB enforces it) |
| Admin sees everything | `supabaseAdmin` (existing), only after the admin permission check | Full access |

Reference: Supabase docs — "Custom Claims & Role-based Access Control (RBAC)".

**Why not CASL (`@casl/ability`)?** Its main strength is conditional rules ("teacher can read a class *if* it's theirs"). RLS already enforces that at the DB level — teacher/student queries run through the user's own Supabase session, so the DB only returns their rows. That leaves the app with coarse checks only (page/API/sidebar access), which a ~30–50 line map handles. **Revisit CASL** if rules get finer-grained (e.g. "teacher can edit a class only before it starts"). Switching is cheap since all checks go through one `can()` function.

**Rejected alternatives:**

| Option | Examples | Why not |
|---|---|---|
| Auth providers with built-in RBAC | Clerk, Auth0, Kinde, WorkOS | Requires replacing Supabase Auth + migrating users; not worth it for a handful of roles. |
| Authorization-as-a-service | Permit.io, Oso, Cerbos, OpenFGA, SpiceDB | Built for complex large-scale sharing models; extra infra + cost; overkill here. |
| Other libraries | Casbin (`node-casbin`), `accesscontrol` | Casbin is more complex than needed; `accesscontrol` isn't actively maintained. |

### C. Built to add more roles later

Three rules, cheap now and expensive to retrofit:

1. **Check permissions, never role names, in code.**
   ```ts
   // ❌ Breaks every time a role is added
   if (user.role === "admin" || user.role === "teacher") { ... }

   // ✅ Code never mentions role names
   if (can(user, "demos:read")) { ... }
   ```
2. **Roles are a lookup table, not a Postgres `enum`** — enums are easy to add to but painful to rename/remove.
3. **A user can have multiple roles from day one** (`user_roles` join table) — e.g. a teacher who is also a student. A user's permissions = union of all their roles' permissions.

**Cost of adding a role later:**

| Kind of new role | Example | Work needed |
|---|---|---|
| Same data, different access | `counselor` (sees demos + contacts), `sales`, `support` | Insert 1 row in `roles` + 1 entry in the permission map. ~10 min. |
| Role with a new relationship | `parent` (sees their child's classes) | Above + a new table (`parent_students`) + an RLS policy. No tool avoids this — the DB must know which child belongs to which parent. |
| Admin creates roles from the UI | Admin builds a custom role, ticks permissions in a screen | Move permissions from code into DB tables (`permissions`, `role_permissions`). Bigger change — the point where a service like Permit.io starts to make sense. Only needed if non-developers must create roles without a deploy. |

## Design (original, 2026-09-28)

_Sections 1–4 describe what was built in Phases 1–2 (the permission names ended up as `<resource>:read` / `<resource>:manage`). Section 5 was an early guess — the current Phase 3 scope is in "Phase 3" below._

### 1. Roles in the database

```sql
create table roles (
  id text primary key,          -- 'admin', 'teacher', 'student', 'developer'
  label text not null
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now()
);

create table user_roles (
  user_id uuid references auth.users(id) on delete cascade,
  role_id text references roles(id),
  primary key (user_id, role_id)
);
```

- New signups get the `student` role by default; admin grants teacher/developer/admin from the dashboard (for now: manually in Supabase Table Editor → `user_roles`).
- Roles are read per request from `user_roles` (no JWT hook — see Decision B).
- Replaces the `ADMIN_EMAIL` comparison. `ADMIN_EMAIL` stays only as the notification-email inbox.
- **Do not** store roles in Supabase `user_metadata` — users can edit it themselves.
- Add to `supabase-schema.sql` (keep it re-runnable).

### 2. Single permission map

`src/modules/auth/permissions.ts`:

```ts
export const ROLE_PERMISSIONS: Record<RoleId, readonly Permission[]> = {
  admin:     ["contacts:read", "applications:manage", "courses:manage",
              "classes:read:all", "demos:read:all", "users:manage"],
  teacher:   ["classes:read:own", "demos:read:own"],
  student:   ["classes:read:enrolled", "profile:read"],
  developer: [/* TBD */],
};

// A user's permissions = union across all their roles
export function can(user: SessionUser, perm: Permission) {
  return user.roles.some((r) => ROLE_PERMISSIONS[r]?.includes(perm));
}
```

Sidebar, page guards, and API guards all read from this one map. Nothing else in the codebase references role names.

### 3. Route structure

```
src/app/dashboard/
  layout.tsx          ← server-reads roles, builds sidebar from permissions
  page.tsx            ← overview (admin: stats · teacher: today's classes · student: next class)
  contacts/page.tsx   ← needs contacts:read
  classes/page.tsx    ← classes:read:all → all · classes:read:own → own (same page, different scope)
  demos/page.tsx      ← demos:read:all → all · demos:read:own → assigned to them
  my-classes/page.tsx ← classes:read:enrolled
  users/page.tsx      ← users:manage (assign roles)
```

- Every page calls `requirePermission(...)` server-side — typing the URL can't bypass it.
- UI panels live in modules (e.g. `modules/contacts/components/ContactsPanel.tsx`), which also splits up the current 3,700-line admin page.
- Redirect old `/admin/dashboard` and `/user/dashboard` to `/dashboard`.

### 4. Data scoping on the server

Hiding UI is not security. Every server function scopes by caller:

```ts
export async function getClasses(user: SessionUser) {
  if (can(user, "classes:read:all")) return supabaseAdmin.from("classes").select();
  if (can(user, "classes:read:own")) return userClient.from("classes").select(); // RLS limits to own rows
  throw forbidden();
}
```

- Every `/api/**` route (other than public submit endpoints) calls `requireUser()` / `requirePermission()` first.
- Teacher/student queries use the user's session client so **RLS** enforces row-level scoping (e.g. `teacher_id = auth.uid()`); `supabaseAdmin` is used only for full-access permissions.

### 5. New tables needed

- `classes` / `sessions` — course, teacher_id, scheduled time, meeting link.
- `enrollments` — student ↔ course/class.
- `demo_bookings.teacher_id` — assign a demo to a teacher.

## Implementation phases

1. **Security + roles** — `roles`, `user_roles`, `profiles` tables; `permissions.ts` + `requirePermission` guard; lock down `/api/admin/*`; switch page protection and login redirects from `ADMIN_EMAIL` to roles. ✅ _Done — live on `main` since 2026-09-30 (PR #3, `4c10f05`)._
2. **Unified dashboard** — create `/dashboard` with permission-based sidebar; split the admin page into module panels; redirect old routes. ✅ _Complete 2026-09-30 (`feat/rbac-phase-2-sections`); user merging to `main` for testing._
3. **Teacher & student features** — first scope (decided 2026-09-30): profiles for students/teachers + demo assignment (admin assigns teacher/time/Meet link; teacher sees assigned demos; student sees their demo). Classes/enrollments/payments etc. come later, one at a time. ✅ _Code complete 2026-10-01 — see "Phase 3"._

## Progress

### Phase 1 — ✅ complete (branch `feat/rbac-phase-1`, 2026-09-28 → 2026-09-30)

- [x] **Step 1** — `requirePermission()` guard on all 17 `/api/admin/*` handlers (401 not logged in / 403 no permission).
- [x] **Step 2** — `roles`, `profiles`, `user_roles` tables + signup trigger + backfill + read-own RLS (SQL run in Supabase). Removed stale MongoDB `scripts/create-admin.js` (had hardcoded credentials — MongoDB password rotated by user on 2026-09-29). README rewritten for Supabase.
- [x] **Steps 3+4** — roles read from `user_roles` per request (`fetchUserRoles`); page protection and login redirects use `can()` / `dashboardPathFor()` instead of `ADMIN_EMAIL`.
- [x] **Bug found & fixed:** the old `middleware.ts` was in the project root, but with a `src/app/` layout Next only loads it from `src/` — so **page protection never ran** (e.g. `/admin/dashboard` returned 200 without login). Moved to `src/proxy.ts` (Next 16 name).
- [x] **Step 5** — tested by user on staging and production with admin + student accounts; merged to `main` (PR #2 → `feat/rbac-phase-1`, PR #3 → `main`, `4c10f05`, 2026-09-30). Verified on production: `/api/admin/*` → 401 without login, `/admin` + `/dashboard` → redirect to `/login`.

### Phase 2 — ✅ complete (2026-09-29 → 2026-09-30)

_Steps 1, 2, 3 (contacts) and 6 shipped to `main` with Phase 1 (PR #3). The rest is on branch `feat/rbac-phase-2-sections` (from `main`, 2026-09-30), which the user is merging to `main` and testing. Phase 2 has **no database changes** — nothing to run in Supabase._

- [x] **Step 1** — shared types/UI extracted from the admin page (3,710 → 2,695 lines, no behavior change) — `74c7ca4`
- [x] **Step 2** — `/dashboard` shell: permission-filtered sidebar, page guards, proxy covers `/dashboard/*` — `196bef8`
- [x] **Step 3** — sections to pages (every sidebar item has a page):
  - [x] contacts → `/dashboard/contacts` (+ shared hooks `useAdminRecords`, `useTableControls`, `useToasts`) — `0ba2942` — ✅ verified by user
  - [x] demo bookings → `/dashboard/demos` — `0f4e37b` — ✅ verified by user
  - [x] applications → `/dashboard/applications` — `ebf8baf` — search also matches position
  - [x] jobs → `/dashboard/jobs` — `04ce661` — form is now a real component (`JobFormModal`), fixing the "component created during render" lint error; shared `BulletListInput`
  - [x] courses → `/dashboard/courses` — `e396538` — `CourseFormModal` as a real component (fixes the second "component created during render" + the ref-during-render lint errors); save payload unchanged so website pricing is unaffected
- [x] **Step 4** — overview page — `4987c18`: welcome card + "At a glance" stat cards (total + unread/live) for every section the user can read, counted server-side; users with no section permissions (students/teachers until phase 3) get the "classes will appear here" placeholder
- [x] **Step 5** — switch-over — `f939ea0`: everyone lands on `/dashboard` after login; `/admin`, `/admin/*`, `/user`, `/user/*` → 308 to `/dashboard` (`next.config.ts`); deleted `src/app/admin` + `src/app/user` (2,803 lines incl. the admin page's 4 lint errors); removed `admin-dashboard:view` + `dashboardPathFor`; proxy now only guards `/dashboard/*` + `/login`; `robots.ts` disallows `/dashboard`. `/api/admin/*` paths unchanged.
- [x] **Step 6** — Users & Roles page `/dashboard/users`; developer role = read-only admin — `af64dd9` — ✅ verified by user
- [x] **Step 7** — verify + docs (2026-09-30): type-check ✅, production build ✅, lint: 0 errors in dashboard/auth code (project total 8 → 4; the 4 left are pre-existing `set-state-in-effect` in `components/ui/carousel.tsx`, `hooks/use-mobile.ts`, `HeroCarouselSection.tsx`, `SaleBanner.tsx`). `CLAUDE.md` (local, gitignored) and `README.md` updated for the unified dashboard.
- [ ] **Merge + test** (user, in progress 2026-09-30) — merge `feat/rbac-phase-2-sections` → `main`, then test:
  1. Admin login → lands on `/dashboard`, 6 stat cards, every section loads and saves.
  2. Courses: edit a price → homepage / course page / enroll page update; change it back.
  3. Jobs: create, edit, publish/hide, delete a test job.
  4. Student login → `/dashboard` with Overview only; `/dashboard/contacts` bounces back to Overview.
  5. Old bookmark `/admin/dashboard` → opens `/dashboard`.
  6. Users & Roles: give a test account `developer` → sees everything, no edit/delete/toggle controls.
  - ⚠️ The old-URL redirects are permanent (308) — browsers cache them, which only matters if we ever roll back to the old dashboard.

**Phase 2 result:** one `/dashboard` for all roles; 6 sections + overview, each its own page guarded by permission; old 3,710-line admin page and user stub deleted.

## Phase 2 — detailed plan (start: 2026-09-29 morning)

**Goal:** replace `/admin/dashboard` + `/user/dashboard` with one `/dashboard` whose sidebar and pages depend on the user's permissions.

### Before starting (carry-overs from Phase 1)

1. ✅ Browser test Phase 1 — done by user on staging + production (2026-09-30):
   - Admin account → lands on `/admin/dashboard`, all tabs load and save.
   - Non-admin account → lands on `/user/dashboard`; `/admin/dashboard` bounces back; `/api/admin/contacts` shows `{"error":"Forbidden"}`.
   - Logged-in admin visiting `/login` → redirected to `/admin/dashboard`.
2. ✅ Push + PR + merge — done (PR #3 → `main`, 2026-09-30). The admin API/pages are now protected on the live site.
3. ~~Rotate the MongoDB password~~ — ✅ done by user (2026-09-29).
4. ✅ Created `feat/rbac-phase-2-dashboard` from `feat/rbac-phase-1` (2026-09-29) — user will test phases 1+2 together on staging, so phase 2 builds on the unmerged phase 1 branch.

### What we're working with

`src/app/admin/dashboard/page.tsx` (~3,700 lines, one client component) contains:
- Types: `Contact`, `Application`, `DemoBooking`, `Job`, `Course`, statuses.
- Shared UI helpers: `StatusBadge`, `BookingTypeBadge`, `StatsCards`, `SearchAndFilterBar`, `SortableTh`, `SkeletonRows`, `ToastContainer`, `ConfirmModal`, `ActionDropdown`, `SlideOver`, `EmptyState`, `formatDate`.
- `AdminDashboard` — tab state via `activeSection` (`contacts` / `demo-bookings` / `applications` / `jobs` / `courses`), sidebar nav, data fetching from `/api/admin/*`, and all five sections' tables/forms.

`/user/dashboard` (99 lines) is just a welcome card + "courses will appear here" placeholder.

### Steps (one commit each, test after each)

1. **Extract shared UI (pure move, no behavior change).** Move the helper components into `src/modules/dashboard/components/` and the types into each domain module (e.g. `modules/contacts/types.ts`). `/admin/dashboard` must look and work exactly as before.
2. **Dashboard shell.**
   - `src/modules/dashboard/nav.ts` — one list of `{ href, label, icon, permission }`.
   - `src/app/dashboard/layout.tsx` (server) — `getSessionUser()`, redirect to `/login` if none, filter nav items with `can()`, render a client `Sidebar` + user menu (name/avatar/sign out).
   - Add a page guard (redirect / 404 instead of a JSON response) alongside the API guard `requirePermission()`.
3. **Move sections to pages, one at a time** — contacts → demo bookings → applications → jobs → courses:
   - `src/app/dashboard/<section>/page.tsx` (server: page guard) renders `modules/<domain>/components/<Domain>Panel.tsx` (client: table, filters, slide-over, actions).
   - Keep calling the existing `/api/admin/*` endpoints (already permission-guarded) — no API renames.
   - Test each section in the browser before moving to the next.
4. **Overview page `/dashboard`.** Role-aware cards: admin → stats (counts of new contacts/demos/applications); student → current welcome card; teacher → placeholder until Phase 3.
5. **Switch routing over.**
   - `dashboardPathFor()` → `/dashboard`. (Proxy matcher already covers `/dashboard/:path*` since step 2.)
   - 301 redirects in `next.config.ts`: `/admin/dashboard` → `/dashboard`, `/user/dashboard` → `/dashboard`.
   - Delete `src/app/admin/` and `src/app/user/`; drop the `admin-dashboard:view` permission (each page now has its own).
6. **Users & roles page `/dashboard/users`** (`users:read` / `users:manage`) — list profiles with their roles, add/remove roles. New `modules/users/server/admin.ts` + `/api/admin/users` routes using `supabaseAdmin`. Replaces the manual Table Editor step. Safety: an admin can't remove their own `admin` role, and the last admin can't be removed (prevents lock-out). ✅ _Built 2026-09-29, ahead of steps 3–5._
7. **Verify & document.** `type-check`, `lint`, browser test as admin and as student; update `CLAUDE.md` (remove the "3,700-line page" note) and tick Phase 2 here.

### Decisions to confirm when we start

- [x] ~~Multi-role users~~ → **combined sidebar** (decided 2026-09-30).
- [x] ~~URL shape~~ → `/dashboard/<section>` (went with recommended default, 2026-09-29).
- [x] ~~API paths~~ → keep `/api/admin/*` (went with recommended default, 2026-09-29).
- [x] ~~Users & roles page in Phase 2?~~ → **Yes**, built (2026-09-29).
- [x] ~~Sidebar items for sections not yet moved?~~ → **Keep them visible** (option B, 2026-09-30): Demo Bookings / Job Applications / Job Postings / Courses 404 on `/dashboard` until each page is built. Acceptable because admins still land on `/admin/dashboard`, where all sections work.

## Open questions

- [x] ~~What should the developer role see?~~ → **Everything admin sees, read-only** (2026-09-29). Change `ROLE_PERMISSIONS.developer` in `permissions.ts` to give full admin rights instead.
- [x] ~~Can one person have multiple roles?~~ → **Confirmed (2026-09-28): yes**, via `user_roles` join table (see Decision C).
- [x] ~~Multi-role users: combined view or role switcher?~~ → **Combined view** (2026-09-30). Phase 3 pages get distinct names ("My Demo" vs "My Demo Classes") so overlapping roles stay clear.
- [x] ~~How are teachers onboarded?~~ → **Option A** (2026-09-30): teacher logs in once, admin grants `teacher` on Users & Roles. Invite flow later if needed.
- [x] ~~What should students see?~~ → Built **one priority at a time** (2026-09-30). First: (1) **their own profile** (edit info + photo), (2) **their demo booking** (booked time + teacher info). Everything else (payments, progress, certificates, materials) later.
- [x] ~~Custom roles from the UI?~~ → **Not needed now** (2026-09-30). Roles stay defined in code.

## Phase 3 — Teacher & student features (final plan, 2026-09-30)

**Status:** ✅ Code complete 2026-10-01 on branch `feat/rbac-phase-3` (from `main` after PR #4). Database SQL already run in Supabase. Awaiting user's browser test (checklist under Steps) → PR → `main`.

### Requirements (from user, 2026-09-30)

**Student**
1. **My Profile** — add/edit their info: name, email, college, field of study, photo, "and so on".
2. **My Demo** — see their demo booking: when it's scheduled, and the assigned teacher's info.

**Teacher**
1. **My Profile** — add/edit their info (same idea as students).
2. **My Demo Classes** — see the demo classes **assigned to them by an admin**: the time, and the student's info. Teachers only see their own assigned demos.

**Admin**
- Assigns a teacher (and a time) to each demo booking.

### What the data looks like today (checked 2026-09-30)

- `demo_bookings` are submitted from the public form **without login**: `name`, `phone` (required), `email` (optional), `course`, `message`, plus corporate fields and an optional `preferred_date` (date only).
- 63 bookings: 30 have an email, **0 match any logged-in user's email**, 0 have a preferred date.
- There is **no** `student_id`, `teacher_id`, or scheduled time column → needs schema changes.
- `profiles` has only `email`, `full_name`, `avatar_url` (from Google/GitHub).

### Decisions (confirmed by user, 2026-09-30)

- [x] **Linking a booking to a student** → **admin links it by hand** in the Demo Bookings slide-over (pick a student account). No auto-link by email, no login-to-book.
- [x] **Student profile fields** → name, email (read-only — it's the login), photo, phone, date of birth, city, college, field of study, year of study.
- [x] **Teacher profile fields** → name, email (read-only), photo, phone, qualification, years of experience, specialization, short bio.
- [x] **Teacher sees about the student** → name, **phone**, course, message, date of birth/city, college, field of study, year of study, photo. **Not email.**
- [x] **Student sees about the teacher** → name, photo, qualification, experience, specialization, bio. **No phone, no email.**
- [x] **Meeting link** → **Google Meet** link per demo, entered by admin (validated as `https://meet.google.com/...`). Shown to the assigned teacher and the student.
- [x] **Demo lifecycle** → `pending` (new, no teacher/time) → `scheduled` → `completed` / `cancelled` / `no_show` / `rescheduled` (scheduled again at a new time). Separate from the inbox status (not_read/read/replied).
- [x] **Time zone** → everything shown and entered in **IST (Asia/Kolkata)**; stored as `timestamptz`.

### Design

**Database (`supabase-schema.sql`, re-runnable — user runs it in the Supabase SQL editor):**

**`profiles` new columns:** `phone`, `date_of_birth date`, `city`, `college`, `field_of_study`, `year_of_study`, `qualification`, `experience_years int`, `specialization`, `bio`, `updated_at`. Student fields and teacher fields are all nullable; the profile form shows the student section to users with the student role and the teacher section to teachers (both if they have both). `avatar_url` becomes the uploaded photo when set (falls back to the Google/GitHub picture).

**`demo_bookings` new columns:** `student_id uuid → profiles`, `teacher_id uuid → profiles`, `scheduled_at timestamptz`, `meet_link text`, `demo_status text default 'pending'` (check constraint on the 6 values), `updated_at`.

**Field whitelists (enforced server-side, not just hidden in the UI):**
- Teacher's view of a demo: time, meet link, course, message, demo status + student `full_name, phone, avatar_url, date_of_birth, city, college, field_of_study, year_of_study`. **No student email.**
- Student's view of a demo: time, meet link, course, demo status + teacher `full_name, avatar_url, qualification, experience_years, specialization, bio`. **No teacher phone/email.**

**A student can have more than one booking** → My Demo lists all bookings linked to them, next upcoming first.

**Photo storage:** Supabase Storage bucket `avatars` — each user uploads to `avatars/<user_id>/…`; storage RLS lets a user write only their own folder; public read (photos are shown to teachers/students).

**Permissions (added to `permissions.ts`):**

| Permission | Who | Allows |
|---|---|---|
| _(none — any logged-in user)_ | everyone | My Profile: view/edit own profile + photo |
| `demos:assign` | admin | Link student, assign teacher, set time + Meet link, change demo stage |
| `demos:read:assigned` | teacher | My Demo Classes: only demos where `teacher_id = me` |
| `demos:read:own` | student | My Demo: only demos where `student_id = me` |

Admin keeps `demos:read` / `demos:manage`; developer gets the new `:read`-style permissions read-only as today.

**Data scoping:** teacher/student queries are always filtered to the caller on the server (`teacher_id = me` / `student_id = me`) **and** return only the whitelisted fields above. RLS policies on `demo_bookings` as a second layer.

**Pages:**
- `/dashboard/profile` — **My Profile** (every logged-in user). Common fields + student section and/or teacher section depending on roles; photo upload.
- `/dashboard/my-demo` — **My Demo** (student): each linked booking — date/time (IST), stage, Meet link, teacher card.
- `/dashboard/my-demo-classes` — **My Demo Classes** (teacher): upcoming + past assigned demos — date/time (IST), stage, Meet link, course/message, student card (with phone).
- Admin **Demo Bookings** slide-over: new "Assign" section — link student (pick from student accounts), assign teacher (pick from teacher accounts), date + time (IST), Google Meet link, demo stage. Table gets Teacher / Scheduled columns.
- **Overview:** "Your next demo" card for students and teachers.

### Steps (one commit each, test after each)

1. ✅ **Database** — `profiles` columns, `demo_bookings` columns + check constraint, `avatars` bucket + storage policies. Run in Supabase + verified 2026-10-01 — `277e1c4`. _Changed from plan: no select/update RLS policies for teachers/students on `profiles`/`demo_bookings` (RLS is row-level and would expose e.g. student email); all reads/writes go through the server with field whitelists._
2. ✅ **My Profile** `/dashboard/profile` (2026-10-01) — every role; basic section + Education (student) / Teaching (teacher) sections via `profileSectionsFor()`; shared validation (client + server); server writes only whitelisted fields; photo resized in-browser to 512px JPEG, uploaded to `avatars/<user id>/`, server verifies path + file before saving, old upload deleted, "Remove photo" reverts to the Google/GitHub picture; sidebar/top bar now show the profile name/photo. — _awaiting user's browser check_
3. ✅ **Admin assigning** in Demo Bookings (2026-10-01) — "Demo assignment" section in the booking slide-over: student account, teacher, date & time (IST), Google Meet link, stage (picking teacher + time auto-moves a pending demo to Scheduled). New `demos:assign` permission (admin only; developers see a read-only summary). `PATCH /api/admin/demo-bookings/[id]/assign` validates stage, IST time, Meet link, and that the picked accounts actually have the student/teacher role; scheduled/rescheduled/completed/no-show require a teacher + time. `GET …/assignees` lists teacher/student accounts. Table gets a sortable "Demo" column (stage, IST time, teacher); search matches teacher/student names. — _awaiting user's browser check_
4. ✅ **Teacher: My Demo Classes** `/dashboard/my-demo-classes` (2026-10-01) — server-rendered (no API); `demos:read:assigned` (teacher only — "personal" permissions are excluded from admin's all-permissions so admins don't get an empty page); only demos with `teacher_id = me`; Upcoming (not finished, until 1 h after start) / Past; card: IST time, stage, course, Join Google Meet, message, student card (name, phone, photo, age, city, college, field, year; falls back to booking-form name/phone if no account linked). Student email is never selected from the DB. Also gives students `demos:read:own` (used in step 5). — _awaiting user's browser check_
5. ✅ **Student: My Demo** `/dashboard/my-demo` (2026-10-01) — server-rendered; `demos:read:own`; only bookings with `student_id = me`; Upcoming / Past; card: IST time (or "to be confirmed"), stage + friendly note, course, booked date, Join Google Meet, teacher card (name, photo, qualification, experience, specialization, bio — or "a teacher will be assigned soon"). Teacher phone/email never selected from the DB. Empty state explains the admin links bookings + "Book a free demo" → `/demo`. — _awaiting user's browser check_
6. ✅ **Overview "next demo" cards + verify + docs** (2026-10-01) — Overview shows "Your next demo" (student) / "Your next demo class" (teacher) with IST time, stage, other person's name, Join Google Meet, link to the full page; the empty placeholder only remains for users with nothing to show. Verified: 0 type errors, build ✅, lint unchanged (same 4 pre-existing marketing/ui errors, 0 in phase 3 code), all logged-out checks 307/401; logic + privacy checks (permissions, IST conversion in 3 time zones, upcoming/past, age, no email/phone in whitelisted rows, assignment validation without writes) all pass. `README.md` + `CLAUDE.md` (local) updated.

### Browser test checklist (user)

_Prerequisite: on Users & Roles, give one test account **teacher** and another **student** (there are none yet)._

1. **My Profile** (each role): fill in fields + save; upload a photo (sidebar avatar updates), then Remove (back to Google photo); bad phone / future DOB show errors; student sees Education, teacher sees Teaching.
2. **Admin → Demo Bookings:** open a booking → link the student, pick the teacher, set a future IST time + Meet link → Save. Stage becomes Scheduled; table "Demo" column shows time + teacher. A Zoom link is rejected; "Scheduled" without teacher/time is rejected.
3. **Teacher → My Demo Classes:** the demo is under Upcoming with correct IST time, working Meet button, student card with phone — **no email**.
4. **Student → My Demo:** same demo with teacher card (qualification, experience, bio) — **no teacher phone/email**.
5. **Overview** for teacher and student shows the "next demo" card.
6. Set the demo to Completed / Cancelled → moves to Past on both pages.
7. Developer account: Demo Bookings shows the assignment read-only (no Save).

### Later (not in this scope)

Classes / enrollments, payments & receipts, progress / attendance, certificates, study materials — one at a time, when prioritised. Email notifications when a demo is assigned. Teacher invite flow.

## Related notes

- `/spoken-english-course` landing page was removed on 2026-09-28 (page + `SpokenEnglishLanding.tsx`). Old ad links now 404 — consider a 301 redirect in `next.config.ts` (e.g. to `/courses/communication-skills` or `/demo`).
