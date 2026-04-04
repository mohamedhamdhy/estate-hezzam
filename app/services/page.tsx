'use client';

import Link from 'next/link';

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes re-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(1.4); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes imgZoom {
    from { transform: scale(1); }
    to   { transform: scale(1.07); }
  }

  .prop-card {
    background: #0D1118;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(0.34,1.3,0.64,1), box-shadow 0.35s, border-color 0.35s;
    animation: fadeUp 0.55s ease both;
  }
  .prop-card:hover {
    transform: translateY(-7px);
    box-shadow: 0 28px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,55,0.18);
    border-color: rgba(212,175,55,0.22);
  }
  .prop-card:hover .card-img-inner {
    transform: scale(1.07);
  }
  .card-img-inner {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94);
    display: block;
  }

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

  .metric-divider {
    width: 1px;
    background: rgba(255,255,255,0.06);
    align-self: stretch;
  }

  .trust-item-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(212,175,55,0.10);
    border: 1px solid rgba(212,175,55,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type BadgeVariant = 'exclusive' | 'available' | 'offplan';

interface Metric {
  label: string;
  value: string;
  sub: string;
  color: 'green' | 'gold' | 'blue';
}

interface Property {
  image: string;
  alt: string;
  badge: string;
  badgeVariant: BadgeVariant;
  roi: string;
  name: string;
  location: string;
  price: string;
  description: string;
  metrics: [Metric, Metric, Metric];
  delay: number;
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PROPERTIES: Property[] = [
  {
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=85',
    alt: 'Palm Jumeirah luxury villa',
    badge: 'Exclusive',
    badgeVariant: 'exclusive',
    roi: 'ROI 9.2%',
    name: 'Palm Signature Villa',
    location: 'Palm Jumeirah, Dubai',
    price: 'AED 9,200,000',
    description:
      'A palatial waterfront estate with 6 bedrooms, private beach, and infinity pool. Trophy asset delivering exceptional rental demand and above-market yields year-round.',
    metrics: [
      { label: 'Annual ROI', value: '9.2%', sub: '↑ above avg', color: 'green' },
      { label: 'Cap Rate',   value: '6.8%', sub: 'Net yield',   color: 'gold'  },
      { label: 'Apprec.',   value: '+24%', sub: 'Since 2023',  color: 'blue'  },
    ],
    delay: 0,
  },
  {
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=85',
    alt: 'Downtown Dubai penthouse view',
    badge: 'Available',
    badgeVariant: 'available',
    roi: 'ROI 10.4%',
    name: 'Burj View Sky Penthouse',
    location: 'Downtown Dubai, UAE',
    price: 'AED 5,100,000',
    description:
      'Sky-high duplex penthouse with floor-to-ceiling glass and direct Burj Khalifa views. Fully furnished with concierge services and premium short-term rental income potential.',
    metrics: [
      { label: 'Annual ROI', value: '10.4%', sub: '↑ above avg', color: 'green' },
      { label: 'Cap Rate',   value: '8.1%',  sub: 'Net yield',   color: 'gold'  },
      { label: 'Apprec.',   value: '+31%',  sub: 'Since 2023',  color: 'blue'  },
    ],
    delay: 110,
  },
  {
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=85',
    alt: 'Dubai Marina apartment skyline',
    badge: 'Off-Plan',
    badgeVariant: 'offplan',
    roi: 'ROI 8.4%',
    name: 'Marina Skyline Residences',
    location: 'Dubai Marina, UAE',
    price: 'AED 3,100,000',
    description:
      'Sleek 3-bedroom Emaar-developed apartment with panoramic marina and sea views. World-class amenities and consistently high occupancy from expat professionals and tourists.',
    metrics: [
      { label: 'Annual ROI', value: '8.4%', sub: '↑ above avg', color: 'green' },
      { label: 'Cap Rate',   value: '6.2%', sub: 'Net yield',   color: 'gold'  },
      { label: 'Apprec.',   value: '+19%', sub: 'Since 2023',  color: 'blue'  },
    ],
    delay: 220,
  },
];

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
      </svg>
    ),
    text: 'Verified Listings',
  },
  {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
      </svg>
    ),
    text: 'Avg. 18 Days to Close',
  },
  {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    text: 'RERA Licensed',
  },
  {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    text: 'GCC & International Buyers',
  },
];

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */

/** Status badge on the card image */
function StatusBadge({ label, variant }: { label: string; variant: BadgeVariant }) {
  const styles: Record<BadgeVariant, React.CSSProperties> = {
    exclusive: {
      background: 'rgba(212,175,55,0.18)',
      color: '#D4AF37',
      border: '1px solid rgba(212,175,55,0.32)',
    },
    available: {
      background: 'rgba(52,211,153,0.18)',
      color: '#34D399',
      border: '1px solid rgba(52,211,153,0.32)',
    },
    offplan: {
      background: 'rgba(96,165,250,0.18)',
      color: '#60A5FA',
      border: '1px solid rgba(96,165,250,0.32)',
    },
  };

  return (
    <div
      className="f-sans"
      style={{
        position: 'absolute',
        top: 14,
        right: 14,
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        padding: '4px 11px',
        borderRadius: 100,
        ...styles[variant],
      }}
    >
      {label}
    </div>
  );
}

/** ROI pill overlaid bottom-left on the image */
function RoiPill({ roi }: { roi: string }) {
  return (
    <div
      className="f-sans"
      style={{
        position: 'absolute',
        bottom: 14,
        left: 14,
        fontSize: 11,
        fontWeight: 700,
        color: '#0C0C0F',
        background: '#D4AF37',
        borderRadius: 100,
        padding: '4px 13px',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          display: 'block',
        }}
      />
      {roi}
    </div>
  );
}

/** Single metric cell */
function MetricCell({ metric, first }: { metric: Metric; first?: boolean }) {
  const colorMap: Record<Metric['color'], string> = {
    green: '#34D399',
    gold:  '#D4AF37',
    blue:  '#60A5FA',
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        paddingLeft: first ? 0 : 14,
        paddingRight: first ? 14 : 0,
      }}
    >
      <span
        className="f-sans"
        style={{
          fontSize: 8,
          color: 'rgba(255,255,255,0.25)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 600,
        }}
      >
        {metric.label}
      </span>
      <span
        className="f-display"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: colorMap[metric.color],
          lineHeight: 1,
        }}
      >
        {metric.value}
      </span>
      <span
        className="f-sans"
        style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)' }}
      >
        {metric.sub}
      </span>
    </div>
  );
}

/** Full property card */
function PropertyCard({ property }: { property: Property }) {
  const { image, alt, badge, badgeVariant, roi, name, location, price, description, metrics, delay } = property;

  return (
    <div
      className="prop-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* ── Image ── */}
      <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="card-img-inner" src={image} alt={alt} />
        {/* gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, transparent 42%, rgba(13,17,24,0.88) 100%)',
          }}
        />
        <StatusBadge label={badge} variant={badgeVariant} />
        <RoiPill roi={roi} />
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '22px 22px 20px' }}>
        {/* name + price */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h3
            className="f-display"
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            {name}
          </h3>
          <div style={{ flexShrink: 0, textAlign: 'right' }}>
            <p
              className="f-display"
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#D4AF37',
                margin: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {price}
            </p>
            <span
              className="f-sans"
              style={{
                display: 'block',
                fontSize: 8,
                color: 'rgba(255,255,255,0.25)',
                marginTop: 2,
              }}
            >
              Asking Price
            </span>
          </div>
        </div>

        {/* location */}
        <div
          className="f-sans"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 14,
          }}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="rgba(212,175,55,0.55)"
            style={{ flexShrink: 0 }}
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          {location}
        </div>

        {/* description */}
        <p
          className="f-sans"
          style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.48)',
            lineHeight: 1.7,
            marginBottom: 18,
            margin: '0 0 18px',
          }}
        >
          {description}
        </p>

        {/* ── Metrics strip ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {metrics.map((m, i) => (
            <div key={m.label} style={{ display: 'contents' }}>
              {i > 0 && <div className="metric-divider" />}
              <MetricCell metric={m} first={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function Properties() {
  return (
    <>
      <style>{G}</style>

      <section
        style={{ background: '#0C0C0F', position: 'relative', overflow: 'hidden' }}
      >
        {/* ── Ambient orbs ── */}
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 640,
            height: 640,
            top: -100,
            right: -140,
            background:
              'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 520,
            height: 520,
            bottom: -80,
            left: -110,
            background:
              'radial-gradient(circle, rgba(26,110,142,0.10) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 280,
            height: 280,
            top: '45%',
            left: '42%',
            background:
              'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 65%)',
          }}
        />

        {/* ── Subtle grid overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />

        {/* ── Content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-20 lg:py-28">

          {/* ── Section Header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            {/* Left: headline */}
            <div>
              {/* Eyebrow pill */}
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
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Featured Properties · Dubai 2026
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
                Curated For
                <br />
                <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                  Discerning Investors
                </em>
              </h2>

              <p
                className="f-sans"
                style={{
                  fontSize: 'clamp(13px, 1.1vw, 15px)',
                  color: '#94A3B8',
                  lineHeight: 1.72,
                  maxWidth: 420,
                  marginTop: 14,
                  marginBottom: 0,
                }}
              >
                Hand-picked residences across Dubai's most coveted addresses — each
                selected for maximum capital appreciation and above-market rental yield
                potential.
              </p>
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/properties" className="btn-gold">
                View All Properties
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11"
                    stroke="#0C0C0F"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Property Grid — 3 columns ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {PROPERTIES.map((property) => (
              <PropertyCard key={property.name} property={property} />
            ))}
          </div>

          {/* ── Bottom CTA Row ── */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ marginBottom: 56 }}
          >
            <Link href="/properties" className="btn-gold">
              View All Properties
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11"
                  stroke="#0C0C0F"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="#contact" className="btn-ghost">
              Book a Private Viewing ↗
            </Link>
          </div>

          {/* ── Trust Bar ── */}
          <div
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '20px 28px',
            }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            {/* Trust items */}
            <div className="flex flex-wrap items-center gap-6 justify-center sm:justify-start">
              {TRUST_ITEMS.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="trust-item-icon">{icon}</div>
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

            {/* Live badge */}
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
                style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}
              >
                Live listings · Updated daily
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}