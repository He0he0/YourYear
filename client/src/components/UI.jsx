import React from 'react';

// ─── Button ───────────────────────────────────────────────────────────────────
const btnStyles = {
  base: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '6px', fontFamily: 'var(--font-body)', fontWeight: 500,
    borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'all 0.15s',
    border: 'none', fontSize: '14px', lineHeight: 1,
  },
  primary: {
    background: 'var(--accent)', color: '#fff', padding: '10px 18px',
  },
  secondary: {
    background: 'var(--surface)', color: 'var(--text)', padding: '10px 18px',
    border: '1px solid var(--border)',
  },
  ghost: {
    background: 'transparent', color: 'var(--text-muted)', padding: '6px 10px',
  },
  danger: {
    background: 'var(--danger-bg)', color: 'var(--danger)', padding: '8px 14px',
  },
  sm: { padding: '6px 12px', fontSize: '13px' },
};

export function Button({ variant = 'primary', size, children, style, ...props }) {
  return (
    <button
      style={{ ...btnStyles.base, ...btnStyles[variant], ...(size === 'sm' ? btnStyles.sm : {}), ...style }}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      {label && <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>}
      <input
        style={{
          width: '100%', padding: '10px 12px',
          background: 'var(--surface)', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)',
          transition: 'border-color 0.15s',
          ...style
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = 'var(--accent)'; }}
        onBlur={e => { e.target.style.borderColor = error ? 'var(--danger)' : 'var(--border)'; }}
        {...props}
      />
      {error && <span style={{ fontSize: '12px', color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, children, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '100%' }}>
      {label && <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>{label}</label>}
      <select
        style={{
          width: '100%', padding: '10px 12px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', fontSize: '14px', color: 'var(--text)',
          cursor: 'pointer', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A756D' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
          ...style
        }}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 480 }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
          width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 24px', borderBottom: '1px solid var(--border)',
        }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 400 }}>{title}</h3>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '20px', color: 'var(--text-muted)', lineHeight: 1,
          }}>×</button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style, ...props }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '14px',
      boxShadow: 'var(--shadow)', ...style
    }} {...props}>
      {children}
    </div>
  );
}
