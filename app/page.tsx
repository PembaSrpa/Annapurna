'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const services = [
  {
    icon: '📱',
    title: 'Mobile Accessories',
    desc: 'Earphones, chargers, cases, screen guards, cables, power banks and all mobile essentials.',
    items: ['Earphones & Headphones', 'Chargers & Cables', 'Phone Cases & Covers', 'Screen Guards', 'Power Banks'],
  },
  {
    icon: '🔧',
    title: 'Phone Repair',
    desc: 'Expert repair services for all brands. Fast turnaround, quality parts, trusted hands.',
    items: ['Screen Replacement', 'Battery Replacement', 'Charging Port Repair', 'Speaker & Mic Fix', 'Software Issues'],
  },
  {
    icon: '🖨️',
    title: 'Printing & Photocopy',
    desc: 'Black & white and colour printing for all your document and academic needs.',
    items: ['Black & White Photocopy', 'Colour Photocopy', 'Document Printing', 'A4 / A3 / Legal Sizes', 'Bulk Printing'],
  },
  {
    icon: '📸',
    title: 'Photo Services',
    desc: 'Professional passport photos, photo prints, and framing for every occasion.',
    items: ['Passport Size Photos', 'Photo Printing', 'Photo Framing', 'ID Card Photos', 'Custom Size Prints'],
  },
  {
    icon: '📄',
    title: 'Document Services',
    desc: 'Scanning, PDF creation, CV writing and all your professional document needs.',
    items: ['Document Scanning', 'PDF Creation', 'CV / Resume Writing', 'Lamination', 'Spiral Binding'],
  },
  {
    icon: '💻',
    title: 'Digital Services',
    desc: 'Digital assistance for forms, applications, and everyday digital tasks.',
    items: ['Form Filling', 'Email & Print', 'File Conversion', 'Data Entry', 'USB / Memory Card'],
  },
]

const stats = [
  { value: '1000+', label: 'Happy Customers' },
  { value: '500+', label: 'Repairs Done' },
  { value: '5+', label: 'Years of Service' },
  { value: '24hr', label: 'Fast Turnaround' },
]

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="min-h-screen">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-navy-900 shadow-lg py-3' : 'bg-transparent py-5'
        }`}
        style={{ backgroundColor: scrolled ? 'var(--navy-900)' : 'transparent' }}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fcd34d)', color: '#0a1230' }}
            >
              A
            </div>
            <div>
              <div className="font-display font-semibold text-white text-sm leading-tight">Annapurna</div>
              <div className="text-xs leading-tight" style={{ color: 'var(--gold-400)' }}>Mobile Care</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Services', 'About', 'Location', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link text-sm font-medium text-white/80 hover:text-white"
              >
                {item}
              </a>
            ))}
            <Link
              href="/admin"
              className="text-xs px-4 py-2 rounded-full border border-white/20 text-white/60 hover:border-yellow-400 hover:text-yellow-400 transition-all"
            >
              Admin
            </Link>
          </div>

          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <div className={`w-5 h-0.5 bg-white mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <div className={`w-5 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden px-6 pb-4" style={{ backgroundColor: 'var(--navy-900)' }}>
            {['Services', 'About', 'Location', 'Contact'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block py-2 text-white/80 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      <section className="hero-bg min-h-screen flex items-center relative" id="home">
        <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 animate-fade-in-up"
              style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: 'var(--gold-400)', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Open Now · Dharan-16, Annapurna Chowk
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up animate-delay-100">
              Your Trusted<br />
              <span className="gold-text">Tech & Print</span><br />
              Partner
            </h1>

            <p className="text-white/70 text-lg md:text-xl mb-10 max-w-xl animate-fade-in-up animate-delay-200">
              From mobile accessories and repairs to printing, photos, and document services — everything you need, right here in Dharan.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up animate-delay-300">
              <a
                href="#services"
                className="px-8 py-4 rounded-full font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #fcd34d)', color: '#0a1230' }}
              >
                View Our Services
              </a>
              <a
                href="#contact"
                className="px-8 py-4 rounded-full font-medium text-sm text-white border border-white/25 hover:border-yellow-400 hover:text-yellow-400 transition-all"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <span className="text-white/40 text-xs">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: '#f8f9ff' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
                <div className="font-display text-4xl font-bold mb-1" style={{ color: 'var(--navy-700)' }}>{s.value}</div>
                <div className="text-sm text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--gold-600)' }}>
              What We Offer
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--navy-800)' }}>
              Our Services
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A complete range of mobile, tech, and printing services — all under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="service-card rounded-2xl p-6 bg-white">
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--navy-800)' }}>{s.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{s.desc}</p>
                <ul className="space-y-1">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <span style={{ color: 'var(--gold-500)' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-24" style={{ backgroundColor: 'var(--navy-900)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--gold-400)' }}>
                About Us
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Built on Trust,<br />
                <span className="gold-text">Driven by Service</span>
              </h2>
              <p className="text-white/70 mb-4 leading-relaxed">
                Annapurna Mobile Care has been serving the people of Dharan for years, offering reliable mobile accessories, professional repair services, and comprehensive printing solutions.
              </p>
              <p className="text-white/70 leading-relaxed">
                We believe in honest pricing, quality work, and making technology accessible to everyone. Walk in with a problem, walk out with a solution.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <div className="h-px flex-1" style={{ backgroundColor: 'rgba(245,158,11,0.3)' }} />
                <span className="text-sm" style={{ color: 'var(--gold-400)' }}>Annapurna Chowk, Dharan-16</span>
                <div className="h-px flex-1" style={{ backgroundColor: 'rgba(245,158,11,0.3)' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '⚡', title: 'Fast Service', desc: 'Quick turnaround on all repairs and print jobs' },
                { icon: '💎', title: 'Quality First', desc: 'Only genuine parts and professional-grade materials' },
                { icon: '💰', title: 'Fair Pricing', desc: 'Transparent rates, no hidden charges' },
                { icon: '🤝', title: 'Trusted', desc: 'Hundreds of satisfied customers in Dharan' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}
                >
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                  <div className="text-white/50 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--gold-600)' }}>
              Find Us
            </div>
            <h2 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--navy-800)' }}>
              Our Location
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { icon: '📍', label: 'Address', value: 'Annapurna Chowk, Dharan-16\nSunsari, Koshi Province, Nepal' },
                { icon: '🕐', label: 'Hours', value: 'Sunday – Friday: 7:00 AM – 8:00 PM\nSaturday: 8:00 AM – 6:00 PM' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-5 rounded-xl" style={{ backgroundColor: '#f8f9ff', border: '1px solid rgba(30,58,138,0.08)' }}>
                  <div className="text-2xl mt-0.5">{item.icon}</div>
                  <div>
                    <div className="font-semibold text-sm mb-1" style={{ color: 'var(--navy-700)' }}>{item.label}</div>
                    <div className="text-gray-600 text-sm whitespace-pre-line">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100" style={{ height: '360px' }}>
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=87.26,26.79,87.30,26.82&layer=mapnik&marker=26.805,87.280"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Annapurna Mobile Care Location"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24" style={{ backgroundColor: '#f8f9ff' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: 'var(--gold-600)' }}>
              Reach Out
            </div>
            <h2 className="font-display text-4xl font-bold mb-4" style={{ color: 'var(--navy-800)' }}>
              Contact Us
            </h2>
            <p className="text-gray-500">Have a question? We're just a message away.</p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="space-y-4 mb-8">
                {[
                  { icon: '📍', label: 'Visit Us', value: 'Annapurna Chowk, Dharan-16' },
                  { icon: '🕐', label: 'Business Hours', value: 'Sun–Fri 7AM–8PM · Sat 8AM–6PM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <div>
                      <div className="font-medium text-sm" style={{ color: 'var(--navy-700)' }}>{item.label}</div>
                      <div className="text-gray-500 text-sm">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="p-4 rounded-xl text-center text-sm"
                style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <span style={{ color: 'var(--gold-600)' }}>
                  Walk in anytime during business hours — we're always happy to help!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: 'var(--navy-900)' }} className="py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #fcd34d)', color: '#0a1230' }}
            >
              A
            </div>
            <div>
              <div className="font-display font-semibold text-white text-sm">Annapurna Mobile Care</div>
              <div className="text-xs text-white/40">Dharan-16, Annapurna Chowk</div>
            </div>
          </div>
          <div className="text-white/30 text-xs">
            © {new Date().getFullYear()} Annapurna Mobile Care. All rights reserved.
          </div>
          <Link href="/admin" className="text-xs text-white/30 hover:text-yellow-400 transition-colors">
            Admin Login
          </Link>
        </div>
      </footer>
    </div>
  )
}
