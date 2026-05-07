import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function CourseCard({ course, onEdit, onDelete, onSendToClipboard, location, showCheckbox = false, isSelected = false, onToggleSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: course.id, data: { course, location } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const gradeColor = (g) => {
    if (!g) return null;
    if (g.startsWith('A')) return '#2D5016';
    if (g.startsWith('B')) return '#1a5276';
    if (g.startsWith('C')) return '#7D6608';
    return '#922b21';
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        {...listeners}
        style={{
          background: isSelected ? 'var(--accent-bg)' : 'var(--surface)',
          border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius)', padding: '10px 12px',
          boxShadow: 'var(--shadow)', position: 'relative',
          cursor: 'grab', userSelect: 'none',
          transition: 'background 0.12s, border-color 0.12s',
        }}
        title="Drag to move"
      >
        {/* Left strip: checkbox (selection mode) or drag dots */}
        {showCheckbox ? (
          <div
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onToggleSelect?.(course.id); }}
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', zIndex: 1,
              borderRight: '1px solid var(--border)',
              borderRadius: 'var(--radius) 0 0 var(--radius)',
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              style={{ cursor: 'pointer', accentColor: 'var(--accent)', width: '13px', height: '13px', pointerEvents: 'none' }}
            />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--border)', pointerEvents: 'none',
              borderRight: '1px solid var(--border)',
              borderRadius: 'var(--radius) 0 0 var(--radius)',
            }}
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
              <circle cx="2" cy="2" r="1.5"/><circle cx="6" cy="2" r="1.5"/>
              <circle cx="2" cy="7" r="1.5"/><circle cx="6" cy="7" r="1.5"/>
              <circle cx="2" cy="12" r="1.5"/><circle cx="6" cy="12" r="1.5"/>
            </svg>
          </div>
        )}

        <div style={{ paddingLeft: showCheckbox ? '24px' : '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>{course.code}</span>
                {course.units && (
                  <span style={{
                    fontSize: '10px', background: 'var(--accent-bg)', color: 'var(--accent)',
                    padding: '1px 5px', borderRadius: '10px',
                  }}>{course.units}u</span>
                )}
                {course.grade && (
                  <span style={{
                    fontSize: '10px', fontWeight: 600, color: gradeColor(course.grade),
                    background: `${gradeColor(course.grade)}18`, padding: '1px 5px', borderRadius: '10px',
                  }}>{course.grade}</span>
                )}
              </div>
              <div
                style={{ fontSize: '13px', color: 'var(--text)', marginTop: '2px', cursor: 'pointer' }}
                onClick={() => setDetailOpen(v => !v)}
                title="Click to expand"
              >
                {course.title}
              </div>
            </div>
            {/* Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', padding: '2px 4px', fontSize: '16px', lineHeight: 1,
                }}
              >⋯</button>
              {menuOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                    onClick={() => setMenuOpen(false)}
                  />
                  <div style={{
                    position: 'absolute', right: 0, top: '100%', zIndex: 100,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)',
                    minWidth: '140px', overflow: 'hidden',
                  }}>
                    {[
                      { label: 'Edit', action: () => { onEdit(course); setMenuOpen(false); } },
                      location !== 'clipboard' && { label: 'Move to clipboard', action: () => { onSendToClipboard(course.id); setMenuOpen(false); } },
                      { label: 'Delete', action: () => { onDelete(course.id); setMenuOpen(false); }, danger: true },
                    ].filter(Boolean).map(item => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        style={{
                          display: 'block', width: '100%', padding: '9px 14px',
                          background: 'none', border: 'none', cursor: 'pointer',
                          textAlign: 'left', fontSize: '13px',
                          color: item.danger ? 'var(--danger)' : 'var(--text)',
                        }}
                        onMouseEnter={e => e.target.style.background = 'var(--bg)'}
                        onMouseLeave={e => e.target.style.background = 'none'}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Expanded detail */}
          {detailOpen && (course.description || course.prerequisites || course.notes) && (
            <div style={{
              marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)',
              fontSize: '12px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px',
            }}>
              {course.description && <p>{course.description}</p>}
              {course.prerequisites && <p><strong>Prereqs:</strong> {course.prerequisites}</p>}
              {course.notes && <p><strong>Notes:</strong> {course.notes}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
