import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input, Button, UniversitySelect } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin, register as apiRegister } from '../utils/api';
import { US_UNIVERSITIES } from '../data/usUniversities';

function AuthShell({ title, subtitle, children }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '26px', marginBottom: '8px' }}>YourYear</div>
          <h2 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '4px' }}>{title}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{subtitle}</p>
        </div>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '32px',
          boxShadow: 'var(--shadow)',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await apiLogin(form);
      login(user);
      navigate('/planner');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your account">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div style={{
            background: 'var(--danger-bg)', color: 'var(--danger)',
            padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '13px',
          }}>{error}</div>
        )}
        <Input label="Email" type="email" placeholder="you@example.com"
          value={form.email} onChange={e => set('email', e.target.value)} required />
        <Input label="Password" type="password" placeholder="••••••••"
          value={form.password} onChange={e => set('password', e.target.value)} required />
        <Button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', marginTop: '4px' }}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          No account? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign up</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', structure: 'semester', university: '', startYear: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const yr = Number(form.startYear);
    if (!form.startYear || yr < 1900 || yr > 2100) { setError('Please enter a valid school start year.'); return; }
    setLoading(true);
    try {
      const { user } = await apiRegister(form);
      login(user);
      navigate('/planner');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Start building your academic plan">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {error && (
          <div style={{
            background: 'var(--danger-bg)', color: 'var(--danger)',
            padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '13px',
          }}>{error}</div>
        )}
        <Input label="Full name" placeholder="Jane Smith"
          value={form.name} onChange={e => set('name', e.target.value)} required />
        <Input label="Email" type="email" placeholder="you@example.com"
          value={form.email} onChange={e => set('email', e.target.value)} required />
        <Input label="Password" type="password" placeholder="Min. 6 characters"
          value={form.password} onChange={e => set('password', e.target.value)} required />
        <UniversitySelect
          label="University"
          options={US_UNIVERSITIES}
          value={form.university}
          onChange={v => set('university', v)}
        />
        <Input label="School start year" type="number" placeholder="e.g. 2026"
          min="1900" max="2100"
          value={form.startYear} onChange={e => set('startYear', e.target.value)} required />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Academic structure</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['semester', 'quarter'].map(s => (
              <label key={s} style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px', borderRadius: 'var(--radius)', cursor: 'pointer',
                border: `2px solid ${form.structure === s ? 'var(--accent)' : 'var(--border)'}`,
                background: form.structure === s ? 'var(--accent-bg)' : 'var(--surface)',
                transition: 'all 0.15s',
              }}>
                <input type="radio" name="structure" value={s}
                  checked={form.structure === s} onChange={() => set('structure', s)}
                  style={{ accentColor: 'var(--accent)' }} />
                <span style={{ fontSize: '14px', textTransform: 'capitalize', fontWeight: form.structure === s ? 600 : 400 }}>{s}</span>
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', marginTop: '4px' }}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Log in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
