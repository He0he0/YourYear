import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 48px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px' }}>YourYear</span>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={() => navigate('/login')}>Log in</Button>
          <Button onClick={() => navigate('/register')}>Get started</Button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: '680px', margin: '0 auto', padding: '100px 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block', background: 'var(--accent-bg)', color: 'var(--accent)',
          fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
          marginBottom: '24px', letterSpacing: '0.05em', textTransform: 'uppercase',
        }}>Academic Planner</div>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 400,
          lineHeight: 1.1, marginBottom: '20px', color: 'var(--text)',
        }}>
          Plan your entire<br />
          <em>academic journey</em>
        </h1>

        <p style={{
          fontSize: '18px', color: 'var(--text-muted)', marginBottom: '36px',
          lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 36px',
        }}>
          Map out every term, organize your courses, and see your full four-year plan in one clean view.
        </p>

        <Button onClick={() => navigate('/register')} style={{ padding: '14px 32px', fontSize: '16px' }}>
          Start planning →
        </Button>
      </div>

      {/* Feature strip */}
      <div style={{
        maxWidth: '800px', margin: '0 auto 80px', padding: '0 24px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
      }}>
        {[
          { icon: '📋', title: 'Visual planner', desc: 'Drag and drop courses between terms and years.' },
          { icon: '📎', title: 'Clipboard', desc: 'Stage courses before placing them in your plan.' },
          { icon: '✏️', title: 'Full details', desc: 'Track units, grades, prereqs, and notes per course.' },
        ].map(f => (
          <div key={f.title} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', padding: '24px',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{f.icon}</div>
            <div style={{ fontWeight: 600, marginBottom: '6px' }}>{f.title}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
