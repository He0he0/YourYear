import React, { useState, useRef, useEffect, useMemo } from 'react';

const GRADE_POINTS = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'D-': 0.7,
  'F': 0.0,
};
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CourseCard from './CourseCard';

export default function TermColumn({ yearId, term, onEditCourse, onDeleteCourse, onSendToClipboard, onRemoveTerm, onRenameTerm, onExpandCourse }) {
  const droppableId = `term:${yearId}:${term.id}`;
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(term.name);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const totalUnits = term.courses.reduce((sum, c) => sum + (Number(c.units) || 0), 0);

  const termGpa = useMemo(() => {
    let pts = 0, creds = 0;
    for (const c of term.courses) {
      if (c.units && c.grade && c.grade in GRADE_POINTS) {
        pts += Number(c.units) * GRADE_POINTS[c.grade];
        creds += Number(c.units);
      }
    }
    return creds > 0 ? (pts / creds).toFixed(1) : null;
  }, [term.courses]);

  const commitRename = () => {
    const name = draft.trim();
    if (name && name !== term.name) onRenameTerm(yearId, term.id, name);
    else setDraft(term.name);
    setEditing(false);
  };

  return (
    <div style={{
      flex: '1 0 180px',
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {/* Term header */}
      <div style={{ marginBottom: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {editing ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commitRename}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') { setDraft(term.name); setEditing(false); }
              }}
              style={{
                fontSize: '20px', fontWeight: 600, color: 'var(--text)',
                background: 'var(--bg)', border: '1px solid var(--accent)',
                borderRadius: 'var(--radius)', padding: '1px 6px',
                outline: 'none', width: '100%',
              }}
            />
          ) : (
            <>
              <span style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text)' }}>{term.name}</span>
              <button
                onClick={() => { setDraft(term.name); setEditing(true); }}
                title="Rename term"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--border)', padding: '0 2px', lineHeight: 1,
                  display: 'flex', alignItems: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-muted)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--border)'}
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.466 7.56A.5.5 0 0 1 6.5 14H6v-.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H4v-.5a.5.5 0 0 0-.5-.5H3v-.5a.5.5 0 0 0-.5-.5H2.5l-.761 2.284a.5.5 0 0 0 .62.62z"/>
                </svg>
              </button>
            </>
          )}
        </div>
        {!editing && (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Units: {totalUnits}</span>
            {termGpa && <span>GPA: {termGpa}</span>}
          </div>
        )}
      </div>

      {/* Drop zone */}
      <SortableContext
        items={term.courses.map(c => c.id)}
        strategy={verticalListSortingStrategy}
        id={droppableId}
      >
        <div
          ref={setNodeRef}
          style={{
            minHeight: '80px', display: 'flex', flexDirection: 'column', gap: '6px',
            padding: '8px', borderRadius: 'var(--radius)',
            background: isOver ? 'var(--accent-bg)' : 'transparent',
            border: `2px dashed ${isOver ? 'var(--accent-light)' : 'var(--border)'}`,
            transition: 'all 0.15s',
          }}
        >
          {term.courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              location={`term:${yearId}:${term.id}`}
              onEdit={onEditCourse}
              onDelete={onDeleteCourse}
              onSendToClipboard={onSendToClipboard}
              onExpand={onExpandCourse}
            />
          ))}
          {term.courses.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--border)', fontSize: '12px', paddingTop: '16px' }}>
              Drop here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
