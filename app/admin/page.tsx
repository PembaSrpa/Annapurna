'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconLock, IconArrowLeft } from '@tabler/icons-react'

export default function AdminLogin() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })
        if (res.ok) {
            router.push('/admin/dashboard')
        } else {
            setError('Incorrect password. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden', maxWidth: '100vw' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/mountain-bg.svg)', backgroundSize: 'cover', backgroundPosition: 'center bottom', opacity: 0.22 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.88))' }} />
            <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', width: '80vw', maxWidth: 400, height: 180, background: 'radial-gradient(ellipse, rgba(251,191,36,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 400, position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#000', margin: '0 auto 14px' }}>A</div>
                    <h1 style={{ fontSize: 21, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Admin Portal</h1>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>Annapurna Mobile Care</p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '28px 24px' }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <IconLock size={14} color="rgba(255,255,255,0.25)" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    required
                                    style={{ width: '100%', boxSizing: 'border-box', padding: '11px 13px 11px 38px', borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 13, outline: 'none', colorScheme: 'dark', transition: 'border-color 0.2s' }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(251,191,36,0.55)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ padding: '9px 13px', borderRadius: 8, fontSize: 12, color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ width: '100%', padding: '12px 0', borderRadius: 9, fontWeight: 700, fontSize: 13, background: loading ? 'rgba(251,191,36,0.5)' : '#fbbf24', color: '#000', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.85' }}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: 18 }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.22)', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}>
                        <IconArrowLeft size={12} />
                        Back to website
                    </Link>
                </div>
            </div>
        </div>
    )
}
