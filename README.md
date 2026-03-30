# UNIK Academy - Next.js Application

A modern, responsive web application for UNIK Academy built with Next.js 15, TypeScript, Tailwind CSS, and MongoDB.

## Features

- 🎨 Modern, responsive design with custom color scheme
- 📱 Mobile-friendly navigation
- 🏠 Home page with course pricing and core courses
- 📖 About Us page
- 💼 Careers/Hiring page with application form
- 📧 Contact page with contact form
- 📄 Terms and Conditions page
- 🔐 Admin panel for managing contacts and applications
- 🗄️ MongoDB integration for data storage
- ⚡ Built with Next.js 15 App Router

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB with Mongoose
- **Authentication:** Custom admin authentication

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)

### Installation

1. Clone the repository or navigate to the project directory:

   ```bash
   cd unik-academy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `ADMIN_SECRET_KEY` with a secure secret key

   ```bash
   cp .env.local.example .env.local
   ```

4. Create an admin user:

   ```bash
   node scripts/create-admin.js
   ```

   This script connects to MongoDB and creates the admin account. If the admin already exists, it will delete and recreate it.

   Default credentials (edit `scripts/create-admin.js` to change):

   | Field    | Value        |
   | -------- | ------------ |
   | Username | `admin`      |
   | Password | `admin@2026` |

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
unik-academy/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin panel pages
│   │   ├── api/            # API routes
│   │   ├── about/          # About Us page
│   │   ├── careers/        # Careers/Hiring page
│   │   ├── contact/        # Contact page
│   │   ├── terms/          # Terms and Conditions page
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── not-found.tsx   # 404 error page
│   ├── components/         # React components
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── lib/               # Utility functions
│   │   ├── mongodb.ts     # MongoDB connection (cached)
│   │   └── api.ts         # Shared API helpers (withDB, ok, err)
│   └── models/            # Mongoose models
│       ├── Contact.ts
│       ├── Application.ts
│       └── Admin.ts
├── scripts/
│   └── create-admin.js    # Admin user creation script
├── .env.local             # Environment variables
└── package.json
```

## Color Scheme

- **Primary Dark:** `#0e2b49`
- **Primary Medium:** `#133a67`
- **Accent Gold:** `#c0a84f`

## Pages

- **Home (`/`):** Main landing page with course pricing and core courses
- **About Us (`/about`):** Information about UNIK Academy
- **Careers (`/careers`):** Job openings and application form
- **Contact (`/contact`):** Contact form and contact information
- **Terms (`/terms`):** Terms and conditions
- **Admin Login (`/admin/login`):** Admin authentication
- **Admin Dashboard (`/admin/dashboard`):** Admin panel for managing data

## API Routes

- `POST /api/contact` - Submit contact form
- `POST /api/application` - Submit job application
- `POST /api/auth/login` - Admin login
- `GET /api/admin/contacts` - Get all contact messages (admin only)
- `GET /api/admin/applications` - Get all job applications (admin only)
- `POST /api/admin/create-admin` - Create admin user (requires secret key)

## Database Models

- **Contact:** Stores contact form submissions
- **Application:** Stores job application submissions
- **Admin:** Stores admin user credentials

## Deployment

1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Update `MONGODB_URI` in your deployment environment
3. Deploy to Vercel, Netlify, or your preferred hosting platform
4. Create an admin user using the create-admin endpoint

## Contact Information

- **Email:** unikacademy2025@gmail.com
- **Phone:** 9217196824

## License

Private - UNIK Academy

create a prompt as want to appoyu same in another proejct so I will easy to use

⏺ Here's a reusable prompt you can copy-paste into any new project:

---

Build a contact form API route in Next.js 14 App Router with the following setup:

## Stack

- Next.js 14 App Router (route.js, not TypeScript)
- Nodemailer with Gmail SMTP
- MongoDB for persisting submissions
- Zod for validation

## File: app/api/[[...path]]/route.js

### MongoDB

- Module-level singleton connection (client + db vars)
- connectDB() checks if db already exists before reconnecting
- DB name from env: DB_NAME (default: "myapp")
- Connection string from env: MONGO_URL

### Email (Nodemailer)

- Gmail SMTP via nodemailer.createTransport({ service: "gmail" })
- Credentials from env: GMAIL_USER, GMAIL_APP_PASSWORD (app password, not account password)
- Create transporter per request inside the handler function
- Send 2 emails in parallel using Promise.all:
  1. Admin notification → ADMIN_EMAIL env var
  2. Auto-reply → user's submitted email
- Wrap sendMail in try/catch — email failures should NOT fail the API response

### POST /api/contact

Validate body with Zod: - name: string, min 2 chars - email: valid email - phone: string, min 10 chars - company: optional string - message: string, min 10 chars

On success:

1. Generate unique ID: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
2. Save to MongoDB collection "contact_submissions" with { id, ...fields, createdAt, status: "new" }
3. Send admin email (HTML table with all fields + submission ID)
4. Send auto-reply to user (branded HTML with reference ID + website link)
5. Return { success: true, message: "...", submissionId }

On Zod error: return 400 with error.errors array
On other error: return 500

### Other routes

- GET /api/ → API info JSON
- GET /api/health → MongoDB ping, returns { status, database, timestamp }
- PUT, DELETE, PATCH → 405 Method Not Allowed

### Env vars required

MONGO_URL
DB_NAME
GMAIL_USER
GMAIL_APP_PASSWORD
ADMIN_EMAIL
NEXT_PUBLIC_BASE_URL ← used in auto-reply email as website link

---

Save this somewhere handy — paste it as the first message when starting a new project and it will reproduce the exact same setup.
