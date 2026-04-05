'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

/* ─────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes re-pulse {
    0%,100% { opacity:1; transform:scale(1); }
    50%      { opacity:0.4; transform:scale(1.4); }
  }
  @keyframes shimmerLoad {
    0%   { background-position:-400px 0; }
    100% { background-position:400px 0; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes dropIn {
    from { opacity:0; transform:translateY(-8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .skeleton {
    background: linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);
    background-size: 400px 100%;
    animation: shimmerLoad 1.4s infinite;
    border-radius: 10px;
  }

  .prop-card {
    background: #0D1118;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    overflow: hidden;
    transition: transform .32s cubic-bezier(.34,1.3,.64,1), box-shadow .32s, border-color .32s;
    animation: fadeUp .5s ease both;
  }
  .prop-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(212,175,55,.16);
    border-color: rgba(212,175,55,.2);
  }
  .prop-card:hover .card-img { transform: scale(1.06); }
  .card-img { width:100%; height:100%; object-fit:cover; transition:transform .55s cubic-bezier(.25,.46,.45,.94); display:block; }

  .status-badge {
    display:inline-flex; align-items:center; gap:5px;
    font-family:'Outfit',sans-serif; font-size:9px; font-weight:700;
    letter-spacing:.07em; text-transform:uppercase;
    padding:4px 11px; border-radius:100px;
  }

  .btn-gold {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    background:#D4AF37; color:#0C0C0F;
    font-family:'Outfit',sans-serif; font-size:13px; font-weight:700;
    padding:13px 28px; border-radius:10px; border:none;
    cursor:pointer; text-decoration:none;
    box-shadow:0 0 28px rgba(212,175,55,.28);
    letter-spacing:.01em;
    transition:transform .15s, box-shadow .15s;
    white-space:nowrap;
  }
  .btn-gold:hover { transform:translateY(-2px); box-shadow:0 10px 36px rgba(212,175,55,.42); }

  .btn-ghost {
    display:inline-flex; align-items:center; gap:8px;
    background:transparent; color:#E2E8F0;
    font-family:'Outfit',sans-serif; font-size:13px; font-weight:600;
    padding:12px 24px; border-radius:10px;
    border:1px solid rgba(255,255,255,.12);
    cursor:pointer; text-decoration:none;
    transition:border-color .2s, background .2s;
    white-space:nowrap;
  }
  .btn-ghost:hover { border-color:rgba(212,175,55,.32); background:rgba(212,175,55,.04); }

  .adm-select {
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.09);
    border-radius:10px; padding:10px 34px 10px 14px;
    font-family:'Outfit',sans-serif; font-size:12px;
    color:rgba(255,255,255,.65); outline:none;
    cursor:pointer; appearance:none;
    transition:border-color .2s, background .2s;
    white-space:nowrap; min-width:140px;
  }
  .adm-select:focus {
    border-color:rgba(212,175,55,.45);
    background:rgba(212,175,55,.04);
    box-shadow:0 0 0 3px rgba(212,175,55,.08);
  }
  .adm-select option { background:#0D1118; color:#E2E8F0; }

  .select-wrap { position:relative; display:inline-flex; align-items:center; }
  .select-wrap::after {
    content:''; position:absolute; right:11px; top:50%; transform:translateY(-50%);
    width:0; height:0;
    border-left:4px solid transparent; border-right:4px solid transparent;
    border-top:5px solid rgba(255,255,255,.3);
    pointer-events:none;
  }

  .search-input {
    width:100%;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.09);
    border-radius:10px; padding:12px 40px 12px 42px;
    font-family:'Outfit',sans-serif; font-size:13px;
    color:#E2E8F0; outline:none;
    transition:border-color .2s, background .2s, box-shadow .2s;
    box-sizing:border-box;
  }
  .search-input::placeholder { color:rgba(255,255,255,.22); }
  .search-input:focus {
    border-color:rgba(212,175,55,.45);
    background:rgba(212,175,55,.04);
    box-shadow:0 0 0 3px rgba(212,175,55,.08);
  }

  .autocomplete-drop {
    position:absolute; top:calc(100% + 6px); left:0; right:0;
    background:#0D1118;
    border:1px solid rgba(212,175,55,.2);
    border-radius:14px; z-index:200;
    overflow:hidden;
    animation:dropIn .16s ease both;
    box-shadow:0 20px 56px rgba(0,0,0,.65);
    max-height:260px; overflow-y:auto;
  }
  .autocomplete-item {
    display:flex; align-items:center; gap:10px;
    padding:11px 16px;
    font-family:'Outfit',sans-serif; font-size:12px; color:rgba(255,255,255,.6);
    cursor:pointer;
    transition:background .15s, color .15s;
    border-bottom:1px solid rgba(255,255,255,.04);
  }
  .autocomplete-item:last-child { border-bottom:none; }
  .autocomplete-item:hover { background:rgba(212,175,55,.08); color:#fff; }
  .autocomplete-item mark { background:transparent; color:#D4AF37; font-weight:700; }

  .filter-pill {
    display:inline-flex; align-items:center; gap:6px;
    font-family:'Outfit',sans-serif; font-size:11px; font-weight:500;
    padding:7px 14px; border-radius:100px;
    border:1px solid rgba(255,255,255,.09);
    background:transparent; color:rgba(255,255,255,.4);
    cursor:pointer; transition:border-color .18s, background .18s, color .18s;
    white-space:nowrap;
  }
  .filter-pill:hover { border-color:rgba(212,175,55,.3); color:rgba(255,255,255,.75); background:rgba(212,175,55,.05); }
  .filter-pill.active { border-color:rgba(212,175,55,.4); background:rgba(212,175,55,.12); color:#D4AF37; }

  .btn-reset {
    display:inline-flex; align-items:center; gap:5px;
    font-family:'Outfit',sans-serif; font-size:11px; font-weight:500;
    color:rgba(248,113,113,.7); background:rgba(248,113,113,.06);
    border:1px solid rgba(248,113,113,.18); border-radius:8px;
    padding:7px 13px; cursor:pointer;
    transition:color .18s, border-color .18s, background .18s;
    white-space:nowrap;
  }
  .btn-reset:hover { color:#F87171; border-color:rgba(248,113,113,.35); background:rgba(248,113,113,.1); }

  .trust-item-icon {
    width:28px; height:28px; border-radius:8px;
    background:rgba(212,175,55,.10); border:1px solid rgba(212,175,55,.2);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }

  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(212,175,55,.28); }
`;

/* ─────────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────────── */
interface Property {
  id: string;
  name: string | null;
  description: string | null;
  location: string | null;
  property_type: string | null;
  property: string | null;
  price: number | null;
  property_image: string | null;
  status: string | null;
  created_at: string;
}

const PHONE = '+971000000000';

const PRICE_RANGES = [
  { label: 'Any Price',       min: 0,          max: Infinity  },
  { label: 'Under AED 1M',   min: 0,          max: 1_000_000 },
  { label: 'AED 1M – 3M',    min: 1_000_000,  max: 3_000_000 },
  { label: 'AED 3M – 6M',    min: 3_000_000,  max: 6_000_000 },
  { label: 'AED 6M – 10M',   min: 6_000_000,  max: 10_000_000},
  { label: 'AED 10M+',       min: 10_000_000, max: Infinity  },
];

const TRUST_ITEMS = [
  { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>, text:'RERA Licensed' },
  { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>, text:'Verified Listings' },
  { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>, text:'Avg. 18 Days to Close' },
  { icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4AF37"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>, text:'GCC & International Buyers' },
];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function fmtPrice(n: number) {
  if (n >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n.toLocaleString()}`;
}
function statusStyle(s: string): React.CSSProperties {
  const m: Record<string, React.CSSProperties> = {
    Available: { background:'rgba(52,211,153,.15)',  color:'#34D399', border:'1px solid rgba(52,211,153,.28)' },
    Sold:      { background:'rgba(212,175,55,.15)',  color:'#D4AF37', border:'1px solid rgba(212,175,55,.28)' },
    Reserved:  { background:'rgba(96,165,250,.15)',  color:'#60A5FA', border:'1px solid rgba(96,165,250,.28)' },
  };
  return m[s] ?? m['Available'];
}
function statusDot(s: string) {
  return s==='Available'?'#34D399':s==='Sold'?'#D4AF37':'#60A5FA';
}
function highlight(text: string, q: string) {
  if (!q.trim()) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return <>{text.slice(0,i)}<mark>{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>;
}

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ background:'#0D1118', border:'1px solid rgba(255,255,255,.07)', borderRadius:18, overflow:'hidden' }}>
      <div className="skeleton" style={{ height:210 }} />
      <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
        <div className="skeleton" style={{ height:12, width:'68%' }} />
        <div className="skeleton" style={{ height:10, width:'42%' }} />
        <div className="skeleton" style={{ height:10, width:'88%' }} />
        <div className="skeleton" style={{ height:10, width:'72%' }} />
        <div style={{ height:1, background:'rgba(255,255,255,.05)', margin:'6px 0' }} />
        <div className="skeleton" style={{ height:44, borderRadius:10 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROPERTY CARD
───────────────────────────────────────────── */
function PropertyCard({ prop, delay }: { prop: Property; delay: number }) {
  const ss    = statusStyle(prop.status ?? 'Available');
  const sd    = statusDot(prop.status ?? 'Available');
  const price = Number(prop.price ?? 0);

  return (
    <div className="prop-card" style={{ animationDelay:`${delay}ms` }}>
      {/* Image */}
      <div style={{ position:'relative', height:210, overflow:'hidden', background:'rgba(255,255,255,.03)' }}>
        {prop.property_image
          // eslint-disable-next-line @next/next/no-img-element
          ? <img className="card-img" src={prop.property_image} alt={prop.name ?? 'Property'} />
          : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,rgba(212,175,55,.07),rgba(26,110,142,.09))' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="rgba(212,175,55,.28)" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M9 21V12h6v9" stroke="rgba(212,175,55,.28)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 40%,rgba(13,17,24,.85) 100%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:14, right:14 }}>
          <div className="status-badge" style={ss}>
            <div style={{ width:5, height:5, borderRadius:'50%', background:sd, flexShrink:0 }} />
            {prop.status ?? 'Available'}
          </div>
        </div>
        <div style={{ position:'absolute', bottom:14, left:14 }}>
          <div className="f-sans" style={{ fontSize:13, fontWeight:700, color:'#0C0C0F', background:'#D4AF37', borderRadius:100, padding:'5px 13px', display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:5, height:5, borderRadius:'50%', background:'rgba(0,0,0,.22)', display:'block', flexShrink:0 }} />
            {fmtPrice(price)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding:'20px 20px 20px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10, marginBottom:8 }}>
          <h3 className="f-display" style={{ fontSize:20, fontWeight:700, color:'#fff', lineHeight:1.15, margin:0 }}>
            {prop.name || 'Unnamed Property'}
          </h3>
          {prop.property_type && (
            <span className="f-sans" style={{ fontSize:9, fontWeight:600, color:'rgba(255,255,255,.4)', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:6, padding:'3px 9px', flexShrink:0, marginTop:2, letterSpacing:'.05em' }}>
              {prop.property_type}
            </span>
          )}
        </div>

        {prop.location && (
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:12 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(212,175,55,.55)" style={{ flexShrink:0 }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <span className="f-sans" style={{ fontSize:11, color:'rgba(255,255,255,.35)' }}>{prop.location}</span>
          </div>
        )}

        {prop.description && (
          <p className="f-sans" style={{ fontSize:12, color:'rgba(255,255,255,.45)', lineHeight:1.7, marginBottom:14, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {prop.description}
          </p>
        )}

        {prop.property && (
          <div style={{ marginBottom:14 }}>
            <span className="f-sans" style={{ fontSize:9, fontWeight:600, color:'rgba(212,175,55,.7)', background:'rgba(212,175,55,.08)', border:'1px solid rgba(212,175,55,.18)', borderRadius:6, padding:'3px 9px', letterSpacing:'.06em', textTransform:'uppercase' }}>
              {prop.property}
            </span>
          </div>
        )}

        <div style={{ height:1, background:'rgba(255,255,255,.06)', marginBottom:16 }} />

        <a href={`tel:${PHONE}`} className="btn-gold" style={{ width:'100%', padding:'13px 20px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.56a1 1 0 01-.24 1.01l-2.21 2.22z" fill="#0C0C0F"/>
          </svg>
          Book This Property
        </a>
        <p className="f-sans" style={{ textAlign:'center', fontSize:10, color:'rgba(255,255,255,.2)', marginTop:7 }}>
          Call {PHONE}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [showDrop, setShowDrop]     = useState(false);
  const [statusFilter, setStatus]   = useState('All');
  const [locationFilter, setLoc]    = useState('');
  const [typeFilter, setType]       = useState('');
  const [priceRange, setPriceRange] = useState(0);
  const searchRef                   = useRef<HTMLDivElement>(null);

  /* ── Fetch ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setProperties(data as Property[]);
      setLoading(false);
    })();
  }, []);

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDrop(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* ── Derived option lists ── */
  const locations = useMemo(
    () => [...new Set(properties.map(p => p.location).filter(Boolean) as string[])].sort(),
    [properties]
  );
  const types = useMemo(
    () => [...new Set(properties.map(p => p.property_type).filter(Boolean) as string[])].sort(),
    [properties]
  );

  /* ── Autocomplete suggestions ── */
  const suggestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return properties.filter(p =>
      (p.name?.toLowerCase().includes(q)) ||
      (p.location?.toLowerCase().includes(q)) ||
      (p.property_type?.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [search, properties]);

  /* ── Filtered results ── */
  const filtered = useMemo(() => {
    const q  = search.trim().toLowerCase();
    const pr = PRICE_RANGES[priceRange];
    return properties.filter(p => {
      const mSearch   = !q || (p.name??'').toLowerCase().includes(q) || (p.location??'').toLowerCase().includes(q) || (p.property_type??'').toLowerCase().includes(q) || (p.description??'').toLowerCase().includes(q);
      const mStatus   = statusFilter === 'All' || p.status === statusFilter;
      const mLocation = !locationFilter || p.location === locationFilter;
      const mType     = !typeFilter     || p.property_type === typeFilter;
      const price     = Number(p.price ?? 0);
      const mPrice    = price >= pr.min && (pr.max === Infinity ? true : price < pr.max);
      return mSearch && mStatus && mLocation && mType && mPrice;
    });
  }, [properties, search, statusFilter, locationFilter, typeFilter, priceRange]);

  const counts = {
    All:       properties.length,
    Available: properties.filter(p => p.status === 'Available').length,
    Sold:      properties.filter(p => p.status === 'Sold').length,
    Reserved:  properties.filter(p => p.status === 'Reserved').length,
  };

  const hasFilters = search || statusFilter !== 'All' || locationFilter || typeFilter || priceRange !== 0;

  const resetAll = () => {
    setSearch(''); setStatus('All'); setLoc(''); setType(''); setPriceRange(0); setShowDrop(false);
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <>
      <style>{G}</style>

      <div style={{ background:'#0C0C0F', minHeight:'100vh', position:'relative', overflow:'hidden' }}>

        {/* ── Ambient orbs — same as about.tsx ── */}
        <div className="absolute pointer-events-none rounded-full"
          style={{ width:640, height:640, top:80, right:-60, background:'radial-gradient(circle,rgba(212,175,55,.08) 0%,transparent 65%)' }} />
        <div className="absolute pointer-events-none rounded-full"
          style={{ width:520, height:520, bottom:100, left:-60, background:'radial-gradient(circle,rgba(26,110,142,.10) 0%,transparent 65%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-20 lg:py-28">

          {/* ══ SECTION HEADER — about.tsx pattern ══ */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
            <div>
              {/* Eyebrow pill */}
              <div className="inline-flex items-center gap-2 mb-5"
                style={{ background:'rgba(212,175,55,.08)', border:'1px solid rgba(212,175,55,.22)', borderRadius:100, padding:'5px 16px' }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#D4AF37', display:'block', animation:'re-pulse 2s infinite' }} />
                <span className="f-sans" style={{ fontSize:10, color:'#D4AF37', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase' }}>
                  Dubai · Premium Real Estate
                </span>
              </div>

              <h2 className="f-display"
                style={{ fontSize:'clamp(36px,4.2vw,62px)', fontWeight:700, color:'#fff', lineHeight:1.05, letterSpacing:'-.01em', margin:0 }}>
                Discover Your Next
                <br />
                <em style={{ color:'#D4AF37', fontStyle:'italic' }}>Dream Property</em>
              </h2>

              <p className="f-sans"
                style={{ fontSize:'clamp(13px,1.1vw,15px)', color:'#94A3B8', lineHeight:1.72, maxWidth:420, marginTop:14, marginBottom:0 }}>
                Browse our curated portfolio of luxury residences across Dubai's most
                prestigious addresses — hand-picked for investors and lifestyle seekers alike.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="#contact" className="btn-gold">
                Book a Viewing
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="#0C0C0F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href={`tel:${PHONE}`} className="btn-ghost">Call Us ↗</a>
            </div>
          </div>

          {/* ══ FILTER PANEL ══ */}
          <div style={{ background:'#0D1118', border:'1px solid rgba(255,255,255,.08)', borderRadius:18, padding:'22px 24px', marginBottom:28, borderTop:'2px solid #D4AF37' }}>

            {/* Search bar with autocomplete */}
            <div ref={searchRef} style={{ position:'relative', marginBottom:16 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none', color:'rgba(255,255,255,.3)' }}>
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>

              <input
                className="search-input"
                type="text"
                placeholder="Search by name, location, property type…"
                value={search}
                onChange={e => { setSearch(e.target.value); setShowDrop(true); }}
                onFocus={() => setShowDrop(true)}
                autoComplete="off"
              />

              {search && (
                <button onClick={() => { setSearch(''); setShowDrop(false); }}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.3)', display:'flex', padding:4 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              )}

              {/* Autocomplete dropdown */}
              {showDrop && suggestions.length > 0 && (
                <div className="autocomplete-drop">
                  {suggestions.map(p => (
                    <div key={p.id} className="autocomplete-item"
                      onMouseDown={() => { setSearch(p.name ?? ''); setShowDrop(false); }}>
                      {p.property_image
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.property_image} alt="" style={{ width:32, height:28, objectFit:'cover', borderRadius:6, flexShrink:0, border:'1px solid rgba(255,255,255,.08)' }}/>
                        : <div style={{ width:32, height:28, borderRadius:6, background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.07)', flexShrink:0 }}/>
                      }
                      <div style={{ flex:1, minWidth:0 }}>
                        <p className="f-sans" style={{ fontSize:12, color:'rgba(255,255,255,.8)', margin:0, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {highlight(p.name ?? 'Unnamed', search)}
                        </p>
                        <p className="f-sans" style={{ fontSize:10, color:'rgba(255,255,255,.3)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {p.location}{p.property_type && ` · ${p.property_type}`}
                        </p>
                      </div>
                      <span className="f-display" style={{ fontSize:13, fontWeight:700, color:'#D4AF37', flexShrink:0 }}>
                        {fmtPrice(Number(p.price ?? 0))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdowns + status pills row */}
            <div className="flex flex-wrap gap-3 items-center">

              {/* Location */}
              <div className="select-wrap">
                <select className="adm-select" value={locationFilter} onChange={e => setLoc(e.target.value)}>
                  <option value="">All Locations</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Type */}
              <div className="select-wrap">
                <select className="adm-select" value={typeFilter} onChange={e => setType(e.target.value)}>
                  <option value="">All Types</option>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Price */}
              <div className="select-wrap">
                <select className="adm-select" value={priceRange} onChange={e => setPriceRange(Number(e.target.value))}>
                  {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                </select>
              </div>

              {/* Vertical rule */}
              <div style={{ width:1, height:20, background:'rgba(255,255,255,.08)', flexShrink:0 }} />

              {/* Status pills */}
              {(['All','Available','Sold','Reserved'] as const).map(s => (
                <button key={s} className={`filter-pill${statusFilter===s?' active':''}`} onClick={() => setStatus(s)}>
                  {s}
                  <span style={{ fontSize:10, fontWeight:700, background:statusFilter===s?'rgba(212,175,55,.2)':'rgba(255,255,255,.06)', borderRadius:100, padding:'1px 7px', color:statusFilter===s?'#D4AF37':'rgba(255,255,255,.3)' }}>
                    {counts[s as keyof typeof counts]}
                  </span>
                </button>
              ))}

              {/* Reset */}
              {hasFilters && (
                <button className="btn-reset" onClick={resetAll}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Reset
                </button>
              )}

              {/* Count — pushed right */}
              <div style={{ marginLeft:'auto', flexShrink:0 }}>
                <p className="f-sans" style={{ fontSize:11, color:'rgba(255,255,255,.25)' }}>
                  <span style={{ color:'#D4AF37', fontWeight:600 }}>{filtered.length}</span>{' '}
                  {filtered.length===1?'property':'properties'} found
                </p>
              </div>
            </div>
          </div>

          {/* ══ GRID ══ */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
              {Array.from({ length:6 }).map((_,i) => <SkeletonCard key={i}/>)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'80px 0', textAlign:'center', gap:14 }}>
              <div style={{ width:58, height:58, borderRadius:18, background:'rgba(212,175,55,.07)', border:'1px solid rgba(212,175,55,.16)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="rgba(212,175,55,.5)" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 21V12h6v9" stroke="rgba(212,175,55,.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="f-display" style={{ fontSize:24, fontWeight:700, color:'#fff', margin:0 }}>No Properties Found</h3>
              <p className="f-sans" style={{ fontSize:13, color:'rgba(255,255,255,.3)', margin:0, maxWidth:320 }}>
                {hasFilters ? 'Try adjusting your search or filters.' : 'No properties are currently listed.'}
              </p>
              {hasFilters && (
                <button className="btn-reset" onClick={resetAll} style={{ marginTop:6, padding:'9px 20px', fontSize:12 }}>
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
              {filtered.map((prop, i) => (
                <PropertyCard key={prop.id} prop={prop} delay={Math.min(i,5)*65}/>
              ))}
            </div>
          )}

          {/* ══ TRUST BAR — matches about.tsx ══ */}
          <div style={{ background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.06)', borderRadius:14, padding:'20px 28px' }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 justify-center sm:justify-start">
              {TRUST_ITEMS.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="trust-item-icon">{icon}</div>
                  <span className="f-sans" style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:500 }}>{text}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#D4AF37', animation:'re-pulse 2s infinite' }} />
              <span className="f-sans" style={{ fontSize:10, color:'rgba(255,255,255,.22)' }}>Live listings · Updated daily</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}