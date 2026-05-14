import React, { useState, useEffect } from 'react';

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];

export default function CourseDetailPanel({ course, initialEditMode = false, onClose, onSave }) {
  const [editMode, setEditMode] = useState(initialEditMode);
  const [draft, setDraft] = useState({ ...course });

  useEffect(() => {
    setDraft({ ...course });
    setEditMode(initialEditMode);
  }, [course.id, initialEditMode]);

  const set = (field) => (e) => setDraft(d => ({ ...d, [field]: e.target.value }));

  const handleSave = () => {
    onSave(course.id, draft);
    setEditMode(false);
  };

  const handleCancel = () => {
    setDraft({ ...course });
    setEditMode(false);
  };

  const inputStyle = {
    width: '100%', fontSize: '14px', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    padding: '8px 10px', outline: 'none', lineHeight: 1.6,
    fontFamily: 'var(--font-body)', background: 'var(--surface)',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.22)', zIndex: 499 }}
      />

      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(680px, 56vw)',
        background: 'var(--surface)',
        zIndex: 500,
        overflowY: 'auto',
        boxShadow: '-6px 0 32px rgba(0,0,0,0.08)',
        display: 'flex',
      }}>
        {/* Left green bar */}
        <div style={{
          width: '20px', flexShrink: 0,
          background: 'var(--course-accent-bg)',
          borderRadius: '0 12px 12px 0',
        }} />

        <div style={{ flex: 1, padding: '56px 56px 56px 52px', overflowY: 'auto' }}>

          {/* ── Header row: code + units badge + pencil ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '40px' }}>
            {editMode ? (
              <input
                value={draft.code}
                onChange={set('code')}
                style={{ ...inputStyle, fontSize: '30px', fontWeight: 700, width: '180px', padding: '4px 8px' }}
              />
            ) : (
              <h1 style={{ fontSize: '36px', fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1 }}>
                {course.code}
              </h1>
            )}

            {editMode ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  value={draft.units ?? ''}
                  onChange={set('units')}
                  type="number" min={0} max={20}
                  style={{ ...inputStyle, width: '56px', textAlign: 'center', padding: '5px 8px' }}
                />
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>units</span>
              </div>
            ) : (
              <span style={{
                fontSize: '16px', fontWeight: 500,
                background: 'var(--course-accent-bg)', color: 'var(--text)',
                padding: '6px 18px', borderRadius: '999px',
                border: '1px solid #d4edcc', whiteSpace: 'nowrap',
              }}>{course.units ?? '—'} units</span>
            )}

            {/* Pencil / Save+Cancel pushed to far right */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
              {editMode ? (
                <>
                  <button onClick={handleCancel} style={{
                    background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
                    padding: '6px 14px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-muted)',
                  }}>Cancel</button>
                  <button onClick={handleSave} style={{
                    background: 'var(--accent)', color: '#fff', border: 'none',
                    borderRadius: '6px', padding: '6px 16px', fontSize: '13px',
                    cursor: 'pointer', fontWeight: 500,
                  }}>Save</button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  title="Edit course"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#BBBBB5', padding: '4px',
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.466 7.56A.5.5 0 0 1 6.5 14H6v-.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H4v-.5a.5.5 0 0 0-.5-.5H3v-.5a.5.5 0 0 0-.5-.5H2.5l-.761 2.284a.5.5 0 0 0 .62.62z"/>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* ── Title + Description ── */}
          <div style={{ marginBottom: '40px' }}>
            {editMode ? (
              <input
                value={draft.title ?? ''}
                onChange={set('title')}
                placeholder="Course Title"
                style={{ ...inputStyle, fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}
              />
            ) : (
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.4 }}>
                {course.title}
              </h2>
            )}
            {editMode ? (
              <textarea
                value={draft.description ?? ''}
                onChange={set('description')}
                placeholder="Course description..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            ) : (
              course.description && (
                <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.75, margin: 0 }}>
                  {course.description}
                </p>
              )
            )}
          </div>

          {/* ── Prerequisites ── */}
          {(editMode || course.prerequisites) && (
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text)', marginBottom: '10px' }}>
                Prerequisites
              </h3>
              {editMode ? (
                <textarea
                  value={draft.prerequisites ?? ''}
                  onChange={set('prerequisites')}
                  placeholder="e.g. CSE 8A or consent of instructor"
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              ) : (
                <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
                  {course.prerequisites}
                </p>
              )}
            </div>
          )}

          {/* ── Divider ── */}
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0 0 32px 0' }} />

          {/* ── Grade ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', minWidth: '80px' }}>Grade:</span>
            {editMode ? (
              <select
                value={draft.grade ?? ''}
                onChange={set('grade')}
                style={{
                  fontSize: '14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                  padding: '5px 10px', outline: 'none', background: 'var(--surface)', cursor: 'pointer',
                }}
              >
                <option value="">— no grade —</option>
                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            ) : (
              <span style={{ fontSize: '14px', color: 'var(--text)' }}>{course.grade || '—'}</span>
            )}
          </div>

          {/* ── Notes ── */}
          <div style={{ display: 'flex', gap: '12px', alignItems: editMode ? 'flex-start' : 'baseline' }}>
            <span style={{
              fontSize: '16px', fontWeight: 700, color: 'var(--text)',
              minWidth: '80px', paddingTop: editMode ? '9px' : 0,
            }}>Notes:</span>
            {editMode ? (
              <textarea
                value={draft.notes ?? ''}
                onChange={set('notes')}
                placeholder="Any notes about this course..."
                rows={3}
                style={{ ...inputStyle, flex: 1, resize: 'vertical' }}
              />
            ) : (
              <span style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.7 }}>
                {course.notes || '—'}
              </span>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
