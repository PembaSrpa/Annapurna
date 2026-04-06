import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

export async function query(text: string, params?: unknown[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export async function initDb() {
  await query(`
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
}
