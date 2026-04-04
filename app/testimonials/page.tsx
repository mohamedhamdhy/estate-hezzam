'use client';

import Link from 'next/link';
import Image from 'next/image';

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes re-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(1.4); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes shimmerLine {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Profile card ── */
  .profile-card {
    background: #0D1118;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    animation: fadeUp 0.6s ease both;
  }

  /* ── Testimonial cards ── */
  .t-card {
    background: rgba(255,255,255,0.025);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    padding: 24px;
    position: relative;
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
    animation: fadeUp 0.55s ease both;
    overflow: hidden;
  }
  .t-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .t-card:hover {
    border-color: rgba(212,175,55,0.18);
    box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.08);
    transform: translateY(-3px);
  }
  .t-card:hover::before {
    opacity: 1;
  }

  /* ── Stat ring ── */
  .stat-ring {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stat-ring svg {
    animation: rotateSlow 12s linear infinite;
  }

  /* ── Metric badge ── */
  .metric-badge {
    background: rgba(212,175,55,0.08);
    border: 1px solid rgba(212,175,55,0.2);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    transition: border-color 0.25s, background 0.25s;
    animation: countUp 0.5s ease both;
  }
  .metric-badge:hover {
    background: rgba(212,175,55,0.12);
    border-color: rgba(212,175,55,0.32);
  }

  /* ── Stars ── */
  .stars { display: flex; gap: 2px; }
  .star  { color: #D4AF37; font-size: 11px; }

  /* ── Image frame ── */
  .img-frame {
    position: relative;
    border-radius: 14px;
    overflow: hidden;
    animation: float 6s ease-in-out infinite;
  }
  .img-frame::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 60%, rgba(26,110,142,0.10) 100%);
    pointer-events: none;
  }

  /* ── Quote mark ── */
  .quote-mark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 96px;
    font-weight: 700;
    color: rgba(212,175,55,0.12);
    line-height: 0.7;
    position: absolute;
    top: 16px;
    left: 20px;
    user-select: none;
    pointer-events: none;
  }

  /* ── CTA buttons ── */
  .btn-gold {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #D4AF37;
    color: #0C0C0F;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    padding: 13px 28px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 0 28px rgba(212,175,55,0.28);
    letter-spacing: 0.01em;
    transition: transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
  }
  .btn-gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 36px rgba(212,175,55,0.42);
  }
  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: #E2E8F0;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    padding: 12px 24px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .btn-ghost:hover {
    border-color: rgba(212,175,55,0.32);
    background: rgba(212,175,55,0.04);
  }

  /* ── Shimmer bar ── */
  .shimmer-bar {
    position: relative;
    overflow: hidden;
    background: rgba(255,255,255,0.04);
    border-radius: 100px;
    height: 3px;
  }
  .shimmer-bar-fill {
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, #D4AF37, #F0D060, #D4AF37);
    background-size: 200% 100%;
    animation: shimmerLine 2.5s linear infinite;
    position: relative;
  }

  /* ── Verified chip ── */
  .verified-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(52,211,153,0.12);
    border: 1px solid rgba(52,211,153,0.25);
    border-radius: 100px;
    padding: 3px 10px;
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 700;
    color: #34D399;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const AGENT_METRICS = [
  { label: 'Total Volume',     value: 'AED 750M+', sub: '2012 – 2026',    delay: 0   },
  { label: 'Deals Closed',     value: '50+',        sub: 'All categories', delay: 60  },
  { label: 'Avg. ROI',         value: '7.8%',       sub: 'Above market',   delay: 120 },
  { label: 'Client Retention', value: '94%',        sub: 'Repeat buyers',  delay: 180 },
];

const SUCCESS_STATS = [
  { value: '98%',    label: 'Satisfaction Rate',   bar: 98  },
  { value: '18 Days', label: 'Avg. Days to Close', bar: 72  },
  { value: '12+',    label: 'Communities Served',  bar: 85  },
  { value: '100%',   label: 'Deals Above Asking',  bar: 100 },
];

interface Testimonial {
  name: string;
  location: string;
  property: string;
  value: string;
  rating: number;
  text: string;
  tag: string;
  delay: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Khalid Al Mansoori',
    location: 'Abu Dhabi, UAE',
    property: 'Palm Jumeirah Villa',
    value: 'AED 9.2M',
    rating: 5,
    text: 'Hesham guided us through every step of acquiring our Palm villa with unmatched professionalism. His market insight and negotiation skills saved us over AED 400K on the final price. An absolute pleasure to work with.',
    tag: 'Investment Purchase',
    delay: 0,
  },
  {
    name: 'Sophie Müller',
    location: 'Munich, Germany',
    property: 'Burj View Penthouse',
    value: 'AED 5.1M',
    rating: 5,
    text: 'As a foreign investor, I was nervous about navigating Dubai\'s market. Hesham made the entire process seamless — from legal due diligence to handover. The ROI in year one exceeded all projections.',
    tag: 'International Investor',
    delay: 80,
  },
  {
    name: 'Rajan Mehta',
    location: 'Mumbai, India',
    property: 'Marina Skyline Apt.',
    value: 'AED 3.1M',
    rating: 5,
    text: 'Three properties in three years, all through Hesham. Each deal has outperformed expectations. His data-driven approach and honest advice is something you rarely find in this industry.',
    tag: 'Repeat Client',
    delay: 160,
  },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

function Stars({ count }: { count: number }) {
  return (
    <div className="stars">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="star">★</span>
      ))}
    </div>
  );
}

function ShimmerBar({ percent }: { percent: number }) {
  return (
    <div className="shimmer-bar" style={{ flex: 1 }}>
      <div className="shimmer-bar-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}

function MetricBadge({
  label,
  value,
  sub,
  delay,
}: {
  label: string;
  value: string;
  sub: string;
  delay: number;
}) {
  return (
    <div className="metric-badge" style={{ animationDelay: `${delay}ms` }}>
      <span
        className="f-sans"
        style={{
          fontSize: 8,
          color: 'rgba(255,255,255,0.28)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <span
        className="f-display"
        style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1 }}
      >
        {value}
      </span>
      <span
        className="f-sans"
        style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)' }}
      >
        {sub}
      </span>
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="t-card" style={{ animationDelay: `${t.delay}ms` }}>
      {/* Decorative quote mark */}
      <div className="quote-mark">"</div>

      {/* Header: avatar + name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 14,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Avatar initials */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(26,110,142,0.2))',
              border: '1px solid rgba(212,175,55,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <span
              className="f-display"
              style={{ fontSize: 16, fontWeight: 700, color: '#D4AF37' }}
            >
              {t.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p
              className="f-sans"
              style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}
            >
              {t.name}
            </p>
            <p
              className="f-sans"
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.35)',
                margin: '2px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="rgba(212,175,55,0.5)">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              </svg>
              {t.location}
            </p>
          </div>
        </div>
        <Stars count={t.rating} />
      </div>

      {/* Quote */}
      <p
        className="f-sans"
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.75,
          marginBottom: 16,
          position: 'relative',
          zIndex: 1,
          fontStyle: 'italic',
          margin: '0 0 16px',
        }}
      >
        "{t.text}"
      </p>

      {/* Footer: property + tag */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 14,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          gap: 8,
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div>
          <p
            className="f-sans"
            style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)', margin: 0 }}
          >
            Property
          </p>
          <p
            className="f-display"
            style={{ fontSize: 14, fontWeight: 600, color: '#D4AF37', margin: '1px 0 0' }}
          >
            {t.property} · {t.value}
          </p>
        </div>
        <div className="verified-chip">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="#34D399">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          {t.tag}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function Testimonials() {
  return (
    <>
      <style>{G}</style>

      <section
        id="testimonials"
        style={{ background: '#0C0C0F', position: 'relative', overflow: 'hidden' }}
      >
        {/* ── Ambient orbs ── */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 700,
            height: 700,
            top: -120,
            left: -160,
            background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 500,
            height: 500,
            bottom: -60,
            right: -100,
            background: 'radial-gradient(circle, rgba(26,110,142,0.10) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 260,
            height: 260,
            top: '38%',
            left: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 65%)',
          }}
        />

        {/* ── Grid overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-20 lg:py-28">

          {/* ── Section Header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <div
                className="inline-flex items-center gap-2 mb-5"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.22)',
                  borderRadius: 100,
                  padding: '5px 16px',
                }}
              >
                <span
                  style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: '#D4AF37',
                    display: 'block',
                    animation: 're-pulse 2s infinite',
                  }}
                />
                <span
                  className="f-sans"
                  style={{
                    fontSize: 10,
                    color: '#D4AF37',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Client Stories · 98% Satisfaction
                </span>
              </div>

              <h2
                className="f-display"
                style={{
                  fontSize: 'clamp(36px, 4.2vw, 62px)',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                Trusted By Those
                <br />
                <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                  Who Demand Excellence
                </em>
              </h2>

              <p
                className="f-sans"
                style={{
                  fontSize: 'clamp(13px, 1.1vw, 15px)',
                  color: '#94A3B8',
                  lineHeight: 1.72,
                  maxWidth: 440,
                  marginTop: 14,
                  marginBottom: 0,
                }}
              >
                From first-time investors to seasoned portfolio builders — hear directly
                from the clients whose lives and wealth we've helped transform across
                Dubai's finest addresses.
              </p>
            </div>

            {/* Overall rating pill */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: '18px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                flexShrink: 0,
                minWidth: 180,
              }}
            >
              <div className="stars" style={{ gap: 3 }}>
                {[1,2,3,4,5].map((i) => (
                  <span key={i} style={{ color: '#D4AF37', fontSize: 16 }}>★</span>
                ))}
              </div>
              <p
                className="f-display"
                style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1 }}
              >
                5.0
              </p>
              <p
                className="f-sans"
                style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}
              >
                Based on 50+ verified deals
              </p>
            </div>
          </div>

          {/* ─────────────────────────────────────────
              MAIN 2-COL GRID
          ───────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.55fr] gap-6 mb-10">

            {/* ══ LEFT COLUMN ══ */}
            <div className="flex flex-col gap-5">

              {/* ── Profile Card ── */}
              <div className="profile-card">
                {/* Gold top accent line */}
                <div
                  style={{
                    height: 3,
                    background: 'linear-gradient(90deg, #D4AF37, #F0D060, rgba(212,175,55,0.2))',
                  }}
                />

                <div style={{ padding: '24px 24px 20px' }}>
                  {/* Image + floating badge */}
                  <div style={{ position: 'relative', marginBottom: 20 }}>
                    <div className="img-frame" style={{ height: 260, background: 'rgba(255,255,255,0.04)' }}>
                      {/* Replace /agent.jpg with actual image in /public */}
                      <Image
                        src="/agent.jpg"
                        alt="Hesham — Dubai Real Estate Expert"
                        fill
                        style={{ objectFit: 'cover', objectPosition: 'top center' }}
                        onError={(e) => {
                          /* fallback gradient if image missing */
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {/* Fallback gradient placeholder */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(160deg, rgba(212,175,55,0.15) 0%, rgba(13,17,24,0.9) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          className="f-display"
                          style={{ fontSize: 72, fontWeight: 700, color: 'rgba(212,175,55,0.2)' }}
                        >
                          H
                        </span>
                      </div>
                    </div>

                    {/* Floating experience badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: -10,
                        background: '#D4AF37',
                        color: '#0C0C0F',
                        borderRadius: 12,
                        padding: '8px 14px',
                        boxShadow: '0 8px 24px rgba(212,175,55,0.4)',
                        animation: 'float 5s ease-in-out infinite',
                      }}
                    >
                      <p
                        className="f-display"
                        style={{ fontSize: 22, fontWeight: 700, margin: 0, lineHeight: 1 }}
                      >
                        14+
                      </p>
                      <p
                        className="f-sans"
                        style={{ fontSize: 8, fontWeight: 700, margin: 0, letterSpacing: '0.06em' }}
                      >
                        YRS EXP
                      </p>
                    </div>

                    {/* Floating verified badge */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 14,
                        left: -10,
                        background: '#0D1118',
                        border: '1px solid rgba(52,211,153,0.3)',
                        borderRadius: 10,
                        padding: '7px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        animation: 'float 5s ease-in-out infinite 0.8s',
                      }}
                    >
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', animation: 're-pulse 2s infinite' }} />
                      <span className="f-sans" style={{ fontSize: 9, color: '#34D399', fontWeight: 600 }}>
                        RERA Certified
                      </span>
                    </div>
                  </div>

                  {/* Name + location */}
                  <div style={{ marginBottom: 16 }}>
                    <h3
                      className="f-display"
                      style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1.1 }}
                    >
                      Hesham Al Rashid
                    </h3>
                    <p
                      className="f-sans"
                      style={{ fontSize: 12, color: '#D4AF37', margin: '0 0 6px', fontWeight: 500 }}
                    >
                      Luxury Real Estate Specialist
                    </p>
                    <div
                      className="f-sans"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.35)',
                      }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="rgba(212,175,55,0.5)">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      </svg>
                      Dubai, United Arab Emirates
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

                  {/* Specialities */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 0 }}>
                    {['Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'JBR', 'Off-Plan'].map((tag) => (
                      <span
                        key={tag}
                        className="f-sans"
                        style={{
                          fontSize: 9,
                          fontWeight: 600,
                          color: 'rgba(255,255,255,0.4)',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 6,
                          padding: '3px 10px',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Agent Metrics Grid 2×2 ── */}
              <div className="grid grid-cols-2 gap-3">
                {AGENT_METRICS.map((m) => (
                  <MetricBadge key={m.label} {...m} />
                ))}
              </div>

              {/* ── Awards / credentials strip ── */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { icon: '🏆', label: 'Top 1% Agent' },
                  { icon: '🌍', label: 'GCC & Global' },
                  { icon: '⚡', label: '18-Day Close' },
                ].map(({ icon, label }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span
                      className="f-sans"
                      style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', fontWeight: 500 }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4AF37', animation: 're-pulse 2s infinite' }} />
                  <span className="f-sans" style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)' }}>
                    Since 2012
                  </span>
                </div>
              </div>
            </div>

            {/* ══ RIGHT COLUMN ══ */}
            <div className="flex flex-col gap-5">

              {/* ── Testimonial cards ── */}
              {TESTIMONIALS.map((t) => (
                <TestimonialCard key={t.name} t={t} />
              ))}

              {/* ── Success rate bars ── */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '22px 24px',
                }}
              >
                <p
                  className="f-sans"
                  style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.28)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: 18,
                    fontWeight: 600,
                  }}
                >
                  Performance at a Glance
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {SUCCESS_STATS.map(({ value, label, bar }) => (
                    <div key={label}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: 6,
                        }}
                      >
                        <span
                          className="f-sans"
                          style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}
                        >
                          {label}
                        </span>
                        <span
                          className="f-display"
                          style={{ fontSize: 18, fontWeight: 700, color: '#D4AF37' }}
                        >
                          {value}
                        </span>
                      </div>
                      <ShimmerBar percent={bar} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────
              CONTACT / CTA BANNER
          ───────────────────────────────────────── */}
          <div
            id="contactus"
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(26,110,142,0.08) 100%)',
              border: '1px solid rgba(212,175,55,0.18)',
              borderRadius: 20,
              padding: 'clamp(28px, 4vw, 44px) clamp(24px, 4vw, 48px)',
              overflow: 'hidden',
            }}
          >
            {/* Decorative orb inside banner */}
            <div
              style={{
                position: 'absolute',
                width: 320,
                height: 320,
                top: -80,
                right: -60,
                background: 'radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 65%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 relative z-10">
              {/* Left: headline */}
              <div>
                <p
                  className="f-sans"
                  style={{
                    fontSize: 10,
                    color: '#D4AF37',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  Ready to Invest?
                </p>
                <h3
                  className="f-display"
                  style={{
                    fontSize: 'clamp(26px, 3vw, 42px)',
                    fontWeight: 700,
                    color: '#fff',
                    lineHeight: 1.1,
                    margin: '0 0 10px',
                  }}
                >
                  Let's Find Your
                  <em style={{ color: '#D4AF37', fontStyle: 'italic' }}> Perfect Property</em>
                </h3>
                <p
                  className="f-sans"
                  style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.65,
                    maxWidth: 420,
                    margin: 0,
                  }}
                >
                  Book a no-obligation private consultation. Whether you're acquiring your
                  first Dubai investment or expanding a portfolio — Hesham delivers results.
                </p>
              </div>

              {/* Right: CTA buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                {/* Book appointment */}
                <Link href="#contactus" className="btn-gold">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="3" stroke="#0C0C0F" strokeWidth="1.8"/>
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="#0C0C0F" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  Book an Appointment
                </Link>

                {/* WhatsApp / call */}
                <a
                  href="tel:+971500000000"
                  className="btn-ghost"
                  style={{ justifyContent: 'center' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.56a1 1 0 01-.24 1.01l-2.21 2.22z" fill="rgba(255,255,255,0.6)"/>
                  </svg>
                  +971 50 000 0000
                </a>

                {/* Live availability indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399', animation: 're-pulse 2s infinite' }} />
                  <span
                    className="f-sans"
                    style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em' }}
                  >
                    Available Now · Dubai Time (GMT+4)
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}