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

### Making a user an admin

There is no admin script or default password. Admins are normal users with the `admin` role:

1. Log in once at `/login` (Google or GitHub) — this creates your profile with the default `student` role.
2. In the Supabase dashboard → **Table Editor → `user_roles`**, find your row and change `role_id` from `student` to `admin` (or add a second row with `admin` to keep both roles).

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
│   ├── admin/         # admin dashboard
│   ├── user/          # user dashboard
│   ├── login/         # login page (Google / GitHub)
│   ├── auth/callback/ # Supabase OAuth callback
│   └── api/           # thin route handlers → src/modules/*/server
├── modules/           # feature modules (contacts, applications, demo-bookings, courses, jobs, auth, marketing)
├── shared/            # reusable UI, animations, validation
└── lib/               # Supabase clients, API helpers
supabase-schema.sql    # database schema + RLS policies (source of truth)
middleware.ts          # route protection for /admin, /user, /login
```

See `CLAUDE.md` for a detailed architecture guide and `requirement.md` for the role-based dashboard plan.

## Contact

- **Email:** unikacademy2025@gmail.com
- **Phone:** 9217196824

## License

Private — UNIK Academy
