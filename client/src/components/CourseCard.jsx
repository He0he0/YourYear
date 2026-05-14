import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function CourseCard({ course, onEdit, onDelete, onSendToClipboard, onExpand, location, showCheckbox = false, isSelected = false, onToggleSelect }) {
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
          display: 'flex', alignItems: 'stretch',
          background: isSelected ? 'var(--course-accent-bg)' : 'var(--surface)',
          border: `1px solid ${isSelected ? 'var(--course-accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow)',
          overflow: 'hidden',
          cursor: 'grab', userSelect: 'none',
          transition: 'background 0.12s, border-color 0.12s',
        }}
      >
        {/* Left: drag dots or checkbox */}
        {showCheckbox ? (
          <div
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onToggleSelect?.(course.id); }}
            style={{
              width: '36px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', borderRight: '1px solid var(--border)',
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              style={{ cursor: 'pointer', accentColor: 'var(--course-accent)', width: '14px', height: '14px', pointerEvents: 'none' }}
            />
          </div>
        ) : (
          <div style={{
            width: '32px', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--border)', pointerEvents: 'none',
          }}>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
              <circle cx="2.5" cy="2.5" r="1.5"/><circle cx="7.5" cy="2.5" r="1.5"/>
              <circle cx="2.5" cy="8" r="1.5"/><circle cx="7.5" cy="8" r="1.5"/>
              <circle cx="2.5" cy="13.5" r="1.5"/><circle cx="7.5" cy="13.5" r="1.5"/>
            </svg>
          </div>
        )}

        {/* Course info */}
        <div style={{ flex: 1, padding: '16px 12px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)' }}>{course.code}</span>
            {course.units && (
              <span style={{
                fontSize: '13px', background: 'var(--course-accent-bg)', color: 'var(--text)',
                padding: '4px 12px', borderRadius: '999px', fontWeight: 500, border: '1px solid #d4edcc',
              }}>{course.units}u</span>
            )}
            {course.grade && (
              <span style={{
                fontSize: '11px', fontWeight: 600, color: gradeColor(course.grade),
                background: `${gradeColor(course.grade)}18`, padding: '2px 7px', borderRadius: '10px',
              }}>{course.grade}</span>
            )}
          </div>
          <div style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{course.title}</div>

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

        {/* ⋯ Menu */}
        {location !== 'overlay' && (
          <div style={{ position: 'relative', alignSelf: 'flex-start', paddingTop: '6px', paddingRight: '2px' }}>
            <button
              onPointerDown={e => e.stopPropagation()}
              onClick={() => setMenuOpen(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', padding: '2px 4px', fontSize: '15px', lineHeight: 1,
              }}
            >⋯</button>
            {menuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setMenuOpen(false)} />
                <div style={{
                  position: 'absolute', right: 0, top: '100%', zIndex: 100,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-md)',
                  minWidth: '140px', overflow: 'hidden',
                }}>
                  {[
                    onExpand && { label: 'Expand', action: () => { onExpand(course, false); setMenuOpen(false); } },
                    { label: 'Edit', action: () => { onExpand ? onExpand(course, true) : onEdit(course); setMenuOpen(false); } },
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
        )}

        {/* Right green panel */}
        <div
          onPointerDown={e => e.stopPropagation()}
          onClick={() => onExpand ? onExpand(course, false) : setDetailOpen(v => !v)}
          style={{
            width: '44px', flexShrink: 0,
            background: 'var(--course-accent-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: location === 'overlay' ? 'grabbing' : 'pointer',
            borderLeft: '1px solid #d4edcc',
          }}
        >
          <svg
            width="13" height="13" viewBox="0 0 24 24" fill="var(--course-accent)"
            style={{ transform: detailOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
          >
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
