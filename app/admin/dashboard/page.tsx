'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Tooltip, Legend as ChartLegend, Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Tooltip, ChartLegend, Filler
)

// Pure black/white/yellow palette
const N900 = '#000000'
const N800 = '#0a0a0a'
const N700 = '#1a1a1a'
const N600 = '#333333'
const N500 = '#555555'
const N400 = '#888888'
const N300 = '#bbbbbb'
const N200 = '#e5e5e5'

const B900 = '#080808'
const B800 = '#111111'
const B100 = '#fbbf24'

const RED = '#ef4444'
const RED_DIM = '#ef444420'

type Entry = {
    id: number
    date: string
    photo: string | number
    photocopy: string | number
    mobile: string | number
    other: string | number
    expenses: string | number
    notes: string
}

type Totals = {
    photo: number
    photocopy: number
    mobile: number
    other: number
    expenses: number
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const CATS = [
    { key: 'photo', label: 'Photo', color: N200 },
    { key: 'photocopy', label: 'Photocopy', color: N200 },
    { key: 'mobile', label: 'Mobile', color: N200 },
    { key: 'other', label: 'Other', color: N200 },
    { key: 'expenses', label: 'Expenses', color: RED },
] as const

const CHART_COLORS = {
    purple: '#aaaaaa',
    blue: '#cccccc',
    green: '#999999',
    amber: B100,
    red: '#666666',
    orange: '#777777',
}

const GRID_COLOR = `${N600}55`
const TICK_COLOR = N500
const TOOLTIP_CFG = {
    backgroundColor: B800,
    borderColor: `${N600}66`,
    borderWidth: 1,
    titleColor: N300,
    bodyColor: N500,
}

function fmt(n: string | number) {
    return 'Rs. ' + Math.round(parseFloat(String(n || 0))).toLocaleString('en-NP')
}

function todayStr() {
    return new Date().toISOString().split('T')[0]
}

function getTotals(ents: Entry[]): Totals {
    return ents.reduce(
        (acc, e) => {
            CATS.forEach(c => { acc[c.key] += parseFloat(String(e[c.key])) || 0 })
            return acc
        },
        { photo: 0, photocopy: 0, mobile: 0, other: 0, expenses: 0 }
    )
}

function getIncome(e: Entry) {
    return (
        (parseFloat(String(e.photo)) || 0) +
        (parseFloat(String(e.photocopy)) || 0) +
        (parseFloat(String(e.mobile)) || 0) +
        (parseFloat(String(e.other)) || 0)
    )
}

function tickFmt(v: number | string) {
    const n = typeof v === 'string' ? parseFloat(v) : v
    return 'Rs.' + (Math.abs(n) >= 1000 ? (n / 1000).toFixed(0) + 'k' : n)
}

function modalInputStyle(borderColor = N600): React.CSSProperties {
    return {
        width: '100%', padding: '10px 14px', borderRadius: 8,
        background: N900, border: `1px solid ${borderColor}`,
        color: N200, fontSize: 13, outline: 'none', colorScheme: 'dark',
    }
}

function yellowBtn(extra: React.CSSProperties = {}): React.CSSProperties {
    return { background: B100, color: N900, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', ...extra }
}

function ghostBtn(extra: React.CSSProperties = {}): React.CSSProperties {
    return { background: N800, color: N400, border: `1px solid ${N600}`, borderRadius: 8, cursor: 'pointer', ...extra }
}

function StatCards({ entries }: { entries: Entry[] }) {
    const t = getTotals(entries)
    const income = t.photo + t.photocopy + t.mobile + t.other
    const net = income - t.expenses

    const cards = [
        { label: 'Photo', val: fmt(t.photo), accent: N200, border: N700 },
        { label: 'Photocopy', val: fmt(t.photocopy), accent: N200, border: N700 },
        { label: 'Mobile', val: fmt(t.mobile), accent: N200, border: N700 },
        { label: 'Other', val: fmt(t.other), accent: N200, border: N700 },
        { label: 'Expenses', val: fmt(t.expenses), accent: RED, border: `${RED}40` },
        { label: 'Total Income', val: fmt(income), accent: N200, border: N600 },
        { label: 'Net Profit', val: fmt(net), accent: net >= 0 ? B100 : RED, border: net >= 0 ? `${B100}50` : `${RED}50` },
    ]

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginBottom: 20 }}>
            {cards.map(c => (
                <div key={c.label} style={{ background: B900, border: `1px solid ${c.border}`, borderRadius: 9, padding: '11px 13px' }}>
                    <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px', color: N400, marginBottom: 5 }}>
                        {c.label}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.accent }}>{c.val}</div>
                </div>
            ))}
        </div>
    )
}

function Th({ children, left, accent, muted }: { children?: React.ReactNode; left?: boolean; accent?: string; muted?: boolean }) {
    return (
        <th style={{
            padding: '10px 12px', textAlign: left ? 'left' : 'right',
            fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px',
            color: accent ?? (muted ? N500 : N300),
        }}>
            {children}
        </th>
    )
}

function TableRow({ entry: e, dateStr, net, onEdit, onDelete }: {
    entry: Entry; dateStr: string; net: number
    onEdit: (e: Entry) => void; onDelete: (id: number) => void

}) {
    const [hovered, setHovered] = useState(false)
    return (
        <tr
            style={{ borderTop: `1px solid ${N700}`, background: hovered ? `${N800}55` : 'transparent', transition: 'background .1s' }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <td style={{ padding: '10px 12px', textAlign: 'left', color: N200, fontWeight: 500, fontSize: 12 }}>{dateStr}</td>
            {CATS.map(c => {
                const val = parseFloat(String(e[c.key as keyof Entry])) || 0
                const isExp = c.key === 'expenses'
                return (
                    <td key={c.key} style={{ padding: '10px 12px', textAlign: 'right', color: val > 0 ? (isExp ? RED : N200) : N600, fontSize: 12 }}>
                        {val > 0 ? fmt(val) : '—'}
                    </td>
                )
            })}
            <td style={{ padding: '10px 12px', textAlign: 'right', color: net >= 0 ? B100 : RED, fontWeight: 600, fontSize: 12 }}>
                {fmt(net)}
            </td>
            <td style={{ padding: '10px 12px', textAlign: 'left', color: N400, fontSize: 11, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.notes || '—'}
            </td>
            <td style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', gap: 6, opacity: hovered ? 1 : 0, transition: 'opacity .15s' }}>
                    <button onClick={() => { console.log('editing:', e.id, e.date); onEdit(e) }} style={{ background: N800, border: `1px solid ${B100}40`, cursor: 'pointer', fontSize: 10, color: B100, padding: '3px 9px', borderRadius: 5 }}>
                        Edit
                    </button>
                    <button onClick={() => onDelete(e.id)} style={{ background: N800, border: `1px solid ${N500}40`, cursor: 'pointer', fontSize: 10, color: N400, padding: '3px 9px', borderRadius: 5 }}>
                        Del
                    </button>
                </div>
            </td>
        </tr>
    )
}

function EntriesTable({ entries, month, year, onEdit, onDelete }: {
    entries: Entry[]; month: number; year: number
    onEdit: (e: Entry) => void; onDelete: (id: number) => void
}) {
    const t = getTotals(entries)
    const income = t.photo + t.photocopy + t.mobile + t.other
    const net = income - t.expenses

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: N200 }}>Daily Entries</div>
                    <div style={{ fontSize: 11, color: N400, marginTop: 2 }}>{MONTHS[month - 1]} {year}</div>
                </div>
                <div style={{ fontSize: 11, color: N400 }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>
            </div>

            <div style={{ background: B900, border: `1px solid ${N700}`, borderRadius: 11, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                        <thead>
                            <tr style={{ background: N900, borderBottom: `1px solid ${N700}` }}>
                                <Th left>Date</Th>
                                {CATS.map(c => <Th key={c.key} accent={c.color}>{c.label}</Th>)}
                                <Th accent={B100}>Net</Th>
                                <Th left muted>Notes</Th>
                                <Th />
                            </tr>
                        </thead>
                        <tbody>
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={9} style={{ padding: 48, textAlign: 'center', color: N500, fontSize: 13 }}>
                                        No entries for this period
                                    </td>
                                </tr>
                            ) : entries.map(e => {
                                const inc = getIncome(e)
                                const n = inc - (parseFloat(String(e.expenses)) || 0)
                                const [y, mo, dd] = e.date.slice(0, 10).split('-')
                                const ds = `${dd} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(mo) - 1]} ${y}`
                                return <TableRow key={e.id} entry={e} dateStr={ds} net={n} onEdit={onEdit} onDelete={onDelete} />
                            })}
                        </tbody>
                        <tfoot>
                            <tr style={{ background: N900, borderTop: `1px solid ${N600}` }}>
                                <td style={{ padding: '10px 12px', textAlign: 'left', color: N400, fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.6px' }}>Total</td>
                                {CATS.map(c => (
                                    <td key={c.key} style={{ padding: '10px 12px', textAlign: 'right', color: c.color, fontWeight: 600, fontSize: 12 }}>
                                        {fmt(t[c.key])}
                                    </td>
                                ))}
                                <td style={{ padding: '10px 12px', textAlign: 'right', color: net >= 0 ? B100 : RED, fontWeight: 700, fontSize: 12 }}>
                                    {fmt(net)}
                                </td>
                                <td colSpan={2} />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

function EmptyAnalysis() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 10 }}>
            <div style={{ fontSize: 32 }}>📊</div>
            <div style={{ fontSize: 13, color: N400 }}>No data for this period</div>
            <div style={{ fontSize: 11, color: N500 }}>Add entries to see analysis</div>
        </div>
    )
}

function AnalysisPane({ entries, month, year, allEntries }: {
    entries: Entry[]; month: number; year: number; allEntries: Record<string, Entry[]>
}) {
    if (entries.length === 0) return <EmptyAnalysis />

    const baseOpts = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: TOOLTIP_CFG },
    }
    const yAxis = {
        grid: { color: GRID_COLOR },
        ticks: { color: TICK_COLOR, font: { size: 9 }, callback: tickFmt },
        border: { display: false },
    }
    const xAxis = { grid: { display: false }, ticks: { color: TICK_COLOR, font: { size: 9 } }, border: { display: false } }

    const labels = entries.map(e => {
        const [, mo, dd] = e.date.slice(0, 10).split('-')
        return parseInt(dd) + ' ' + MONTHS[parseInt(mo) - 1].slice(0, 3)
    })

    const netData = entries.map(e => getIncome(e) - (parseFloat(String(e.expenses)) || 0))
    const incData = entries.map(e => getIncome(e))
    const expData = entries.map(e => parseFloat(String(e.expenses)) || 0)

    const t = getTotals(entries)
    const dData = [t.photo, t.photocopy, t.mobile, t.other]
    const dColors = ['#ffffff', '#cccccc', B100, '#888888']
    const dLabels = ['Photo', 'Photocopy', 'Mobile', 'Other']
    const dTotal = dData.reduce((a, b) => a + b, 0)

    const mInc = MONTHS.map((_, i) => {
        const key = `${year}-${i + 1}`
        return (allEntries[key] ?? []).reduce((a, e) => a + getIncome(e), 0)
    })
    const mExp = MONTHS.map((_, i) => {
        const key = `${year}-${i + 1}`
        return (allEntries[key] ?? []).reduce((a, e) => a + (parseFloat(String(e.expenses)) || 0), 0)
    })

    const hasYearlyData = mInc.some(v => v > 0) || mExp.some(v => v > 0)

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: N200 }}>Analysis</div>
                <div style={{ fontSize: 11, color: N400, marginTop: 2 }}>{MONTHS[month - 1]} {year}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <ChartCard title="Daily Profit Trend">
                    <div style={{ position: 'relative', height: 180 }}>
                        <Line
                            data={{ labels, datasets: [{ label: 'Net Profit', data: netData, borderColor: B100, backgroundColor: `${B100}14`, tension: 0.35, fill: true, pointBackgroundColor: B100, pointRadius: 3, pointHoverRadius: 5, borderWidth: 2 }] }}
                            options={{ ...baseOpts, scales: { x: xAxis, y: yAxis } }}
                        />
                    </div>
                </ChartCard>

                <ChartCard title="Category Income — Month">
                    {dTotal === 0 ? (
                        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: N500, fontSize: 12 }}>No income data</div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ position: 'relative', height: 180, width: 180, flexShrink: 0 }}>
                                <Doughnut
                                    data={{ labels: dLabels, datasets: [{ data: dData, backgroundColor: dColors, borderWidth: 2, borderColor: B900 }] }}
                                    options={{ ...baseOpts, cutout: '62%', plugins: { ...baseOpts.plugins, tooltip: { ...TOOLTIP_CFG, callbacks: { label: ctx => `Rs. ${Math.round(ctx.parsed).toLocaleString('en-NP')} (${dTotal > 0 ? Math.round(ctx.parsed / dTotal * 100) : 0}%)` } } } }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                {dLabels.map((l, i) => (
                                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: N300 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: 2, background: dColors[i], flexShrink: 0 }} />
                                        {l}: {dTotal > 0 ? Math.round(dData[i] / dTotal * 100) : 0}%
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </ChartCard>

                <ChartCard title="Income vs Expenses — Daily">
                    <div style={{ position: 'relative', height: 180 }}>
                        <Bar
                            data={{
                                labels, datasets: [
                                    { label: 'Income', data: incData, backgroundColor: `#ffffffaa`, borderRadius: 3, borderSkipped: false as const },
                                    { label: 'Expenses', data: expData, backgroundColor: `#ef4444`, borderRadius: 3, borderSkipped: false as const },
                                ]
                            }}
                            options={{ ...baseOpts, scales: { x: xAxis, y: yAxis } }}
                        />
                    </div>
                    <ChartLegendRow items={[{ color: '#ffffff', label: 'Income' }, { color: '#ef4444', label: 'Expenses' }]} />
                </ChartCard>

                <ChartCard title={`Monthly Breakdown — ${year}`}>
                    {!hasYearlyData ? (
                        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: N500, fontSize: 12 }}>No data for other months yet</div>
                    ) : (
                        <>
                            <div style={{ position: 'relative', height: 180 }}>
                                <Bar
                                    data={{
                                        labels: MONTHS.map(m => m.slice(0, 3)), datasets: [
                                            { label: 'Income', data: mInc, backgroundColor: `#ccccccaa`, borderRadius: 3, borderSkipped: false as const },
                                            { label: 'Expenses', data: mExp, backgroundColor: `#ef4444`, borderRadius: 3, borderSkipped: false as const },
                                        ]
                                    }}
                                    options={{ ...baseOpts, scales: { x: { ...xAxis, ticks: { ...xAxis.ticks, font: { size: 8 } } }, y: yAxis } }}
                                />
                            </div>
                            <ChartLegendRow items={[{ color: '#cccccc', label: 'Income' }, { color: '#ef4444', label: 'Expenses' }]} />
                        </>
                    )}
                </ChartCard>
            </div>
        </div>
    )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div style={{ background: B900, border: `1px solid ${N700}`, borderRadius: 11, padding: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: N400, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.6px' }}>{title}</div>
            {children}
        </div>
    )
}

function ChartLegendRow({ items }: { items: { color: string; label: string }[] }) {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {items.map(i => (
                <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: N400 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: i.color, flexShrink: 0 }} />
                    {i.label}
                </div>
            ))}
        </div>
    )
}

function EntryModal({ initial, onSave, onClose }: {
    initial: Partial<Entry>
    onSave: (data: Partial<Entry>) => Promise<void>
    onClose: () => void
}) {
    const [form, setForm] = useState({
        date: initial.date ? initial.date.slice(0, 10) : todayStr(),
        photo: String(initial.photo ?? ''),
        photocopy: String(initial.photocopy ?? ''),
        mobile: String(initial.mobile ?? ''),
        other: String(initial.other ?? ''),
        expenses: String(initial.expenses ?? ''),
        notes: initial.notes ?? '',
    })

    useEffect(() => {
        setForm({
            date: initial.date ? initial.date.slice(0, 10) : todayStr(),
            photo: String(initial.photo ?? ''),
            photocopy: String(initial.photocopy ?? ''),
            mobile: String(initial.mobile ?? ''),
            other: String(initial.other ?? ''),
            expenses: String(initial.expenses ?? ''),
            notes: initial.notes ?? '',
        })
    }, [initial.id])
    const [saving, setSaving] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        await onSave({
            ...form,
            photo: parseFloat(form.photo) || 0,
            photocopy: parseFloat(form.photocopy) || 0,
            mobile: parseFloat(form.mobile) || 0,
            other: parseFloat(form.other) || 0,
            expenses: parseFloat(form.expenses) || 0,
        })
        setSaving(false)
    }

    const overlay: React.CSSProperties = {
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
    }

    return (
        <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{ background: B900, border: `1px solid ${N600}`, borderRadius: 16, padding: 24, width: '100%', maxWidth: 480 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: N200 }}>
                        {initial.id ? 'Edit Entry' : 'New Entry'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: N400, fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: N400, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>Date</label>
                        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={modalInputStyle()} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {CATS.map(c => (
                            <div key={c.key}>
                                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: c.color, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                                    {c.label} (Rs.)
                                </label>
                                <input
                                    type="number" min="0" step="0.01" placeholder="0"
                                    value={form[c.key as keyof typeof form]}
                                    onChange={e => setForm({ ...form, [c.key]: e.target.value })}
                                    style={modalInputStyle(c.key === 'expenses' ? `${RED}50` : `${N500}50`)}
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: N400, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.5px' }}>Notes (optional)</label>
                        <input type="text" placeholder="Any notes for this day..."
                            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                            style={modalInputStyle()} />
                    </div>

                    <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                        <button type="button" onClick={onClose}
                            style={{ ...ghostBtn({ flex: '1', padding: '11px 0', fontSize: 13, borderRadius: 9 }) }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            style={{ ...yellowBtn({ flex: '1', padding: '11px 0', fontSize: 13, borderRadius: 9, opacity: saving ? 0.6 : 1 }) }}>
                            {saving ? 'Saving...' : 'Save Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function DeleteModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
    const overlay: React.CSSProperties = {
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
    }
    return (
        <div style={overlay}>
            <div style={{ background: B900, border: `1px solid ${N600}`, borderRadius: 16, padding: 28, width: '100%', maxWidth: 360, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: N200, marginBottom: 6 }}>Delete Entry?</div>
                <p style={{ color: N400, fontSize: 12, marginBottom: 24 }}>This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={onClose}
                        style={{ ...ghostBtn({ flex: '1', padding: '10px 0', fontSize: 13, borderRadius: 9 }) }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm}
                        style={{ flex: 1, padding: '10px 0', borderRadius: 9, background: RED_DIM, color: N300, border: `1px solid ${RED}50`, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}

function NavItem({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                fontSize: 12, fontWeight: 500,
                color: active ? B100 : hovered ? N200 : N400,
                background: active ? `${B100}12` : hovered ? N700 : 'transparent',
                border: `1px solid ${active ? `${B100}30` : 'transparent'}`,
                transition: 'all .15s',
            }}
        >
            {children}
        </div>
    )
}

export default function Dashboard() {
    const router = useRouter()
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [entries, setEntries] = useState<Entry[]>([])
    const [allEntries, setAllEntries] = useState<Record<string, Entry[]>>({})
    const [loading, setLoading] = useState(true)
    const [pane, setPane] = useState<'entries' | 'analysis'>('entries')
    const [showForm, setShowForm] = useState(false)
    const [editTarget, setEditTarget] = useState<Entry | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)

    const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

    const fetchEntries = useCallback(async () => {
        setLoading(true)
        const res = await fetch(`/api/finance?month=${month}&year=${year}`)
        if (res.status === 401) { router.push('/admin'); return }
        const data = await res.json()
        setEntries(data)
        setAllEntries(prev => ({ ...prev, [`${year}-${month}`]: data }))
        setLoading(false)
    }, [month, year, router])

    const fetchYearEntries = useCallback(async () => {
        const res = await fetch(`/api/finance?year=${year}`)
        if (!res.ok) return
        const data: Entry[] = await res.json()
        const grouped: Record<string, Entry[]> = {}
        data.forEach(e => {
            const [y, mo] = e.date.slice(0, 10).split('-')
            const key = `${y}-${parseInt(mo)}`
            if (!grouped[key]) grouped[key] = []
            grouped[key].push(e)
        })
        setAllEntries(grouped)
    }, [year])

    useEffect(() => { fetchEntries() }, [fetchEntries])
    useEffect(() => { fetchYearEntries() }, [fetchYearEntries])

    async function handleSave(formData: Partial<Entry>) {
        const isEdit = !!editTarget?.id
        const res = await fetch(isEdit ? `/api/finance/${editTarget!.id}` : '/api/finance', {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        if (res.ok) {
            setShowForm(false)
            setEditTarget(null)
            fetchEntries()
            fetchYearEntries()
        }
    }

    async function handleDelete(id: number) {
        await fetch(`/api/finance/${id}`, { method: 'DELETE' })
        setDeleteId(null)
        fetchEntries()
        fetchYearEntries()
    }

    const selectStyle: React.CSSProperties = {
        width: '100%', background: N900, border: `1px solid ${N600}`,
        color: N300, padding: '7px 10px', borderRadius: 7,
        fontSize: 11, outline: 'none', cursor: 'pointer',
    }

    return (
        <div style={{ background: N900, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: N300, fontFamily: 'system-ui, sans-serif' }}>

            <nav style={{ background: B900, borderBottom: `1px solid ${N700}`, padding: '11px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: B100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: N900 }}>A</div>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: N200 }}>Annapurna Mobile Care</div>
                        <div style={{ fontSize: 10, color: N400, marginTop: 1 }}>Finance Dashboard</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => { window.location.href = `/api/export?month=${month}&year=${year}` }}
                        style={{ ...yellowBtn({ padding: '7px 14px', fontSize: 11, borderRadius: 7 }) }}
                    >
                        ↓ Export Excel
                    </button>
                    <button
                        onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/admin') }}
                        style={{ ...ghostBtn({ padding: '7px 14px', fontSize: 11, borderRadius: 7 }) }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <div style={{ width: 185, flexShrink: 0, background: B900, borderRight: `1px solid ${N700}`, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: N500, padding: '0 10px 8px' }}>Menu</div>

                    <NavItem active={pane === 'entries'} onClick={() => setPane('entries')}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                            <rect x="1" y="1" width="14" height="3" rx="1" fill="currentColor" />
                            <rect x="1" y="6" width="14" height="3" rx="1" fill="currentColor" opacity=".6" />
                            <rect x="1" y="11" width="14" height="3" rx="1" fill="currentColor" opacity=".4" />
                        </svg>
                        Daily Entries
                    </NavItem>

                    <NavItem active={pane === 'analysis'} onClick={() => setPane('analysis')}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                            <polyline points="1,12 5,7 8,10 11,4 15,6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Analysis
                    </NavItem>

                    <div style={{ height: 1, background: N700, margin: '8px 10px' }} />
                    <div style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.8px', color: N500, padding: '0 10px 8px' }}>Filters</div>

                    <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <select value={month} onChange={e => setMonth(parseInt(e.target.value))} style={selectStyle}>
                            {MONTHS.map((m, i) => <option key={i} value={i + 1} style={{ background: N900 }}>{m}</option>)}
                        </select>
                        <select value={year} onChange={e => setYear(parseInt(e.target.value))} style={selectStyle}>
                            {years.map(y => <option key={y} value={y} style={{ background: N900 }}>{y}</option>)}
                        </select>
                    </div>

                    <div style={{ height: 1, background: N700, margin: '8px 10px' }} />

                    <div style={{ padding: '0 4px' }}>
                        <button
                            onClick={() => { setEditTarget(null); setShowForm(true) }}
                            style={{ ...yellowBtn({ width: '100%', padding: '9px 0', fontSize: 12, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }) }}
                        >
                            + Add Entry
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, color: N500, fontSize: 13 }}>Loading...</div>
                    ) : (
                        <>
                            <StatCards entries={entries} />
                            {pane === 'entries' && (
                                <EntriesTable entries={entries} month={month} year={year}
                                    onEdit={e => { setEditTarget(e); setShowForm(true) }}
                                    onDelete={id => setDeleteId(id)}
                                />
                            )}
                            {pane === 'analysis' && (
                                <AnalysisPane entries={entries} month={month} year={year} allEntries={allEntries} />
                            )}
                        </>
                    )}
                </div>
            </div>

            {showForm && (
                <EntryModal
                    initial={editTarget ?? {}}
                    onSave={handleSave}
                    onClose={() => { setShowForm(false); setEditTarget(null) }}
                />
            )}

            {deleteId !== null && (
                <DeleteModal
                    onConfirm={() => handleDelete(deleteId)}
                    onClose={() => setDeleteId(null)}
                />
            )}
        </div>
    )
}
