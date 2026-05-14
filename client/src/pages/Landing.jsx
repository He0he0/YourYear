import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/Logo(1).png';

function MiniCard({ code, units, title, grade, showPanel = false }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'stretch',
      background: '#fff', border: '1px solid #e8e8e4',
      borderRadius: '7px', overflow: 'hidden', marginBottom: '5px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ flex: 1, padding: '7px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a' }}>{code}</span>
          {units && (
            <span style={{
              fontSize: '9px', background: '#EEF8EC', color: '#1a1a1a',
              padding: '1px 6px', borderRadius: '999px', border: '1px solid #d4edcc',
            }}>{units}</span>
          )}
          {grade && (
            <span style={{ fontSize: '8px', fontWeight: 600, color: '#2D5016', background: '#2D501618', padding: '1px 4px', borderRadius: '6px' }}>{grade}</span>
          )}
        </div>
        {title && <div style={{ fontSize: '9px', color: '#888', lineHeight: 1.3 }}>{title}</div>}
      </div>
      <div style={{ width: '14px', flexShrink: 0, background: '#EEF8EC', borderLeft: '1px solid #d4edcc' }} />
    </div>
  );
}

function PlannerMockup() {
  return (
    <div style={{
      width: '520px', height: '360px',
      borderRadius: '14px', overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)',
      background: '#fff', flexShrink: 0, position: 'relative',
      border: '1px solid rgba(0,0,0,0.08)',
    }}>
      {/* Top bar */}
      <div style={{
        height: '38px', background: 'linear-gradient(90deg, #4A7FE4 0%, #5B8FEE 100%)',
        display: 'flex', alignItems: 'center', padding: '0 12px', gap: '8px',
      }}>
        <img src={logo} alt="YourYear" style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0 }} />
        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.01em' }}>YourYear</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#1A1814', border: '2px solid rgba(255,255,255,0.3)' }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ display: 'flex', height: 'calc(100% - 38px)', background: '#F5F3EF' }}>

        {/* Term columns */}
        <div style={{ flex: 1, padding: '10px 10px 0', overflowX: 'hidden', display: 'flex', gap: '8px' }}>

          {/* Fall 2020 */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a' }}>Fall 2020</div>
              <div style={{ fontSize: '8px', color: '#999' }}>Units: 12 · GPA: 4.0</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '6px', padding: '6px', border: '1px solid #e8e4de' }}>
              <MiniCard code="CSE 8A" units="4" grade="A+" />
              <MiniCard code="MATH 20A" units="4" title="Calculus for Sci+Eng" grade="A+" />
              <MiniCard code="PHYS 20A" units="4" title="Physics — Mechanics" grade="A+" />
            </div>
          </div>

          {/* Winter 2021 */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a' }}>Winter 2021</div>
              <div style={{ fontSize: '8px', color: '#999' }}>Units: 16</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '6px', padding: '6px', border: '1px solid #e8e4de' }}>
              <MiniCard code="CSE 8B" units="4" grade="A+" />
              <MiniCard code="MATH 20B" units="4" title="Calculus II" grade="A+" />
            </div>
          </div>

          {/* Spring 2021 */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#1a1a1a' }}>Spring 2021</div>
              <div style={{ fontSize: '8px', color: '#999' }}>Planned Units: 12</div>
            </div>
            <div style={{ background: '#fff', borderRadius: '6px', padding: '6px', border: '1px solid #e8e4de' }}>
              <MiniCard code="CSE 12" units="4" title="Basic Data Structures" />
              <MiniCard code="MATH 20C" units="4" title="Multivariable Calc" />
            </div>
          </div>
        </div>

        {/* Expanded detail panel overlay */}
        <div style={{
          position: 'absolute', top: 38, right: 0, bottom: 0,
          width: '200px',
          background: '#fff',
          borderLeft: '1px solid #e8e4de',
          boxShadow: '-4px 0 16px rgba(0,0,0,0.08)',
          display: 'flex',
        }}>
          <div style={{ width: '8px', flexShrink: 0, background: '#EEF8EC', borderRadius: '0 6px 6px 0' }} />
          <div style={{ flex: 1, padding: '14px 12px', overflowY: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a1a' }}>CSE 8A</span>
              <span style={{
                fontSize: '9px', background: '#EEF8EC', color: '#1a1a1a',
                padding: '2px 7px', borderRadius: '999px', border: '1px solid #d4edcc',
              }}>4 units</span>
            </div>
            <div style={{ fontSize: '9px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
              Introduction to Computer Science: Java I
            </div>
            <div style={{ fontSize: '8px', color: '#888', lineHeight: 1.5, marginBottom: '8px' }}>
              Introductory course for students interested in computer science. Fundamental concepts of applied computer science using the Java programming language.
            </div>
            <div style={{ fontSize: '8px', fontWeight: 700, color: '#555', marginBottom: '2px' }}>Prereqs.</div>
            <div style={{ fontSize: '8px', color: '#888', marginBottom: '8px', lineHeight: 1.4 }}>
              Restricted to undergraduates. Graduate students will be allowed as space permits.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ fontSize: '8px', fontWeight: 700, color: '#555' }}>Grade:</span>
              <span style={{ fontSize: '8px', color: '#333' }}>A+</span>
            </div>
            <div style={{ borderTop: '1px solid #f0ede8', paddingTop: '6px' }}>
              <div style={{ fontSize: '8px', fontWeight: 700, color: '#555', marginBottom: '2px' }}>Notes:</div>
              <div style={{ fontSize: '8px', color: '#888', lineHeight: 1.4 }}>Professor sucked — remember to post to Rate my Professor!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F0EAE0', fontFamily: 'var(--font-body)' }}>

      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 48px',
        background: '#fff',
        borderBottom: '1px solid #e8e4de',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="YourYear" style={{ width: 35, height: 35, borderRadius: 4, flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>YourYear</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: '#4A7FE4', color: '#fff', border: 'none', cursor: 'pointer',
              borderRadius: '999px', padding: '10px 28px', fontSize: '15px', fontWeight: 600,
              boxShadow: '0 2px 8px rgba(74,127,228,0.3)',
            }}
          >
            Log in
          </button>
          <button
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '15px', fontWeight: 500, color: '#1a1a1a',
            }}
          >
            Contact
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: '1160px', margin: '0 auto',
        padding: '80px 48px 80px',
        display: 'flex', alignItems: 'center', gap: '64px',
      }}>
        {/* Left copy */}
        <div style={{ flex: '0 0 420px' }}>
          <h1 style={{
            fontSize: '52px', fontWeight: 800, lineHeight: 1.1,
            color: '#1a1a1a', margin: '0 0 20px 0',
          }}>
            Plan your entire<br />
            <em style={{ fontStyle: 'italic', fontWeight: 800 }}>academic journey</em>
          </h1>
          <p style={{
            fontSize: '17px', color: '#666', lineHeight: 1.65,
            margin: '0 0 36px 0', maxWidth: '360px',
          }}>
            Map out every term, organize your courses, and see your full four-year plan in one clean view.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#4A7FE4', color: '#fff', border: 'none', cursor: 'pointer',
              borderRadius: '999px', padding: '14px 32px', fontSize: '16px', fontWeight: 600,
              boxShadow: '0 4px 16px rgba(74,127,228,0.35)',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}
          >
            Start Planning <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>

        {/* Right mockup */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <PlannerMockup />
        </div>
      </div>

      {/* Feature cards */}
      <div style={{
        maxWidth: '1000px', margin: '0 auto 80px',
        padding: '0 48px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px',
      }}>
        {[
          { icon: '📋', title: 'Visual Planner', desc: 'Drag and drop courses between terms and years.' },
          { icon: '📎', title: 'Clipboard', desc: 'Stage courses before placing them in your plan.' },
          { icon: '✏️', title: 'Full details', desc: 'Track units, grades, prereqs, and notes per course.' },
        ].map(f => (
          <div key={f.title} style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '36px 28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
            <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '10px', color: '#1a1a1a' }}>{f.title}</div>
            <div style={{ fontSize: '15px', color: '#888', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
