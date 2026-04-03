import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query, initDb } from '@/lib/db'

async function isAuthenticated(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  const payload = await verifyToken(token)
  return !!payload
}

export async function GET(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await initDb()

  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  const year = searchParams.get('year')

let queryText = 'SELECT id, date::text, photo, photocopy, mobile, other, expenses, notes, created_at, updated_at FROM finance_entries'
  const params: unknown[] = []

  if (month && year) {
    queryText += ' WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2'
    params.push(parseInt(month), parseInt(year))
  } else if (year) {
    queryText += ' WHERE EXTRACT(YEAR FROM date) = $1'
    params.push(parseInt(year))
  }

  queryText += ' ORDER BY date DESC'

  const result = await query(queryText, params)
  return NextResponse.json(result.rows)
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await initDb()

  const body = await req.json()
  const { date, photo, photocopy, mobile, other, expenses, notes } = body

  const result = await query(
    `INSERT INTO finance_entries (date, photo, photocopy, mobile, other, expenses, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [date, photo || 0, photocopy || 0, mobile || 0, other || 0, expenses || 0, notes || '']
  )

  return NextResponse.json(result.rows[0])
}
