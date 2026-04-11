require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set.')
  console.error('Create a .env.local file with DATABASE_URL=postgresql://...')
  process.exit(1)
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
})

async function setup() {
  console.log('Setting up Annapurna Mobile Care database...')

  const client = await pool.connect()

  try {
    await client.query(`
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
      )
    `)

    console.log('Database tables created successfully')
    console.log('Setup complete! Run: npm run dev')
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

setup()
