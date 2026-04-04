# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start development server
yarn build      # Production build
yarn start      # Start production server
yarn lint       # Run ESLint
```

No test framework is configured.

To create the first admin user, run:

```bash
npx ts-node scripts/create-admin.ts
```

## Environment Variables

Required in `.env.local`:

```
MONGODB_URI=mongodb://...
ADMIN_SECRET_KEY=your-secret-key
```

## Architecture

UNIK Academy is a Next.js 15 App Router application — a course/academy marketing site with an admin dashboard. It uses MongoDB (via Mongoose) to store form submissions and admin users.

**Route groups:**

- `(main)/` — Public-facing pages (home, demo booking, careers, about, contact, terms)
- `admin/` — Admin login and dashboard (client-side localStorage session)
- `api/` — REST API routes for form submissions and admin CRUD

**API pattern:** Each route splits into `route.ts` (thin handler calling `NextRequest.json()`) and `handler.ts` (business logic). Reusable helpers in `src/lib/api.ts`:

- `withDB(fn, context)` — ensures Mongoose connection before running `fn`
- `ok(data, status?)` / `err(message, status?)` — standardized JSON responses

**Database:** Cached Mongoose singleton in `src/lib/mongodb.ts`. Models (`Contact`, `Application`, `DemoBooking`, `Admin`) live in `src/models/`. Models delete their cached schema on require to support hot-reload in dev.

**Auth:** Custom username/password auth with bcryptjs. Admin session is stored in `localStorage` (no httpOnly cookies or server-side session). The `Admin` model has `comparePassword()` instance method.

**Styling:** Tailwind CSS v4 with the new `@theme` inline syntax — no `tailwind.config.js`. Custom CSS variables and animations are defined in `src/app/globals.css`. Color scheme: primary dark blue `#0e2b49`, accent gold `#c0a84f`.

**Path alias:** `@/*` maps to `src/*`.

## Project Structure Rules

All code must be placed in one of three categories:

- **Users** — All user-related logic, components, APIs, and files must go inside the `Users` folder only.
- **Admins** — All admin-related work (APIs, components, utilities) must go inside the `Admins` folder.
- **Website** — All general website-related code must go inside the `Website` folder.

## Code Quality Rules

- **DRY (Don't Repeat Yourself):** If the same code appears more than once, extract it into a reusable component or utility. Never duplicate logic — always create a shared abstraction instead.
