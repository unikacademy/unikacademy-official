# UNIK Academy

Website and admin dashboard for UNIK Academy, built with Next.js (App Router), TypeScript, Tailwind CSS, and Supabase.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Database & Auth:** Supabase (Postgres + Supabase Auth with Google/GitHub login)
- **Email:** Resend
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your env file and fill in the values (see comments inside):

   ```bash
   cp .env.example .env
   ```

3. Set up the database: open the Supabase dashboard → **SQL Editor**, paste the whole of `supabase-schema.sql` and run it. The file is safe to re-run whenever the schema changes.

4. Run the dev server and open [http://localhost:3000](http://localhost:3000):

   ```bash
   npm run dev
   ```

### Roles and the dashboard

Everyone logs in at `/login` (Google or GitHub) and lands on `/dashboard`. What they see there depends on their roles:

| Role | Access |
|---|---|
| Admin | Everything — view and manage contacts, demo bookings (incl. assigning teachers), applications, jobs, courses, users & roles |
| Developer | Sees everything an admin sees, read-only |
| Teacher | My Profile (incl. teaching details) · **My Demo Classes** — demos assigned to them, with time, Meet link and student details (phone, not email) |
| Student | My Profile (incl. education details) · **My Demo** — their demo bookings, with time, Meet link and teacher details (no phone/email) |

Everyone has **My Profile** (name, phone, photo, etc.). New signups get the `student` role. A user can have several roles and sees the pages for all of them.

**Demo workflow:** a visitor books a demo on the website (no login needed) → an admin opens it in **Demo Bookings**, links it to the student's account, assigns a teacher, sets the date/time (IST) and Google Meet link → the teacher sees it under My Demo Classes and the student under My Demo.

Profile photos are stored in the Supabase Storage bucket `avatars` (created by `supabase-schema.sql`).

**Making the first admin** (one-time, on a fresh database — there is no admin script or default password):

1. Log in once at `/login` — this creates your profile with the default `student` role.
2. In the Supabase dashboard → **Table Editor → `user_roles`**, find your row and change `role_id` from `student` to `admin`.

After that, manage everyone's roles from **Dashboard → Users & Roles** (`/dashboard/users`).

## Scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run lint         # eslint
npm run type-check   # tsc --noEmit
```

## Project Structure

```
src/
├── app/
│   ├── (marketing)/   # public site: home, about, careers, contact, courses, demo, enroll, terms, privacy-policy
│   ├── dashboard/     # one dashboard for all roles; pages shown by permission
│   ├── login/         # login page (Google / GitHub)
│   ├── auth/callback/ # Supabase OAuth callback
│   └── api/           # thin route handlers → src/modules/*/server
├── modules/           # feature modules (contacts, applications, demo-bookings, courses, jobs, users, auth, dashboard, marketing)
├── shared/            # reusable UI, animations, validation
└── lib/               # Supabase clients, API helpers
supabase-schema.sql    # database schema + RLS policies (source of truth)
src/proxy.ts           # login required for /dashboard/* (Next 16 "middleware")
```

See `CLAUDE.md` for a detailed architecture guide and `requirement.md` for the role-based dashboard plan.

## Contact

- **Email:** unikacademy2025@gmail.com
- **Phone:** 9217196824

## License

Private — UNIK Academy
