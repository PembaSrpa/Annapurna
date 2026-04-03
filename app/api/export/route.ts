import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { query, initDb } from '@/lib/db'
import * as XLSX from 'xlsx'

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

  let queryText = 'SELECT * FROM finance_entries'
  const params: unknown[] = []

  if (month && year) {
    queryText += ' WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2'
    params.push(parseInt(month), parseInt(year))
  } else if (year) {
    queryText += ' WHERE EXTRACT(YEAR FROM date) = $1'
    params.push(parseInt(year))
  }

  queryText += ' ORDER BY date ASC'

  const result = await query(queryText, params)
  const rows = result.rows

  const data = rows.map((row) => ({
    Date: new Date(row.date).toLocaleDateString('en-NP'),
    Photo: parseFloat(row.photo),
    Photocopy: parseFloat(row.photocopy),
    Mobile: parseFloat(row.mobile),
    Other: parseFloat(row.other),
    'Total Income': parseFloat(row.photo) + parseFloat(row.photocopy) + parseFloat(row.mobile) + parseFloat(row.other),
    Expenses: parseFloat(row.expenses),
    'Net Profit': parseFloat(row.photo) + parseFloat(row.photocopy) + parseFloat(row.mobile) + parseFloat(row.other) - parseFloat(row.expenses),
    Notes: row.notes || '',
  }))

  const totalsRow = {
    Date: 'TOTAL',
    Photo: data.reduce((s, r) => s + r.Photo, 0),
    Photocopy: data.reduce((s, r) => s + r.Photocopy, 0),
    Mobile: data.reduce((s, r) => s + r.Mobile, 0),
    Other: data.reduce((s, r) => s + r.Other, 0),
    'Total Income': data.reduce((s, r) => s + r['Total Income'], 0),
    Expenses: data.reduce((s, r) => s + r.Expenses, 0),
    'Net Profit': data.reduce((s, r) => s + r['Net Profit'], 0),
    Notes: '',
  }

  data.push(totalsRow)

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(data)

  ws['!cols'] = [
    { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
    { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 24 }
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Finance')

  const label = month && year ? `${year}-${month.padStart(2, '0')}` : year || 'all'
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="annapurna-finance-${label}.xlsx"`,
    },
  })
}
