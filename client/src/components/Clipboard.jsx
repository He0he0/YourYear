import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CourseCard from './CourseCard';
import { Button } from './UI';

export default function Clipboard({ courses, onAddCourse, onEditCourse, onDeleteCourse }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'clipboard' });

  return (
    <div style={{
      width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column',
      background: 'var(--surface)', borderRight: '1px solid var(--border)',
      height: '100%',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px', borderBottom: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>Clipboard</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{courses.length} course{courses.length !== 1 ? 's' : ''}</div>
          </div>
        </div>
        <Button size="sm" onClick={onAddCourse} style={{ width: '100%' }}>
          + Add Course
        </Button>
      </div>

      {/* Course list */}
      <SortableContext
        items={courses.map(c => c.id)}
        strategy={verticalListSortingStrategy}
        id="clipboard"
      >
        <div
          ref={setNodeRef}
          style={{
            flex: 1, overflowY: 'auto', padding: '10px',
            display: 'flex', flexDirection: 'column', gap: '6px',
            background: isOver ? 'var(--accent-bg)' : 'transparent',
            transition: 'background 0.15s',
            minHeight: '60px',
          }}
        >
          {courses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              location="clipboard"
              onEdit={onEditCourse}
              onDelete={onDeleteCourse}
              onSendToClipboard={() => {}}
            />
          ))}
          {courses.length === 0 && (
            <div style={{
              textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px',
              paddingTop: '24px', lineHeight: 1.6,
            }}>
              No courses yet.<br />Add one above.
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
