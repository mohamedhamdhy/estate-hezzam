'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmerLoad {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Inputs ── */
  .adm-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #E2E8F0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .adm-input::placeholder { color: rgba(255,255,255,0.2); }
  .adm-input:focus {
    border-color: rgba(212,175,55,0.45);
    background: rgba(212,175,55,0.04);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
  }
  .adm-input:hover:not(:focus) { border-color: rgba(255,255,255,0.18); }

  /* ── Select ── */
  .adm-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #E2E8F0;
    outline: none;
    cursor: pointer;
    appearance: none;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .adm-select:focus {
    border-color: rgba(212,175,55,0.45);
    background: rgba(212,175,55,0.04);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
  }
  .adm-select option { background: #0D1118; color: #E2E8F0; }

  /* ── Textarea ── */
  .adm-textarea {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    padding: 12px 14px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #E2E8F0;
    outline: none;
    resize: vertical;
    min-height: 90px;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    line-height: 1.6;
  }
  .adm-textarea::placeholder { color: rgba(255,255,255,0.2); }
  .adm-textarea:focus {
    border-color: rgba(212,175,55,0.45);
    background: rgba(212,175,55,0.04);
    box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
  }

  /* ── Drop zone ── */
  .drop-zone {
    border: 1.5px dashed rgba(255,255,255,0.12);
    border-radius: 12px;
    padding: 24px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .drop-zone:hover, .drop-zone.drag-over {
    border-color: rgba(212,175,55,0.4);
    background: rgba(212,175,55,0.04);
  }
  .drop-zone input[type=file] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  /* ── Table ── */
  .tbl-row {
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: background 0.15s;
  }
  .tbl-row:hover { background: rgba(255,255,255,0.025); }
  .tbl-row:last-child { border-bottom: none; }
  .tbl-head {
    font-family: 'Outfit', sans-serif;
    font-size: 9px;
    font-weight: 700;
    color: rgba(255,255,255,0.25);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    white-space: nowrap;
  }
  .tbl-cell {
    padding: 14px 16px;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: rgba(255,255,255,0.75);
    vertical-align: middle;
  }

  /* ── Buttons ── */
  .btn-gold {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    background: #D4AF37;
    color: #0C0C0F;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    padding: 12px 24px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 24px rgba(212,175,55,0.22);
    letter-spacing: 0.01em;
    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .btn-gold:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(212,175,55,0.38);
  }
  .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: transparent;
    color: rgba(255,255,255,0.55);
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .btn-ghost:hover {
    border-color: rgba(212,175,55,0.3);
    color: #D4AF37;
    background: rgba(212,175,55,0.05);
  }

  .btn-danger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    background: transparent;
    color: rgba(248,113,113,0.7);
    font-family: 'Outfit', sans-serif;
    font-size: 12px;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(248,113,113,0.15);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    white-space: nowrap;
  }
  .btn-danger:hover {
    border-color: rgba(248,113,113,0.35);
    color: #F87171;
    background: rgba(248,113,113,0.06);
  }

  /* ── Misc ── */
  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(12,12,15,0.3);
    border-top-color: #0C0C0F;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }

  .skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 400px 100%;
    animation: shimmerLoad 1.4s infinite;
    border-radius: 6px;
  }

  .field-label {
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: rgba(255,255,255,0.3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
    display: block;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'Outfit', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 100px;
  }

  .select-wrap { position: relative; }
  .select-wrap::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid rgba(255,255,255,0.3);
    pointer-events: none;
  }

  .img-preview {
    width: 100%;
    height: 160px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.08);
    display: block;
  }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
    background: #0D1118;
    border: 1px solid rgba(212,175,55,0.3);
    border-radius: 12px;
    padding: 13px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.6);
    animation: toastIn 0.25s ease both;
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    color: #E2E8F0;
    min-width: 220px;
    max-width: 320px;
  }
  .toast.error { border-color: rgba(248,113,113,0.3); }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.3); }
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
}

type ToastState = { message: string; kind: 'success' | 'error' } | null;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function statusStyle(s: string): React.CSSProperties {
  const m: Record<string, React.CSSProperties> = {
    Available: {
      background: 'rgba(52,211,153,0.12)',
      color: '#34D399',
      border: '1px solid rgba(52,211,153,0.25)',
    },
    Sold: {
      background: 'rgba(212,175,55,0.12)',
      color: '#D4AF37',
      border: '1px solid rgba(212,175,55,0.25)',
    },
    Reserved: {
      background: 'rgba(96,165,250,0.12)',
      color: '#60A5FA',
      border: '1px solid rgba(96,165,250,0.25)',
    },
  };
  return m[s] ?? m['Available'];
}

function statusDot(s: string) {
  return s === 'Available' ? '#34D399' : s === 'Sold' ? '#D4AF37' : '#60A5FA';
}

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const IconEdit = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconTrash = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconClose = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const IconUpload = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
      stroke="rgba(212,175,55,0.55)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconLocation = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="rgba(212,175,55,0.5)">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
  </svg>
);
const IconBuilding = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      stroke="rgba(212,175,55,0.5)"
      strokeWidth="1.6"
      fill="none"
      strokeLinejoin="round"
    />
    <path
      d="M9 22V12h6v10"
      stroke="rgba(212,175,55,0.5)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const IconRefresh = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path
      d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   FIELD WRAPPER
───────────────────────────────────────────── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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
    <div className={`toast${toast.kind === 'error' ? ' error' : ''}`}>
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: toast.kind === 'success' ? '#34D399' : '#F87171',
          flexShrink: 0,
          animation: 're-pulse 1.5s infinite',
        }}
      />
      <span className="f-sans" style={{ flex: 1 }}>
        {toast.message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(255,255,255,0.3)',
          padding: 0,
          display: 'flex',
          flexShrink: 0,
        }}
      >
        <IconClose />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState<ToastState>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    property_type: '',
    property: '',
    price: 0,
    property_image: null as File | null,
    status: 'Available',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const showToast = (message: string, kind: 'success' | 'error' = 'success') =>
    setToast({ message, kind });

  /* ── Fetch ── */
  const fetchProperties = async (silent = false) => {
    if (!silent) setFetching(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) showToast('Failed to load properties', 'error');
    else setProperties(data as Property[]);
    setFetching(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  /* ── Image upload ── */
  const uploadImage = async (file: File) => {
    const ext = file.name.split('.').pop();
    const name = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('property-images')
      .upload(name, file);
    if (error) return null;
    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(name);
    return data.publicUrl;
  };

  /* ── File change ── */
  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setForm((f) => ({ ...f, property_image: file }));
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.price) {
      showToast('Please fill in Name, Location, and Price', 'error');
      return;
    }
    setLoading(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        showToast('You must be logged in', 'error');
        return;
      }

      let imageUrl = null;
      if (form.property_image) {
        imageUrl = await uploadImage(form.property_image);
        if (!imageUrl) {
          showToast('Image upload failed', 'error');
          return;
        }
      }

      const payload = {
        name: form.name,
        description: form.description,
        location: form.location,
        property_type: form.property_type,
        property: form.property,
        price: form.price,
        status: form.status,
        user_id: user.id,
        ...(imageUrl && { property_image: imageUrl }),
      };

      if (editingId) {
        const { error } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
        showToast('Property updated');
      } else {
        const { error } = await supabase.from('properties').insert([payload]);
        if (error) throw error;
        showToast('Property created');
      }

      resetForm();
      fetchProperties(true);
    } catch (err: any) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── Edit ── */
  const handleEdit = (prop: Property) => {
    setEditingId(prop.id);
    setPreviewUrl(prop.property_image);
    setForm({
      name: prop.name || '',
      description: prop.description || '',
      location: prop.location || '',
      property_type: prop.property_type || '',
      property: prop.property || '',
      price: Number(prop.price) || 0,
      property_image: null,
      status: prop.status || 'Available',
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ── Delete ── */
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('properties').delete().eq('id', id);
    if (error) showToast('Delete failed', 'error');
    else {
      showToast('Property deleted');
      fetchProperties(true);
    }
    setDeleteConfirmId(null);
  };

  /* ── Reset ── */
  const resetForm = () => {
    setEditingId(null);
    setPreviewUrl(null);
    setForm({
      name: '',
      description: '',
      location: '',
      property_type: '',
      property: '',
      price: 0,
      property_image: null,
      status: 'Available',
    });
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <>
      <style>{G}</style>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Delete modal ── */}
      {deleteConfirmId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#0D1118',
              border: '1px solid rgba(248,113,113,0.25)',
              borderRadius: 16,
              padding: '32px 28px',
              maxWidth: 360,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#F87171',
              }}
            >
              <IconTrash />
            </div>
            <h3
              className="f-display"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 8,
              }}
            >
              Delete Property?
            </h3>
            <p
              className="f-sans"
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.65,
                marginBottom: 24,
              }}
            >
              This cannot be undone. The listing will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                className="btn-ghost"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                style={{
                  background: 'rgba(248,113,113,0.12)',
                  borderColor: 'rgba(248,113,113,0.3)',
                  color: '#F87171',
                  padding: '9px 20px',
                }}
                onClick={() => handleDelete(deleteConfirmId)}
              >
                <IconTrash /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page ── */}
      <div
        className="f-sans"
        style={{ background: '#0C0C0F', minHeight: '100vh' }}
      >
        {/* ── Page header ── */}
        <div
          style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '20px 24px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div
              style={{
                width: 34,
                height: 34,
                background: 'rgba(212,175,55,0.1)',
                border: '1px solid rgba(212,175,55,0.22)',
                borderRadius: 9,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IconBuilding />
            </div>
            <div>
              <p
                className="f-sans"
                style={{
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Properties
              </p>
              <h1
                className="f-display"
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#fff',
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                Listings{' '}
                <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                  Management
                </em>
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#34D399',
                animation: 're-pulse 2s infinite',
              }}
            />
            <span
              className="f-sans"
              style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)' }}
            >
              {properties.length}{' '}
              {properties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="p-4 sm:p-6">
          {/*
            Responsive layout:
            - Mobile  (default):   single column, form on top, table below
            - Tablet  (md):        single column still, slightly more padding
            - Desktop (lg):        side by side — form 380px fixed, table fills rest
          */}
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* ══ FORM (left on desktop, top on mobile) ══ */}
            <div
              ref={formRef}
              className="w-full lg:w-[380px] lg:flex-shrink-0"
              style={{
                background: '#0D1118',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                overflow: 'hidden',
              }}
            >
              {/* Accent line */}
              <div
                style={{
                  height: 3,
                  background: editingId
                    ? 'linear-gradient(90deg,#60A5FA,rgba(96,165,250,0.15))'
                    : 'linear-gradient(90deg,#D4AF37,#F0D060,rgba(212,175,55,0.12))',
                }}
              />

              <div className="p-5 sm:p-6">
                {/* Form header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <h2
                      className="f-display"
                      style={{
                        fontSize: 19,
                        fontWeight: 700,
                        color: '#fff',
                        margin: 0,
                        lineHeight: 1.1,
                      }}
                    >
                      {editingId ? 'Edit Listing' : 'New Listing'}
                    </h2>
                    <p
                      className="f-sans"
                      style={{
                        fontSize: 11,
                        color: 'rgba(255,255,255,0.28)',
                        marginTop: 3,
                      }}
                    >
                      {editingId
                        ? 'Modify property details'
                        : 'Add a new property'}
                    </p>
                  </div>
                  {editingId && (
                    <button
                      className="btn-ghost"
                      onClick={resetForm}
                      style={{ padding: '6px 10px', flexShrink: 0 }}
                    >
                      <IconClose />
                    </button>
                  )}
                </div>

                {/* Image upload */}
                <div style={{ marginBottom: 16 }}>
                  <label className="field-label">Property Image</label>
                  {previewUrl ? (
                    <div style={{ position: 'relative' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="img-preview"
                      />
                      <button
                        onClick={() => {
                          setPreviewUrl(null);
                          setForm((f) => ({ ...f, property_image: null }));
                        }}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(12,12,15,0.85)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 6,
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'rgba(255,255,255,0.55)',
                        }}
                      >
                        <IconClose />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`drop-zone${dragOver ? ' drag-over' : ''}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        const f = e.dataTransfer.files?.[0];
                        if (f) handleFileChange(f);
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(e.target.files?.[0] || null)
                        }
                      />
                      <IconUpload />
                      <p
                        className="f-sans"
                        style={{
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.38)',
                          margin: 0,
                        }}
                      >
                        Drop image or click to browse
                      </p>
                      <p
                        className="f-sans"
                        style={{
                          fontSize: 10,
                          color: 'rgba(255,255,255,0.18)',
                          margin: 0,
                        }}
                      >
                        JPG, PNG, WEBP · max 10MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Fields */}
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 13 }}
                >
                  <Field label="Property Name">
                    <input
                      className="adm-input"
                      type="text"
                      placeholder="e.g. Palm Signature Villa"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Type">
                      <input
                        className="adm-input"
                        type="text"
                        placeholder="Villa, Apt…"
                        value={form.property_type}
                        onChange={(e) =>
                          setForm({ ...form, property_type: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Category">
                      <input
                        className="adm-input"
                        type="text"
                        placeholder="Residential…"
                        value={form.property}
                        onChange={(e) =>
                          setForm({ ...form, property: e.target.value })
                        }
                      />
                    </Field>
                  </div>

                  <Field label="Location">
                    <div style={{ position: 'relative' }}>
                      <span
                        style={{
                          position: 'absolute',
                          left: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          pointerEvents: 'none',
                        }}
                      >
                        <IconLocation />
                      </span>
                      <input
                        className="adm-input"
                        type="text"
                        placeholder="e.g. Palm Jumeirah, Dubai"
                        value={form.location}
                        style={{ paddingLeft: 28 }}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                      />
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Price (AED)">
                      <input
                        className="adm-input"
                        type="number"
                        placeholder="3500000"
                        value={form.price || ''}
                        onChange={(e) =>
                          setForm({ ...form, price: Number(e.target.value) })
                        }
                      />
                    </Field>
                    <Field label="Status">
                      <div className="select-wrap">
                        <select
                          className="adm-select"
                          value={form.status}
                          onChange={(e) =>
                            setForm({ ...form, status: e.target.value })
                          }
                        >
                          <option value="Available">Available</option>
                          <option value="Sold">Sold</option>
                          <option value="Reserved">Reserved</option>
                        </select>
                      </div>
                    </Field>
                  </div>

                  <Field label="Description">
                    <textarea
                      className="adm-textarea"
                      placeholder="Key features, views, amenities…"
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </Field>

                  <div
                    style={{ height: 1, background: 'rgba(255,255,255,0.06)' }}
                  />

                  <div className="flex gap-2">
                    <button
                      className="btn-gold"
                      onClick={handleSubmit}
                      disabled={loading}
                      style={{ flex: 1 }}
                    >
                      {loading ? (
                        <>
                          <div className="spinner" /> Processing…
                        </>
                      ) : editingId ? (
                        <>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M5 12l5 5L20 7"
                              stroke="#0C0C0F"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Update Property
                        </>
                      ) : (
                        <>
                          <IconPlus /> Create Listing
                        </>
                      )}
                    </button>
                    {editingId && (
                      <button className="btn-ghost" onClick={resetForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ══ TABLE (right on desktop, bottom on mobile) ══ */}
            <div
              className="w-full min-w-0"
              style={{
                background: '#0D1118',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                overflow: 'hidden',
              }}
            >
              {/* Table header */}
              <div
                style={{
                  padding: '18px 22px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h2
                    className="f-display"
                    style={{
                      fontSize: 19,
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0,
                    }}
                  >
                    Active Listings{' '}
                    <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                      Portfolio
                    </em>
                  </h2>
                  <p
                    className="f-sans"
                    style={{
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.28)',
                      marginTop: 3,
                    }}
                  >
                    {properties.length}{' '}
                    {properties.length === 1 ? 'property' : 'properties'} in
                    database
                  </p>
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => fetchProperties()}
                  style={{ fontSize: 11, padding: '7px 13px' }}
                >
                  <IconRefresh /> Refresh
                </button>
              </div>

              {/* Table body */}
              {fetching ? (
                <div
                  style={{
                    padding: 22,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{ display: 'flex', gap: 14, alignItems: 'center' }}
                    >
                      <div
                        className="skeleton"
                        style={{
                          width: 64,
                          height: 48,
                          borderRadius: 8,
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <div
                          className="skeleton"
                          style={{ height: 11, width: '55%' }}
                        />
                        <div
                          className="skeleton"
                          style={{ height: 9, width: '35%' }}
                        />
                      </div>
                      <div
                        className="skeleton"
                        style={{ height: 11, width: 70, flexShrink: 0 }}
                      />
                    </div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div
                  style={{
                    padding: '56px 22px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      background: 'rgba(212,175,55,0.07)',
                      border: '1px solid rgba(212,175,55,0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconBuilding />
                  </div>
                  <p
                    className="f-display"
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0,
                    }}
                  >
                    No Listings Yet
                  </p>
                  <p
                    className="f-sans"
                    style={{
                      fontSize: 13,
                      color: 'rgba(255,255,255,0.28)',
                      margin: 0,
                    }}
                  >
                    Create your first property using the form.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                  }}
                >
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      minWidth: 600,
                    }}
                  >
                    <thead>
                      <tr>
                        {[
                          'Image',
                          'Property',
                          'Type',
                          'Location',
                          'Price',
                          'Status',
                          'Actions',
                        ].map((h) => (
                          <th
                            key={h}
                            className="tbl-head"
                            style={{ textAlign: 'left' }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((prop) => (
                        <tr key={prop.id} className="tbl-row">
                          {/* Image */}
                          <td className="tbl-cell" style={{ width: 76 }}>
                            {prop.property_image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={prop.property_image}
                                alt={prop.name}
                                style={{
                                  width: 64,
                                  height: 48,
                                  objectFit: 'cover',
                                  borderRadius: 8,
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  display: 'block',
                                }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: 64,
                                  height: 48,
                                  borderRadius: 8,
                                  background: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.07)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <IconBuilding />
                              </div>
                            )}
                          </td>

                          {/* Name */}
                          <td className="tbl-cell">
                            <p
                              className="f-display"
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#fff',
                                margin: 0,
                                lineHeight: 1.2,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {prop.name}
                            </p>
                            {prop.description && (
                              <p
                                className="f-sans"
                                style={{
                                  fontSize: 10,
                                  color: 'rgba(255,255,255,0.27)',
                                  margin: '3px 0 0',
                                  maxWidth: 150,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {prop.description}
                              </p>
                            )}
                          </td>

                          {/* Type */}
                          <td className="tbl-cell">
                            <span
                              className="f-sans"
                              style={{
                                fontSize: 10,
                                color: 'rgba(255,255,255,0.45)',
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 6,
                                padding: '3px 8px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {prop.property_type || '—'}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="tbl-cell">
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <IconLocation />
                              <span
                                className="f-sans"
                                style={{
                                  fontSize: 12,
                                  color: 'rgba(255,255,255,0.45)',
                                }}
                              >
                                {prop.location || '—'}
                              </span>
                            </div>
                          </td>

                          {/* Price */}
                          <td
                            className="tbl-cell"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            <span
                              className="f-display"
                              style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: '#D4AF37',
                              }}
                            >
                              AED {Number(prop.price).toLocaleString()}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="tbl-cell">
                            <div
                              className="status-badge"
                              style={statusStyle(prop.status)}
                            >
                              <div
                                style={{
                                  width: 5,
                                  height: 5,
                                  borderRadius: '50%',
                                  background: statusDot(prop.status),
                                  flexShrink: 0,
                                }}
                              />
                              {prop.status}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="tbl-cell">
                            <div style={{ display: 'flex', gap: 5 }}>
                              <button
                                className="btn-ghost"
                                onClick={() => handleEdit(prop)}
                                style={{ padding: '7px 12px' }}
                              >
                                <IconEdit /> Edit
                              </button>
                              <button
                                className="btn-danger"
                                onClick={() => setDeleteConfirmId(prop.id)}
                                style={{ padding: '7px 12px' }}
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
