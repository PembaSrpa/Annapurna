'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
    IconDeviceMobile,
    IconTool,
    IconPrinter,
    IconCamera,
    IconFileText,
    IconDeviceLaptop,
    IconMapPin,
    IconClock,
    IconPhone,
    IconMail,
    IconBrandWhatsapp,
    IconMenu2,
    IconX,
    IconArrowDown,
    IconCheck,
    IconBolt,
    IconDiamond,
    IconCoin,
    IconUsers,
} from '@tabler/icons-react'

const services = [
    {
        icon: IconDeviceMobile,
        title: 'Mobile Accessories',
        desc: 'Earphones, chargers, tempered glass, cables, and all mobile essentials.',
        items: ['Earphones & Headphones', 'Chargers & Cables', 'Tempered Glass'],
    },
    {
        icon: IconTool,
        title: 'Phone Repair',
        desc: 'Expert repair services for all brands. Fast turnaround, quality parts, trusted hands.',
        items: ['Screen Replacement', 'Battery Replacement', 'Charging Port Repair', 'Speaker & Mic Fix', 'Software Issues'],
    },
    {
        icon: IconPrinter,
        title: 'Printing & Photocopy',
        desc: 'Black & white and colour printing for all your document and academic needs.',
        items: ['Black & White Photocopy', 'Colour Photocopy', 'Document Printing', 'A4', 'Bulk Printing'],
    },
    {
        icon: IconCamera,
        title: 'Photo Services',
        desc: 'Professional passport photos, photo prints, and framing for every occasion.',
        items: ['Passport Size Photos', 'Photo Printing', 'Photo Framing', 'ID Card Photos', 'Custom Size Prints', 'Cup Prints'],
    },
    {
        icon: IconFileText,
        title: 'Document Services',
        desc: 'Scanning, PDF creation, CV writing and all your professional document needs.',
        items: ['Document Scanning', 'PDF Creation', 'CV / Resume Writing', 'Lamination'],
    },
    {
        icon: IconDeviceLaptop,
        title: 'Digital Services',
        desc: 'Digital assistance for forms, applications, and everyday digital tasks.',
        items: ['Form Filling', 'Email & Print', 'File Conversion', 'Data Entry'],
    },
]

const qualities = [
    { icon: IconBolt, title: 'Fast Service' },
    { icon: IconDiamond, title: 'Quality First' },
    { icon: IconCoin, title: 'Fair Pricing' },
    { icon: IconUsers, title: 'Trusted' },
]

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return { ref, visible }
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
    const { ref, visible } = useInView()
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
            ...style,
        }}>
            {children}
        </div>
    )
}

function useIsOpen() {
    const [status, setStatus] = useState<{ open: boolean; label: string }>({ open: false, label: '' })
    useEffect(() => {
        function check() {
            const now = new Date()
            const hours = now.getHours()
            const minutes = now.getMinutes()
            const total = hours * 60 + minutes
            const open = total >= 8 * 60 && total < 20 * 60
            const label = open ? 'Open Now' : 'Closed'
            setStatus({ open, label })
        }
        check()
        const id = setInterval(check, 60000)
        return () => clearInterval(id)
    }, [])
    return status
}

export default function HomePage() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { open, label } = useIsOpen()

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handler)
        return () => window.removeEventListener('scroll', handler)
    }, [])

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', overflowX: 'hidden', maxWidth: '100vw' }}>

            {/* NAV */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                transition: 'all 0.3s',
                backgroundColor: scrolled ? '#000' : 'transparent',
                borderBottom: scrolled ? '1px solid #1a1a1a' : 'none',
                padding: scrolled ? '12px 0' : '20px 0',
            }}>
                <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#000' }}>A</div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, lineHeight: 1.2 }}>Annapurna</div>
                            <div style={{ color: '#fbbf24', fontSize: 10, lineHeight: 1.2 }}>Mobile Care</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} id="desktop-nav">
                        {['Services', 'About', 'Location', 'Contact'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500, textDecoration: 'none' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}>
                                {item}
                            </a>
                        ))}
                        <Link href="/admin" style={{ fontSize: 11, padding: '6px 14px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', textDecoration: 'none', fontWeight: 600 }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444' }}>
                            Admin
                        </Link>
                    </div>

                    <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }} id="mobile-btn">
                        {menuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
                    </button>
                </div>

                {menuOpen && (
                    <div style={{ backgroundColor: '#000', padding: '12px 24px 20px', borderTop: '1px solid #1a1a1a' }}>
                        {['Services', 'About', 'Location', 'Contact'].map(item => (
                            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                                style={{ display: 'block', padding: '10px 0', color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none', borderBottom: '1px solid #111' }}>
                                {item}
                            </a>
                        ))}
                        <Link href="/admin" onClick={() => setMenuOpen(false)}
                            style={{ display: 'inline-block', marginTop: 12, fontSize: 11, padding: '6px 14px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', textDecoration: 'none', fontWeight: 600 }}>
                            Admin
                        </Link>
                    </div>
                )}
            </nav>

            {/* HERO */}
            <section id="home" style={{ minHeight: 'clamp(50vh, 60vh, 75vh)', maxHeight: '90vh', background: '#000', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', maxWidth: '100vw' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/annapurna.jpg)', backgroundSize: 'cover', backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat', opacity: 0.55 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 75%, #000 100%)' }} />
                <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', width: '80vw', maxWidth: 600, height: 180, background: 'radial-gradient(ellipse, rgba(251,191,36,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 1152, margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1, width: '100%' }}>
                    <div style={{ maxWidth: 680, position: 'relative' }}>
                        <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', marginBottom: 32 }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: open ? '#4ade80' : '#ef4444', display: 'inline-block' }} />
                            <span style={{ color: '#fbbf24', fontSize: 11, fontWeight: 500 }}>{label} · Dharan-16, Annapurna Chowk</span>
                        </div>

                        <h1 className="animate-fade-in-up animate-delay-100" style={{ fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, marginBottom: 24, letterSpacing: '-1px' }}>
                            Annapurna <span style={{ color: '#fbbf24' }}>Mobile Care,</span><br />
                            Your Tech & Print <span style={{ color: '#fbbf24' }}>Partner</span><br />
                        </h1>

                        <p className="animate-fade-in-up animate-delay-200" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
                            From mobile accessories and repairs to printing, photos, and document services - everything you probably need.
                        </p>

                        <div className="animate-fade-in-up animate-delay-300" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                            <a href="#services" style={{ padding: '14px 28px', borderRadius: 8, fontWeight: 700, fontSize: 13, background: '#fbbf24', color: '#000', textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                                View Our Services
                            </a>
                            <a href="#contact" style={{ padding: '14px 28px', borderRadius: 8, fontWeight: 600, fontSize: 13, background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'}
                                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}>
                                Get In Touch
                            </a>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: 'bounce 2s infinite' }}>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' }}>Scroll</span>
                    <IconArrowDown size={16} color="rgba(255,255,255,0.25)" />
                </div>
            </section>

            {/* SERVICES */}
            <section id="services" style={{ padding: '32px 0', background: '#fff', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>What We Offer</div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#000', marginBottom: 16, letterSpacing: '-0.5px' }}>Our Services</h2>
                        <p style={{ color: '#777', maxWidth: 480, margin: '0 auto', fontSize: 15, lineHeight: 1.6 }}>
                            A complete range of mobile, tech, and printing services.
                        </p>
                    </FadeIn>

                    <div id="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden' }}>
                        {services.map((s, i) => {
                            const Icon = s.icon
                            return (
                                <FadeIn key={i} delay={i * 60} style={{ padding: '32px 28px', background: '#fff', borderRight: i % 3 !== 2 ? '1px solid #e5e5e5' : 'none', borderBottom: i < 3 ? '1px solid #e5e5e5' : 'none' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 10, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                        <Icon size={22} color="#fbbf24" />
                                    </div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#000', marginBottom: 8 }}>{s.title}</h3>
                                    <p style={{ color: '#888', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{s.desc}</p>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {s.items.map((item, j) => (
                                            <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#555' }}>
                                                <IconCheck size={13} color="#fbbf24" strokeWidth={3} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </FadeIn>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" style={{ padding: '32px 0', background: '#000', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
                    <div id="about-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
                        <FadeIn>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#fbbf24', marginBottom: 16 }}>About Us</div>
                            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-0.5px' }}>
                                Annapurna Mobile Care,<br />
                                <span style={{ color: '#fbbf24' }}>Since 2010</span>
                            </h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
                                Annapurna Mobile Care has been serving the people of Dharan for years, offering reliable mobile accessories, professional repair services, and comprehensive printing solutions.
                            </p>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.8 }}>
                                We believe in honest pricing, quality work, and making technology accessible to everyone.
                            </p>
                            <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ height: 1, flex: 1, background: 'rgba(251,191,36,0.2)' }} />
                                <span style={{ color: '#fbbf24', fontSize: 11, fontWeight: 500 }}>Annapurna Chowk, Dharan-16</span>
                                <div style={{ height: 1, flex: 1, background: 'rgba(251,191,36,0.2)' }} />
                            </div>
                        </FadeIn>

                        <FadeIn delay={120}>
                            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                                <img src="/shop-placeholder.svg" alt="Annapurna Mobile Care shop" style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px 20px 16px', background: 'linear-gradient(to top, rgba(0,0,0,0.92), transparent)' }}>
                                    <div style={{ color: '#fbbf24', fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 }}>Our Shop</div>
                                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Annapurna Chowk, Dharan-16</div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
                                {qualities.map((q, i) => {
                                    const Icon = q.icon
                                    return (
                                        <div key={i} style={{ padding: '8px 7px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', transition: 'border-color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(251,191,36,0.3)'}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                                            <Icon size={18} color="#fbbf24" style={{ marginBottom: 8 }} />
                                            <div style={{ fontWeight: 600, color: '#fff', fontSize: 12, marginBottom: 1 }}>{q.title}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* LOCATION */}
            <section id="location" style={{ padding: '32px 0', background: '#fff', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#999', marginBottom: 12 }}>Find Us</div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#000', letterSpacing: '-0.5px' }}>Our Location</h2>
                    </FadeIn>

                    <div id="location-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
                        <FadeIn style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { icon: IconMapPin, label: 'Address', value: 'Annapurna Chowk, Dharan-16\nSunsari, Koshi Province, Nepal' },
                                { icon: IconClock, label: 'Hours', value: 'Everyday: 8:00 AM – 8:00 PM' },
                            ].map((item, i) => {
                                const Icon = item.icon
                                return (
                                    <div key={i} style={{ display: 'flex', gap: 16, padding: '20px 24px', borderRadius: 12, background: '#f9f9f9', border: '1px solid #eee' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Icon size={18} color="#fbbf24" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 11, color: '#000', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
                                            <div style={{ color: '#555', fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{item.value}</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </FadeIn>

                        <FadeIn delay={100}>
                            <div style={{ borderRadius: 16, overflow: 'hidden', height: 360, border: '1px solid #e5e5e5' }}>
                                <iframe
                                    src="https://www.openstreetmap.org/export/embed.html?bbox=87.2787,26.8172,87.2818,26.8189&layer=mapnik&marker=26.81811,87.28030"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    title="Annapurna Mobile Care Location"
                                />
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" style={{ padding: '76px 0', background: '#000', overflow: 'hidden' }}>
                <div style={{ maxWidth: 1152, maxHeight: '60vh', margin: '0 auto', padding: '0 24px' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#fbbf24', marginBottom: 12 }}>Reach Out</div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 12 }}>Let&apos;s Talk</h2>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0 }}>Walk in, call, or message - we&apos;re here for you.</p>
                    </FadeIn>

                    <div style={{ maxWidth: 900, margin: '0 auto' }}>
                        <FadeIn>
                            <div id="contact-top-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                {[
                                    { label: 'Primary Line', value: '+977 9842 415795', href: 'tel:9842415795', accent: true },
                                    { label: 'Alternate Line', value: '+977 9802 388360', href: 'tel:9802388360', accent: false },
                                ].map((item, i) => (
                                    <a key={i} href={item.href}
                                        style={{
                                            textDecoration: 'none', display: 'flex', flexDirection: 'column',
                                            justifyContent: 'space-between', padding: '28px', borderRadius: 16,
                                            position: 'relative', overflow: 'hidden', minHeight: 140,
                                            background: item.accent ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${item.accent ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.08)'}`,
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = item.accent ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.06)'
                                            e.currentTarget.style.borderColor = item.accent ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.2)'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = item.accent ? 'rgba(251,191,36,0.06)' : 'rgba(255,255,255,0.03)'
                                            e.currentTarget.style.borderColor = item.accent ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.08)'
                                        }}>
                                        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: item.accent ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.25)', marginBottom: 16 }}>{item.label}</div>
                                        <div>
                                            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', marginBottom: 4 }}>{item.value}</div>
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Tap to call</div>
                                        </div>
                                        <div style={{ position: 'absolute', top: 24, right: 24, width: 40, height: 40, borderRadius: 10, background: item.accent ? '#fbbf24' : 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <IconPhone size={18} color={item.accent ? '#000' : 'rgba(255,255,255,0.5)'} />
                                        </div>
                                    </a>
                                ))}
                            </div>

                            <div id="contact-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <a href="https://wa.me/9779842415795" target="_blank" rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '22px 24px', borderRadius: 16, background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.12)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.4)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(37,211,102,0.06)'; e.currentTarget.style.borderColor = 'rgba(37,211,102,0.2)' }}>
                                    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <IconBrandWhatsapp size={22} color="#25d366" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(37,211,102,0.5)', marginBottom: 3 }}>WhatsApp</div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Message us instantly</div>
                                    </div>
                                </a>

                                <a href="mailto:annapurnamobilec@gmail.com"
                                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '22px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}>
                                    <div style={{ width: 46, height: 46, borderRadius: 12, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <IconMail size={20} color="rgba(255,255,255,0.5)" />
                                    </div>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 3 }}>Email</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>annapurnamobilec@gmail.com</div>
                                    </div>
                                </a>
                            </div>

                            <div style={{ marginTop: 24, padding: '20px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: open ? '#4ade80' : '#ef4444', flexShrink: 0, display: 'inline-block' }} />
                                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Open today · 8:00 AM – 8:00 PM</span>
                                </div>
                                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>Annapurna Chowk, Dharan-16</span>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ background: '#000', borderTop: '1px solid #111', padding: '32px 0' }}>
                <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#000' }}>A</div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#fff', fontSize: 12 }}>Annapurna Mobile Care</div>
                            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>Dharan-16, Annapurna Chowk</div>
                        </div>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                        © {new Date().getFullYear()} Annapurna Mobile Care. All rights reserved.
                    </div>
                    <Link href="/admin" style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}>
                        Admin Login
                    </Link>
                </div>
            </footer>

            <style>{`
        #mobile-btn { display: none; }
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #mobile-btn { display: flex !important; }
          #services-grid { grid-template-columns: 1fr !important; }
          #about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          #location-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          #contact-top-grid { grid-template-columns: 1fr !important; }
          #contact-bottom-grid { grid-template-columns: 1fr !important; }
          #hero-content { padding: 100px 20px 60px !important; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
        </div>
    )
}
