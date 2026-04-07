'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');`;

const NAV_LINKS = [
  { href: '/',           label: 'Home',       icon: HomeIcon       },
  { href: '/properties', label: 'Properties', icon: PropertiesIcon },
];

/* ── Icons ── */
function HomeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  );
}
function PropertiesIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="shrink-0"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2"  y="3"  width="7" height="7" rx="1"/>
      <rect x="15" y="3"  width="7" height="7" rx="1"/>
      <rect x="2"  y="14" width="7" height="7" rx="1"/>
      <rect x="15" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  );
}

export default function ClientNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dateLabel, setDateLabel] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  /* Hydration-safe date — only set on the client */
  useEffect(() => {
    setDateLabel(
      new Date().toLocaleDateString('en-US', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    );
  }, []);

  /* Close on outside click */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* Close on route change */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <style>{FONTS}</style>

      {/* ══════════════════════════════════════
          TOPBAR
      ══════════════════════════════════════ */}
      <header className="h-14 shrink-0 sticky top-0 z-50 flex items-center px-4 sm:px-6 gap-3
        bg-[#080B11] border-b border-white/[0.06]">

        {/* Hamburger — ONLY on mobile */}
        <button
          onClick={() => setOpen(v => !v)}
          className="sm:hidden w-9 h-9 rounded-lg bg-white/[0.05] border border-white/10
            flex items-center justify-center text-white/50
            hover:text-white/90 hover:bg-white/10
            transition-colors duration-100 cursor-pointer shrink-0"
          aria-label="Toggle menu"
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Logo */}
        <Link
          href="/"
          className="font-['Cormorant_Garamond'] text-[17px] sm:text-[19px] font-bold
            text-white flex-1 truncate no-underline
            hover:text-[#D4AF37] transition-colors duration-100"
        >
          Hesham{' '}
          <em className="text-[#D4AF37] not-italic">Estate</em>
        </Link>

        {/* Desktop + tablet inline nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`no-underline font-['Outfit'] text-[13px] font-medium
                  px-3.5 py-1.5 rounded-[9px] border whitespace-nowrap
                  transition-colors duration-100
                  ${active
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/22'
                    : 'text-white/45 border-transparent hover:text-white/85 hover:bg-white/[0.04] hover:border-white/[0.08]'
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Live badge + date */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1
            bg-[#D4AF37]/[0.03] border border-[#D4AF37]/20">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="hidden sm:block font-['Outfit'] text-[9px] text-[#D4AF37]
              font-bold tracking-[0.12em] uppercase">
              Live
            </span>
          </div>
          {/* Render only after client mount to avoid hydration mismatch */}
          {dateLabel && (
            <p className="hidden sm:block font-['Outfit'] text-[10px] text-white/25">
              {dateLabel}
            </p>
          )}
        </div>
      </header>

      {/* ══════════════════════════════════════
          MOBILE DRAWER + BACKDROP
      ══════════════════════════════════════ */}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 sm:hidden bg-black/65 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 bottom-0 z-50 sm:hidden w-60 flex flex-col
          bg-[#0A0C10] border-r border-white/[0.07]
          transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="h-14 shrink-0 flex items-center justify-between px-4
          border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0
              bg-gradient-to-br from-[#D4AF37]/18 to-[#D4AF37]/5
              border border-[#D4AF37]/28">
              <span className="font-['Cormorant_Garamond'] text-[15px] font-bold text-[#D4AF37]">
                H
              </span>
            </div>
            <div>
              <p className="font-['Cormorant_Garamond'] text-[15px] font-bold text-white leading-none">
                Hesham
              </p>
              <p className="font-['Outfit'] text-[8px] text-[#D4AF37] tracking-[0.1em] uppercase">
                Estate
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10
              flex items-center justify-center text-white/40
              hover:text-white/80 hover:bg-white/[0.08]
              transition-colors duration-100 cursor-pointer"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-2.5 py-3 flex flex-col gap-1 overflow-y-auto">
          <p className="font-['Outfit'] text-[8px] text-white/20 uppercase tracking-[0.14em]
            font-semibold px-2 py-1.5">
            Navigation
          </p>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative no-underline flex items-center gap-2.5
                  px-3.5 py-2.5 rounded-xl font-['Outfit'] text-[13px] font-medium
                  border transition-colors duration-100
                  ${active
                    ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/22'
                    : 'text-white/45 border-transparent hover:text-white/80 hover:bg-white/[0.05]'
                  }`}
              >
                {active && (
                  <span className="absolute left-0 top-[20%] bottom-[20%] w-[2px]
                    bg-[#D4AF37] rounded-r-sm" />
                )}
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="px-4 py-3.5 border-t border-white/[0.07] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
          <span className="font-['Outfit'] text-[10px] text-white/22">Dubai · UAE</span>
        </div>
      </div>
    </>
  );
}