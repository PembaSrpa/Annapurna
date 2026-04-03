import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db'

async function isAuthenticated(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return false
  const payload = await verifyToken(token)
  return !!payload
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { photo, photocopy, mobile, other, expenses, notes, date } = await req.json()

  const result = await query(
    `UPDATE finance_entries
     SET date = $1, photo = $2, photocopy = $3, mobile = $4, other = $5, expenses = $6, notes = $7, updated_at = NOW()
     WHERE id = $8
     RETURNING *`,
    [date, photo || 0, photocopy || 0, mobile || 0, other || 0, expenses || 0, notes || '', params.id]
  )

  if (result.rowCount === 0) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  }

  return NextResponse.json(result.rows[0])
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await query('DELETE FROM finance_entries WHERE id = $1', [params.id])
  return NextResponse.json({ success: true })
}
