import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button, Select } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { usePlanner } from '../context/PlannerContext';
import { updateProfile } from '../utils/api';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { restructureYears, gpa } = usePlanner();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    major: user?.major || '',
    minor: user?.minor || '',
    structure: user?.structure || 'semester',
    university: user?.university || '',
    startYear: user?.startYear || '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setError(''); setSaved(false); setLoading(true);
    const prevStructure = user?.structure;
    try {
      const updated = await updateProfile(user.id, form);
      updateUser(updated);
      if (form.structure !== prevStructure) {
        restructureYears(form.structure);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/planner')} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px',
          }}>← Back to planner</button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px' }}>Profile</span>
        </div>
        <Button variant="ghost" onClick={handleLogout} style={{ color: 'var(--danger)' }}>Log out</Button>
      </div>

      <div style={{ maxWidth: '520px', margin: '48px auto', padding: '0 24px' }}>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '32px', boxShadow: 'var(--shadow)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, marginBottom: '24px' }}>Account settings</h2>

          {error && (
            <div style={{
              background: 'var(--danger-bg)', color: 'var(--danger)',
              padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '13px', marginBottom: '16px',
            }}>{error}</div>
          )}
          {saved && (
            <div style={{
              background: 'var(--accent-bg)', color: 'var(--accent)',
              padding: '10px 14px', borderRadius: 'var(--radius)', fontSize: '13px', marginBottom: '16px',
            }}>Changes saved ✓</div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Full name" value={form.name} onChange={e => set('name', e.target.value)} />
            <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input label="Major" placeholder="e.g. Computer Science" value={form.major} onChange={e => set('major', e.target.value)} />
              <Input label="Minor (optional)" placeholder="e.g. Mathematics" value={form.minor} onChange={e => set('minor', e.target.value)} />
            </div>
            <Input label="School start year" type="number" placeholder="e.g. 2026"
              min="1900" max="2100"
              value={form.startYear} onChange={e => set('startYear', e.target.value ? Number(e.target.value) : '')} />
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
                    <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>Cumulative GPA</label>
              <div style={{
                padding: '10px 12px', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', background: 'var(--bg)',
                fontSize: '14px', color: gpa !== null ? 'var(--text)' : 'var(--text-muted)',
              }}>
                {gpa !== null ? gpa : 'No graded courses yet'}
              </div>
            </div>
            <Button onClick={handleSave} disabled={loading} style={{ marginTop: '8px' }}>
              {loading ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
