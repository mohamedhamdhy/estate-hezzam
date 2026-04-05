'use client';

import Link from 'next/link';

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes re-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(1.4); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .res-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .res-card:hover {
    border-color: rgba(212,175,55,0.25);
    box-shadow: 0 8px 40px rgba(212,175,55,0.07);
  }
  .prop-card {
    background: #0D1118;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    overflow: hidden;
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .prop-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }
  .ticker-wrap { overflow: hidden; }
  .ticker-inner {
    display: flex;
    gap: 0;
    width: max-content;
    animation: ticker 28s linear infinite;
  }
`;

function Sparkline({ up }: { up: boolean }) {
  const pts = up
    ? '0,28 10,22 20,24 30,15 40,18 50,8 60,11 70,4'
    : '0,4  10,10 20,7  30,16 40,12 50,22 60,18 70,26';
  return (
    <svg viewBox="0 0 70 32" width={70} height={32} fill="none">
      <polyline
        points={pts}
        stroke={up ? '#D4AF37' : '#F87171'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
      <circle
        cx={up ? 70 : 70}
        cy={up ? 4 : 26}
        r={2.5}
        fill={up ? '#D4AF37' : '#F87171'}
      />
    </svg>
  );
}

function PropCard({
  emoji,
  name,
  loc,
  price,
  badge,
  badgeColor,
  roi,
}: {
  emoji: string;
  name: string;
  loc: string;
  price: string;
  badge: string;
  badgeColor: string;
  roi: string;
}) {
  return (
    <div className="prop-card">
      <div
        className="relative flex items-end"
        style={{
          height: 90,
          background: `linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(26,110,142,0.15) 100%)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            opacity: 0.35,
          }}
        >
          {emoji}
        </div>
        <div
          className="f-sans absolute top-2 right-2"
          style={{
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '2px 7px',
            borderRadius: 100,
            background:
              badgeColor === 'gold'
                ? 'rgba(212,175,55,0.2)'
                : 'rgba(52,211,153,0.2)',
            color: badgeColor === 'gold' ? '#D4AF37' : '#34D399',
            border: `1px solid ${badgeColor === 'gold' ? 'rgba(212,175,55,0.35)' : 'rgba(52,211,153,0.35)'}`,
          }}
        >
          {badge}
        </div>
        <div
          className="f-sans absolute bottom-2 left-2"
          style={{
            fontSize: 8,
            fontWeight: 600,
            color: '#0C0C0F',
            background: '#D4AF37',
            borderRadius: 100,
            padding: '2px 7px',
          }}
        >
          {roi}
        </div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <p
          className="f-display"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {name}
        </p>
        <p
          className="f-sans"
          style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}
        >
          📍 {loc}
        </p>
        <div
          className="flex items-center justify-between"
          style={{ marginTop: 6 }}
        >
          <span
            className="f-display"
            style={{ fontSize: 12, fontWeight: 600, color: '#D4AF37' }}
          >
            {price}
          </span>
          <span
            className="f-sans"
            style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)' }}
          >
            AED
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  value,
  label,
  sub,
  up,
  delay,
}: {
  value: string;
  label: string;
  sub: string;
  up: boolean;
  delay: number;
}) {
  return (
    <div
      className="res-card flex flex-col gap-3 p-5"
      style={{
        animation: `countUp 0.5s ease both`,
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className="f-sans"
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 4,
            }}
          >
            {label}
          </p>
          <p
            className="f-display"
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
            }}
          >
            {value}
          </p>
          <p
            className="f-sans"
            style={{
              fontSize: 10,
              color: up ? '#34D399' : '#F87171',
              marginTop: 4,
            }}
          >
            {up ? '↑' : '↓'} {sub}
          </p>
        </div>
        <Sparkline up={up} />
      </div>
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />
      <div className="flex items-center gap-1.5">
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: up ? '#D4AF37' : '#F87171',
            animation: 're-pulse 2.5s infinite',
          }}
        />
        <span
          className="f-sans"
          style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}
        >
          Live · Updated daily
        </span>
      </div>
    </div>
  );
}

function TimelineItem({
  year,
  title,
  val,
  last,
}: {
  year: string;
  title: string;
  val: string;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex flex-col items-center" style={{ minWidth: 40 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#D4AF37',
            border: '2px solid #0C0C0F',
            boxShadow: '0 0 0 2px rgba(212,175,55,0.3)',
            flexShrink: 0,
          }}
        />
        {!last && (
          <div
            style={{
              width: 1,
              flex: 1,
              minHeight: 28,
              background: 'rgba(212,175,55,0.15)',
              marginTop: 4,
            }}
          />
        )}
      </div>
      <div style={{ paddingBottom: last ? 0 : 20 }}>
        <span
          className="f-sans"
          style={{
            fontSize: 9,
            color: '#D4AF37',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {year}
        </span>
        <p
          className="f-sans"
          style={{
            fontSize: 13,
            color: 'rgba(255,255,255,0.85)',
            marginTop: 2,
            fontWeight: 500,
          }}
        >
          {title}
        </p>
        <p
          className="f-display"
          style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 1 }}
        >
          {val}
        </p>
      </div>
    </div>
  );
}

function TickItem({
  label,
  val,
  up,
}: {
  label: string;
  val: string;
  up: boolean;
}) {
  return (
    <div
      className="f-sans inline-flex items-center gap-2 shrink-0"
      style={{
        padding: '0 28px',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
      }}
    >
      <span>{label}</span>
      <span style={{ color: up ? '#34D399' : '#F87171', fontWeight: 600 }}>
        {up ? '↑' : '↓'} {val}
      </span>
    </div>
  );
}

function BarChart() {
  const data = [
    { m: '2019', v: 38 },
    { m: '2020', v: 29 },
    { m: '2021', v: 52 },
    { m: '2022', v: 67 },
    { m: '2023', v: 81 },
    { m: '2024', v: 100 },
  ];
  return (
    <div>
      <div className="flex items-end gap-2" style={{ height: 72 }}>
        {data.map(({ m, v }, i) => (
          <div key={m} className="flex-1 flex flex-col items-center gap-1">
            <div
              style={{
                width: '100%',
                height: `${v}%`,
                borderRadius: '3px 3px 0 0',
                background:
                  i === 5
                    ? 'linear-gradient(to top, #D4AF37, #F0D060)'
                    : `rgba(212,175,55,${0.1 + i * 0.05})`,
                boxShadow: i === 5 ? '0 0 12px rgba(212,175,55,0.4)' : 'none',
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2" style={{ marginTop: 6 }}>
        {data.map(({ m }) => (
          <div
            key={m}
            className="flex-1 text-center f-sans"
            style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)' }}
          >
            {m}
          </div>
        ))}
      </div>
    </div>
  );
}

const tickers = [
  { label: 'Palm Jumeirah · 5BR Villa', val: '12.4%', up: true },
  { label: 'Downtown Dubai · Penthouse', val: '9.8%', up: true },
  { label: 'Dubai Marina · 3BR', val: '7.2%', up: true },
  { label: 'JBR · Beachfront', val: '8.5%', up: true },
  { label: 'Business Bay · Studio', val: '6.1%', up: true },
  { label: 'Emaar Beachfront', val: '11.3%', up: true },
  { label: 'MBR City · Villa', val: '1.2%', up: false },
];

const properties = [
  {
    emoji: '🏝️',
    name: 'Palm Signature Villa',
    loc: 'Palm Jumeirah',
    price: '9,200,000',
    badge: 'SOLD',
    badgeColor: 'gold',
    roi: 'ROI 7.5%',
  },
  {
    emoji: '🏙️',
    name: 'Burj View Sky Penthouse',
    loc: 'Downtown Dubai',
    price: '5,100,000',
    badge: 'SOLD',
    badgeColor: 'gold',
    roi: 'ROI 10.1%',
  },
  {
    emoji: '🌊',
    name: 'Marina Skyline Apartment',
    loc: 'Dubai Marina',
    price: '3,050,000',
    badge: 'SOLD',
    badgeColor: 'gold',
    roi: 'ROI 8.4%',
  },
  {
    emoji: '🏖️',
    name: 'JBR Luxury Beach Suite',
    loc: 'Jumeirah Beach Residence',
    price: '4,800,000',
    badge: 'SOLD',
    badgeColor: 'gold',
    roi: 'ROI 7.0%',
  },
  {
    emoji: '🌆',
    name: 'Business Bay Executive Loft',
    loc: 'Business Bay',
    price: '2,600,000',
    badge: 'SOLD',
    badgeColor: 'gold',
    roi: 'ROI 9.2%',
  },
  {
    emoji: '🏡',
    name: 'Arabian Ranches Family Villa',
    loc: 'Arabian Ranches',
    price: '3,900,000',
    badge: 'SOLD',
    badgeColor: 'gold',
    roi: 'ROI 6.5%',
  },
];

export default function Results() {
  return (
    <>
      <style>{G}</style>

      <section
        style={{ background: '#0C0C0F' }}
        className="relative overflow-hidden"
      >
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 500,
            height: 500,
            top: -60,
            right: -80,
            background:
              'radial-gradient(circle, rgba(212,175,55,0.09) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 420,
            height: 420,
            bottom: 100,
            left: -60,
            background:
              'radial-gradient(circle, rgba(26,110,142,0.10) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 240,
            height: 240,
            top: '40%',
            left: '40%',
            background:
              'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        <div
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.015)',
            padding: '10px 0',
          }}
        >
          <div className="ticker-wrap">
            <div className="ticker-inner">
              {[...tickers, ...tickers].map((t, i) => (
                <TickItem key={i} {...t} />
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div>
              <div
                className="inline-flex items-center gap-2 mb-4"
                style={{
                  background: 'rgba(212,175,55,0.08)',
                  border: '1px solid rgba(212,175,55,0.22)',
                  borderRadius: 100,
                  padding: '5px 14px',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
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
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  Proven Track Record · Since 2012
                </span>
              </div>
              <h2
                className="f-display"
                style={{
                  fontSize: 'clamp(34px, 4vw, 58px)',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                }}
              >
                Results That
                <br />
                <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                  Speak Volumes
                </em>
              </h2>
              <p
                className="f-sans"
                style={{
                  fontSize: 'clamp(13px, 1.1vw, 15px)',
                  color: '#94A3B8',
                  lineHeight: 1.7,
                  maxWidth: 420,
                  marginTop: 12,
                }}
              >
                Over a decade of closing high-value deals, delivering
                above-market returns, and building trust across the UAE's most
                prestigious addresses.
              </p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="#listings"
                className="f-sans inline-flex items-center gap-2 no-underline transition-all duration-150 hover:-translate-y-0.5"
                style={{
                  background: '#D4AF37',
                  color: '#0C0C0F',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '11px 24px',
                  borderRadius: 10,
                  boxShadow: '0 0 24px rgba(212,175,55,0.3)',
                  letterSpacing: '0.01em',
                }}
              >
                View All Listings →
              </Link>
              <Link
                href="#contact"
                className="f-sans inline-flex items-center gap-2 no-underline"
                style={{
                  background: 'transparent',
                  color: '#E2E8F0',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '10px 22px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.12)',
                  letterSpacing: '0.01em',
                }}
              >
                Book a Call ↗
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 mb-6">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  value="750M+"
                  label="Total Volume"
                  sub="38% vs last year"
                  up
                  delay={0}
                />
                <StatCard
                  value="50+"
                  label="Deals Closed"
                  sub="12 deals this year"
                  up
                  delay={80}
                />
                <StatCard
                  value="7.8%"
                  label="Avg. ROI"
                  sub="Above market avg"
                  up
                  delay={160}
                />
                <StatCard
                  value="98%"
                  label="Client Satisfaction"
                  sub="2 disputes resolved"
                  up
                  delay={240}
                />
              </div>

              <div className="res-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p
                      className="f-sans"
                      style={{
                        fontSize: 9,
                        color: 'rgba(255,255,255,0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                      }}
                    >
                      Portfolio Growth
                    </p>
                    <p
                      className="f-display"
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#fff',
                        marginTop: 2,
                      }}
                    >
                      2019 → 2024
                    </p>
                  </div>
                  <div
                    className="f-sans"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#34D399',
                      background: 'rgba(52,211,153,0.12)',
                      border: '1px solid rgba(52,211,153,0.2)',
                      borderRadius: 6,
                      padding: '4px 10px',
                    }}
                  >
                    ↑ 163% Total Growth
                  </div>
                </div>
                <BarChart />
              </div>

              <div className="res-card p-5">
                <p
                  className="f-sans"
                  style={{
                    fontSize: 9,
                    color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: 16,
                  }}
                >
                  Milestone Highlights
                </p>
                <TimelineItem
                  year="2024"
                  title="First deal closed"
                  val="AED 2.4M — JVC Villa"
                />
                <TimelineItem
                  year="2025"
                  title="Crossed AED 100M total volume"
                  val="12 deals · 6 communities"
                />
                <TimelineItem
                  year="2025"
                  title="Record year — post-pandemic surge"
                  val="AED 180M · 14 transactions"
                />
                <TimelineItem
                  year="2026"
                  title="Largest single sale to date"
                  val="AED 28M · Palm Jumeirah"
                  last
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div
                style={{
                  background: '#0D1118',
                  borderRadius: 14,
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  boxShadow:
                    '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.07)',
                }}
              >
                <div
                  style={{
                    background: '#0A0E1A',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex gap-1.5">
                    {['#FF5F57', '#FFBD2E', '#28C840'].map((c) => (
                      <div
                        key={c}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: c,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 5,
                      padding: '3px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: '#34D399',
                      }}
                    />
                    <span
                      className="f-sans"
                      style={{
                        fontSize: 9,
                        color: '#475569',
                        fontFamily: 'monospace',
                      }}
                    >
                      hesham.estate/analytics
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'rgba(212,175,55,0.08)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: 6,
                      padding: '2px 8px',
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: '#D4AF37',
                        display: 'block',
                        animation: 're-pulse 2s infinite',
                      }}
                    />
                    <span
                      className="f-sans"
                      style={{ fontSize: 8, color: '#D4AF37', fontWeight: 600 }}
                    >
                      Live
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { l: 'Active Listings', v: '14', c: '#D4AF37' },
                      { l: 'Under Offer', v: '6', c: '#60A5FA' },
                      { l: 'Closed Q4', v: '8', c: '#34D399' },
                      { l: 'Avg Days', v: '18d', c: '#C4B5FD' },
                    ].map(({ l, v, c }) => (
                      <div
                        key={l}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: 8,
                          padding: '8px 10px',
                        }}
                      >
                        <p
                          className="f-sans"
                          style={{
                            fontSize: 7,
                            color: '#475569',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            marginBottom: 3,
                          }}
                        >
                          {l}
                        </p>
                        <p
                          className="f-display"
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: c,
                            lineHeight: 1,
                          }}
                        >
                          {v}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: 10 }}
                    >
                      <span
                        className="f-sans"
                        style={{
                          fontSize: 8,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        Dubai Deals Heatmap
                      </span>
                      <span
                        className="f-sans"
                        style={{ fontSize: 8, color: '#D4AF37' }}
                      >
                        Live Activity
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12,1fr)',
                        gap: 3,
                      }}
                    >
                      {[0.4, 0.5, 0.6, 0.5, 0.5, 0.6, 0.5, 0.4].map((o, i) => (
                        <div
                          key={i}
                          style={{
                            height: 10,
                            borderRadius: 2,
                            background:
                              o > 0.7
                                ? `rgba(212,175,55,${o})`
                                : o > 0.4
                                  ? `rgba(212,175,55,${o * 0.8})`
                                  : `rgba(255,255,255,${o * 0.15})`,
                          }}
                        />
                      ))}
                    </div>

                    <div
                      className="flex items-center justify-between"
                      style={{ marginTop: 6 }}
                    >
                      {[
                        'Palm Jumeirah',
                        'Downtown Dubai',
                        'Dubai Marina',
                        'JBR',
                      ].map((z) => (
                        <span
                          key={z}
                          className="f-sans"
                          style={{
                            fontSize: 6,
                            color: 'rgba(255,255,255,0.2)',
                          }}
                        >
                          {z}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <div
                      className="flex items-center justify-between pt-1"
                      style={{ marginBottom: 8 }}
                    >
                      <span
                        className="f-sans"
                        style={{
                          fontSize: 8,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        Recent Transactions
                      </span>
                      <span
                        className="f-sans"
                        style={{
                          fontSize: 8,
                          color: '#D4AF37',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        View all →
                      </span>
                    </div>
                    {[
                      {
                        prop: 'Palm Signature Villa',
                        loc: 'Palm Jumeirah',
                        price: 'AED 9.2M',
                        status: 'Closed',
                        up: true,
                      },
                      {
                        prop: 'Burj View Sky Penthouse',
                        loc: 'Downtown Dubai ',
                        price: 'AED 5.1M',
                        status: 'Closed',
                        up: true,
                      },
                      {
                        prop: 'Marina Skyline Apartment',
                        loc: 'Dubai Marina',
                        price: 'AED 3.1M',
                        status: 'Closed',
                        up: true,
                      },
                      {
                        prop: 'JBR Luxury Beach Suite',
                        loc: 'JBR',
                        price: 'AED 4.8M',
                        status: 'Closed',
                        up: true,
                      },
                    ].map(({ prop, loc, price, status, up }) => (
                      <div
                        key={prop}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '5px 0',
                          borderBottom: '1px solid rgba(255,255,255,0.03)',
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: up ? '#D4AF37' : '#60A5FA',
                            flexShrink: 0,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <p
                            className="f-sans"
                            style={{
                              fontSize: 9,
                              color: 'rgba(255,255,255,0.75)',
                              fontWeight: 500,
                            }}
                          >
                            {prop}
                          </p>
                          <p
                            className="f-sans"
                            style={{ fontSize: 7, color: '#475569' }}
                          >
                            {loc}
                          </p>
                        </div>
                        <span
                          className="f-display"
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#fff',
                          }}
                        >
                          {price}
                        </span>
                        <span
                          className="f-sans"
                          style={{
                            fontSize: 7,
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: up
                              ? 'rgba(212,175,55,0.12)'
                              : 'rgba(96,165,250,0.12)',
                            color: up ? '#D4AF37' : '#60A5FA',
                          }}
                        >
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {properties.map((p) => (
                  <PropCard key={p.name} {...p} />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '18px 28px',
            }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 flex-wrap justify-center sm:justify-start">
              {[
                { icon: '🏆', text: 'Top 1% Agent' },
                { icon: '🔐', text: 'Licensed' },
                { icon: '🌍', text: 'GCC & International Buyers' },
                { icon: '⚡', text: 'Avg. 18 Days to Close' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <span
                    className="f-sans"
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.4)',
                      fontWeight: 500,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#D4AF37',
                  animation: 're-pulse 2s infinite',
                }}
              />
              <span
                className="f-sans"
                style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}
              >
                Based in UAE · Available Worldwide
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
