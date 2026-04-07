'use client';

import Link from 'next/link';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');`;

const PHONE = '+971505514612';
const DEV_SITE = 'https://mohamedalhamdhy.vercel.app';

function PhoneIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.18 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6z"/>
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.553 4.1 1.523 5.824L.044 23.111a.5.5 0 00.611.639l5.463-1.432A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.98-1.356l-.357-.213-3.704.971.987-3.607-.232-.373A9.818 9.818 0 1112 21.818z"/>
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

export default function ClientFooter() {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{FONTS}</style>

      <footer className="shrink-0 border-t border-white/[0.06] bg-[#080B11]">

        {/* ── Divider accent line ── */}
        <div className="h-[1px] bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/5 to-transparent" />

        {/* ── Main footer row ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">

          {/*
            3-column grid:
              Mobile:  stacked, center-aligned
              sm+:     single row, left / center / right
          */}
          <div className="flex flex-col sm:flex-row items-center sm:items-center
            justify-between gap-4 sm:gap-6">

            {/* ── LEFT — copyright ── */}
            <p className="font-['Outfit'] text-[11px] text-white/25 whitespace-nowrap order-3 sm:order-1">
              © {year} Hesham Estate. All rights reserved.
            </p>

            {/* ── CENTER — brand link ── */}
            <Link
              href="/"
              className="font-['Cormorant_Garamond'] text-[17px] font-bold text-white
                no-underline hover:text-[#D4AF37] transition-colors duration-100
                whitespace-nowrap order-1 sm:order-2"
            >
              Hesham{' '}
              <em className="text-[#D4AF37] not-italic">Estate</em>
            </Link>

            {/* ── RIGHT — dev credit + contacts ── */}
            <div className="flex flex-col items-center sm:items-end gap-2 order-2 sm:order-3">

              {/* Dev credit */}
              <div className="flex items-center gap-1.5">
                <span className="font-['Outfit'] text-[10px] text-white/20">
                  Developed by
                </span>
                <a
                  href={DEV_SITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-['Outfit'] text-[10px]
                    font-semibold text-[#D4AF37]/70 no-underline
                    hover:text-[#D4AF37] transition-colors duration-100"
                >
                  Mohamed Al Hamdhy
                  <ExternalIcon />
                </a>
              </div>

              {/* Contact links */}
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center gap-1.5 font-['Outfit'] text-[10px]
                    font-medium text-white/30 no-underline
                    hover:text-[#D4AF37] transition-colors duration-100"
                >
                  <PhoneIcon />
                  {PHONE}
                </a>

                <span className="text-white/10 text-[10px]">·</span>

                <a
                  href={`https://wa.me/${PHONE.replace(/\+/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-['Outfit'] text-[10px]
                    font-medium text-white/30 no-underline
                    hover:text-[#34D399] transition-colors duration-100"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom strip ── */}
        <div className="border-t border-white/[0.04] px-4 sm:px-6 py-2.5
          flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            <span className="font-['Outfit'] text-[9px] text-white/15 tracking-[0.1em] uppercase">
              Dubai · United Arab Emirates · Available Worldwide
            </span>
          </div>
        </div>

      </footer>
    </>
  );
}