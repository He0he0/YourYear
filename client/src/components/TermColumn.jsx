import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CourseCard from './CourseCard';

export default function TermColumn({ yearId, term, onEditCourse, onDeleteCourse, onSendToClipboard, onRemoveTerm }) {
  const droppableId = `term:${yearId}:${term.id}`;

  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  const totalUnits = term.courses.reduce((sum, c) => sum + (Number(c.units) || 0), 0);

  return (
    <div style={{
      minWidth: '200px', maxWidth: '220px', flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: '8px',
    }}>
      {/* Term header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{term.name}</span>
          {totalUnits > 0 && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>{totalUnits}u</span>
          )}
        </div>
        <button
          onClick={() => onRemoveTerm(yearId, term.id)}
          title="Remove term"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--border)', fontSize: '14px', lineHeight: 1,
            padding: '2px',
          }}
          onMouseEnter={e => e.target.style.color = 'var(--danger)'}
          onMouseLeave={e => e.target.style.color = 'var(--border)'}
        >×</button>
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
