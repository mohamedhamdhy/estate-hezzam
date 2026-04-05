'use client';

import Image from 'next/image';
import Link from 'next/link';

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  .clink:hover .clink-icon  { background: rgba(212,175,55,.18); border-color: rgba(212,175,55,.4); }
  .clink:hover .clink-arrow { opacity:1; transform:translateX(0); }

  @keyframes re-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.3); }
  }
`;

function ContactLink({
  href,
  icon,
  line1,
  line2,
}: {
  href: string;
  icon: React.ReactNode;
  line1: string;
  line2: string;
}) {
  return (
    <a
      href={href}
      className="clink flex items-center gap-3 px-3 py-2 rounded-xl border border-white/6 hover:border-[#D4AF37]/30 hover:bg-white/4 transition-colors duration-200 no-underline"
    >
      <span className="clink-icon w-8 h-8 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center shrink-0 text-[#D4AF37] transition-all duration-200">
        {icon}
      </span>
      <span className="flex flex-col min-w-0">
        <span className="f-sans text-[9px] font-medium tracking-[.12em] uppercase text-white/35">
          {line1}
        </span>
        <span className="f-sans text-[12px] text-white/80 tracking-wide truncate">
          {line2}
        </span>
      </span>
      <span className="clink-arrow ml-auto text-[#D4AF37] opacity-0 -translate-x-1.5 transition-all duration-200 text-sm">
        →
      </span>
    </a>
  );
}

function MiniBar({ h, active }: { h: number; active?: boolean }) {
  return (
    <div className="flex-1 flex items-end" style={{ height: '100%' }}>
      <div
        className="w-full rounded-t-[3px]"
        style={{
          height: `${h}%`,
          background: active
            ? 'linear-gradient(to top,#D4AF37,#F0D060)'
            : 'rgba(255,255,255,0.1)',
        }}
      />
    </div>
  );
}

export default function Landing() {
  const bars = [
    { h: 32 },
    { h: 48 },
    { h: 38 },
    { h: 62 },
    { h: 54 },
    { h: 78 },
    { h: 68 },
    { h: 88, active: true },
  ];

  return (
    <>
      <style>{G}</style>

      <section
        style={{ background: '#0C0C0F' }}
        className="relative flex flex-col min-h-screen lg:h-screen overflow-x-hidden lg:overflow-hidden"
      >
        <div
          className="absolute pointer-events-none rounded-full -top-32 -left-32"
          style={{
            width: 560,
            height: 560,
            background:
              'radial-gradient(circle, rgba(212,175,55,0.11) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full -bottom-40 -right-20"
          style={{
            width: 620,
            height: 620,
            background:
              'radial-gradient(circle, rgba(26,110,142,0.13) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full top-24 right-40"
          style={{
            width: 280,
            height: 280,
            background:
              'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none rounded-full top-1/2 -left-20"
          style={{
            width: 340,
            height: 340,
            background:
              'radial-gradient(circle, rgba(251,146,60,0.06) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center flex-1 lg:h-full gap-8 lg:gap-10 xl:gap-14 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-10 pt-14 sm:pt-16 lg:pt-0 pb-10 lg:pb-0 lg:py-6">
          <div className="flex-1 min-w-0 flex flex-col items-start">
            <div
              className="inline-flex items-center gap-2 mb-4 lg:mb-3"
              style={{
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: 100,
                padding: '5px 14px',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: '#D4AF37',
                  animation: 're-pulse 2s infinite',
                }}
              />
              <span
                className="f-sans"
                style={{
                  fontSize: 10,
                  color: '#D4AF37',
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Open to Clients · UAE &amp; Worldwide
              </span>
            </div>

            <h1
              className="f-display mb-3 lg:mb-2"
              style={{
                fontSize: 'clamp(28px, 3.6vw, 52px)',
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: '-0.01em',
                color: '#fff',
              }}
            >
              Discover
              <br />
              <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                Extraordinary
              </em>
              <br />
              Properties
            </h1>

            <p
              className="f-sans mb-4 lg:mb-3 max-w-md"
              style={{
                fontSize: 'clamp(13px, 1.1vw, 15px)',
                color: '#94A3B8',
                lineHeight: 1.65,
                fontWeight: 400,
              }}
            >
              Curated luxury real estate across the UAE’s most prestigious
              destinations — from Palm Jumeirah villas to Downtown Dubai
              penthouses and beyond.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4 lg:mb-3">
              {[
                { label: 'Palm Jumeirah', color: 'gold' },
                { label: 'Downtown Dubai', color: 'teal' },
                { label: 'Off-Plan', color: 'gold' },
                { label: 'Villa & Penthouse', color: 'teal' },
                { label: 'Investment ROI', color: 'purple' },
              ].map(({ label, color }) => (
                <span
                  key={label}
                  className="f-sans"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    padding: '4px 11px',
                    borderRadius: 100,
                    ...(color === 'gold'
                      ? {
                          background: 'rgba(212,175,55,0.10)',
                          color: '#D4AF37',
                          border: '1px solid rgba(212,175,55,0.22)',
                        }
                      : color === 'teal'
                        ? {
                            background: 'rgba(0,194,160,0.10)',
                            color: '#34D399',
                            border: '1px solid rgba(0,194,160,0.22)',
                          }
                        : {
                            background: 'rgba(167,139,250,0.10)',
                            color: '#C4B5FD',
                            border: '1px solid rgba(167,139,250,0.22)',
                          }),
                  }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4 lg:mb-3 w-full max-w-sm">
              <div className="h-px w-8" style={{ background: '#D4AF37' }} />
              <span
                className="f-sans"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)',
                }}
              >
                Trusted Since 2012
              </span>
              <div
                className="h-px flex-1"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              />
            </div>

            <div className="flex flex-col gap-1 mb-4 lg:mb-3 w-full max-w-sm">
              <ContactLink
                href="tel:+971556027424"
                line1="Call Directly"
                line2="+971 55 602 7424"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6z" />
                  </svg>
                }
              />
              <ContactLink
                href="https://wa.me/971556027424"
                line1="WhatsApp"
                line2="Chat on WhatsApp"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.1 1.523 5.824L.044 23.111a.5.5 0 00.611.639l5.463-1.432A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.98-1.356l-.357-.213-3.704.971.987-3.607-.232-.373A9.818 9.818 0 1112 21.818z" />
                  </svg>
                }
              />
              <ContactLink
                href="mailto:hesham@gmail.com"
                line1="Email"
                line2="hesham@gmail.com"
                icon={
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-4 lg:mb-3">
              <Link
                href="#listings"
                className="f-sans inline-flex items-center gap-2 transition-all duration-150 hover:-translate-y-0.5 no-underline"
                style={{
                  background: '#D4AF37',
                  color: '#0C0C0F',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '11px 24px',
                  borderRadius: 10,
                  boxShadow: '0 0 24px rgba(212,175,55,0.35)',
                  letterSpacing: '0.01em',
                }}
              >
                View Listings <span style={{ fontSize: 14 }}>→</span>
              </Link>
              <Link
                href="#contact"
                className="f-sans inline-flex items-center gap-2 transition-all duration-150 no-underline"
                style={{
                  background: 'transparent',
                  color: '#E2E8F0',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '10px 22px',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.15)',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    'rgba(212,175,55,0.5)';
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    '#E2E8F0';
                }}
              >
                Book Consultation <span style={{ fontSize: 13 }}>↗</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {[
                { n: '50+', l: 'Deals Closed' },
                { n: 'AED 750M', l: 'Total Volume' },
                { n: '98%', l: 'Satisfaction' },
              ].map(({ n, l }, i) => (
                <div
                  key={l}
                  className={`flex flex-col gap-0.5 ${i > 0 ? 'pl-4 ml-4' : ''}`}
                  style={
                    i > 0
                      ? { borderLeft: '1px solid rgba(255,255,255,0.08)' }
                      : {}
                  }
                >
                  <span
                    className="f-display"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#fff',
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </span>
                  <span
                    className="f-sans"
                    style={{
                      fontSize: 8,
                      color: 'rgba(255,255,255,0.30)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0 flex justify-center items-center w-full lg:w-auto">
            <div className="relative w-full max-w-130">
              <div
                className="absolute pointer-events-none"
                style={{
                  inset: -20,
                  borderRadius: 24,
                  background:
                    'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.11) 0%, transparent 70%)',
                }}
              />

              <div
                className="absolute z-20 hidden sm:block"
                style={{
                  top: -12,
                  right: -12,
                  background: '#0D1118',
                  border: '1px solid rgba(212,175,55,0.30)',
                  borderRadius: 10,
                  padding: '7px 11px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  className="f-sans"
                  style={{
                    fontSize: 7,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Appreciation
                </div>
                <div
                  className="f-display"
                  style={{ fontSize: 16, fontWeight: 800, color: '#D4AF37' }}
                >
                  +18.4%
                </div>
                <div
                  className="f-sans"
                  style={{ fontSize: 7, color: '#D4AF37', opacity: 0.7 }}
                >
                  YoY · 2024
                </div>
              </div>

              <div
                className="absolute z-20 hidden sm:flex items-center gap-2"
                style={{
                  bottom: -12,
                  left: -12,
                  background: '#0D1118',
                  border: '1px solid rgba(52,211,153,0.3)',
                  borderRadius: 10,
                  padding: '7px 11px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: 'rgba(52,211,153,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg viewBox="0 0 16 16" fill="none" width={12} height={12}>
                    <path
                      d="M2 11l4-4 3 3 5-6"
                      stroke="#34D399"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <div
                    className="f-sans"
                    style={{ fontSize: 11, fontWeight: 700, color: '#34D399' }}
                  >
                    ROI ~7.2% / yr
                  </div>
                  <div
                    className="f-sans"
                    style={{ fontSize: 7, color: '#64748B' }}
                  >
                    Rental yield
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#0D1118',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  boxShadow:
                    '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.08)',
                }}
              >
                <div
                  style={{
                    background: '#0A0E1A',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
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
                      padding: '3px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
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
                      hesham.com/listings
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    position: 'relative',
                    height: 160,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    src="/images/Property.jpg"
                    alt="Luxury Dubai property"
                    fill
                    priority
                    sizes="520px"
                    className="object-cover object-center"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to bottom, rgba(12,12,15,0.25) 0%, transparent 40%, rgba(12,12,15,0.88) 100%)',
                    }}
                  />
                  <div style={{ position: 'absolute', top: 10, left: 12 }}>
                    <span
                      className="f-sans"
                      style={{
                        fontSize: 7,
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#D4AF37',
                        display: 'block',
                        marginBottom: 2,
                      }}
                    >
                      Featured Listing
                    </span>
                    <h2
                      className="f-display"
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: '#fff',
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      Palm Jumeirah Villa
                    </h2>
                    <p
                      className="f-sans"
                      style={{
                        fontSize: 9,
                        color: 'rgba(255,255,255,0.45)',
                        marginTop: 2,
                      }}
                    >
                      📍 Palm Jumeirah, Dubai
                    </p>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 100,
                      padding: '3px 8px',
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
                      style={{
                        fontSize: 8,
                        fontWeight: 600,
                        color: 'rgba(255,255,255,0.65)',
                      }}
                    >
                      4 New Today
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div
                        className="f-sans"
                        style={{
                          fontSize: 7,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          marginBottom: 2,
                        }}
                      >
                        Asking Price
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span
                          className="f-display"
                          style={{
                            fontSize: 18,
                            fontWeight: 600,
                            color: '#fff',
                            lineHeight: 1,
                          }}
                        >
                          AED 8,500,000
                        </span>
                        <span
                          className="f-sans"
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            color: '#34D399',
                            background: 'rgba(52,211,153,0.12)',
                            padding: '2px 5px',
                            borderRadius: 4,
                          }}
                        >
                          ↑ 12.4%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          width="9"
                          height="9"
                          viewBox="0 0 24 24"
                          fill="#D4AF37"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                      <span
                        className="f-sans"
                        style={{
                          fontSize: 8,
                          color: 'rgba(255,255,255,0.4)',
                          marginLeft: 2,
                        }}
                      >
                        5.0
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[
                      { icon: '🛏', label: '6 Beds' },
                      { icon: '🚿', label: '7 Baths' },
                      { icon: '📐', label: '8,200 sqft' },
                      { icon: '🏊', label: 'Pool' },
                    ].map(({ icon, label }) => (
                      <span
                        key={label}
                        className="f-sans"
                        style={{
                          fontSize: 9,
                          color: 'rgba(255,255,255,0.50)',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 7,
                          padding: '3px 7px',
                        }}
                      >
                        {icon} {label}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 8,
                      padding: '8px 10px',
                    }}
                  >
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: 6 }}
                    >
                      <span
                        className="f-sans"
                        style={{
                          fontSize: 7,
                          color: '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                        }}
                      >
                        Market Trend
                      </span>
                      <span
                        className="f-sans"
                        style={{
                          fontSize: 8,
                          color: '#34D399',
                          fontWeight: 600,
                        }}
                      >
                        ↑ Uptrend
                      </span>
                    </div>
                    <div
                      className="flex items-end gap-1"
                      style={{ height: 30 }}
                    >
                      {bars.map(({ h, active }, i) => (
                        <MiniBar key={i} h={h} active={active} />
                      ))}
                    </div>
                    <div
                      className="flex justify-between"
                      style={{ marginTop: 3 }}
                    >
                      {[
                        'Jan',
                        'Feb',
                        'Mar',
                        'Apr',
                        'May',
                        'Jun',
                        'Jul',
                        'Aug',
                      ].map((m) => (
                        <span
                          key={m}
                          className="f-sans"
                          style={{
                            fontSize: 6,
                            color: 'rgba(255,255,255,0.20)',
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="lg:hidden relative z-10 flex items-center justify-center gap-2 pb-6"
          style={{ fontSize: 11, color: '#475569' }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#D4AF37',
            }}
          />
          <span className="f-sans">
            Based in{' '}
            <span style={{ color: '#D4AF37' }}>United Arab Emirates</span> ·
            Luxury Real Estate · Available Worldwide
          </span>
        </div>
      </section>
    </>
  );
}
