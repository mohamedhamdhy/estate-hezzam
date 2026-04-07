'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');`;

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Property {
  id: string;
  name: string;
  location: string;
  property_type: string;
  price: number;
  status: string;
  property_image: string | null;
  created_at: string;
}
interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function fmtPrice(n: number) {
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `AED ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n.toLocaleString()}`;
}
function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)    return 'Just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function toMonthInput(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function fromMonthInput(s: string) {
  const [y, m] = s.split('-').map(Number);
  return new Date(y, m - 1, 1);
}
function defaultFrom() {
  const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - 7); return d;
}
function defaultTo() {
  const d = new Date(); d.setDate(1); return d;
}
function buildSlots(from: Date, to: Date) {
  const slots: { label: string; month: number; year: number }[] = [];
  const cur = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(to.getFullYear(), to.getMonth(), 1);
  while (cur <= end) {
    slots.push({ label: MONTHS[cur.getMonth()], month: cur.getMonth(), year: cur.getFullYear() });
    cur.setMonth(cur.getMonth() + 1);
  }
  return slots;
}

/* ─────────────────────────────────────────────
   DATE RANGE PICKER
───────────────────────────────────────────── */
function DateRangePicker({ from, to, onChange }: {
  from: Date; to: Date; onChange: (f: Date, t: Date) => void;
}) {
  const [open,      setOpen]      = useState(false);
  const [draftFrom, setDraftFrom] = useState(toMonthInput(from));
  const [draftTo,   setDraftTo]   = useState(toMonthInput(to));
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const [pos,   setPos]   = useState({ top: 0, right: 0 });

  function openPicker() {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setOpen(true);
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popRef.current && !popRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function apply() {
    const f = fromMonthInput(draftFrom);
    const t = fromMonthInput(draftTo);
    if (f <= t) { onChange(f, t); setOpen(false); }
  }

  const label = `${MONTHS[from.getMonth()]} ${from.getFullYear()} – ${MONTHS[to.getMonth()]} ${to.getFullYear()}`;

  return (
    <>
      <button
        ref={btnRef}
        onClick={openPicker}
        className="inline-flex items-center gap-1.5 font-['Outfit'] text-[9px] font-semibold
          tracking-[0.06em] bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5
          cursor-pointer text-white/50 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]
          transition-colors duration-100 whitespace-nowrap"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        {label}
      </button>

      {open && (
        <div
          ref={popRef}
          className="fixed z-[9999] bg-[#131920] border border-white/10 rounded-xl p-4
            shadow-2xl min-w-[240px]"
          style={{ top: pos.top, right: pos.right }}
        >
          <p className="font-['Outfit'] text-[9px] text-white/30 uppercase tracking-[0.1em] mb-3">
            Date Range
          </p>
          <div className="flex flex-col gap-2 mb-3">
            <div>
              <p className="font-['Outfit'] text-[9px] text-white/30 mb-1">From</p>
              <input type="month" value={draftFrom}
                onChange={e => setDraftFrom(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5
                  text-white/70 font-['Outfit'] text-[11px] outline-none focus:border-[#D4AF37]/40"
              />
            </div>
            <div>
              <p className="font-['Outfit'] text-[9px] text-white/30 mb-1">To</p>
              <input type="month" value={draftTo}
                onChange={e => setDraftTo(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5
                  text-white/70 font-['Outfit'] text-[11px] outline-none focus:border-[#D4AF37]/40"
              />
            </div>
          </div>
          <div className="flex gap-1.5 mb-3">
            {[{ l: '3M', m: 3 }, { l: '6M', m: 6 }, { l: '12M', m: 12 }].map(({ l, m }) => (
              <button key={l}
                onClick={() => {
                  const t = new Date(); t.setDate(1);
                  const f = new Date(t.getFullYear(), t.getMonth() - (m - 1), 1);
                  setDraftFrom(toMonthInput(f)); setDraftTo(toMonthInput(t));
                }}
                className="flex-1 font-['Outfit'] text-[9px] font-semibold py-1 rounded-md
                  bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37]
                  hover:bg-[#D4AF37]/20 cursor-pointer transition-colors duration-100"
              >
                Last {l}
              </button>
            ))}
          </div>
          <button onClick={apply}
            className="w-full bg-[#D4AF37] text-[#0C0C0F] font-['Outfit'] text-[11px]
              font-bold py-2 rounded-lg hover:bg-[#F0D060] cursor-pointer transition-colors duration-100"
          >
            Apply
          </button>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────
   KPI CARD
───────────────────────────────────────────── */
const ACCENT_MAP: Record<string, {
  bar: string; iconBg: string; iconBorder: string; textColor: string;
}> = {
  gold:   { bar: 'from-[#D4AF37]', iconBg: 'bg-[#D4AF37]/10', iconBorder: 'border-[#D4AF37]/20', textColor: 'text-[#D4AF37]' },
  green:  { bar: 'from-[#34D399]', iconBg: 'bg-[#34D399]/10', iconBorder: 'border-[#34D399]/20', textColor: 'text-[#34D399]' },
  blue:   { bar: 'from-[#60A5FA]', iconBg: 'bg-[#60A5FA]/10', iconBorder: 'border-[#60A5FA]/20', textColor: 'text-[#60A5FA]' },
  purple: { bar: 'from-[#C4B5FD]', iconBg: 'bg-[#C4B5FD]/10', iconBorder: 'border-[#C4B5FD]/20', textColor: 'text-[#C4B5FD]' },
  teal:   { bar: 'from-[#2DD4BF]', iconBg: 'bg-[#2DD4BF]/10', iconBorder: 'border-[#2DD4BF]/20', textColor: 'text-[#2DD4BF]' },
};

function KpiCard({ label, value, sub, accent, icon, change }: {
  label: string; value: string; sub: string; accent: string;
  icon: React.ReactNode; change?: { val: string; up: boolean };
}) {
  const a = ACCENT_MAP[accent] ?? ACCENT_MAP.gold;
  return (
    <div className="relative bg-[#0D1118] border border-white/[0.08] rounded-2xl p-4
      overflow-hidden flex flex-col gap-2
      hover:border-white/[0.14] transition-colors duration-100 h-full">
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${a.bar} to-transparent`} />
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-['Outfit'] text-[8px] uppercase tracking-[0.12em] font-semibold mb-1.5 ${a.textColor} opacity-60`}>
            {label}
          </p>
          <p className="font-['Cormorant_Garamond'] text-[clamp(18px,1.8vw,26px)] font-bold text-white leading-none mb-1">
            {value}
          </p>
          <p className="font-['Outfit'] text-[9px] text-white/25">{sub}</p>
        </div>
        <div className={`w-9 h-9 rounded-xl ${a.iconBg} border ${a.iconBorder} flex items-center justify-center shrink-0 ${a.textColor}`}>
          {icon}
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/[0.05] mt-auto">
          <span className={`font-['Outfit'] text-[10px] font-semibold ${change.up ? 'text-[#34D399]' : 'text-[#F87171]'}`}>
            {change.up ? '↑' : '↓'} {change.val}
          </span>
          <span className="font-['Outfit'] text-[8px] text-white/20">this month</span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BAR CHART
───────────────────────────────────────────── */
function BarChart({ data, color = 'gold' }: {
  data: { label: string; count: number; highlight?: boolean }[];
  color?: 'gold' | 'blue';
}) {
  const max           = Math.max(...data.map(d => d.count), 1);
  const isBlue        = color === 'blue';
  const baseAlpha     = isBlue ? 'rgba(96,165,250,' : 'rgba(212,175,55,';
  const highlightGrad = isBlue ? 'linear-gradient(to top,#60A5FA,#93C5FD)' : 'linear-gradient(to top,#D4AF37,#F0D060)';

  return (
    <div className="flex items-end gap-1 h-full">
      {data.map(({ label, count, highlight }) => {
        const pct = Math.round((count / max) * 100);
        return (
          <div key={label} className="flex-1 flex flex-col items-center gap-1 h-full min-w-0">
            <div className="w-full flex-1 flex items-end">
              <div
                className="w-full rounded-t-[3px]"
                style={{
                  height:     `${Math.max(pct, 4)}%`,
                  background: highlight ? highlightGrad : `${baseAlpha}${0.07 + (pct / 100) * 0.3})`,
                  boxShadow:  highlight && !isBlue ? '0 0 8px rgba(212,175,55,0.3)' : 'none',
                }}
              />
            </div>
            <span className="font-['Outfit'] text-[7px] text-white/20 text-center truncate w-full">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────────── */
function Sparkline({ points, color }: { points: number[]; color: string }) {
  if (points.length < 2) return <div className="h-full bg-white/[0.02] rounded-lg" />;
  const max    = Math.max(...points);
  const min    = Math.min(...points);
  const range  = max - min || 1;
  const W = 200; const H = 56;
  const step   = W / (points.length - 1);
  const coords = points.map((v, i) => ({ x: i * step, y: H - ((v - min) / range) * (H - 8) - 4 }));
  const path   = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
  const area   = `${path} L${W},${H} L0,${H} Z`;
  const gradId = `sg-${color.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="2.5" fill={color} />
    </svg>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function AnalyticsPage() {
  const router = useRouter();

  /* ── Auth state ── */
  const [authChecked, setAuthChecked] = useState(false);

  /* ── Client-only date values (avoids hydration mismatch) ── */
  const [now, setNow] = useState<Date | null>(null);

  /* ── Data ── */
  const [profile,    setProfile]    = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [users,      setUsers]      = useState<User[]>([]);

  const [listingsFrom, setListingsFrom] = useState<Date>(defaultFrom);
  const [listingsTo,   setListingsTo]   = useState<Date>(defaultTo);
  const [revenueFrom,  setRevenueFrom]  = useState<Date>(defaultFrom);
  const [revenueTo,    setRevenueTo]    = useState<Date>(defaultTo);

  /* Set current date on client only */
  useEffect(() => { setNow(new Date()); }, []);

  /* ── Auth guard ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/auth/login');
      } else {
        setAuthChecked(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/auth/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  /* ── Data fetch ── */
  const fetchData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: pd }, { data: propD }, { data: usrD }] = await Promise.all([
      supabase.from('users').select('*').eq('id', user.id).single(),
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('id,username,email,created_at').order('created_at', { ascending: false }),
    ]);

    if (pd)    setProfile(pd);
    if (propD) setProperties(propD as Property[]);
    if (usrD)  setUsers(usrD as User[]);
  }, []);

  useEffect(() => {
    if (authChecked) fetchData();
  }, [authChecked, fetchData]);

  /* ── Derived analytics (safe: only uses fetched data, not Date()) ── */
  const totalListings = properties.length;
  const available     = properties.filter(p => p.status === 'Available').length;
  const sold          = properties.filter(p => p.status === 'Sold').length;
  const totalVolume   = properties.reduce((s, p) => s + Number(p.price), 0);
  const soldVolume    = properties.filter(p => p.status === 'Sold').reduce((s, p) => s + Number(p.price), 0);
  const avgPrice      = totalListings ? totalVolume / totalListings : 0;
  const totalUsers    = users.length;

  /* These depend on current month/year — derive from `now` (client-only) */
  const curM           = now?.getMonth()    ?? -1;
  const curY           = now?.getFullYear() ?? -1;
  const thisMonthUsers = now
    ? users.filter(u => { const d = new Date(u.created_at); return d.getMonth() === curM && d.getFullYear() === curY; }).length
    : 0;
  const thisMonthProps = now
    ? properties.filter(p => { const d = new Date(p.created_at); return d.getMonth() === curM && d.getFullYear() === curY; }).length
    : 0;

  /* ── Chart data ── */
  const listingSlots    = buildSlots(listingsFrom, listingsTo);
  const monthlyListings = listingSlots.map(s => ({
    label:     s.label,
    count:     properties.filter(p => { const d = new Date(p.created_at); return d.getMonth() === s.month && d.getFullYear() === s.year; }).length,
    highlight: now ? s.month === curM && s.year === curY : false,
  }));

  const revenueSlots   = buildSlots(revenueFrom, revenueTo);
  const monthlySoldVol = revenueSlots.map(s =>
    properties
      .filter(p => { const d = new Date(p.created_at); return p.status === 'Sold' && d.getMonth() === s.month && d.getFullYear() === s.year; })
      .reduce((a, p) => a + Number(p.price), 0)
  );

  const recentUsers = users.slice(0, 5);

  /* ── Block render until session confirmed ── */
  if (!authChecked) {
    return (
      <>
        <style>{FONTS}</style>
        <div className="h-full flex items-center justify-center bg-[#080B11]">
          <p className="font-['Outfit'] text-[12px] text-white/25">Checking session…</p>
        </div>
      </>
    );
  }

  /* ════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════ */
  return (
    <>
      <style>{FONTS}</style>

      <div className="w-full bg-[#0C0C0F] p-4 sm:p-5 flex flex-col gap-3
        h-auto lg:h-full overflow-y-auto lg:overflow-hidden">

        {/* ══ ROW 1 — KPI CARDS ══ */}
        <div className="flex flex-col gap-2.5 shrink-0 lg:flex-1 lg:min-h-0">

          {/* Greeting */}
          <div className="shrink-0">
            <h1 className="font-['Cormorant_Garamond'] text-[clamp(16px,1.8vw,22px)] font-bold text-white leading-tight">
              Welcome back,{' '}
              <em className="text-[#D4AF37] not-italic">{profile?.username || 'Admin'}</em>
            </h1>
            {/* Render date only after client mount */}
            {now && (
              <p className="font-['Outfit'] text-[10px] text-white/25 mt-0.5">
                {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 lg:flex-1 lg:min-h-0">
            <KpiCard label="Total Users" value={String(totalUsers)} sub="Registered accounts" accent="blue"
              change={{ val: `${thisMonthUsers} new`, up: true }}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 20c0-3.314 2.686-6 6-6s6 2.686 6 6"/><path d="M16 3.13a4 4 0 010 7.75M21 20c0-3.314-2-5.5-5-6"/></svg>}
            />
            <KpiCard label="Total Listings" value={String(totalListings)} sub="All properties" accent="gold"
              change={{ val: `${thisMonthProps} new`, up: true }}
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>}
            />
            <KpiCard label="Portfolio Value" value={fmtPrice(totalVolume)} sub={`${fmtPrice(avgPrice)} avg`} accent="purple"
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>}
            />
            <KpiCard label="Available" value={String(available)} sub="Ready to transact" accent="green"
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>}
            />
            <KpiCard label="Sold" value={String(sold)} sub={`${fmtPrice(soldVolume)} closed`} accent="teal"
              icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
            />
          </div>
        </div>

        {/* ══ ROW 2 — CHARTS + USERS ══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 min-h-[560px] lg:flex-1 lg:min-h-0">

          {/* Monthly Activity */}
          <div className="bg-[#0D1118] border border-white/[0.08] rounded-2xl flex flex-col overflow-visible hover:border-white/[0.12] transition-colors duration-100">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.06] shrink-0 flex-wrap">
              <div>
                <p className="font-['Outfit'] text-[8px] text-white/25 uppercase tracking-[0.12em] font-semibold mb-0.5">Monthly Activity</p>
                <p className="font-['Cormorant_Garamond'] text-[15px] font-bold text-white leading-none">
                  New Listings <em className="text-[#D4AF37] not-italic">Trend</em>
                </p>
              </div>
              <DateRangePicker from={listingsFrom} to={listingsTo}
                onChange={(f, t) => { setListingsFrom(f); setListingsTo(t); }} />
            </div>
            <div className="flex-1 min-h-0 p-4 flex flex-col gap-3">
              <div className="flex-1 min-h-0">
                <BarChart data={monthlyListings} color="gold" />
              </div>
              <div className="flex justify-between pt-2.5 border-t border-white/[0.05] shrink-0">
                <div>
                  <p className="font-['Outfit'] text-[8px] text-white/20 uppercase tracking-[0.1em]">Peak Month</p>
                  <p className="font-['Cormorant_Garamond'] text-[16px] font-bold text-[#D4AF37] leading-none mt-0.5">
                    {monthlyListings.reduce((a, b) => b.count > a.count ? b : a, { label: '—', count: 0 }).label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-['Outfit'] text-[8px] text-white/20 uppercase tracking-[0.1em]">Range Total</p>
                  <p className="font-['Cormorant_Garamond'] text-[16px] font-bold text-white leading-none mt-0.5">
                    {monthlyListings.reduce((s, m) => s + m.count, 0)} Listed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-[#0D1118] border border-white/[0.08] rounded-2xl flex flex-col overflow-visible hover:border-white/[0.12] transition-colors duration-100">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.06] shrink-0 flex-wrap">
              <div>
                <p className="font-['Outfit'] text-[8px] text-white/25 uppercase tracking-[0.12em] font-semibold mb-0.5">Revenue</p>
                <p className="font-['Cormorant_Garamond'] text-[15px] font-bold text-white leading-none">
                  Sales <em className="text-[#D4AF37] not-italic">Growth</em>
                </p>
              </div>
              <DateRangePicker from={revenueFrom} to={revenueTo}
                onChange={(f, t) => { setRevenueFrom(f); setRevenueTo(t); }} />
            </div>
            <div className="flex-1 min-h-0 p-4 flex flex-col gap-2">
              <div className="shrink-0">
                <p className="font-['Outfit'] text-[8px] text-white/20 uppercase tracking-[0.1em]">Sold in Range</p>
                <p className="font-['Cormorant_Garamond'] text-[22px] font-bold text-[#D4AF37] leading-none mt-1">
                  {fmtPrice(monthlySoldVol.reduce((a, v) => a + v, 0))}
                </p>
                <p className="font-['Outfit'] text-[9px] text-white/25 mt-0.5">{sold} transactions closed</p>
              </div>
              <div className="flex-1 min-h-0">
                <Sparkline points={monthlySoldVol} color="#D4AF37" />
              </div>
              <div className="flex justify-between shrink-0">
                {revenueSlots
                  .filter((_, i) => i % Math.max(1, Math.floor(revenueSlots.length / 5)) === 0)
                  .map(s => (
                    <span key={`${s.label}-${s.year}`} className="font-['Outfit'] text-[7px] text-white/20">
                      {s.label}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-[#0D1118] border border-white/[0.08] rounded-2xl flex flex-col overflow-hidden hover:border-white/[0.12] transition-colors duration-100">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.06] shrink-0">
              <div>
                <p className="font-['Outfit'] text-[8px] text-white/25 uppercase tracking-[0.12em] font-semibold mb-0.5">Accounts</p>
                <p className="font-['Cormorant_Garamond'] text-[15px] font-bold text-white leading-none">
                  Recent <em className="text-[#60A5FA] not-italic">Users</em>
                </p>
              </div>
              <span className="font-['Outfit'] text-[9px] font-bold text-[#60A5FA] bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-lg px-2.5 py-1">
                {totalUsers} Total
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {recentUsers.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <p className="font-['Outfit'] text-[12px] text-white/20">No users yet.</p>
                </div>
              ) : recentUsers.map(u => {
                const ui = (u.username || u.email || 'U').slice(0, 2).toUpperCase();
                return (
                  <div key={u.id} className="flex items-center gap-2.5 px-4 py-2.5 border-b border-white/[0.04] last:border-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#60A5FA]/15 to-[#1A6E8E]/15 border border-[#60A5FA]/20 flex items-center justify-center shrink-0">
                      <span className="font-['Cormorant_Garamond'] text-[12px] font-bold text-[#60A5FA]">{ui}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-['Outfit'] text-[12px] font-semibold text-white/75 truncate">{u.username || '—'}</p>
                      <p className="font-['Outfit'] text-[9px] text-white/25 truncate">{u.email}</p>
                    </div>
                    <p className="font-['Outfit'] text-[9px] text-white/20 shrink-0">{timeAgo(u.created_at)}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] shrink-0">
              <div>
                <p className="font-['Outfit'] text-[8px] text-white/20 uppercase tracking-[0.1em]">This Month</p>
                <p className="font-['Cormorant_Garamond'] text-[18px] font-bold text-[#60A5FA] leading-none mt-0.5">{thisMonthUsers}</p>
              </div>
              <div className="text-right">
                <p className="font-['Outfit'] text-[8px] text-white/20 uppercase tracking-[0.1em]">Total</p>
                <p className="font-['Cormorant_Garamond'] text-[18px] font-bold text-white leading-none mt-0.5">{totalUsers}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}