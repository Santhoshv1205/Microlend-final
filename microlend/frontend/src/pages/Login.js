import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, verifyAndCompleteLogin } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(1); // 1 = Credentials, 2 = OTP
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Cooldown timer logic
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function submitCredentials(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      setStep(2);
      setCooldown(60); // 60s resend timer lock
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const r = await verifyAndCompleteLogin(form.email, otpCode);
      nav(r.to);
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (cooldown > 0) return;
    setErr('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      setCooldown(60);
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Error resending OTP');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f172a 0%,#1d4ed8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 14, padding: 36, width: '100%', maxWidth: 400,
        boxShadow: '0 20px 60px #0003' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: '#1d4ed8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: '#fff', fontSize: 22, margin: '0 auto 12px' }}>M</div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0f172a' }}>MicroLend</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>NBFC Loan Management System</p>
        </div>

        {err && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px',
          borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{err}</div>}

        {step === 1 ? (
          <form onSubmit={submitCredentials}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>
                Email Address
              </label>
              <input name="email" type="email" value={form.email} onChange={onChange} required
                placeholder="admin@microlend.com"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid #e2e8f0', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>
                Password
              </label>
              <input name="password" type="password" value={form.password} onChange={onChange} required
                placeholder="••••••••"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8,
                  border: '1px solid #e2e8f0', fontSize: 14, boxSizing: 'border-box' }} />
            </div>
            <button id="btn-signin" type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', background: loading ? '#94a3b8' : '#1d4ed8',
                color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700,
                fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Validating…' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={submitOtp}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>
                Verification OTP Code
              </label>
              <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: 13 }}>
                We've sent a 6-digit OTP code to <strong style={{ color: '#0f172a' }}>{form.email}</strong>.
              </p>
              <input name="otp" type="text" maxLength={6} value={otpCode} onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))} required
                placeholder="000000"
                style={{ width: '100%', padding: '12px', borderRadius: 8, textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold',
                  border: '1px solid #e2e8f0', fontSize: 18, boxSizing: 'border-box' }} />
            </div>
            <button id="btn-verify" type="submit" disabled={loading || otpCode.length !== 6}
              style={{ width: '100%', padding: '11px', background: (loading || otpCode.length !== 6) ? '#94a3b8' : '#10b981',
                color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700,
                fontSize: 14, cursor: (loading || otpCode.length !== 6) ? 'not-allowed' : 'pointer', marginBottom: 14 }}>
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button type="button" onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>
                Back to Login
              </button>
              <button type="button" onClick={handleResendOtp} disabled={cooldown > 0 || loading}
                style={{ background: 'none', border: 'none', color: cooldown > 0 ? '#94a3b8' : '#1d4ed8', fontSize: 13,
                  cursor: (cooldown > 0 || loading) ? 'not-allowed' : 'pointer', textDecoration: cooldown > 0 ? 'none' : 'underline', fontWeight: 600 }}>
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 20, padding: 14, background: '#f8fafc', borderRadius: 8 }}>
          <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 700, color: '#374151' }}>DEFAULT ADMIN</p>
          <p style={{ margin: 0, fontSize: 12, color: '#475569', fontFamily: 'monospace' }}>
            admin@microlend.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
