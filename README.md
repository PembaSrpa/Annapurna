# Annapurna Mobile Care

Official website and finance dashboard for Annapurna Mobile Care, Dharan-16 Annapurna Chowk.

---

## Deploying to Vercel

### Prerequisites
- [Vercel account](https://vercel.com/signup) (free tier works)
- A PostgreSQL database — [Neon](https://neon.tech) is recommended (free tier, Vercel-native)

### Step 1: Set Up a PostgreSQL Database

**Option A — Neon (recommended)**
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project → copy the **Connection String** (starts with `postgresql://...`)

**Option B — Vercel Postgres**
1. In your Vercel dashboard, go to **Storage** → **Create Database** → **Postgres**
2. After creation, go to the database → **Settings** → copy `DATABASE_URL`

**Option C — Supabase**
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **Database** → copy the **Connection string** (URI format)

### Step 2: Initialize the Database Tables

Run this once against your production database to create the required tables:

```bash
# Clone the repo locally first, then:
npm install
DATABASE_URL="your-connection-string-here" node scripts/setup-db.js
```

Or connect via any PostgreSQL client and run:

```sql
CREATE TABLE IF NOT EXISTS finance_entries (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  photo NUMERIC(10,2) NOT NULL DEFAULT 0,
  photocopy NUMERIC(10,2) NOT NULL DEFAULT 0,
  mobile NUMERIC(10,2) NOT NULL DEFAULT 0,
  other NUMERIC(10,2) NOT NULL DEFAULT 0,
  expenses NUMERIC(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Step 3: Deploy to Vercel

**Option A — Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel --prod
```

Follow the prompts. When asked about environment variables, add them in the next step.

**Option B — GitHub Integration (recommended)**
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects Next.js — click **Deploy**

### Step 4: Set Environment Variables

In the Vercel dashboard → your project → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `ADMIN_PASSWORD` | A secure password for the admin dashboard |
| `JWT_SECRET` | A random secret string (min 32 characters) |

To generate a secure `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

After adding variables, go to **Deployments** → click the latest → **Redeploy**.

### Step 5: Verify

Visit your deployment URL:
- `/` — Public homepage
- `/admin` — Login with your `ADMIN_PASSWORD`
- `/admin/dashboard` — Finance dashboard

---

## Local Development

### 1. Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 2. Clone and Install

```bash
git clone <your-repo-url>
cd annapurna-mobile-care
npm install
```

### 3. Configure Environment

Create `.env.local`:

```env
DATABASE_URL=postgresql://postgres:admin@localhost:5432/annapurna_db
ADMIN_PASSWORD=your-password
JWT_SECRET=your-secret-key-min-32-chars
```

### 4. Set Up Local Database

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE annapurna_db;"

# Create tables
node scripts/setup-db.js
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Finance Categories

| Category | What it tracks |
|----------|---------------|
| Photo | Income from photo services (passport photos, prints, framing) |
| Photocopy | Income from printing and photocopy jobs |
| Mobile | Income from mobile accessories sold |
| Other | Miscellaneous income |
| Expenses | All expenses (rent, supplies, utilities, etc.) |

---

## Project Structure

```
annapurna/
├── app/
│   ├── page.tsx              # Public homepage
│   ├── admin/
│   │   ├── page.tsx          # Login page
│   │   └── dashboard/
│   │       └── page.tsx      # Finance dashboard
│   └── api/
│       ├── auth/
│       │   ├── login/        # POST - login
│       │   └── logout/       # POST - logout
│       ├── finance/
│       │   ├── route.ts      # GET (list), POST (create)
│       │   └── [id]/route.ts # DELETE
│       └── export/route.ts   # GET - download Excel
├── lib/
│   ├── db.ts                 # PostgreSQL connection pool
│   └── auth.ts               # JWT utilities
├── middleware.ts             # Route protection
├── vercel.json               # Vercel configuration
└── scripts/
    └── setup-db.js           # One-time database setup
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `ADMIN_PASSWORD` | Yes | Password to access `/admin` |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens (min 32 chars) |
