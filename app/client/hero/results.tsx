'use client';

import { useState } from 'react';
import Link from 'next/link';

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes re-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(1.4); }
  }

  /* Stat card */
  .stat-card {
    background: #0D1118;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
  }
  .stat-gold::before   { background: linear-gradient(90deg, #D4AF37, transparent); }
  .stat-green::before  { background: linear-gradient(90deg, #34D399, transparent); }
  .stat-blue::before   { background: linear-gradient(90deg, #60A5FA, transparent); }
  .stat-purple::before { background: linear-gradient(90deg, #C4B5FD, transparent); }

  /* Testimonial card */
  .review-card {
    background: #0D1118;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 32px 36px;
    position: relative;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .review-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, #D4AF37, rgba(212,175,55,0.2), transparent);
  }

  /* Swipe hint */
  .nav-btn {
    width: 40px; height: 40px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    color: rgba(255,255,255,0.45);
  }
  .nav-btn:hover {
    border-color: rgba(212,175,55,0.35);
    background: rgba(212,175,55,0.08);
    color: #D4AF37;
  }

  .trust-item-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(212,175,55,0.10); border: 1px solid rgba(212,175,55,0.2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
`;

/* ── Types ── */
interface Review {
  name: string;
  title: string;
  location: string;
  rating: number;
  text: string;
  deal: string;
  dealColor: string;
  initials: string;
  avatarColor: string;
}

/* ── Data ── */
const REVIEWS: Review[] = [
  {
    name: "Mohammed Al Rashidi",
    title: "CEO, Rashidi Holdings",
    location: "Dubai, UAE",
    rating: 5,
    text: "Hesham didn't just find us a property — he found us the right investment. Our Palm Jumeirah villa appreciated 24% within 18 months. The level of discretion and market knowledge he brings is genuinely rare in this industry.",
    deal: "Palm Jumeirah Villa · AED 9.2M",
    dealColor: "#D4AF37",
    initials: "MR",
    avatarColor: "#D4AF37",
  },
  {
    name: "Sarah Chen",
    title: "Private Investor",
    location: "Singapore",
    rating: 5,
    text: "As an international buyer, I was nervous about purchasing remotely. Hesham managed every step with absolute professionalism — from virtual tours to final documentation. The whole process took 18 days. Remarkable.",
    deal: "Downtown Penthouse · AED 5.1M",
    dealColor: "#60A5FA",
    initials: "SC",
    avatarColor: "#60A5FA",
  },
  {
    name: "James Whitmore",
    title: "Director, Whitmore Capital",
    location: "London, UK",
    rating: 5,
    text: "We've worked with agents across London, New York and Dubai. Hesham is in a different league. His off-market access and negotiation skills saved us over AED 400,000 on our Marina acquisition. Highly recommended.",
    deal: "Dubai Marina · AED 3.1M",
    dealColor: "#34D399",
    initials: "JW",
    avatarColor: "#34D399",
  },
  {
    name: "Layla Mansouri",
    title: "Entrepreneur",
    location: "Abu Dhabi, UAE",
    rating: 5,
    text: "From the first call I knew I was in safe hands. Hesham listened to exactly what I needed, presented three perfectly matched options, and we closed in under three weeks. The ROI on my JBR suite is already beating projections.",
    deal: "JBR Beach Suite · AED 4.8M",
    dealColor: "#C4B5FD",
    initials: "LM",
    avatarColor: "#C4B5FD",
  },
  {
    name: "Rajan Mehta",
    title: "Managing Partner, Mehta Ventures",
    location: "Mumbai, India",
    rating: 5,
    text: "Third property I've bought through Hesham, and every time the experience gets better. He thinks like an investor first and an agent second. That perspective makes all the difference when allocating serious capital.",
    deal: "Business Bay Loft · AED 2.6M",
    dealColor: "#2DD4BF",
    initials: "RM",
    avatarColor: "#2DD4BF",
  },
];

const STATS = [
  {
    value: "AED 2.1B",
    label: "Total Volume",
    sub: "Across 340+ transactions",
    accent: "#D4AF37",
    cls: "stat-gold",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    value: "340+",
    label: "Deals Closed",
    sub: "Since 2012",
    accent: "#34D399",
    cls: "stat-green",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    value: "7.8%",
    label: "Avg. ROI",
    sub: "Above Dubai market average",
    accent: "#60A5FA",
    cls: "stat-blue",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    value: "98%",
    label: "Client Satisfaction",
    sub: "Based on 300+ reviews",
    accent: "#C4B5FD",
    cls: "stat-purple",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
];

const TRUST_ITEMS = [
  {
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>,
    text: "RERA Licensed",
  },
  {
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>,
    text: "Verified Specialist",
  },
  {
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>,
    text: "Avg. 18 Days to Close",
  },
  {
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>,
    text: "GCC & International Buyers",
  },
];

/* ── Star rating ── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < count ? "#D4AF37" : "rgba(255,255,255,0.12)"}
          stroke={i < count ? "#D4AF37" : "rgba(255,255,255,0.12)"}
          strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ── Testimonial slider ── */
function TestimonialSlider() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState<1 | -1>(1);
  const total = REVIEWS.length;

  function go(delta: 1 | -1) {
    setDir(delta);
    setCurrent(c => (c + delta + total) % total);
  }

  /* touch / swipe */
  let touchStartX = 0;
  function onTouchStart(e: React.TouchEvent) { touchStartX = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1);
  }

  const r = REVIEWS[current];

  return (
    <div className="flex flex-col h-full gap-5">

      {/* Card */}
      <div
        className="review-card flex-1"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ userSelect: "none" }}
      >
        {/* Quote mark */}
        <div
          className="f-display absolute"
          style={{ top: 20, right: 28, fontSize: 96, lineHeight: 1, color: "rgba(212,175,55,0.07)", fontWeight: 700, pointerEvents: "none" }}
        >
          "
        </div>

        {/* Stars */}
        <div className="mb-5">
          <Stars count={r.rating} />
        </div>

        {/* Review text */}
        <p
          className="f-display flex-1"
          style={{ fontSize: "clamp(16px,1.5vw,20px)", fontWeight: 600, color: "rgba(255,255,255,0.88)", lineHeight: 1.6, marginBottom: 28, fontStyle: "italic", flex: 1 }}
        >
          "{r.text}"
        </p>

        {/* Deal badge */}
        <div
          className="f-sans inline-flex items-center gap-2 mb-6 self-start"
          style={{
            fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
            background: `${r.dealColor}12`, color: r.dealColor, border: `1px solid ${r.dealColor}28`,
            borderRadius: 100, padding: "4px 12px",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: r.dealColor, display: "block" }} />
          {r.deal}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />

        {/* Author */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: `${r.avatarColor}18`,
              border: `1.5px solid ${r.avatarColor}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span className="f-display" style={{ fontSize: 16, fontWeight: 700, color: r.avatarColor }}>{r.initials}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="f-sans" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", margin: 0 }}>{r.name}</p>
            <p className="f-sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{r.title} · {r.location}</p>
          </div>
          {/* Verified */}
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }} title="Verified Client">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                cursor: "pointer",
                background: i === current ? "#D4AF37" : "rgba(255,255,255,0.15)",
                transition: "width 0.3s, background 0.2s",
                padding: 0,
              }}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* Counter + arrows */}
        <div className="flex items-center gap-3">
          <span className="f-sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: ".06em" }}>
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button className="nav-btn" onClick={() => go(-1)} aria-label="Previous review">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button className="nav-btn" onClick={() => go(1)} aria-label="Next review">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function Results() {
  return (
    <>
      <style>{G}</style>

      <section
        style={{ background: '#0C0C0F', position: 'relative', overflow: 'hidden' }}
      >
     <div className="absolute pointer-events-none rounded-full"
          style={{ width: 640, height: 640, top: 100, right: -50, background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)" }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 520, height: 520, bottom: 100, left: -50, background: "radial-gradient(circle, rgba(26,110,142,0.10) 0%, transparent 65%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-20 lg:py-28">

          {/* ── Section header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div>
              <div
                className="inline-flex items-center gap-2 mb-5"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 100, padding: "5px 16px" }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", display: "block", animation: "re-pulse 2s infinite" }} />
                <span className="f-sans" style={{ fontSize: 10, color: "#D4AF37", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Results · Proven Track Record
                </span>
              </div>

              <h2
                className="f-display"
                style={{ fontSize: "clamp(36px,4.2vw,62px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.01em", margin: 0 }}
              >
                Results That
                <br />
                <em style={{ color: "#D4AF37", fontStyle: "italic" }}>Speak Volumes</em>
              </h2>

              <p
                className="f-sans"
                style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "#94A3B8", lineHeight: 1.72, maxWidth: 420, marginTop: 14, marginBottom: 0 }}
              >
                Over a decade of high-value deals, above-market returns and
                lasting client relationships across the UAE's most prestigious
                addresses.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="#listings"
                className="f-sans inline-flex items-center gap-2 no-underline transition-all duration-150 hover:-translate-y-0.5"
                style={{ background: "#D4AF37", color: "#0C0C0F", fontSize: 13, fontWeight: 700, padding: "13px 28px", borderRadius: 10, boxShadow: "0 0 28px rgba(212,175,55,0.28)", letterSpacing: "0.01em" }}
              >
                View All Listings
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="#0C0C0F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="#contact"
                className="f-sans inline-flex items-center gap-2 no-underline"
                style={{ background: "transparent", color: "#E2E8F0", fontSize: 13, fontWeight: 600, padding: "12px 24px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", letterSpacing: "0.01em" }}
              >
                Book a Call ↗
              </Link>
            </div>
          </div>

          {/* ══ MAIN TWO-COLUMN GRID ══ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mb-12 items-start">

            {/* ━━━ LEFT — 4 stat cards (2×2 grid) ━━━ */}
            <div className="grid grid-cols-2 gap-4 content-start">
              {STATS.map(({ value, label, sub, accent, cls, icon }) => (
                <div key={label} className={`stat-card ${cls}`}>
                  {/* Icon */}
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: `${accent}14`, border: `1px solid ${accent}26`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: accent, marginBottom: 16,
                    }}
                  >
                    {icon}
                  </div>

                  {/* Value */}
                  <p
                    className="f-sans"
                    style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: ".14em", fontWeight: 600, marginBottom: 8 }}
                  >
                    {label}
                  </p>
                  <p
                    className="f-display"
                    style={{ fontSize: "clamp(26px,2.4vw,38px)", fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: 8 }}
                  >
                    {value}
                  </p>

                  {/* Sub */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 10 }} />
                  <p className="f-sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.32)" }}>{sub}</p>

                  {/* Live dot */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: accent, display: "block", animation: "re-pulse 2.5s infinite" }} />
                    <span className="f-sans" style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>Live · Updated daily</span>
                  </div>
                </div>
              ))}

              {/* Extra credibility strip below stats */}
              <div
                className="col-span-2"
                style={{ background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.14)", borderRadius: 14, padding: "16px 20px" }}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4AF37", animation: "re-pulse 2s infinite", flexShrink: 0 }} />
                  <span className="f-sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
                    Trusted by investors from <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>UAE, UK, Singapore, India & Europe</span> — with full RERA compliance and verified transaction records.
                  </span>
                </div>
              </div>
            </div>

            {/* ━━━ RIGHT — Testimonial slider ━━━ */}
            <div style={{ minHeight: 460 }}>
              <TestimonialSlider />
            </div>
          </div>

          {/* ── Trust bar ── */}
          <div
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 28px" }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex flex-wrap items-center gap-6 justify-center sm:justify-start">
              {TRUST_ITEMS.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="trust-item-icon">{icon}</div>
                  <span className="f-sans" style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", animation: "re-pulse 2s infinite" }} />
              <span className="f-sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>Based in UAE · Available Worldwide</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}