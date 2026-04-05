"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

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

  .rp-root {
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
    .rp-root {
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
  .req-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    transition: color 200ms;
  }
`;

/* ─── Validation ─── */
function validatePassword(v: string): string | null {
  if (v.length < 8)      return "At least 8 characters required";
  if (!/[A-Z]/.test(v)) return "One uppercase letter required";
  if (!/\d/.test(v))    return "One number required";
  return null;
}

function validateConfirm(pwd: string, confirm: string): string | null {
  if (!confirm) return "Please confirm your password";
  if (pwd !== confirm) return "Passwords do not match";
  return null;
}

function passwordStrength(v: string): { score: number; label: string; color: string } {
  let s = 0;
  if (v.length >= 8)           s++;
  if (v.length >= 12)          s++;
  if (/[A-Z]/.test(v))         s++;
  if (/\d/.test(v))            s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const map = [
    { label: "",          color: "transparent" },
    { label: "Weak",      color: "#EF4444" },
    { label: "Fair",      color: "#F59E0B" },
    { label: "Good",      color: "#3B82F6" },
    { label: "Strong",    color: "#10B981" },
    { label: "Excellent", color: "#D4AF37" },
  ];
  return { score: s, ...map[Math.min(s, 5)] };
}

/* ─── Sub-components ─── */
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="f-sans" style={{ fontSize: 10, color: "#F87171", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      {msg}
    </p>
  );
}

function ReqDot({ met }: { met: boolean }) {
  return met ? (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ) : (
    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.18)", flexShrink: 0, marginLeft: 3 }} />
  );
}

/* ─── Main ─── */
export default function ResetPassword() {
  const router = useRouter();

  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [pwdErr,      setPwdErr]      = useState("");
  const [confirmErr,  setConfirmErr]  = useState("");
  const [pwdTouched,     setPwdTouched]     = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [status,    setStatus]    = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [countdown, setCountdown] = useState(5);

  const pwdRef = useRef<HTMLInputElement>(null);
  const strength = passwordStrength(password);

  /* Requirements checklist */
  const reqs = [
    { label: "At least 8 characters",  met: password.length >= 8 },
    { label: "One uppercase letter",   met: /[A-Z]/.test(password) },
    { label: "One number",             met: /\d/.test(password) },
    { label: "Passwords match",        met: password.length > 0 && password === confirm },
  ];

  useEffect(() => { pwdRef.current?.focus(); }, []);

  /* Redirect countdown after success */
  useEffect(() => {
    if (status !== "success") return;
    if (countdown <= 0) {
      router.push("/admin/auth/login");
      setTimeout(() => { window.location.href = "/admin/auth/login"; }, 300);
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [status, countdown, router]);

  const onPwdBlur = useCallback(() => {
    setPwdTouched(true);
    setPwdErr(validatePassword(password) ?? "");
  }, [password]);

  const onConfirmBlur = useCallback(() => {
    setConfirmTouched(true);
    setConfirmErr(validateConfirm(password, confirm) ?? "");
  }, [password, confirm]);

  const handleUpdate = async () => {
    if (status === "loading" || status === "success") return;

    setPwdTouched(true); setConfirmTouched(true);
    const pErr = validatePassword(password) ?? "";
    const cErr = validateConfirm(password, confirm) ?? "";
    setPwdErr(pErr); setConfirmErr(cErr);
    if (pErr || cErr) return;

    setStatus("loading");
    setStatusMsg("");

    await new Promise((r) => setTimeout(r, 300));

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setStatus("error");
        setStatusMsg(error.message || "Failed to update password. Please try again.");
        return;
      }

      /* Sign out all sessions after password change */
      await supabase.auth.signOut();

      setStatus("success");
      setStatusMsg("Password updated successfully. Redirecting to login…");
    } catch {
      setStatus("error");
      setStatusMsg("Network error. Please check your connection.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleUpdate();
  };

  const pwdRing     = pwdTouched     ? (pwdErr     ? "error-ring" : "success-ring") : "";
  const confirmRing = confirmTouched ? (confirmErr ? "error-ring" : password === confirm && confirm ? "success-ring" : "error-ring") : "";

  return (
    <>
      <style>{G}</style>

      <div className="rp-root">

        {/* Orbs */}
        <div style={{ position: "absolute", pointerEvents: "none", borderRadius: "50%", width: 520, height: 520, top: -160, left: -160, background: "radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", pointerEvents: "none", borderRadius: "50%", width: 480, height: 480, bottom: -140, right: -80, background: "radial-gradient(circle, rgba(26,110,142,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", pointerEvents: "none", borderRadius: "50%", width: 260, height: 260, top: "30%", right: "8%", background: "radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%)" }} />

        {/* Card */}
        <div
          style={{
            position: "relative", zIndex: 10,
            width: "100%", maxWidth: 420,
            background: "rgba(13,17,24,0.88)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.06)",
          }}
        >
          {/* Gold top line */}
          <div style={{ height: 2, borderRadius: "18px 18px 0 0", background: "linear-gradient(90deg, transparent, #D4AF37, transparent)" }} />

          <div style={{ padding: "32px 32px 28px" }}>

            {/* Back link */}
            <div style={{ marginBottom: 20 }}>
              <Link
                href="/admin/auth/login"
                className="f-sans"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.30)", textDecoration: "none", transition: "color 150ms" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D4AF37")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.30)")}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back to login
              </Link>
            </div>

            {/* Brand */}
            <div style={{ marginBottom: 22, textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.28)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <span className="f-display" style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
                  Hesham<em style={{ color: "#D4AF37", fontStyle: "italic" }}>RE</em>
                </span>
              </div>
              <h1 className="f-display" style={{ fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.1, margin: "0 0 6px" }}>
                New <em style={{ color: "#D4AF37", fontStyle: "italic" }}>Password</em>
              </h1>
              <p className="f-sans" style={{ fontSize: 11, color: "#64748B", margin: 0 }}>
                Choose a strong password for your admin account
              </p>
            </div>

            {/* Status pill */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 100, padding: "4px 12px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D4AF37", animation: "re-pulse 2s infinite", display: "block", flexShrink: 0 }} />
                <span className="f-sans" style={{ fontSize: 9, color: "#D4AF37", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Secure · Encrypted · One-time link
                </span>
              </div>
            </div>

            {/* ── SUCCESS STATE ── */}
            {status === "success" ? (
              <div style={{ textAlign: "center", padding: "8px 0 8px" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.30)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "success-pop 0.4s ease both" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="f-sans" style={{ fontSize: 14, fontWeight: 700, color: "#34D399", margin: "0 0 8px" }}>
                  Password Updated!
                </p>
                <p className="f-sans" style={{ fontSize: 12, color: "#64748B", margin: "0 0 20px", lineHeight: 1.65 }}>
                  Your password has been changed and all sessions have been signed out for security.
                </p>

                {/* Countdown ring */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.22)", borderRadius: 100, padding: "6px 14px", marginBottom: 16 }}>
                  <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(212,175,55,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="f-sans" style={{ fontSize: 9, fontWeight: 700, color: "#D4AF37" }}>{countdown}</span>
                  </span>
                  <span className="f-sans" style={{ fontSize: 10, color: "rgba(212,175,55,0.70)", letterSpacing: "0.04em" }}>
                    Redirecting to login…
                  </span>
                </div>

                {/* Manual redirect button */}
                <div>
                  <Link
                    href="/admin/auth/login"
                    className="btn-primary f-sans"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "11px 28px", borderRadius: 10,
                      background: "#D4AF37", color: "#0C0C0F",
                      fontSize: 12, fontWeight: 700, textDecoration: "none",
                      letterSpacing: "0.02em",
                      boxShadow: "0 0 22px rgba(212,175,55,0.28)",
                    }}
                  >
                    Go to Login Now <span style={{ fontSize: 13 }}>→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* ── New password ── */}
                <div style={{ marginBottom: 12 }}>
                  <label className="f-sans" style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: pwdTouched && !pwdErr ? "#34D399" : "#475569", pointerEvents: "none" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input
                      ref={pwdRef}
                      type={showPwd ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      disabled={status === "loading"}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (pwdTouched) setPwdErr(validatePassword(e.target.value) ?? "");
                        if (confirmTouched) setConfirmErr(validateConfirm(e.target.value, confirm) ?? "");
                      }}
                      onBlur={onPwdBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="••••••••••"
                      className={`input-field f-sans ${pwdRing}`}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 10, padding: "11px 42px 11px 36px",
                        color: "#E2E8F0", fontSize: 13,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 2, lineHeight: 0 }}
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showPwd} />
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div style={{ marginTop: 7 }}>
                      <div style={{ display: "flex", gap: 3, marginBottom: 3 }}>
                        {[1,2,3,4,5].map((i) => (
                          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.score ? strength.color : "rgba(255,255,255,0.07)", transition: "background 300ms" }} />
                        ))}
                      </div>
                      {strength.label && (
                        <span className="f-sans" style={{ fontSize: 9, color: strength.color, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          {strength.label}
                        </span>
                      )}
                    </div>
                  )}

                  {pwdTouched && pwdErr && <FieldError msg={pwdErr} />}
                </div>

                {/* ── Confirm password ── */}
                <div style={{ marginBottom: 16 }}>
                  <label className="f-sans" style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
                    Confirm Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: confirmTouched && !confirmErr ? "#34D399" : "#475569", pointerEvents: "none" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                      </svg>
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirm}
                      disabled={status === "loading"}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        if (confirmTouched) setConfirmErr(validateConfirm(password, e.target.value) ?? "");
                      }}
                      onBlur={onConfirmBlur}
                      onKeyDown={handleKeyDown}
                      placeholder="••••••••••"
                      className={`input-field f-sans ${confirmRing}`}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        borderRadius: 10, padding: "11px 42px 11px 36px",
                        color: "#E2E8F0", fontSize: 13,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      style={{ position: "absolute", right: 11, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 2, lineHeight: 0 }}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    >
                      <EyeIcon open={showConfirm} />
                    </button>
                  </div>
                  {confirmTouched && confirmErr && <FieldError msg={confirmErr} />}
                </div>

                {/* ── Requirements checklist ── */}
                {password.length > 0 && (
                  <div style={{ marginBottom: 18, padding: "12px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
                    <p className="f-sans" style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px", fontWeight: 600 }}>
                      Requirements
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 8px" }}>
                      {reqs.map(({ label, met }) => (
                        <div key={label} className="req-item" style={{ color: met ? "#34D399" : "rgba(255,255,255,0.28)" }}>
                          <ReqDot met={met} />
                          <span className="f-sans" style={{ fontSize: 10 }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error banner */}
                {status === "error" && statusMsg && (
                  <div style={{ marginBottom: 16, borderRadius: 10, padding: "10px 13px", display: "flex", alignItems: "flex-start", gap: 9, background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.28)" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 1, flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p className="f-sans" style={{ fontSize: 12, fontWeight: 600, color: "#F87171", margin: 0, lineHeight: 1.4 }}>
                      {statusMsg}
                    </p>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={handleUpdate}
                  disabled={status === "loading"}
                  className="btn-primary f-sans"
                  style={{
                    width: "100%", padding: "13px 0", borderRadius: 11, border: "none",
                    background: "#D4AF37", color: "#0C0C0F",
                    fontSize: 13, fontWeight: 700, letterSpacing: "0.02em",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    boxShadow: "0 0 22px rgba(212,175,55,0.28)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {status === "loading" ? (
                    <>
                      <span style={{ width: 13, height: 13, border: "2px solid rgba(12,12,15,0.25)", borderTopColor: "#0C0C0F", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                      Updating…
                    </>
                  ) : (
                    <>Update Password <span style={{ fontSize: 14 }}>→</span></>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Bottom security strip */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            {[
              { icon: "🔒", label: "SSL Encrypted" },
              { icon: "🛡", label: "Sessions cleared" },
              { icon: "🌍", label: "GDPR Compliant" },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 9 }}>{icon}</span>
                <span className="f-sans" style={{ fontSize: 8, color: "rgba(255,255,255,0.16)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}