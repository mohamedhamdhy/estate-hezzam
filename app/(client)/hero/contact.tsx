"use client";

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes re-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(1.4); }
  }

  .contact-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 20px;
    border-radius: 14px;
    background: #0D1118;
    border: 1px solid rgba(255,255,255,0.08);
    text-decoration: none;
    transition: transform 0.2s cubic-bezier(0.34,1.3,0.64,1),
                border-color 0.2s,
                box-shadow 0.2s,
                background 0.2s;
    cursor: pointer;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .contact-btn::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .contact-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.55), 0 0 0 1px var(--btn-border);
    border-color: var(--btn-border);
    background: var(--btn-bg);
  }
  .contact-btn:hover::before { opacity: 1; }

  .contact-btn .btn-arrow {
    margin-left: auto;
    color: rgba(255,255,255,0.2);
    transition: color 0.2s, transform 0.2s;
    flex-shrink: 0;
  }
  .contact-btn:hover .btn-arrow {
    color: var(--btn-accent);
    transform: translateX(3px);
  }

  .trust-item-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(212,175,55,0.10); border: 1px solid rgba(212,175,55,0.2);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
`;

interface ContactItem {
  href: string;
  label: string;
  handle: string;
  sub: string;
  accent: string;
  border: string;
  bg: string;
  icon: React.ReactNode;
  topBar: string;
}

const ITEMS: ContactItem[] = [
  {
    href: "tel:+971556027424",
    label: "Phone",
    handle: "+971556027424",
    sub: "Call directly, available 9am–10pm GST +4.00",
    accent: "#34D399",
    border: "rgba(52,211,153,0.28)",
    bg: "rgba(52,211,153,0.04)",
    topBar: "linear-gradient(90deg,#34D399,transparent)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
  {
    href: "https://wa.me/+971556027424",
    label: "WhatsApp",
    handle: "+971556027424",
    sub: "Message me on WhatsApp for a quick reply",
    accent: "#25D366",
    border: "rgba(37,211,102,0.28)",
    bg: "rgba(37,211,102,0.04)",
    topBar: "linear-gradient(90deg,#25D366,transparent)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.1 1.523 5.824L.044 23.111a.5.5 0 00.611.639l5.463-1.432A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.98-1.356l-.357-.213-3.704.971.987-3.607-.232-.373A9.818 9.818 0 1112 21.818z"/>
      </svg>
    ),
  },
  {
    href: "mailto:heshamestate@gmail.com",
    label: "Email",
    handle: "heshamestate@gmail.com",
    sub: "Send an email — replied within 24 hours",
    accent: "#D4AF37",
    border: "rgba(212,175,55,0.28)",
    bg: "rgba(212,175,55,0.04)",
    topBar: "linear-gradient(90deg,#D4AF37,transparent)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/askar__hesham/",
    label: "Instagram",
    handle: "@Hesham",
    sub: "Follow for listings, market updates & more",
    accent: "#E1306C",
    border: "rgba(225,48,108,0.28)",
    bg: "rgba(225,48,108,0.04)",
    topBar: "linear-gradient(90deg,#E1306C,transparent)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/heshamaskar/",
    label: "LinkedIn",
    handle: "Hesham",
    sub: "Connect professionally on LinkedIn",
    accent: "#0A66C2",
    border: "rgba(10,102,194,0.35)",
    bg: "rgba(10,102,194,0.06)",
    topBar: "linear-gradient(90deg,#0A66C2,transparent)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/profile.php?id=61574692691300",
    label: "Facebook",
    handle: "Hesham",
    sub: "Find me on Facebook for updates & news",
    accent: "#1877F2",
    border: "rgba(24,119,242,0.35)",
    bg: "rgba(24,119,242,0.06)",
    topBar: "linear-gradient(90deg,#1877F2,transparent)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
      </svg>
    ),
  },
];

const TRUST_ITEMS = [
  {
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
    text: "Licensed",
  },
  {
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
    text: "Verified Specialist",
  },
  {
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
    text: "GCC & International Buyers",
  },
];

/* ─── Single contact button ─── */
function ContactBtn({ item }: { item: ContactItem }) {
  return (
    <a
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="contact-btn"
      style={{
        "--btn-accent": item.accent,
        "--btn-border": item.border,
        "--btn-bg": item.bg,
      } as React.CSSProperties}
    >
      {/* Top accent bar */}
      <style>{`.contact-btn[data-id="${item.label}"]::before { background: ${item.topBar}; }`}</style>

      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${item.accent}14`,
          border: `1px solid ${item.accent}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: item.accent,
        }}
      >
        {item.icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          className="f-sans"
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.28)",
            marginBottom: 3,
          }}
        >
          {item.label}
        </p>
        <p
          className="f-display"
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1,
            marginBottom: 4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.handle}
        </p>
        <p
          className="f-sans"
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.32)",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.sub}
        </p>
      </div>

      {/* Arrow */}
      <div className="btn-arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M17 7H7M17 7v10"/>
        </svg>
      </div>
    </a>
  );
}

export default function Contact() {
  /* split into two columns: first 3 left, last 3 right */
  const leftItems  = ITEMS.slice(0, 3);
  const rightItems = ITEMS.slice(3);

  return (
    <>
      <style>{G}</style>

      <section
        id="contact"
        style={{ background: "#0C0C0F", position: "relative", overflow: "hidden" }}
      >
        {/* ── Orbs ── */}
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 640, height: 640, top: 100, left: -50, background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 65%)" }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width: 520, height: 520, bottom: 100, right: -50, background: "radial-gradient(circle, rgba(26,110,142,0.10) 0%, transparent 65%)" }} />
         

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-20 lg:py-28">

          {/* ── Section header ── */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div>
              {/* Eyebrow pill */}
              <div
                className="inline-flex items-center gap-2 mb-5"
                style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 100, padding: "5px 16px" }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", display: "block", animation: "re-pulse 2s infinite" }} />
                <span className="f-sans" style={{ fontSize: 10, color: "#D4AF37", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Contact · Reach Out Directly
                </span>
              </div>

              <h2
                className="f-display"
                style={{ fontSize: "clamp(36px,4.2vw,62px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.01em", margin: 0 }}
              >
                Let's Start a
                <br />
                <em style={{ color: "#D4AF37", fontStyle: "italic" }}>Conversation</em>
              </h2>

              <p
                className="f-sans"
                style={{ fontSize: "clamp(13px,1.1vw,15px)", color: "#94A3B8", lineHeight: 1.72, maxWidth: 420, marginTop: 14, marginBottom: 0 }}
              >
            No forms, no waiting. Choose the channel that suits you best and reach me directly. I respond to every message personally.
              </p>
            </div>

            {/* Quick stats */}
            <div
              className="flex items-stretch gap-0 shrink-0"
              style={{ background: "#0D1118", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}
            >
              {[
                { n: "< 30m",  l: "Avg. Reply Time", c: "#D4AF37" },
                { n: "6",     l: "Ways to Reach",   c: "#60A5FA" },
                { n: "24/7",  l: "WhatsApp",         c: "#25D366" },
              ].map(({ n, l, c }, i) => (
                <div
                  key={l}
                  style={{
                    padding: "18px 22px",
                    borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <p className="f-display" style={{ fontSize: 22, fontWeight: 700, color: c, lineHeight: 1, marginBottom: 4 }}>{n}</p>
                  <p className="f-sans" style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: ".1em" }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Contact buttons grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              {leftItems.map(item => (
                <ContactBtn key={item.label} item={item} />
              ))}
            </div>
            {/* Right column */}
            <div className="flex flex-col gap-4">
              {rightItems.map(item => (
                <ContactBtn key={item.label} item={item} />
              ))}
            </div>
          </div>

          {/* ── Location strip ── */}
          <div
            style={{
              background: "rgba(212,175,55,0.04)",
              border: "1px solid rgba(212,175,55,0.14)",
              borderRadius: 14,
              padding: "18px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div className="flex items-center gap-10 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="f-sans" style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>Based In</p>
                  <p className="f-sans" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Dubai, United Arab Emirates</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <p className="f-sans" style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>Office Hours</p>
                  <p className="f-sans" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>Mon – Sat, 9:00 AM – 10:00 PM GST</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="f-sans" style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2 }}>Serves</p>
                  <p className="f-sans" style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>UAE, GCC & International Clients</p>
                </div>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 shrink-0">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", display: "block", animation: "re-pulse 2s infinite" }} />
              <span className="f-sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Currently accepting new clients</span>
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
              <span className="f-sans" style={{ fontSize: 10, color: "rgba(255,255,255,0.22)" }}>Live · Responds personally to every message</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}