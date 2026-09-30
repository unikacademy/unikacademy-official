# Role-Based Dashboard — Requirements & Plan

_Written: 2026-09-28 · Status: Phase 1 done & live · Phase 2 in progress (branch `feat/rbac-phase-2-sections`)_

## Goal

Support multiple user roles — **admin, teacher, student, developer** — all using one dashboard, each seeing a limited view:

- **Admin** — sees everything (contacts, applications, demo bookings, jobs, courses/pricing, users).
- **Teacher** — their own class details and demo class sessions assigned to them.
- **Student** — their upcoming classes and other student-related info.
- **Developer** — sees everything an admin sees, **read-only** (all `:read` permissions, no `:manage`). _Decided 2026-09-29._

The system must also make it easy to **add more roles later** (e.g. counselor, sales, support, parent).

## Current state (as of 2026-09-28)

- Two separate dashboards:
  - `/admin/dashboard` → `src/app/admin/dashboard/page.tsx` (~3,700-line client component, tab-switched: contacts/applications/demo-bookings/jobs/courses).
  - `/user/dashboard` → `src/app/user/dashboard/page.tsx` (99 lines, stub: welcome card + "Your courses will appear here" placeholder, no real data).
- Single `/login` for everyone. No roles table — "admin" is just `user.email === process.env.ADMIN_EMAIL` in `middleware.ts`.
- `middleware.ts` matcher: `/admin/:path*`, `/user/:path*`, `/login`.
- No concept of classes, enrollments, or teacher assignment in the database yet.

## ⚠️ Security issue to fix first

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

## Design

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
2. **Unified dashboard** — create `/dashboard` with permission-based sidebar; split the admin page into module panels; redirect old routes. 🚧 _In progress (see Phase 2 progress)._
3. **Teacher & student features** — `classes`, `enrollments`, demo assignment, RLS policies; build teacher and student views.

## Progress

### Phase 1 — branch `feat/rbac-phase-1` (2026-09-28)

- [x] **Step 1** — `requirePermission()` guard on all 17 `/api/admin/*` handlers (401 not logged in / 403 no permission).
- [x] **Step 2** — `roles`, `profiles`, `user_roles` tables + signup trigger + backfill + read-own RLS (SQL run in Supabase). Removed stale MongoDB `scripts/create-admin.js` (had hardcoded credentials — MongoDB password rotated by user on 2026-09-29). README rewritten for Supabase.
- [x] **Steps 3+4** — roles read from `user_roles` per request (`fetchUserRoles`); page protection and login redirects use `can()` / `dashboardPathFor()` instead of `ADMIN_EMAIL`.
- [x] **Bug found & fixed:** the old `middleware.ts` was in the project root, but with a `src/app/` layout Next only loads it from `src/` — so **page protection never ran** (e.g. `/admin/dashboard` returned 200 without login). Moved to `src/proxy.ts` (Next 16 name).
- [x] **Step 5** — tested by user on staging and production with admin + student accounts; merged to `main` (PR #2 → `feat/rbac-phase-1`, PR #3 → `main`, `4c10f05`, 2026-09-30). Verified on production: `/api/admin/*` → 401 without login, `/admin` + `/dashboard` → redirect to `/login`.

### Phase 2 (2026-09-29 →)

_Steps 1, 2, 3 (contacts) and 6 shipped to `main` with Phase 1 (PR #3). Remaining work on branch `feat/rbac-phase-2-sections` (from `main`, 2026-09-30)._

- [x] **Step 1** — shared types/UI extracted from the admin page (3,710 → 2,695 lines, no behavior change) — `74c7ca4`
- [x] **Step 2** — `/dashboard` shell: permission-filtered sidebar, page guards, proxy covers `/dashboard/*` — `196bef8`
- [ ] **Step 3** — sections to pages:
  - [x] contacts → `/dashboard/contacts` (+ shared hooks `useAdminRecords`, `useTableControls`, `useToasts`) — `0ba2942` — ✅ verified by user
  - [x] demo bookings → `/dashboard/demos` (2026-09-30) — _awaiting user's browser check_
  - [ ] applications → `/dashboard/applications`
  - [ ] jobs → `/dashboard/jobs`
  - [ ] courses → `/dashboard/courses`
- [ ] **Step 4** — role-aware overview page
- [ ] **Step 5** — switch routing to `/dashboard`, redirect + delete old `/admin` and `/user` dashboards
- [x] **Step 6** — Users & Roles page `/dashboard/users`; developer role = read-only admin — `af64dd9` — ✅ verified by user
- [ ] **Step 7** — verify (type-check, lint, build, browser as admin/developer/student), update `CLAUDE.md`

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

- [ ] Multi-role users: **combined sidebar** (default, simplest) or a "viewing as" role switcher? (Can be added later without DB changes.)
- [x] ~~URL shape~~ → `/dashboard/<section>` (went with recommended default, 2026-09-29).
- [x] ~~API paths~~ → keep `/api/admin/*` (went with recommended default, 2026-09-29).
- [x] ~~Users & roles page in Phase 2?~~ → **Yes**, built (2026-09-29).
- [x] ~~Sidebar items for sections not yet moved?~~ → **Keep them visible** (option B, 2026-09-30): Demo Bookings / Job Applications / Job Postings / Courses 404 on `/dashboard` until each page is built. Acceptable because admins still land on `/admin/dashboard`, where all sections work.

## Open questions

- [x] ~~What should the developer role see?~~ → **Everything admin sees, read-only** (2026-09-29). Change `ROLE_PERMISSIONS.developer` in `permissions.ts` to give full admin rights instead.
- [x] ~~Can one person have multiple roles?~~ → **Confirmed (2026-09-28): yes**, via `user_roles` join table (see Decision C).
- [ ] For multi-role users, should the dashboard show **one combined view** (sidebar = union of all their permissions — simplest, the default in this design) or a **role switcher** ("viewing as Teacher / Student")? A switcher helps when e.g. a teacher-who-is-also-a-student wants "my classes" to mean one thing at a time.
- [ ] How are teachers onboarded — admin assigns role to an existing account, or invite flow?
- [ ] What "other student-related info" should students see (payments, progress, certificates, materials)?
- [ ] Will non-developers ever need to create new roles from the UI? (If yes, plan for DB-driven permissions — see Decision C.)

## Related notes

- `/spoken-english-course` landing page was removed on 2026-09-28 (page + `SpokenEnglishLanding.tsx`). Old ad links now 404 — consider a 301 redirect in `next.config.ts` (e.g. to `/courses/communication-skills` or `/demo`).
