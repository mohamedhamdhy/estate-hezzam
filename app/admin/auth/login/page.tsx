'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  .f-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .f-sans    { font-family: 'Outfit', system-ui, sans-serif; }

  @keyframes re-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(1.3); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    15%       { transform: translateX(-6px); }
    30%       { transform: translateX(6px); }
    45%       { transform: translateX(-4px); }
    60%       { transform: translateX(4px); }
    75%       { transform: translateX(-2px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes success-pop {
    0%   { transform: scale(0.7); opacity: 0; }
    60%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); }
  }

  * { box-sizing: border-box; }

  .login-root {
    background: #0C0C0F;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
    overflow: hidden;
    position: relative;
  }
  @media (min-width: 1024px) {
    .login-root {
      height: 100vh;
      min-height: unset;
      padding: 0 16px;
      overflow: hidden;
    }
  }

  .input-field {
    transition: border-color 200ms, box-shadow 200ms, background 200ms;
  }
  .input-field:focus {
    outline: none;
    border-color: rgba(212,175,55,0.55) !important;
    box-shadow: 0 0 0 3px rgba(212,175,55,0.10), inset 0 1px 2px rgba(0,0,0,0.3);
    background: rgba(255,255,255,0.04) !important;
  }
  .input-field.error-ring {
    border-color: rgba(248,113,113,0.6) !important;
    box-shadow: 0 0 0 3px rgba(248,113,113,0.10) !important;
    animation: shake 0.45s ease;
  }
  .input-field.success-ring {
    border-color: rgba(52,211,153,0.5) !important;
    box-shadow: 0 0 0 3px rgba(52,211,153,0.08) !important;
  }
  .btn-primary {
    transition: transform 150ms, box-shadow 150ms;
  }
  .btn-primary:not(:disabled):hover {
    transform: translateY(-1.5px);
    box-shadow: 0 0 36px rgba(212,175,55,0.55) !important;
  }
  .btn-primary:not(:disabled):active {
    transform: translateY(0);
  }
`;

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function validatePassword(v: string) {
  if (v.length < 8) return 'At least 8 characters required';
  if (!/[A-Z]/.test(v)) return 'One uppercase letter required';
  if (!/\d/.test(v)) return 'One number required';
  return null;
}
function passwordStrength(v: string): {
  score: number;
  label: string;
  color: string;
} {
  let s = 0;
  if (v.length >= 8) s++;
  if (v.length >= 12) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const map = [
    { label: '', color: 'transparent' },
    { label: 'Weak', color: '#EF4444' },
    { label: 'Fair', color: '#F59E0B' },
    { label: 'Good', color: '#3B82F6' },
    { label: 'Strong', color: '#10B981' },
    { label: 'Excellent', color: '#D4AF37' },
  ];
  return { score: s, ...map[Math.min(s, 5)] };
}
function sanitize(v: string) {
  return v.replace(/[<>"'`\\]/g, '');
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p
      className="f-sans"
      style={{
        fontSize: 10,
        color: '#F87171',
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ flexShrink: 0 }}
      >
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      {msg}
    </p>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  const [emailErr, setEmailErr] = useState('');
  const [pwdErr, setPwdErr] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [pwdTouched, setPwdTouched] = useState(false);

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockTimer, setLockTimer] = useState('');

  const emailRef = useRef<HTMLInputElement>(null);
  const pwdStrength = passwordStrength(password);

  useEffect(() => {
    const saved = localStorage.getItem('adm_email');
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!lockedUntil) return;
    const tick = () => {
      const diff = lockedUntil - Date.now();
      if (diff <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setLockTimer('');
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLockTimer(`${m}:${s.toString().padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const onEmailBlur = useCallback(() => {
    setEmailTouched(true);
    setEmailErr(validateEmail(email) ? '' : 'Enter a valid email address');
  }, [email]);

  const onPwdBlur = useCallback(() => {
    setPwdTouched(true);
    setPwdErr(validatePassword(password) ?? '');
  }, [password]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleLogin = async () => {
    if (isLocked) return;

    setEmailTouched(true);
    setPwdTouched(true);
    const eErr = validateEmail(email) ? '' : 'Enter a valid email address';
    const pErr = validatePassword(password) ?? '';
    setEmailErr(eErr);
    setPwdErr(pErr);
    if (eErr || pErr) return;

    setStatus('loading');
    setStatusMsg('');

    await new Promise((r) => setTimeout(r, 200));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitize(email.trim()),
        password,
      });

      if (error) {
        const next = attempts + 1;
        setAttempts(next);
        if (next >= MAX_ATTEMPTS) {
          setLockedUntil(Date.now() + LOCKOUT_MS);
          setStatusMsg(
            'Too many failed attempts. Account locked for 15 minutes.',
          );
        } else {
          setStatusMsg(
            error.message || 'Invalid credentials. Please try again.',
          );
        }
        setStatus('error');
      } else {
        setStatus('success');
        setStatusMsg('Access granted. Redirecting to dashboard…');
        if (remember) localStorage.setItem('adm_email', email.trim());
        else localStorage.removeItem('adm_email');
        void data;
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1400);
      }
    } catch {
      setStatus('error');
      setStatusMsg('Network error. Please check your connection.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  const emailRing = emailTouched
    ? emailErr
      ? 'error-ring'
      : 'success-ring'
    : '';
  const pwdRing = pwdTouched ? (pwdErr ? 'error-ring' : 'success-ring') : '';

  return (
    <>
      <style>{G}</style>

      <div className="login-root">
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            borderRadius: '50%',
            width: 520,
            height: 520,
            top: -160,
            left: -160,
            background:
              'radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            borderRadius: '50%',
            width: 480,
            height: 480,
            bottom: -140,
            right: -80,
            background:
              'radial-gradient(circle, rgba(26,110,142,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            pointerEvents: 'none',
            borderRadius: '50%',
            width: 260,
            height: 260,
            top: '30%',
            right: '8%',
            background:
              'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: 420,
            background: 'rgba(13,17,24,0.88)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 18,
            boxShadow:
              '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.06)',
          }}
        >
          <div
            style={{
              height: 2,
              borderRadius: '18px 18px 0 0',
              background:
                'linear-gradient(90deg, transparent, #D4AF37, transparent)',
            }}
          />

          <div style={{ padding: '32px 32px 28px' }}>
            <div style={{ marginBottom: 22, textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid rgba(212,175,55,0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <span
                  className="f-display"
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Hesham
                  <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>RE</em>
                </span>
              </div>
              <h1
                className="f-display"
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.1,
                  margin: '0 0 5px',
                }}
              >
                Admin{' '}
                <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                  Portal
                </em>
              </h1>
              <p
                className="f-sans"
                style={{ fontSize: 11, color: '#64748B', margin: 0 }}
              >
                Authorised access only
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(212,175,55,0.07)',
                  border: '1px solid rgba(212,175,55,0.22)',
                  borderRadius: 100,
                  padding: '4px 12px',
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#D4AF37',
                    animation: 're-pulse 2s infinite',
                    display: 'block',
                    flexShrink: 0,
                  }}
                />
                <span
                  className="f-sans"
                  style={{
                    fontSize: 9,
                    color: '#D4AF37',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  Secure · SSL Encrypted · UAE
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label
                className="f-sans"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.28)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: emailTouched && !emailErr ? '#34D399' : '#475569',
                    pointerEvents: 'none',
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  ref={emailRef}
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  disabled={
                    status === 'loading' || status === 'success' || isLocked
                  }
                  onChange={(e) => {
                    setEmail(sanitize(e.target.value));
                    if (emailTouched)
                      setEmailErr(
                        validateEmail(e.target.value)
                          ? ''
                          : 'Enter a valid email address',
                      );
                  }}
                  onBlur={onEmailBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="admin@hesham.com"
                  className={`input-field f-sans ${emailRing}`}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 10,
                    padding: '11px 36px 11px 36px',
                    color: '#E2E8F0',
                    fontSize: 13,
                  }}
                />
                {emailTouched && !emailErr && (
                  <span
                    style={{
                      position: 'absolute',
                      right: 11,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#34D399',
                      pointerEvents: 'none',
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </div>
              {emailTouched && emailErr && <FieldError msg={emailErr} />}
            </div>

            <div style={{ marginBottom: 6 }}>
              <label
                className="f-sans"
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.28)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: pwdTouched && !pwdErr ? '#34D399' : '#475569',
                    pointerEvents: 'none',
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </span>
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  disabled={
                    status === 'loading' || status === 'success' || isLocked
                  }
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (pwdTouched)
                      setPwdErr(validatePassword(e.target.value) ?? '');
                  }}
                  onBlur={onPwdBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="••••••••••"
                  className={`input-field f-sans ${pwdRing}`}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: 10,
                    padding: '11px 42px 11px 36px',
                    color: '#E2E8F0',
                    fontSize: 13,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 11,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#475569',
                    padding: 2,
                    lineHeight: 0,
                  }}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPwd} />
                </button>
              </div>

              {password.length > 0 && (
                <div style={{ marginTop: 7 }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background:
                            i <= pwdStrength.score
                              ? pwdStrength.color
                              : 'rgba(255,255,255,0.07)',
                          transition: 'background 300ms',
                        }}
                      />
                    ))}
                  </div>
                  {pwdStrength.label && (
                    <span
                      className="f-sans"
                      style={{
                        fontSize: 9,
                        color: pwdStrength.color,
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {pwdStrength.label}
                    </span>
                  )}
                </div>
              )}

              {pwdTouched && pwdErr && <FieldError msg={pwdErr} />}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 14,
                marginBottom: 18,
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                <div
                  onClick={() => setRemember((v) => !v)}
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 4,
                    border: `1.5px solid ${remember ? '#D4AF37' : 'rgba(255,255,255,0.18)'}`,
                    background: remember
                      ? 'rgba(212,175,55,0.16)'
                      : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 150ms, background 150ms',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {remember && (
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span
                  className="f-sans"
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}
                >
                  Remember me
                </span>
              </label>

             <Link
  href="/admin/auth/forgot-password"
  className="f-sans"
  style={{
    fontSize: 11,
    color: "rgba(212,175,55,0.65)",
    textDecoration: "none",
    transition: "color 150ms",
  }}
  onMouseEnter={(e) =>
    ((e.target as HTMLElement).style.color = "#D4AF37")
  }
  onMouseLeave={(e) =>
    ((e.target as HTMLElement).style.color = "rgba(212,175,55,0.65)")
  }
>
  Forgot password?
</Link>
            </div>

            {statusMsg && (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 10,
                  padding: '10px 13px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 9,
                  background:
                    status === 'success'
                      ? 'rgba(52,211,153,0.08)'
                      : 'rgba(248,113,113,0.08)',
                  border: `1px solid ${status === 'success' ? 'rgba(52,211,153,0.28)' : 'rgba(248,113,113,0.28)'}`,
                }}
              >
                <span style={{ marginTop: 1, flexShrink: 0 }}>
                  {status === 'success' ? (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#34D399"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#F87171"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  )}
                </span>
                <div>
                  <p
                    className="f-sans"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: status === 'success' ? '#34D399' : '#F87171',
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {statusMsg}
                  </p>
                  {isLocked && lockTimer && (
                    <p
                      className="f-sans"
                      style={{
                        fontSize: 10,
                        color: 'rgba(248,113,113,0.60)',
                        margin: '3px 0 0',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Try again in{' '}
                      <strong style={{ color: '#F87171' }}>{lockTimer}</strong>
                    </p>
                  )}
                  {status === 'error' && !isLocked && attempts > 0 && (
                    <p
                      className="f-sans"
                      style={{
                        fontSize: 10,
                        color: 'rgba(248,113,113,0.50)',
                        margin: '3px 0 0',
                      }}
                    >
                      {MAX_ATTEMPTS - attempts} attempt
                      {MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining
                      before lockout
                    </p>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={
                status === 'loading' || status === 'success' || isLocked
              }
              className="btn-primary f-sans"
              style={{
                width: '100%',
                padding: '13px 0',
                borderRadius: 11,
                border: 'none',
                background:
                  status === 'success'
                    ? '#34D399'
                    : isLocked
                      ? 'rgba(255,255,255,0.07)'
                      : '#D4AF37',
                color:
                  status === 'success'
                    ? '#0C0C0F'
                    : isLocked
                      ? '#475569'
                      : '#0C0C0F',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.02em',
                cursor:
                  isLocked || status === 'loading' || status === 'success'
                    ? 'not-allowed'
                    : 'pointer',
                boxShadow:
                  status === 'success'
                    ? '0 0 28px rgba(52,211,153,0.4)'
                    : isLocked
                      ? 'none'
                      : '0 0 22px rgba(212,175,55,0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {status === 'loading' ? (
                <>
                  <span
                    style={{
                      width: 13,
                      height: 13,
                      border: '2px solid rgba(12,12,15,0.25)',
                      borderTopColor: '#0C0C0F',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Verifying…
                </>
              ) : status === 'success' ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: 'success-pop 0.4s ease both' }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Access Granted
                </>
              ) : isLocked ? (
                <>
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
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Account Locked
                </>
              ) : (
                <>
                  Sign In <span style={{ fontSize: 14 }}>→</span>
                </>
              )}
            </button>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.05)',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            {[
              { icon: '🔒', label: 'SSL Encrypted' },
              { icon: '🛡', label: '2FA Ready' },
              { icon: '🌍', label: 'GDPR Compliant' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span style={{ fontSize: 9 }}>{icon}</span>
                <span
                  className="f-sans"
                  style={{
                    fontSize: 8,
                    color: 'rgba(255,255,255,0.16)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
