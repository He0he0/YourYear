import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext, DragOverlay, closestCorners,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { usePlanner } from '../context/PlannerContext';
import { useAuth } from '../context/AuthContext';
import Clipboard from '../components/Clipboard';
import TermColumn from '../components/TermColumn';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModal';
import { Button, Modal, Input } from '../components/UI';

export default function Planner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    years, clipboard, loaded,
    addYear, removeYear, addTerm, removeTerm,
    addCourseToClipboard, moveCourseToTerm, moveCourseToClipboard,
    editCourse, deleteCourse,
  } = usePlanner();

  const [activeCourse, setActiveCourse] = useState(null);
  const [courseModal, setCourseModal] = useState({ open: false, course: null });
  const [addTermModal, setAddTermModal] = useState({ open: false, yearId: null });
  const [customTermName, setCustomTermName] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // ─── Drag ─────────────────────────────────────────────────────────────────

  const findCourse = (id) => {
    const inClip = clipboard.find(c => c.id === id);
    if (inClip) return inClip;
    for (const y of years) {
      for (const t of y.terms) {
        const found = t.courses.find(c => c.id === id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleDragStart = ({ active }) => {
    setActiveCourse(findCourse(active.id));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCourse(null);
    if (!over) return;
    const courseId = active.id;
    const dest = over.id;

    if (dest === 'clipboard') {
      moveCourseToClipboard(courseId);
      return;
    }

    if (typeof dest === 'string' && dest.startsWith('term:')) {
      const [, yearId, termId] = dest.split(':');
      moveCourseToTerm(courseId, yearId, termId);
      return;
    }

    // Dropped on another card - find its container
    for (const y of years) {
      for (const t of y.terms) {
        if (t.courses.find(c => c.id === dest)) {
          moveCourseToTerm(courseId, y.id, t.id);
          return;
        }
      }
    }
    if (clipboard.find(c => c.id === dest)) {
      moveCourseToClipboard(courseId);
    }
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const openAddCourse = () => setCourseModal({ open: true, course: null });
  const openEditCourse = (course) => setCourseModal({ open: true, course });
  const closeCourseModal = () => setCourseModal({ open: false, course: null });

  const handleSaveCourse = (data) => {
    if (courseModal.course) {
      editCourse(courseModal.course.id, data);
    } else {
      addCourseToClipboard(data);
    }
  };

  const handleAddTerm = () => {
    if (!customTermName.trim()) return;
    addTerm(addTermModal.yearId, customTermName.trim());
    setAddTermModal({ open: false, yearId: null });
    setCustomTermName('');
  };

  const TERM_SUGGESTIONS = user?.structure === 'quarter'
    ? ['Fall', 'Winter', 'Spring', 'Summer']
    : ['Fall', 'Spring', 'Summer'];

  if (!loaded) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading your planner…</div>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners}
      onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

        {/* Sidebar */}
        <Clipboard
          courses={clipboard}
          onAddCourse={openAddCourse}
          onEditCourse={openEditCourse}
          onDeleteCourse={deleteCourse}
        />

        {/* Main planner area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Topbar */}
          <div style={{
            padding: '14px 24px', borderBottom: '1px solid var(--border)',
            background: 'var(--surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>YourYear</div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Button variant="secondary" size="sm" onClick={addYear}>+ Add Year</Button>
              <button
                onClick={() => navigate('/profile')}
                style={{
                  background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
                  borderRadius: '50%', width: '32px', height: '32px', fontSize: '13px', fontWeight: 600,
                }}
                title="Profile"
              >
                {user?.name?.[0]?.toUpperCase() || '?'}
              </button>
            </div>
          </div>

          {/* Years scroll area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {years.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '60%', gap: '16px', color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: '40px' }}>📅</div>
                <div style={{ fontSize: '16px', fontWeight: 500 }}>No years yet</div>
                <p style={{ fontSize: '14px', textAlign: 'center', maxWidth: '300px', lineHeight: 1.6 }}>
                  Click <strong>+ Add Year</strong> to start building your plan.
                </p>
                <Button onClick={addYear}>+ Add Year</Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {years.map((year, yi) => (
                  <div key={year.id}>
                    {/* Year header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px',
                    }}>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: '20px' }}>
                        {user?.startYear ? String(user.startYear + yi) : year.label}
                      </h2>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {year.terms.reduce((s, t) => s + t.courses.reduce((u, c) => u + (Number(c.units) || 0), 0), 0)} units
                      </span>
                      <Button variant="ghost" size="sm"
                        onClick={() => setAddTermModal({ open: true, yearId: year.id })}>
                        + Term
                      </Button>
                      <Button variant="ghost" size="sm" style={{ color: 'var(--danger)' }}
                        onClick={() => removeYear(year.id)}>
                        Remove year
                      </Button>
                    </div>

                    {/* Terms */}
                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {year.terms.map(term => (
                        <TermColumn
                          key={term.id}
                          yearId={year.id}
                          term={term}
                          onEditCourse={openEditCourse}
                          onDeleteCourse={deleteCourse}
                          onSendToClipboard={moveCourseToClipboard}
                          onRemoveTerm={removeTerm}
                        />
                      ))}
                      {year.terms.length === 0 && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>
                          No terms — click <strong>+ Term</strong> to add one.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeCourse ? (
          <div style={{ opacity: 0.9, transform: 'scale(1.02)' }}>
            <CourseCard
              course={activeCourse}
              location="overlay"
              onEdit={() => {}} onDelete={() => {}} onSendToClipboard={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>

      {/* Course modal */}
      <CourseModal
        open={courseModal.open}
        onClose={closeCourseModal}
        onSave={handleSaveCourse}
        initial={courseModal.course}
        title={courseModal.course ? 'Edit Course' : 'Add Course'}
      />

      {/* Add term modal */}
      <Modal open={addTermModal.open} onClose={() => setAddTermModal({ open: false, yearId: null })} title="Add Term" width={360}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {TERM_SUGGESTIONS.map(s => (
              <Button key={s} variant="secondary" size="sm"
                onClick={() => setCustomTermName(s)}
                style={{ borderColor: customTermName === s ? 'var(--accent)' : undefined }}>
                {s}
              </Button>
            ))}
          </div>
          <Input label="Term name" placeholder="e.g. Fall" value={customTermName}
            onChange={e => setCustomTermName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddTerm()} />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => setAddTermModal({ open: false, yearId: null })}>Cancel</Button>
            <Button onClick={handleAddTerm}>Add</Button>
          </div>
        </div>
      </Modal>
    </DndContext>
  );
}
