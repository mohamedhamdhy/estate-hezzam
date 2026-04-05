"use client";

import Image from "next/image";
import Link from "next/link";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes re-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(1.4); }
  }

  .btn-gold {
    display: inline-flex; align-items: center; gap: 8px;
    background: #D4AF37; color: #0C0C0F;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
    padding: 13px 28px; border-radius: 10px; border: none;
    cursor: pointer; text-decoration: none;
    box-shadow: 0 0 28px rgba(212,175,55,0.28);
    letter-spacing: 0.01em;
    transition: transform 0.15s, box-shadow 0.15s;
    white-space: nowrap;
  }
  .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(212,175,55,0.42); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: #E2E8F0;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    padding: 12px 24px; border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    cursor: pointer; text-decoration: none;
    transition: border-color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .btn-ghost:hover { border-color: rgba(212,175,55,0.32); background: rgba(212,175,55,0.04); }

  /* Social hover */
  .social-link { transition: border-color 0.2s, background 0.2s, color 0.2s; }
  .social-link:hover { border-color: rgba(212,175,55,0.32) !important; background: rgba(212,175,55,0.06) !important; color: #D4AF37 !important; }
  .social-link:hover .social-svg { color: #D4AF37; }

  .trust-item-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(212,175,55,0.10); border: 1px solid rgba(212,175,55,0.2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  /* Profile card hover */
  .profile-img-wrap img { transition: transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94); }
  .profile-img-wrap:hover img { transform: scale(1.04); }
`;

/* ─── Floating mockup chip ─── */
function FloatChip({
  value, label, color, style,
}: { value: string; label: string; color: string; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        background: "rgba(13,17,24,0.94)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        padding: "12px 16px",
        backdropFilter: "blur(14px)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
        zIndex: 20,
        ...style,
      }}
    >
      <p className="f-display" style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1, marginBottom: 3 }}>{value}</p>
      <p className="f-sans" style={{ fontSize: 9, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: ".1em" }}>{label}</p>
    </div>
  );
}

/* ─── Social button ─── */
function SocialLink({
  href, label, icon,
}: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
      style={{
        display: "inline-flex", alignItems: "center", gap: 9,
        padding: "10px 16px", borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 500,
        textDecoration: "none", whiteSpace: "nowrap",
      }}
    >
      <span className="social-svg" style={{ display: "flex", alignItems: "center", color: "inherit" }}>{icon}</span>
      {label}
    </a>
  );
}

/* ─── Skill pill ─── */
function Skill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="f-sans"
      style={{
        fontSize: 10, fontWeight: 600, padding: "6px 14px", borderRadius: 100,
        background: `${color}12`, color, border: `1px solid ${color}22`,
        letterSpacing: ".04em",
      }}
    >
      {label}
    </span>
  );
}

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

const SKILLS = [
  { label: "Luxury Residential", color: "#D4AF37" },
  { label: "Off-Plan Sales",     color: "#60A5FA" },
  { label: "Commercial Leasing", color: "#34D399" },
  { label: "Market Analysis",    color: "#2DD4BF" },
];

export default function About() {
  return (
    <>
      <style>{G}</style>

      <section
        style={{ background: "#0C0C0F", position: "relative", overflow: "hidden" }}
      >
         <div className="absolute pointer-events-none rounded-full"
          style={{ width: 640, height: 640, top: 100, right: -50, background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)" }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 520, height: 520, bottom: 100, left: -50, background: "radial-gradient(circle, rgba(26,110,142,0.10) 0%, transparent 65%)" }} />

        {/* ── Content ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-20 lg:py-28">

          {/* ── Section header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              {/* Eyebrow pill */}
              <div
                className="inline-flex items-center gap-2 mb-5"
                style={{
                  background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)",
                  borderRadius: 100, padding: "5px 16px",
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", display: "block", animation: "re-pulse 2s infinite" }} />
                <span className="f-sans" style={{ fontSize: 10, color: "#D4AF37", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  About · 12 Years in Dubai
                </span>
              </div>

              <h2
                className="f-display"
                style={{ fontSize: "clamp(36px,4.2vw,62px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.01em", margin: 0 }}
              >
                The Person Behind
                <br />
                <em style={{ color: "#D4AF37", fontStyle: "italic" }}>Every Deal</em>
              </h2>

              <p
                className="f-sans"
                style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "#94A3B8", lineHeight: 1.72, maxWidth: 420, marginTop: 14, marginBottom: 0 }}
              >
                With over 12 years navigating Dubai's luxury property market, I connect
                discerning clients with properties that transcend the ordinary — with
                precision, discretion, and genuine care.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="#contact" className="btn-gold">
                Work With Me
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="#0C0C0F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/properties" className="btn-ghost">Book a Viewing ↗</Link>
            </div>
          </div>

          {/* ══════════ TWO-COLUMN GRID ══════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 xl:gap-20 items-start mb-16">

            {/* ━━━ LEFT — Profile image + floating mockups ━━━ */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative w-full max-w-[400px]">

                {/* Glow border */}
                <div
                  className="absolute rounded-3xl pointer-events-none"
                  style={{
                    inset: -2,
                    background: "linear-gradient(135deg, rgba(212,175,55,0.22) 0%, rgba(26,110,142,0.12) 100%)",
                    filter: "blur(1px)",
                    zIndex: 1,
                  }}
                />

                {/* Profile image */}
                <div
                  className="profile-img-wrap relative rounded-3xl overflow-hidden border border-white/[.08] shadow-[0_32px_80px_rgba(0,0,0,0.7)]"
                  style={{ aspectRatio: "3/4", zIndex: 2 }}
                >
                  <Image
                    src="/images/profile.jpg"
                    alt="Hesham Al Mansoori — Senior Real Estate Consultant"
                    fill
                    priority
                    sizes="(max-width:1024px) 90vw, 40vw"
                    className="object-cover object-top"
                  />
                  {/* Bottom gradient */}
                  <div
                    style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(12,12,15,0.75) 0%, transparent 55%)",
                    }}
                  />
                  {/* Name tag pinned to bottom */}
                  <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, zIndex: 10 }}>
                    <div
                      style={{
                        background: "rgba(13,17,24,0.88)", backdropFilter: "blur(16px)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
                        padding: "12px 16px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p className="f-display" style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1, marginBottom: 3 }}>Hesham Al Mansoori</p>
                        <p className="f-sans" style={{ fontSize: 10, color: "#D4AF37", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" }}>Senior Consultant · Dubai</p>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Available badge — top left */}
                  <div style={{ position: "absolute", top: 16, left: 16, zIndex: 10, display: "flex", alignItems: "center", gap: 6, background: "rgba(13,17,24,0.85)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 100, padding: "5px 12px" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", animation: "re-pulse 2s infinite" }} />
                    <span className="f-sans" style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", fontWeight: 600, letterSpacing: ".08em" }}>Available for Clients</span>
                  </div>
                </div>

                {/* ── Floating stat: deals closed — top right ── */}
                <FloatChip
                  value="340+"
                  label="Deals Closed"
                  color="#D4AF37"
                  style={{ top: -16, right: -20 }}
                />

                {/* ── Floating stat: experience — left center ── */}
                <FloatChip
                  value="12 Yrs"
                  label="Experience"
                  color="#60A5FA"
                  style={{ top: "42%", left: -20, transform: "translateY(-50%)" }}
                />

                {/* ── Latest sale mini-card — bottom right ── */}
                <div
                  style={{
                    position: "absolute", bottom: -20, right: -20, zIndex: 20,
                    background: "rgba(13,17,24,0.94)", backdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14,
                    padding: "12px 14px", minWidth: 170,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
                  }}
                >
                  <p className="f-sans" style={{ fontSize: 8, color: "rgba(255,255,255,0.32)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8 }}>Latest Sale</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, overflow: "hidden", position: "relative", flexShrink: 0, border: "1px solid rgba(255,255,255,0.08)" }}>
                      <Image src="/images/Property.jpg" alt="Property" fill sizes="36px" className="object-cover" />
                    </div>
                    <div>
                      <p className="f-sans" style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", lineHeight: 1, marginBottom: 2 }}>Marina Heights</p>
                      <p className="f-sans" style={{ fontSize: 9, color: "rgba(255,255,255,0.32)" }}>Dubai Marina</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span className="f-display" style={{ fontSize: 14, fontWeight: 700, color: "#D4AF37" }}>AED 3.8M</span>
                    <span className="f-sans" style={{ fontSize: 8, fontWeight: 700, color: "#34D399", background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.25)", borderRadius: 100, padding: "2px 8px" }}>↑ Sold</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ━━━ RIGHT — Bio, stats, skills, social ━━━ */}
            <div className="flex flex-col gap-8">

              {/* Bio description */}
              <div
                style={{
                  background: "#0D1118", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 18, padding: "24px 26px",
                  borderTop: "2px solid #D4AF37",
                }}
              >
                <p className="f-sans" style={{ fontSize: "clamp(13px,1.05vw,15px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.85, fontWeight: 300 }}>
                  A Dubai-based luxury real estate consultant with a decade-long track record across the
                  UAE's most prestigious addresses. From off-plan investments on Palm Jumeirah to
                  ultra-prime Downtown penthouses — every transaction is handled with the attention to
                  detail your investment deserves.
                </p>
                <p className="f-sans" style={{ fontSize: "clamp(13px,1.05vw,15px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.85, fontWeight: 300, marginTop: 14 }}>
                  My approach is simple: understand what truly matters to you, then deliver it —
                  with full transparency, zero pressure, and a deep network that opens doors
                  most agents never even find.
                </p>
              </div>

              {/* Location + specialisations */}
              <div>

                {/* Specialisations */}
                <p className="f-sans" style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>Specialisations</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SKILLS.map(s => <Skill key={s.label} {...s} />)}
                </div>
              </div>

              {/* Social media */}
              <div>
                <p className="f-sans" style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>Connect</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <SocialLink href="https://instagram.com/" label="Instagram" icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  } />
                  <SocialLink href="https://linkedin.com/" label="LinkedIn" icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                    </svg>
                  } />
                  <SocialLink href="https://facebook.com/" label="Facebook" icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                  } />
                  <SocialLink href="https://tiktok.com/" label="TikTok" icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.75 }}>
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.53V6.85a4.85 4.85 0 01-1.01-.16z" />
                    </svg>
                  } />
                </div>
              </div>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link href="#contact" className="btn-gold">
                  Work With Me
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="#0C0C0F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link> 
              </div>
            </div>
          </div>

          {/* ── Trust bar (same as properties page) ── */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "20px 28px",
            }}
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
              <span className="f-sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>Open to new clients · Dubai &amp; worldwide</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}