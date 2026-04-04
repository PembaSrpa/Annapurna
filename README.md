# Annapurna Mobile Care

Official website and finance dashboard for Annapurna Mobile Care, Dharan-16 Annapurna Chowk.

## Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL installed and running
- The database `annapurna_db` must exist

### 2. Create the Database
Open your PostgreSQL terminal (psql) and run:
```sql
CREATE DATABASE annapurna_db;
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Set Up Database Tables
```bash
node scripts/setup-db.js
```

### 5. Start the App
```bash
npm run dev
```

Open your browser at: **http://localhost:3000**

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
│       │   ├── route.ts      # GET (list), POST (create/update)
│       │   └── [id]/route.ts # DELETE
│       └── export/route.ts   # GET - download Excel
├── lib/
│   ├── db.ts                 # PostgreSQL connection
│   └── auth.ts               # JWT utilities
├── middleware.ts             # Route protection
└── scripts/
    └── setup-db.js           # One-time database setup
```

---

## Environment Variables (.env.local)

```
DATABASE_URL=postgresql://postgres:admin@localhost:5432/annapurna_db
ADMIN_PASSWORD=dharan16
JWT_SECRET=annapurna-mobile-care-secret-key-2024
```

To change the admin password, update `ADMIN_PASSWORD` in `.env.local` and restart.

---
