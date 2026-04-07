'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/* ─────────────────────────────────────────────
   GLOBAL STYLES — no entry animations, only hover transitions
───────────────────────────────────────────── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes spin { to { transform:rotate(360deg); } }

  /* ── Inputs ── */
  .adm-input {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09); border-radius:10px;
    padding:11px 14px; font-family:'Outfit',sans-serif; font-size:13px;
    color:#E2E8F0; outline:none;
    transition:border-color .15s,background .15s,box-shadow .15s;
    box-sizing:border-box;
  }
  .adm-input::placeholder { color:rgba(255,255,255,0.2); }
  .adm-input:focus {
    border-color:rgba(212,175,55,0.45);
    background:rgba(212,175,55,0.04);
    box-shadow:0 0 0 3px rgba(212,175,55,0.08);
  }
  .adm-input:hover:not(:focus) { border-color:rgba(255,255,255,0.18); }

  .adm-select {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09); border-radius:10px;
    padding:11px 14px; font-family:'Outfit',sans-serif; font-size:13px;
    color:#E2E8F0; outline:none; cursor:pointer; appearance:none;
    transition:border-color .15s,background .15s; box-sizing:border-box;
  }
  .adm-select:focus {
    border-color:rgba(212,175,55,0.45);
    background:rgba(212,175,55,0.04);
    box-shadow:0 0 0 3px rgba(212,175,55,0.08);
  }
  .adm-select option { background:#0D1118; color:#E2E8F0; }

  .adm-textarea {
    width:100%; background:rgba(255,255,255,0.04);
    border:1px solid rgba(255,255,255,0.09); border-radius:10px;
    padding:12px 14px; font-family:'Outfit',sans-serif; font-size:13px;
    color:#E2E8F0; outline:none; resize:vertical; min-height:80px;
    transition:border-color .15s,background .15s,box-shadow .15s;
    box-sizing:border-box; line-height:1.6;
  }
  .adm-textarea::placeholder { color:rgba(255,255,255,0.2); }
  .adm-textarea:focus {
    border-color:rgba(212,175,55,0.45);
    background:rgba(212,175,55,0.04);
    box-shadow:0 0 0 3px rgba(212,175,55,0.08);
  }

  /* ── Drop zone ── */
  .drop-zone {
    border:1.5px dashed rgba(255,255,255,0.12); border-radius:12px;
    padding:20px 16px; display:flex; flex-direction:column;
    align-items:center; justify-content:center; gap:6px;
    cursor:pointer; transition:border-color .15s,background .15s;
    text-align:center; position:relative; overflow:hidden;
  }
  .drop-zone:hover,.drop-zone.drag-over {
    border-color:rgba(212,175,55,0.4);
    background:rgba(212,175,55,0.04);
  }
  .drop-zone input[type=file] {
    position:absolute; inset:0; opacity:0; cursor:pointer;
    width:100%; height:100%;
  }

  /* ── Table ── */
  .tbl-row { border-bottom:1px solid rgba(255,255,255,0.05); transition:background .1s; }
  .tbl-row:hover { background:rgba(255,255,255,0.025); }
  .tbl-row:last-child { border-bottom:none; }
  .tbl-row.selected { background:rgba(212,175,55,0.04); }
  .tbl-head {
    font-family:'Outfit',sans-serif; font-size:9px; font-weight:700;
    color:rgba(255,255,255,0.25); text-transform:uppercase;
    letter-spacing:0.1em; padding:11px 14px;
    border-bottom:1px solid rgba(255,255,255,0.07); white-space:nowrap;
    user-select:none;
  }
  .tbl-cell {
    padding:12px 14px; font-family:'Outfit',sans-serif; font-size:13px;
    color:rgba(255,255,255,0.75); vertical-align:middle;
  }

  /* ── Buttons ── */
  .btn-gold {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    background:#D4AF37; color:#0C0C0F; font-family:'Outfit',sans-serif;
    font-size:13px; font-weight:700; padding:11px 22px; border-radius:10px;
    border:none; cursor:pointer; box-shadow:0 0 24px rgba(212,175,55,0.22);
    letter-spacing:0.01em;
    transition:transform .1s,box-shadow .1s,background .1s; white-space:nowrap;
  }
  .btn-gold:hover:not(:disabled) {
    transform:translateY(-1px);
    background:#F0D060;
    box-shadow:0 6px 24px rgba(212,175,55,0.38);
  }
  .btn-gold:disabled { opacity:0.5; cursor:not-allowed; }

  .btn-ghost {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    background:transparent; color:rgba(255,255,255,0.55);
    font-family:'Outfit',sans-serif; font-size:12px; font-weight:500;
    padding:8px 14px; border-radius:8px;
    border:1px solid rgba(255,255,255,0.1); cursor:pointer;
    transition:border-color .1s,color .1s,background .1s; white-space:nowrap;
  }
  .btn-ghost:hover {
    border-color:rgba(212,175,55,0.3); color:#D4AF37;
    background:rgba(212,175,55,0.05);
  }

  .btn-danger {
    display:inline-flex; align-items:center; justify-content:center; gap:5px;
    background:transparent; color:rgba(248,113,113,0.7);
    font-family:'Outfit',sans-serif; font-size:12px; font-weight:500;
    padding:8px 12px; border-radius:8px;
    border:1px solid rgba(248,113,113,0.15); cursor:pointer;
    transition:border-color .1s,color .1s,background .1s; white-space:nowrap;
  }
  .btn-danger:hover {
    border-color:rgba(248,113,113,0.35); color:#F87171;
    background:rgba(248,113,113,0.06);
  }

  .btn-page {
    display:inline-flex; align-items:center; justify-content:center;
    min-width:32px; height:32px; padding:0 8px;
    border-radius:8px; border:1px solid rgba(255,255,255,0.08);
    background:transparent; color:rgba(255,255,255,0.4);
    font-family:'Outfit',sans-serif; font-size:12px; font-weight:600;
    cursor:pointer; transition:border-color .1s,color .1s,background .1s; white-space:nowrap;
  }
  .btn-page:hover:not(:disabled) {
    border-color:rgba(212,175,55,0.3); color:#D4AF37;
    background:rgba(212,175,55,0.06);
  }
  .btn-page.active {
    border-color:rgba(212,175,55,0.45); color:#D4AF37;
    background:rgba(212,175,55,0.1);
  }
  .btn-page:disabled { opacity:0.3; cursor:not-allowed; }

  /* ── Checkbox ── */
  .chk {
    width:15px; height:15px; border-radius:4px;
    border:1.5px solid rgba(255,255,255,0.15);
    background:transparent; cursor:pointer; appearance:none;
    transition:border-color .1s,background .1s; flex-shrink:0;
    position:relative;
  }
  .chk:checked { background:#D4AF37; border-color:#D4AF37; }
  .chk:checked::after {
    content:''; position:absolute; left:3px; top:1px;
    width:5px; height:9px;
    border:2px solid #0C0C0F; border-top:none; border-left:none;
    transform:rotate(45deg);
  }
  .chk:hover:not(:checked) { border-color:rgba(212,175,55,0.4); }

  /* ── Misc ── */
  .spinner {
    width:15px; height:15px;
    border:2px solid rgba(12,12,15,0.3); border-top-color:#0C0C0F;
    border-radius:50%; animation:spin .65s linear infinite;
    display:inline-block; flex-shrink:0;
  }
  .spinner-white {
    width:14px; height:14px;
    border:2px solid rgba(255,255,255,0.15); border-top-color:rgba(255,255,255,0.7);
    border-radius:50%; animation:spin .65s linear infinite;
    display:inline-block; flex-shrink:0;
  }
  /* skeleton — simple static, no shimmer animation */
  .skeleton {
    background:rgba(255,255,255,0.05);
    border-radius:6px;
  }
  .field-label {
    font-family:'Outfit',sans-serif; font-size:10px; font-weight:600;
    color:rgba(255,255,255,0.3); text-transform:uppercase;
    letter-spacing:0.1em; margin-bottom:6px; display:block;
  }
  .status-badge {
    display:inline-flex; align-items:center; gap:5px;
    font-family:'Outfit',sans-serif; font-size:10px; font-weight:700;
    letter-spacing:0.06em; text-transform:uppercase; padding:4px 10px;
    border-radius:100px;
  }
  .select-wrap { position:relative; }
  .select-wrap::after {
    content:''; position:absolute; right:12px; top:50%;
    transform:translateY(-50%); width:0; height:0;
    border-left:4px solid transparent; border-right:4px solid transparent;
    border-top:5px solid rgba(255,255,255,0.3); pointer-events:none;
  }
  .img-preview {
    width:100%; height:140px; object-fit:cover;
    border-radius:10px; border:1px solid rgba(255,255,255,0.08); display:block;
  }
  /* toast — no entry animation, just appears */
  .toast {
    position:fixed; bottom:24px; right:24px; z-index:99999;
    background:#0D1118; border:1px solid rgba(212,175,55,0.3);
    border-radius:12px; padding:13px 18px;
    display:flex; align-items:center; gap:10px;
    box-shadow:0 16px 40px rgba(0,0,0,0.6);
    font-family:'Outfit',sans-serif; font-size:13px; color:#E2E8F0;
    min-width:220px; max-width:320px;
  }
  .toast.error { border-color:rgba(248,113,113,0.3); }

  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(212,175,55,0.3); }
`;

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  property_type: string;
  property: string;
  price: number;
  property_image: string | null;
  status: string;
  user_id: string;
  created_at?: string;
}
type ToastState = { message: string; kind: 'success' | 'error' } | null;

const EMPTY_FORM = {
  name: '', description: '', location: '',
  property_type: '', property: '',
  price: 0, property_image: null as File | null, status: 'Available',
};

const PAGE_SIZE = 50;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function statusStyle(s: string): React.CSSProperties {
  const m: Record<string, React.CSSProperties> = {
    Available: { background: 'rgba(52,211,153,0.12)', color: '#34D399', border: '1px solid rgba(52,211,153,0.25)' },
    Sold:      { background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' },
    Reserved:  { background: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.25)' },
  };
  return m[s] ?? m['Available'];
}
function statusDot(s: string) {
  return s === 'Available' ? '#34D399' : s === 'Sold' ? '#D4AF37' : '#60A5FA';
}
function fmtPrice(n: number) {
  if (n >= 1_000_000_000) return `AED ${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000)     return `AED ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)         return `AED ${(n / 1_000).toFixed(0)}K`;
  return `AED ${n.toLocaleString()}`;
}

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const IconPlus      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>;
const IconEdit      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconTrash     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconClose     = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const IconUpload    = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="rgba(212,175,55,0.55)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconLocation  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(212,175,55,0.5)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>;
const IconBuilding  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="rgba(212,175,55,0.5)" strokeWidth="1.6" fill="none" strokeLinejoin="round"/><path d="M9 22V12h6v10" stroke="rgba(212,175,55,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconRefresh   = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconChevronLeft  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconChevronRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;

/* ─────────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOAST — no animation, instant appear/disappear
───────────────────────────────────────────── */
function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className={`toast${toast.kind === 'error' ? ' error' : ''}`}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: toast.kind === 'success' ? '#34D399' : '#F87171',
        flexShrink: 0,
      }} />
      <span className="f-sans" style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 0, display: 'flex', flexShrink: 0 }}>
        <IconClose />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROPERTY DIALOG — no entry animation
───────────────────────────────────────────── */
function PropertyDialog({
  open, editingProp, onClose, onSaved,
}: {
  open: boolean;
  editingProp: Property | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [loading, setLoading]     = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [toast, setToast]         = useState<ToastState>(null);

  useEffect(() => {
    if (editingProp) {
      setForm({
        name:           editingProp.name || '',
        description:    editingProp.description || '',
        location:       editingProp.location || '',
        property_type:  editingProp.property_type || '',
        property:       editingProp.property || '',
        price:          Number(editingProp.price) || 0,
        property_image: null,
        status:         editingProp.status || 'Available',
      });
      setPreviewUrl(editingProp.property_image || null);
    } else {
      setForm({ ...EMPTY_FORM });
      setPreviewUrl(null);
    }
  }, [editingProp, open]);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const showToast = (message: string, kind: 'success' | 'error' = 'success') =>
    setToast({ message, kind });

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setForm(f => ({ ...f, property_image: file }));
    const reader = new FileReader();
    reader.onload = e => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File) => {
    const ext  = file.name.split('.').pop();
    const name = `${Math.random().toString(36).slice(2)}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('property-images').upload(name, file);
    if (error) return null;
    return supabase.storage.from('property-images').getPublicUrl(name).data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.price) {
      showToast('Fill in Name, Location, and Price', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) { showToast('Not authenticated', 'error'); return; }

      let imageUrl: string | null = null;
      if (form.property_image) {
        imageUrl = await uploadImage(form.property_image);
        if (!imageUrl) { showToast('Image upload failed', 'error'); setLoading(false); return; }
      }

      const payload: Record<string, unknown> = {
        name: form.name, description: form.description,
        location: form.location, property_type: form.property_type,
        property: form.property, price: form.price,
        status: form.status, user_id: user.id,
        ...(imageUrl && { property_image: imageUrl }),
      };

      if (editingProp) {
        const { error } = await supabase.from('properties').update(payload).eq('id', editingProp.id);
        if (error) throw error;
        showToast('Property updated');
      } else {
        const { error } = await supabase.from('properties').insert([payload]);
        if (error) throw error;
        showToast('Property created');
      }

      // No delay — close and refresh immediately
      onSaved();
      onClose();
    } catch (err: unknown) {
      showToast('Error: ' + (err as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Backdrop — no animation */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.78)',
          backdropFilter: 'blur(4px)',
          zIndex: 9000,
        }}
      />

      {/* Dialog — no animation */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9001,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, pointerEvents: 'none',
      }}>
        <div
          style={{
            background: '#0D1118',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 20,
            width: '100%', maxWidth: 640,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
            pointerEvents: 'all',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Accent bar */}
          <div style={{
            height: 3, borderRadius: '20px 20px 0 0',
            background: editingProp
              ? 'linear-gradient(90deg,#60A5FA,rgba(96,165,250,0.12))'
              : 'linear-gradient(90deg,#D4AF37,#F0D060,rgba(212,175,55,0.1))',
          }} />

          {/* Header */}
          <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2 className="f-display" style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.1 }}>
                {editingProp ? 'Edit Listing' : 'New Listing'}
              </h2>
              <p className="f-sans" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                {editingProp ? 'Modify property details below' : 'Fill in the details to add a new property'}
              </p>
            </div>
            <button onClick={onClose} className="btn-ghost" style={{ padding: '6px 10px', flexShrink: 0 }}>
              <IconClose />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Image upload */}
            <div>
              <label className="field-label">Property Image</label>
              {previewUrl ? (
                <div style={{ position: 'relative' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="img-preview" />
                  <button
                    onClick={() => { setPreviewUrl(null); setForm(f => ({ ...f, property_image: null })); }}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(12,12,15,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.55)' }}
                  ><IconClose /></button>
                </div>
              ) : (
                <div
                  className={`drop-zone${dragOver ? ' drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFileChange(f); }}
                >
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e.target.files?.[0] || null)} />
                  <IconUpload />
                  <p className="f-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', margin: 0 }}>Drop image or click to browse</p>
                  <p className="f-sans" style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', margin: 0 }}>JPG, PNG, WEBP · max 10MB</p>
                </div>
              )}
            </div>

            <Field label="Property Name">
              <input className="adm-input" type="text" placeholder="e.g. Palm Signature Villa"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Type">
                <input className="adm-input" type="text" placeholder="Villa, Apt…"
                  value={form.property_type} onChange={e => setForm({ ...form, property_type: e.target.value })} />
              </Field>
              <Field label="Category">
                <input className="adm-input" type="text" placeholder="Residential…"
                  value={form.property} onChange={e => setForm({ ...form, property: e.target.value })} />
              </Field>
            </div>

            <Field label="Location">
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <IconLocation />
                </span>
                <input className="adm-input" type="text" placeholder="e.g. Palm Jumeirah, Dubai"
                  value={form.location} style={{ paddingLeft: 28 }}
                  onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Price (AED)">
                <input className="adm-input" type="number" placeholder="3500000"
                  value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
              </Field>
              <Field label="Status">
                <div className="select-wrap">
                  <select className="adm-select" value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </Field>
            </div>

            <Field label="Description">
              <textarea className="adm-textarea" placeholder="Key features, views, amenities…"
                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </Field>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-gold" onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
                {loading ? (
                  <><div className="spinner" /> Processing…</>
                ) : editingProp ? (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#0C0C0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Update Property</>
                ) : (
                  <><IconPlus /> Create Listing</>
                )}
              </button>
              <button className="btn-ghost" onClick={onClose}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   DELETE MODAL — no animation
───────────────────────────────────────────── */
function DeleteModal({ count, onConfirm, onCancel }: {
  count: number; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <>
      <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', zIndex: 9998, backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ background: '#0D1118', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 16, padding: '32px 28px', maxWidth: 360, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#F87171' }}>
            <IconTrash />
          </div>
          <h3 className="f-display" style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Delete {count > 1 ? `${count} Properties` : 'Property'}?
          </h3>
          <p className="f-sans" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 24 }}>
            This cannot be undone. {count > 1 ? 'These listings' : 'This listing'} will be permanently removed.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn-danger" onClick={onConfirm}
              style={{ background: 'rgba(248,113,113,0.12)', borderColor: 'rgba(248,113,113,0.3)', color: '#F87171', padding: '9px 20px' }}>
              <IconTrash /> Delete {count > 1 ? 'All' : ''}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PropertiesPage() {
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [properties, setProperties]   = useState<Property[]>([]);
  const [fetching, setFetching]       = useState(true);
  const [toast, setToast]             = useState<ToastState>(null);

  const [dialogOpen, setDialogOpen]   = useState(false);
  const [editingProp, setEditingProp] = useState<Property | null>(null);
  const [selected, setSelected]       = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<'selection' | string | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const [page, setPage]               = useState(0);

  const showToast = (message: string, kind: 'success' | 'error' = 'success') =>
    setToast({ message, kind });

  /* ── Auth guard — matches middleware /admin/dashboard pattern ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/auth/login');
      } else {
        setAuthChecked(true);
      }
    });

    // Also watch for session expiry mid-session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/auth/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  /* ── Fetch ── */
  const fetchProperties = useCallback(async (silent = false) => {
    if (!silent) setFetching(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) showToast('Failed to load properties', 'error');
    else setProperties((data as Property[]) || []);
    setFetching(false);
  }, []);

  useEffect(() => {
    if (authChecked) fetchProperties();
  }, [authChecked, fetchProperties]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
  const paginated  = properties.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => { setPage(0); setSelected(new Set()); }, [properties.length]);

  /* ── Selection ── */
  const pageIds    = paginated.map(p => p.id);
  const allChecked = pageIds.length > 0 && pageIds.every(id => selected.has(id));
  const someChecked = !allChecked && pageIds.some(id => selected.has(id));

  const toggleAll = () => {
    if (allChecked) {
      setSelected(prev => { const s = new Set(prev); pageIds.forEach(id => s.delete(id)); return s; });
    } else {
      setSelected(prev => { const s = new Set(prev); pageIds.forEach(id => s.add(id)); return s; });
    }
  };
  const toggleOne = (id: string) => {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  };

  /* ── Delete ── */
  const confirmDelete = (target: 'selection' | string) => setDeleteTarget(target);

  const executeDelete = async () => {
    setDeleting(true);
    const ids = deleteTarget === 'selection' ? [...selected] : [deleteTarget as string];
    const { error } = await supabase.from('properties').delete().in('id', ids);
    if (error) showToast('Delete failed', 'error');
    else {
      showToast(`Deleted ${ids.length} ${ids.length === 1 ? 'property' : 'properties'}`);
      setSelected(prev => { const s = new Set(prev); ids.forEach(id => s.delete(id)); return s; });
      fetchProperties(true);
    }
    setDeleteTarget(null);
    setDeleting(false);
  };

  /* ── Page numbers ── */
  function buildPageNumbers(current: number, total: number) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i);
    const pages: (number | '...')[] = [];
    if (current <= 3) {
      pages.push(0, 1, 2, 3, '...', total - 1);
    } else if (current >= total - 4) {
      pages.push(0, '...', total - 4, total - 3, total - 2, total - 1);
    } else {
      pages.push(0, '...', current - 1, current, current + 1, '...', total - 1);
    }
    return pages;
  }
  const pageNumbers = buildPageNumbers(page, totalPages);

  /* ── Render: block until auth resolved ── */
  if (!authChecked) {
    return (
      <>
        <style>{G}</style>
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0C0C0F' }}>
          <div className="spinner-white" />
        </div>
      </>
    );
  }

  return (
    <>
      <style>{G}</style>
      <Toast toast={toast} onClose={() => setToast(null)} />

      <PropertyDialog
        open={dialogOpen}
        editingProp={editingProp}
        onClose={() => { setDialogOpen(false); setEditingProp(null); }}
        onSaved={() => fetchProperties(true)}
      />

      {deleteTarget && (
        <DeleteModal
          count={deleteTarget === 'selection' ? selected.size : 1}
          onConfirm={executeDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="f-sans" style={{ background: '#0C0C0F', minHeight: '100%' }}>
        <div className="p-4 sm:p-5" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ══ Table card ══ */}
          <div style={{ background: '#0D1118', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, overflow: 'hidden' }}>

            {/* Toolbar */}
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 12, flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <IconBuilding />
                <div>
                  <h2 className="f-display" style={{ fontSize: 19, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.1 }}>
                    Active Listings <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>Portfolio</em>
                  </h2>
                  <p className="f-sans" style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'} · page {page + 1} of {totalPages}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                {selected.size > 0 && (
                  <button className="btn-danger" onClick={() => confirmDelete('selection')} style={{ fontSize: 12, padding: '8px 14px' }}>
                    <IconTrash /> Delete {selected.size} selected
                  </button>
                )}
                <button className="btn-ghost" onClick={() => fetchProperties()} style={{ fontSize: 11, padding: '7px 13px' }}>
                  <IconRefresh /> Refresh
                </button>
                <button className="btn-gold" onClick={() => { setEditingProp(null); setDialogOpen(true); }}>
                  <IconPlus /> Add Property
                </button>
              </div>
            </div>

            {/* Table body */}
            {fetching ? (
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="skeleton" style={{ height: 11, width: '50%' }} />
                      <div className="skeleton" style={{ height: 9, width: '30%' }} />
                    </div>
                    <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 100, flexShrink: 0 }} />
                    <div className="skeleton" style={{ height: 11, width: 80, flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div style={{ padding: '56px 22px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconBuilding />
                </div>
                <p className="f-display" style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: 0 }}>No Listings Yet</p>
                <p className="f-sans" style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)', margin: 0 }}>Click "Add Property" to create your first listing.</p>
                <button className="btn-gold" onClick={() => { setEditingProp(null); setDialogOpen(true); }} style={{ marginTop: 8 }}>
                  <IconPlus /> Add Property
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead>
                    <tr>
                      <th className="tbl-head" style={{ width: 44, paddingRight: 8 }}>
                        <input
                          type="checkbox" className="chk"
                          checked={allChecked}
                          ref={el => { if (el) el.indeterminate = someChecked; }}
                          onChange={toggleAll}
                        />
                      </th>
                      <th className="tbl-head" style={{ width: 36 }}>#</th>
                      <th className="tbl-head">Image</th>
                      <th className="tbl-head">Property</th>
                      <th className="tbl-head">Type</th>
                      <th className="tbl-head">Category</th>
                      <th className="tbl-head">Location</th>
                      <th className="tbl-head">Price</th>
                      <th className="tbl-head">Status</th>
                      <th className="tbl-head">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((prop, idx) => {
                      const rowNum     = page * PAGE_SIZE + idx + 1;
                      const isSelected = selected.has(prop.id);
                      return (
                        <tr key={prop.id} className={`tbl-row${isSelected ? ' selected' : ''}`}>
                          <td className="tbl-cell" style={{ paddingRight: 8, width: 44 }}>
                            <input type="checkbox" className="chk"
                              checked={isSelected} onChange={() => toggleOne(prop.id)} />
                          </td>
                          <td className="tbl-cell" style={{ width: 36 }}>
                            <span className="f-sans" style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', fontWeight: 600 }}>
                              {rowNum}
                            </span>
                          </td>
                          <td className="tbl-cell" style={{ width: 72 }}>
                            {prop.property_image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={prop.property_image} alt={prop.name}
                                style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', display: 'block' }} />
                            ) : (
                              <div style={{ width: 56, height: 42, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconBuilding />
                              </div>
                            )}
                          </td>
                          <td className="tbl-cell">
                            <p className="f-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.2, whiteSpace: 'nowrap' }}>
                              {prop.name}
                            </p>
                            {prop.description && (
                              <p className="f-sans" style={{ fontSize: 10, color: 'rgba(255,255,255,0.27)', margin: '2px 0 0', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {prop.description}
                              </p>
                            )}
                          </td>
                          <td className="tbl-cell">
                            <span className="f-sans" style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                              {prop.property_type || '—'}
                            </span>
                          </td>
                          <td className="tbl-cell">
                            <span className="f-sans" style={{ fontSize: 10, color: 'rgba(196,181,253,0.8)', background: 'rgba(196,181,253,0.07)', border: '1px solid rgba(196,181,253,0.15)', borderRadius: 6, padding: '3px 8px', whiteSpace: 'nowrap' }}>
                              {prop.property || '—'}
                            </span>
                          </td>
                          <td className="tbl-cell">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
                              <IconLocation />
                              <span className="f-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{prop.location || '—'}</span>
                            </div>
                          </td>
                          <td className="tbl-cell" style={{ whiteSpace: 'nowrap' }}>
                            <span className="f-display" style={{ fontSize: 14, fontWeight: 700, color: '#D4AF37' }}>
                              {fmtPrice(Number(prop.price))}
                            </span>
                          </td>
                          <td className="tbl-cell">
                            <div className="status-badge" style={statusStyle(prop.status)}>
                              <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusDot(prop.status), flexShrink: 0 }} />
                              {prop.status}
                            </div>
                          </td>
                          <td className="tbl-cell">
                            <div style={{ display: 'flex', gap: 5 }}>
                              <button className="btn-ghost" style={{ padding: '6px 11px' }}
                                onClick={() => { setEditingProp(prop); setDialogOpen(true); }}>
                                <IconEdit /> Edit
                              </button>
                              <button className="btn-danger" style={{ padding: '6px 11px' }}
                                onClick={() => confirmDelete(prop.id)}>
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination footer */}
            {!fetching && properties.length > 0 && (
              <div style={{
                padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 12, flexWrap: 'wrap',
              }}>
                <p className="f-sans" style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', margin: 0 }}>
                  Showing{' '}
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, properties.length)}
                  </span>
                  {' '}of{' '}
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{properties.length}</span>
                  {selected.size > 0 && (
                    <span style={{ color: '#D4AF37' }}> · {selected.size} selected</span>
                  )}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                  <button className="btn-page" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                    <IconChevronLeft />
                  </button>
                  {pageNumbers.map((p, i) =>
                    p === '...' ? (
                      <span key={`dots-${i}`} className="f-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', padding: '0 4px' }}>…</span>
                    ) : (
                      <button key={p} className={`btn-page${page === p ? ' active' : ''}`} onClick={() => setPage(p as number)}>
                        {(p as number) + 1}
                      </button>
                    )
                  )}
                  <button className="btn-page" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}>
                    <IconChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}