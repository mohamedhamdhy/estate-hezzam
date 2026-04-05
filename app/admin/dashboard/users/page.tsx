'use client';

import { useState, useEffect } from 'react';
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
  @keyframes spin {
    to { transform:rotate(360deg); }
  }
  @keyframes toastIn {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .skeleton {
    background: linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%);
    background-size: 400px 100%;
    animation: shimmerLoad 1.4s infinite;
    border-radius: 8px;
  }

  .adm-input {
    width:100%;
    background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.09);
    border-radius:10px;
    padding:11px 14px;
    font-family:'Outfit',sans-serif; font-size:13px;
    color:#E2E8F0; outline:none;
    transition:border-color .18s, background .18s, box-shadow .18s;
    box-sizing:border-box;
  }
  .adm-input::placeholder { color:rgba(255,255,255,.2); }
  .adm-input:focus {
    border-color:rgba(212,175,55,.45);
    background:rgba(212,175,55,.04);
    box-shadow:0 0 0 3px rgba(212,175,55,.08);
  }
  .adm-input:hover:not(:focus) { border-color:rgba(255,255,255,.18); }
  .adm-input:disabled { opacity:.4; cursor:not-allowed; }

  .btn-gold {
    display:inline-flex; align-items:center; justify-content:center; gap:7px;
    background:#D4AF37; color:#0C0C0F;
    font-family:'Outfit',sans-serif; font-size:13px; font-weight:700;
    padding:11px 24px; border-radius:10px; border:none;
    cursor:pointer;
    box-shadow:0 0 22px rgba(212,175,55,.22);
    letter-spacing:.01em;
    transition:transform .15s, box-shadow .15s, opacity .15s;
    white-space:nowrap;
  }
  .btn-gold:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 6px 24px rgba(212,175,55,.36); }
  .btn-gold:disabled { opacity:.5; cursor:not-allowed; }

  .btn-ghost {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    background:transparent; color:rgba(255,255,255,.55);
    font-family:'Outfit',sans-serif; font-size:12px; font-weight:500;
    padding:10px 18px; border-radius:9px;
    border:1px solid rgba(255,255,255,.1);
    cursor:pointer;
    transition:border-color .18s, color .18s, background .18s;
    white-space:nowrap;
  }
  .btn-ghost:hover { border-color:rgba(212,175,55,.3); color:#D4AF37; background:rgba(212,175,55,.05); }

  .btn-danger {
    display:inline-flex; align-items:center; justify-content:center; gap:6px;
    background:rgba(248,113,113,.06); color:rgba(248,113,113,.7);
    font-family:'Outfit',sans-serif; font-size:12px; font-weight:500;
    padding:10px 18px; border-radius:9px;
    border:1px solid rgba(248,113,113,.18);
    cursor:pointer;
    transition:border-color .18s, color .18s, background .18s;
    white-space:nowrap;
  }
  .btn-danger:hover { border-color:rgba(248,113,113,.35); color:#F87171; background:rgba(248,113,113,.1); }

  .spinner {
    width:14px; height:14px;
    border:2px solid rgba(12,12,15,.3);
    border-top-color:#0C0C0F;
    border-radius:50%;
    animation:spin .65s linear infinite;
    display:inline-block; flex-shrink:0;
  }

  .field-label {
    font-family:'Outfit',sans-serif; font-size:10px; font-weight:600;
    color:rgba(255,255,255,.28); text-transform:uppercase;
    letter-spacing:.1em; margin-bottom:6px; display:block;
  }

  .avatar-zone { position:relative; cursor:pointer; border-radius:50%; overflow:hidden; }
  .avatar-overlay {
    position:absolute; inset:0;
    background:rgba(0,0,0,.52);
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .18s;
    border-radius:50%;
  }
  .avatar-zone:hover .avatar-overlay { opacity:1; }
  .avatar-overlay input[type=file] {
    position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%;
  }

  .panel {
    background:#0D1118;
    border:1px solid rgba(255,255,255,.08);
    border-radius:18px;
    overflow:hidden;
  }

  .read-row {
    display:flex; align-items:center; gap:10px;
    padding:11px 14px;
    background:rgba(255,255,255,.02);
    border:1px solid rgba(255,255,255,.06);
    border-radius:10px;
  }

  .toast {
    position:fixed; bottom:22px; right:22px; z-index:9999;
    background:#0D1118; border-radius:12px;
    padding:12px 18px;
    display:flex; align-items:center; gap:10px;
    box-shadow:0 16px 40px rgba(0,0,0,.6);
    animation:toastIn .22s ease both;
    font-family:'Outfit',sans-serif; font-size:13px; color:#E2E8F0;
    min-width:200px; max-width:300px;
  }
  .toast.success { border:1px solid rgba(52,211,153,.3); }
  .toast.error   { border:1px solid rgba(248,113,113,.3); }

  .modal-backdrop {
    position:fixed; inset:0; background:rgba(0,0,0,.72);
    display:flex; align-items:center; justify-content:center;
    z-index:9998; padding:16px;
  }

  ::-webkit-scrollbar { width:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(255,255,255,.08); border-radius:3px; }
  ::-webkit-scrollbar-thumb:hover { background:rgba(212,175,55,.25); }
`;

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  phone: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string | null;
}
type ToastState = { message: string; kind: 'success' | 'error' } | null;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function initials(u: UserProfile | null) {
  if (u?.username) return u.username.slice(0, 2).toUpperCase();
  if (u?.email)    return u.email.slice(0, 2).toUpperCase();
  return 'AD';
}

/* ─────────────────────────────────────────────
   ICONS (inline SVG)
───────────────────────────────────────────── */
const IEdit  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ISave  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IClose = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>;
const ICam   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="rgba(255,255,255,.85)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" stroke="rgba(255,255,255,.85)" strokeWidth="1.6"/></svg>;
const ISignOut = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>;

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
   TOAST
───────────────────────────────────────────── */
function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div className={`toast ${toast.kind}`}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: toast.kind === 'success' ? '#34D399' : '#F87171', flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.3)', padding: 0, display: 'flex', flexShrink: 0 }}><IClose /></button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProfilePage() {
  const [profile,   setProfile]   = useState<UserProfile | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [showOut,   setShowOut]   = useState(false);
  const [toast,     setToast]     = useState<ToastState>(null);

  const [form, setForm] = useState({ username: '', phone: '' });

  const showToast = (message: string, kind: 'success' | 'error' = 'success') =>
    setToast({ message, kind });

  /* ── Fetch ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/admin/auth/login'; return; }
      const { data, error } = await supabase
        .from('users').select('*').eq('id', user.id).single();
      if (error || !data) { showToast('Failed to load profile', 'error'); }
      else {
        setProfile(data as UserProfile);
        setForm({ username: data.username ?? '', phone: data.phone ?? '' });
      }
      setLoading(false);
    })();
  }, []);

  /* ── Avatar upload ── */
  const handleAvatar = async (file: File | null) => {
    if (!file || !profile) return;
    setUploading(true);
    const ext  = file.name.split('.').pop();
    const name = `avatar-${profile.id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('property-images').upload(name, file, { upsert: true });
    if (upErr) { showToast('Image upload failed', 'error'); setUploading(false); return; }
    const { data: pub } = supabase.storage.from('property-images').getPublicUrl(name);
    const url = pub.publicUrl;
    const { error: dbErr } = await supabase.from('users')
      .update({ profile_image: url, updated_at: new Date().toISOString() }).eq('id', profile.id);
    if (dbErr) showToast('Failed to save image', 'error');
    else { setProfile(p => p ? { ...p, profile_image: url } : p); showToast('Photo updated'); }
    setUploading(false);
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!profile) return;
    if (!form.username.trim()) { showToast('Username is required', 'error'); return; }
    setSaving(true);
    const { error } = await supabase.from('users').update({
      username:   form.username.trim(),
      phone:      form.phone.trim() || null,
      updated_at: new Date().toISOString(),
    }).eq('id', profile.id);
    if (error) showToast('Update failed: ' + error.message, 'error');
    else {
      setProfile(p => p ? { ...p, username: form.username.trim(), phone: form.phone.trim() || null, updated_at: new Date().toISOString() } : p);
      setEditing(false);
      showToast('Profile updated');
    }
    setSaving(false);
  };

  /* ── Cancel ── */
  const handleCancel = () => {
    if (profile) setForm({ username: profile.username ?? '', phone: profile.phone ?? '' });
    setEditing(false);
  };

  /* ── Logout ── */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  /* ── Skeleton ── */
  if (loading) {
    return (
      <div style={{ padding: '28px 24px' }}>
        <style>{G}</style>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="skeleton" style={{ height: 380, borderRadius: 18 }} />
          <div className="skeleton" style={{ height: 380, borderRadius: 18 }} />
        </div>
      </div>
    );
  }

  const ini = initials(profile);

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <>
      <style>{G}</style>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Sign-out modal */}
      {showOut && (
        <div className="modal-backdrop">
          <div style={{ background: '#0D1118', border: '1px solid rgba(248,113,113,.25)', borderRadius: 16, padding: '30px 26px', maxWidth: 340, width: '100%', textAlign: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#F87171' }}>
              <ISignOut />
            </div>
            <h3 className="f-display" style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Sign Out?</h3>
            <p className="f-sans" style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', lineHeight: 1.65, marginBottom: 22 }}>
              You'll be redirected to the login page.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="btn-ghost" onClick={() => setShowOut(false)}>Cancel</button>
              <button className="btn-danger" style={{ padding: '10px 22px', fontSize: 13 }} onClick={handleLogout}>
                <ISignOut /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', width: 500, height: 500, top: -60, right: -80, background: 'radial-gradient(circle,rgba(212,175,55,.07) 0%,transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', width: 380, height: 380, bottom: 0, left: -50, background: 'radial-gradient(circle,rgba(26,110,142,.08) 0%,transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '24px' }}>

        {/* ══════════════════════════════════════
            50/50 GRID
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ━━━ LEFT — Profile card ━━━ */}
          <div className="panel">
            {/* Gold top accent */}
            <div style={{ height: 3, background: 'linear-gradient(90deg,#D4AF37,#F0D060,rgba(212,175,55,.12))' }} />

            <div style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div
                  className="avatar-zone"
                  style={{ width: 108, height: 108, boxShadow: '0 0 0 3px rgba(212,175,55,.24), 0 12px 36px rgba(0,0,0,.5)' }}
                >
                  {profile?.profile_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.profile_image}
                      alt={profile.username ?? 'Avatar'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: 108, height: 108, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(212,175,55,.2),rgba(26,110,142,.2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="f-display" style={{ fontSize: 36, fontWeight: 700, color: '#D4AF37' }}>{ini}</span>
                    </div>
                  )}
                  <div className="avatar-overlay">
                    {uploading
                      ? <div className="spinner" style={{ borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} />
                      : <ICam />
                    }
                    {!uploading && (
                      <input type="file" accept="image/*" onChange={e => handleAvatar(e.target.files?.[0] ?? null)} />
                    )}
                  </div>
                </div>
                {/* Online dot */}
                <div style={{ position: 'absolute', bottom: 5, right: 5, width: 13, height: 13, borderRadius: '50%', background: '#34D399', border: '2px solid #0D1118' }} />
              </div>

              {/* Name */}
              <div style={{ textAlign: 'center' }}>
                <h2 className="f-display" style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1.1 }}>
                  {profile?.username || 'Admin User'}
                </h2>
                <p className="f-sans" style={{ fontSize: 11, color: '#D4AF37', fontWeight: 500, margin: 0 }}>
                  Real Estate Specialist
                </p>
              </div>

              {/* Status + Role badges */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <span className="f-sans" style={{ fontSize: 10, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,.12)', border: '1px solid rgba(52,211,153,.25)', borderRadius: 100, padding: '4px 12px', letterSpacing: '.05em', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34D399', display: 'block' }} />
                  Active
                </span>
                <span className="f-sans" style={{ fontSize: 10, fontWeight: 700, color: '#60A5FA', background: 'rgba(96,165,250,.12)', border: '1px solid rgba(96,165,250,.25)', borderRadius: 100, padding: '4px 12px', letterSpacing: '.05em' }}>
                  Admin
                </span>
              </div>

              <div style={{ height: 1, background: 'rgba(255,255,255,.06)', width: '100%' }} />

              {/* Info rows */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Email — display only */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="field-label">Email</span>
                  <div className="read-row">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: 'rgba(212,175,55,.5)' }}>
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    </svg>
                    <span className="f-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profile?.email || '—'}
                    </span>
                    <span className="f-sans" style={{ fontSize: 9, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,.1)', border: '1px solid rgba(52,211,153,.2)', borderRadius: 100, padding: '2px 8px', flexShrink: 0 }}>
                      Verified
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="field-label">Phone</span>
                  <div className="read-row">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: 'rgba(212,175,55,.5)' }}>
                      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.56.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.56a1 1 0 01-.24 1.01l-2.21 2.22z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="f-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>
                      {profile?.phone || '—'}
                    </span>
                  </div>
                </div>

                {/* Joined */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span className="field-label">Member Since</span>
                  <div className="read-row">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: 'rgba(212,175,55,.5)' }}>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7"/>
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="f-sans" style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>
                      {fmtDate(profile?.created_at ?? null)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo hint */}
              <p className="f-sans" style={{ fontSize: 10, color: 'rgba(255,255,255,.18)', textAlign: 'center', margin: 0 }}>
                Hover avatar to update photo
              </p>

            </div>
          </div>

          {/* ━━━ RIGHT — Edit form ━━━ */}
          <div className="panel">
            {/* Accent line — blue in edit mode, subtle otherwise */}
            <div style={{ height: 3, background: editing ? 'linear-gradient(90deg,#60A5FA,rgba(96,165,250,.12))' : 'linear-gradient(90deg,rgba(255,255,255,.06),transparent)' }} />

            <div style={{ padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 24 }}>
                <div>
                  <h3 className="f-display" style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>
                    {editing ? <>Edit <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>Details</em></> : <>Profile <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>Details</em></>}
                  </h3>
                  <p className="f-sans" style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', margin: 0 }}>
                    {editing ? 'Update your information below' : 'Your current profile information'}
                  </p>
                </div>
                {editing && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#60A5FA', animation: 're-pulse 1.5s infinite' }} />
                    <span className="f-sans" style={{ fontSize: 9, color: '#60A5FA', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Editing</span>
                  </div>
                )}
              </div>

              {/* Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>

                {/* Username */}
                <Field label="Username">
                  {editing ? (
                    <input
                      className="adm-input"
                      type="text"
                      placeholder="Enter username"
                      value={form.username}
                      onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    />
                  ) : (
                    <div className="read-row">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: 'rgba(212,175,55,.45)' }}>
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7"/>
                        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                      </svg>
                      <span className="f-sans" style={{ fontSize: 13, color: profile?.username ? '#E2E8F0' : 'rgba(255,255,255,.25)' }}>
                        {profile?.username || 'Not set'}
                      </span>
                    </div>
                  )}
                </Field>

                {/* Email — always read-only */}
                <Field label="Email Address">
                  <div className="read-row">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: 'rgba(212,175,55,.45)' }}>
                      <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    </svg>
                    <span className="f-sans" style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', flex: 1 }}>
                      {profile?.email || '—'}
                    </span>
                    <span className="f-sans" style={{ fontSize: 9, color: 'rgba(255,255,255,.25)', flexShrink: 0 }}>
                      Not editable
                    </span>
                  </div>
                </Field>

                {/* Phone */}
                <Field label="Phone Number">
                  {editing ? (
                    <input
                      className="adm-input"
                      type="tel"
                      placeholder="+971 50 000 0000"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    />
                  ) : (
                    <div className="read-row">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color: 'rgba(212,175,55,.45)' }}>
                        <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.56.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.56a1 1 0 01-.24 1.01l-2.21 2.22z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="f-sans" style={{ fontSize: 13, color: profile?.phone ? '#E2E8F0' : 'rgba(255,255,255,.25)' }}>
                        {profile?.phone || 'Not set'}
                      </span>
                    </div>
                  )}
                </Field>

              </div>

              {/* Divider */}
              <div style={{ height: 1, background: 'rgba(255,255,255,.06)', margin: '24px 0 20px' }} />

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {!editing ? (
                  <>
                    <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setEditing(true)}>
                      <IEdit /> Edit Profile
                    </button>
                    <button className="btn-danger" onClick={() => setShowOut(true)}>
                      <ISignOut /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-gold" onClick={handleSave} disabled={saving} style={{ flex: 1 }}>
                      {saving ? <><div className="spinner" /> Saving…</> : <><ISave /> Save Changes</>}
                    </button>
                    <button className="btn-ghost" onClick={handleCancel}>
                      <IClose /> Cancel
                    </button>
                  </>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}