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

  .fp-root {
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
    .fp-root {
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

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}
function sanitize(v: string) {
  return v.replace(/[<>"'`\\]/g, '');
}

const MAX_RESETS = 3;

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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [resetCount, setResetCount] = useState(0);

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const onEmailBlur = useCallback(() => {
    setEmailTouched(true);
    setEmailErr(validateEmail(email) ? '' : 'Enter a valid email address');
  }, [email]);

  const isExhausted = resetCount >= MAX_RESETS;

  const handleReset = async () => {
    if (isExhausted || status === 'loading' || status === 'success') return;

    setEmailTouched(true);
    const err = validateEmail(email) ? '' : 'Enter a valid email address';
    setEmailErr(err);
    if (err) return;

    setStatus('loading');
    setStatusMsg('');

    await new Promise((r) => setTimeout(r, 300));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        sanitize(email.trim()),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      );

      if (error) {
        setStatus('error');
        setStatusMsg(
          error.message || 'Something went wrong. Please try again.',
        );
      } else {
        setStatus('success');
        setResetCount((c) => c + 1);
        setStatusMsg(
          'Reset link sent! Check your inbox (and spam folder) for the email.',
        );
      }
    } catch {
      setStatus('error');
      setStatusMsg('Network error. Please check your connection.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleReset();
  };

  const handleResend = () => {
    if (isExhausted) return;
    setStatus('idle');
    setStatusMsg('');
  };

  const emailRing = emailTouched
    ? emailErr
      ? 'error-ring'
      : 'success-ring'
    : '';

  return (
    <>
      <style>{G}</style>

      <div className="fp-root">
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
            <div style={{ marginBottom: 20 }}>
              <Link
                href="/auth/login"
                className="f-sans"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.30)',
                  textDecoration: 'none',
                  transition: 'color 150ms',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = '#D4AF37')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color =
                    'rgba(255,255,255,0.30)')
                }
              >
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
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to login
              </Link>
            </div>

            <div style={{ marginBottom: 22, textAlign: 'center' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
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
                    <circle cx="7.5" cy="15.5" r="5.5" />
                    <path d="M21 2l-9.6 9.6" />
                    <path d="M15.5 7.5l3 3L22 7l-3-3" />
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
                  margin: '0 0 8px',
                }}
              >
                Reset{' '}
                <em style={{ color: '#D4AF37', fontStyle: 'italic' }}>
                  Password
                </em>
              </h1>
              <p
                className="f-sans"
                style={{
                  fontSize: 12,
                  color: '#64748B',
                  margin: 0,
                  lineHeight: 1.6,
                  maxWidth: 300,
                  marginInline: 'auto',
                }}
              >
                Enter your admin email and we'll send a secure reset link to
                your inbox.
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
                  Secure · Link expires in 1 hour
                </span>
              </div>
            </div>

            {status === 'success' && !isExhausted ? (
              <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'rgba(52,211,153,0.10)',
                    border: '1px solid rgba(52,211,153,0.30)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: 'success-pop 0.4s ease both' }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <p
                  className="f-sans"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#34D399',
                    margin: '0 0 6px',
                  }}
                >
                  Reset link sent!
                </p>
                <p
                  className="f-sans"
                  style={{
                    fontSize: 12,
                    color: '#64748B',
                    margin: '0 0 20px',
                    lineHeight: 1.6,
                  }}
                >
                  We emailed{' '}
                  <strong style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {email.trim()}
                  </strong>
                  .
                  <br />
                  Check your inbox and spam folder.
                </p>

                {resetCount < MAX_RESETS && (
                  <button
                    onClick={handleResend}
                    className="f-sans"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 11,
                      color: 'rgba(212,175,55,0.65)',
                      transition: 'color 150ms',
                      padding: 0,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = '#D4AF37')
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        'rgba(212,175,55,0.65)')
                    }
                  >
                    Didn't receive it? Resend ({MAX_RESETS - resetCount} left)
                  </button>
                )}
              </div>
            ) : (
              <>
                {isExhausted && (
                  <div
                    style={{
                      marginBottom: 16,
                      borderRadius: 10,
                      padding: '10px 13px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 9,
                      background: 'rgba(248,113,113,0.08)',
                      border: '1px solid rgba(248,113,113,0.28)',
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#F87171"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginTop: 1, flexShrink: 0 }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p
                      className="f-sans"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#F87171',
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      Maximum reset attempts reached. Please contact your system
                      administrator.
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: 20 }}>
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
                    Admin Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color:
                          emailTouched && !emailErr ? '#34D399' : '#475569',
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
                      disabled={status === 'loading' || isExhausted}
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

                  {resetCount > 0 && !isExhausted && (
                    <p
                      className="f-sans"
                      style={{
                        fontSize: 10,
                        color: 'rgba(255,255,255,0.22)',
                        marginTop: 5,
                      }}
                    >
                      {MAX_RESETS - resetCount} reset attempt
                      {MAX_RESETS - resetCount !== 1 ? 's' : ''} remaining
                    </p>
                  )}
                </div>

                {status === 'error' && statusMsg && (
                  <div
                    style={{
                      marginBottom: 16,
                      borderRadius: 10,
                      padding: '10px 13px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 9,
                      background: 'rgba(248,113,113,0.08)',
                      border: '1px solid rgba(248,113,113,0.28)',
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#F87171"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginTop: 1, flexShrink: 0 }}
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p
                      className="f-sans"
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#F87171',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {statusMsg}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  disabled={status === 'loading' || isExhausted}
                  className="btn-primary f-sans"
                  style={{
                    width: '100%',
                    padding: '13px 0',
                    borderRadius: 11,
                    border: 'none',
                    background: isExhausted
                      ? 'rgba(255,255,255,0.07)'
                      : '#D4AF37',
                    color: isExhausted ? '#475569' : '#0C0C0F',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    cursor:
                      status === 'loading' || isExhausted
                        ? 'not-allowed'
                        : 'pointer',
                    boxShadow: isExhausted
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
                      Sending link…
                    </>
                  ) : (
                    <>
                      Send Reset Link <span style={{ fontSize: 14 }}>→</span>
                    </>
                  )}
                </button>
              </>
            )}
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
              { icon: '⏱', label: 'Link expires 1hr' },
              { icon: '🛡', label: 'One-time use' },
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
