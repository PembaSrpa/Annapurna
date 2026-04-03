# Annapurna Mobile Care

Official website and finance dashboard for Annapurna Mobile Care, Dharan-16 Annapurna Chowk.

## Quick Start

Create .env.local

Add:

DATABASE_URL=postgresql://postgres:admin@localhost:8000/annapurna_db
ADMIN_PASSWORD=dharan16
JWT_SECRET=annapurna-mobile-care-secret-key-2024


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

---

## How to Use

### Public Website
Visit `http://localhost:3000` to see the public-facing website.
- Shows all services, location, about section, and contact info.

### Admin Dashboard
1. Go to `http://localhost:3000/admin`
2. Enter password: `dharan16`
3. You'll be taken to the Finance Dashboard

### Adding a Daily Entry
1. Click **+ Add Entry**
2. Select the date
3. Enter amounts for: Photo, Photocopy, Mobile, Other, Expenses
4. Add optional notes
5. Click **Save Entry**

> If an entry already exists for a date, saving will update it (not duplicate).

### Viewing by Month
Use the month and year dropdowns at the top to filter entries.

### Exporting to Excel
Click **↓ Export Excel** to download a `.xlsx` file for the selected month.
The file includes all entries plus a totals row at the bottom.

### Editing / Deleting
Hover over any row in the table to see Edit and Delete buttons.

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

## Deploying Online (Future)

When ready to go online:
1. Use [Vercel](https://vercel.com) for the Next.js app (free tier)
2. Use [Supabase](https://supabase.com) for the PostgreSQL database (free tier)
3. Update `DATABASE_URL` in Vercel environment variables

---

## Version 2 Ideas
- Monthly summary charts (bar/line graphs)
- Daily profit trend graph
- Multiple admin users
- Inventory tracking for mobile accessories
- Customer records for repair jobs
- WhatsApp notification on daily entry
